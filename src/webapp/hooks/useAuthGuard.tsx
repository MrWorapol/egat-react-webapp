import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { NavigationCurrentType } from "../state/navigation-current-state";
import { userSessionState, IUserSession } from "../state/user-sessions";
import { useNavigationGet } from "./useNavigationGet";
import jwt_decode, { JwtPayload } from "jwt-decode";

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

interface allowNavigationScope {
    fallbackRoute: string;


}
interface SessionDecode extends JwtPayload {

}
export function useAuthGuard() {
    // let count = 0;
    const [init, setInit] = useState(true);
    const previousRoute = window.location.pathname;
    const [sessionValue, setSessionValue] = useRecoilState(userSessionState);
    const { currentState } = useNavigationGet();
    const history = useHistory();
    const resetSessionState = useResetRecoilState(userSessionState);

    const loadLocalStorage = useCallback(async () => {
        const localStore = localStorage.getItem('session');
        if (localStore) { //if user has sessions
            // console.log(`get localStorage Successful`)
            const sessionObject: IUserSession = JSON.parse(localStore);
            setSessionValue({
                accessToken: sessionObject.accessToken,
                refreshToken: sessionObject.refreshToken,
                lasttimeLogIn: new Date(),
            })
        } else {
            // console.log(`get localStorage Fail!!!`);

            history.push('/login');
            return;
        }
        setInit(!init);
    }, []);

    const checkRefreshToken = useCallback(async () => {
        console.log(`checkRefreshToken`);
        let localSession = localStorage.getItem("session");
        if (localSession) {
            let decodeToken: SessionDecode = jwt_decode(localSession);
            if (decodeToken) {
                let expireUnixTime = decodeToken.exp;
                if (expireUnixTime) {
                    if (dayjs().unix() > expireUnixTime) {
                        localStorage.removeItem("session");
                        resetSessionState();
                    }
                    // console.log(`expire on sesion:${dayjs(expireUnixTime).unix()}\n now unix${dayjs().unix()}`);
                }
            }
        }
    }, [])
    useEffect(() => {
        // console.log('call auth guard' + count);
        // count++;
        if (init === true) { //changeto  !init when integration
            loadLocalStorage();
        } else {
            checkRefreshToken();
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

    return {
        session: sessionValue,
    }

}