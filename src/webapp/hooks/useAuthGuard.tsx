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
    let count = 0;
    let [sessionValue, setSessionValue] = useRecoilState(userSessionState);
    const { currentState } = useNavigationGet();
    const history = useHistory();
    const api = new KeycloakAdminApi();
    const resetSessionState = useResetRecoilState(userSessionState);
    const { showSnackBar } = useSnackBarNotification();

    const checkRefreshToken = async () => {
        let localStore = localStorage.getItem("session");
        if (localStore) {
            let sessionObject: IUserSession = JSON.parse(localStore);
            if (sessionObject) {
                let decodeToken: SessionDecode = jwt_decode(sessionObject.accessToken);
                if (decodeToken) {
                    let expireUnixTime = decodeToken.exp;
                    if (expireUnixTime && (dayjs().unix() + 70 > expireUnixTime)) {//check token expired
                        try {
                            // console.log(`call refresh api`)
                            const response = await api.refreshToken({ refreshToken: sessionObject.refreshToken })
                            if (response) {
                                let session = {
                                    accessToken: response.accessToken,
                                    refreshToken: response.refreshToken,
                                    lasttimeLogIn: sessionObject.lasttimeLogIn,
                                }
                                localStorage.removeItem('session');
                                localStorage.setItem('session', JSON.stringify(session));
                                setSessionValue(session);
                            }
                        } catch (err) {
                            localStorage.removeItem('session');
                            resetSessionState();
                            history.push('/login');
                            showSnackBar({ serverity: 'info', message: 'Session timeout' });
                        }
                    } else if (init === true) {//if not expired and start initialize set to session state
                        setSessionValue({
                            accessToken: sessionObject.accessToken,
                            refreshToken: sessionObject.refreshToken,
                            lasttimeLogIn: sessionObject.lasttimeLogIn,
                        });
                        setInit(false);
                    } else if (currentState === NavigationCurrentType.LOGIN) {
                        history.push('/');
                    }

                }
            }
        } else {
            resetSessionState();
            history.push('/login');
        }
    }

    useEffect(() => {
        // console.log(`call useEffect AuthGuard ${count}`);
        checkRefreshToken();

    }, [currentState]);

    return {
        session: sessionValue,
        checkRefreshToken
    }

}