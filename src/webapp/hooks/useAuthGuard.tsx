import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { NavigationCurrentType } from "../state/navigation-current-state";
import { userSessionState, IUserSession } from "../state/user-sessions";
import { useNavigationGet } from "./useNavigationGet";

import jwtDecode, { JwtPayload } from "jwt-decode";

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useLogin } from "./useLogin";
dayjs.extend(utc);
dayjs.extend(timezone);

interface allowNavigationScope {
    fallbackRoute: string;


}

export function useAuthGuard() {
    const [initial, setInitial] = useState(true);
    const previousRoute = window.location.pathname;
    const [sessionValue, setSessionValue] = useRecoilState(userSessionState);
    const { currentState } = useNavigationGet();
    const history = useHistory();
    const { logout } = useLogin();

    const getSessionOnLocalStorage = useCallback((): Promise<IUserSession | null> => {
        const session = localStorage.getItem('session');
        if (session) {
            const sessionObj: IUserSession = JSON.parse(session);
            return Promise.resolve(sessionObj)
        } else {
            return Promise.reject(null);
        }
    }, []);

    const checkTokenOnInit = useCallback(async () => {
        const sessionStorage = await getSessionOnLocalStorage();
        if (sessionStorage) {
            setSessionValue({
                accessToken: sessionStorage.accessToken,
                refreshToken: sessionStorage.refreshToken,
                lasttimeLogIn: new Date(),
            })
        }
        return;
        // return Promise.resolve(sessionStorage);

    }, []);
    useEffect(() => {
        if (initial) { //changeto  !init when integration
            checkTokenOnInit();

            const localStore = localStorage.getItem('session');
            if (localStore) { //if user has sessions
                console.log(`get localStorage Successful`)
                const sessionObject: IUserSession = JSON.parse(localStore);
                setSessionValue({
                    accessToken: sessionObject.accessToken,
                    refreshToken: sessionObject.refreshToken,
                    lasttimeLogIn: new Date(),
                })
            } else {
                console.log(`get localStorage Fail!!!`);

                history.push('/login');
                return;
            }
            setInitial(false);
        } else {
            const localStore = localStorage.getItem('session');
            if (localStore) {
                console.log('check token ')
                const sessionObject: IUserSession = JSON.parse(localStore);
                const decodeJWT: JwtPayload = jwtDecode(sessionObject.accessToken);
                if (decodeJWT.exp) {
                    if (decodeJWT.exp <= dayjs().unix()) {
                        console.log(`jwt` + decodeJWT.exp);
                        console.log(`currentTime` + dayjs().unix());
                        logout();
                    }

                }

            }
            //case not login
            if (!sessionValue) {
                if (previousRoute !== '/' && previousRoute !== '/login') {
                    history.push('/login?redirect=' + previousRoute);
                } else {
                    history.push('/login');
                    return;
                }
            }
            //case try to access login but already logined
            if (currentState === NavigationCurrentType.LOGIN && sessionValue) {
                history.push('/dashboard');
                return;
            }


        }

    }, [sessionValue, currentState]);

}