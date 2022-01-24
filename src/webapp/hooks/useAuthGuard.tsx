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
import KeycloakAdminApi from "../api/keycloak/keycloakAdminApi";
import { useSnackBarNotification } from "./useSnackBarNotification";
dayjs.extend(utc);
dayjs.extend(timezone);


interface SessionDecode extends JwtPayload {

}

export function useAuthGuard() {
    const [init, setInit] = useState(true);
    let [sessionValue, setSessionValue] = useRecoilState(userSessionState);
    const { currentState } = useNavigationGet();
    const history = useHistory();
    const api = new KeycloakAdminApi();
    const resetSessionState = useResetRecoilState(userSessionState);
    const { showSnackBar } = useSnackBarNotification();
    const loadLocalStorage = async () => {
        const localStore = localStorage.getItem('session');
        if (localStore) {

            const sessionObject: IUserSession = JSON.parse(localStore);
            setSessionValue({
                accessToken: sessionObject.accessToken,
                refreshToken: sessionObject.refreshToken,
                lasttimeLogIn: new Date(),
            })
        } else {
            history.push('/login');
            return;
        }
        setInit(false);
    };


    const checkRefreshToken = async () => {
        let localStore = localStorage.getItem("session");
        if (localStore) {
            let sessionObject: IUserSession = JSON.parse(localStore);
            if (sessionObject) {
                // console.log(`logs: ${dayjs().format('DD/MM/YYYY HH:mm:ss')} last time login ${dayjs(sessionObject.lasttimeLogIn).format('DD/MM/YYYY HH:mm')} \t state:${dayjs(sessionValue?.lasttimeLogIn).format('DD/MM/YYYY HH:mm')}`)
                let decodeToken: SessionDecode = jwt_decode(sessionObject.accessToken);
                if (decodeToken) {
                    let expireUnixTime = decodeToken.exp;
                    console.log(`token unix  is ${expireUnixTime}   and expired: ${expireUnixTime && (dayjs().unix() + 70 > expireUnixTime)} of now unix: ${dayjs().unix()}`);
                    if (expireUnixTime && (dayjs().unix() + 70 > expireUnixTime)) {
                        try {
                            const response = await api.refreshToken({ refreshToken: sessionObject.refreshToken })
                            if (response) {
                                let session = {
                                    accessToken: response.accessToken,
                                    refreshToken: response.refreshToken,
                                    lasttimeLogIn: new Date(),
                                }
                                // console.log(`new token :${dayjs(session.lasttimeLogIn).format('DD/MM/YYYY HH:mm:ss')}`);
                                localStorage.removeItem('session');
                                localStorage.setItem('session', JSON.stringify(session));
                                setSessionValue(session);
                            }
                        } catch (err) {
                            localStorage.removeItem('session');
                            resetSessionState();
                            history.push('/login');
                            showSnackBar({ serverity: 'info', message: 'Session is timeout' });
                        }
                    } else if (init === true) {
                        setSessionValue(sessionObject);
                        setInit(false);
                    }
                }
            }
        } else {
            resetSessionState();
            history.push('/login');
        }
    }

    useEffect(() => {
        console.log(`call useEffect AuthGuard`);
        checkRefreshToken();
        // if (init === true) {
        //     loadLocalStorage();
        // } else {
        //     //case not login
        //     if (!sessionValue) {
        //         history.push('/login');
        //         return;
        //     }
            
            
            
        //     if (currentState === NavigationCurrentType.LOGIN && sessionValue) {
        //         history.push('/dashboard');
        //         return;
        //     }    //case try to access login but already logined
        // }

    }, [currentState]);

    return {
        session: sessionValue,
        checkRefreshToken
    }

}