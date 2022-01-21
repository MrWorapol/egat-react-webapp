import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { NavigationCurrentType } from "../state/navigation-current-state";
import { userSessionState, IUserSession } from "../state/user-sessions";
import { useNavigationGet } from "./useNavigationGet";
import jwt_decode, { JwtPayload } from "jwt-decode";

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { setInterval } from "timers";
import KeycloakAdminApi from "../api/keycloak/keycloakAdminApi";
dayjs.extend(utc);
dayjs.extend(timezone);


interface SessionDecode extends JwtPayload {

}

export function useAuthGuard() {
    const [init, setInit] = useState(true);
    const previousRoute = window.location.pathname;
    let [sessionValue, setSessionValue] = useRecoilState(userSessionState);
    const { currentState } = useNavigationGet();
    const history = useHistory();
    const api = new KeycloakAdminApi();
    const resetSessionState = useResetRecoilState(userSessionState);

    const loadLocalStorage = async () => {
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
        setInit(false);
    };

   

    setInterval(async () => {
        console.log(`call refershtoken`);
        let localStore = localStorage.getItem("session");
        if (localStore) {
            let sessionObject: IUserSession = JSON.parse(localStore);
            if (sessionObject) {
                let decodeToken: SessionDecode = jwt_decode(sessionObject.accessToken);
                if (decodeToken) {
                    let expireUnixTime = decodeToken.exp;
                    if (expireUnixTime && (expireUnixTime+30 < dayjs().unix())) {
                        try {
                            console.log(`call refresh token api`)
                            const response = await api.refreshToken({ refreshToken: sessionObject.refreshToken })
                            if (response) {
                                const session = {
                                    accessToken: response.accessToken,
                                    refreshToken: response.refreshToken,
                                    lasttimeLogIn: new Date(),
                                }
                                localStorage.setItem('session', JSON.stringify(session));
                                setSessionValue(session);
                            }
                        } catch (err) {
                            localStorage.removeItem('session');
                            resetSessionState();
                        }
                    }
                }
            }
        } else {
            resetSessionState();
            history.push('/login');
        }
    }, 60000);


    useEffect(() => {
        if (init === true) {
           
            loadLocalStorage();
        } else {
           
            //case not login
            if (!sessionValue) {
                if (previousRoute !== '/' && previousRoute !== '/login') {
                    history.push('/login');
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