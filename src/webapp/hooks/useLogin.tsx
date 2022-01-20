import { useCallback } from "react";
<<<<<<< HEAD
import { useHistory } from "react-router";
=======
>>>>>>> features/reference-data
import { useRecoilState, useResetRecoilState } from "recoil";
import KeycloakAdminApi from "../api/keycloak/keycloakAdminApi";
import { userProfile } from "../state/user-profile";
import { userSessionState } from "../state/user-sessions";
import { useLoadingScreen } from "./useLoadingScreen";


export function useLogin() {
    const [, setProfile] = useRecoilState(userProfile);
    const [sessionValue, setSession] = useRecoilState(userSessionState);
    const api = new KeycloakAdminApi();
    const resetSession = useResetRecoilState(userSessionState);
<<<<<<< HEAD
    const { showLoading, hideLoading } = useLoadingScreen();
    const history = useHistory();
    const login = useCallback(async (username: string, password: string) => {
        try {
            showLoading(10);
            const response = await api.login({
                username: username,
                password: password,
            });

            if (response) {
                const session = {
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                    lasttimeLogIn: new Date(),
                }
                localStorage.setItem('session', JSON.stringify(session));
                setSession(session);
                history.push('/dashboard');

            }

            hideLoading(10);
        } catch (err: any) {
            let error: Error = err;
            console.log(error);
            hideLoading(10);
        }

    }, [setSession, sessionValue])

    const logout = useCallback(() => {
        //clear local storage
        if (localStorage.getItem('session')) {
            localStorage.removeItem('session');
            resetSession();
        }
        if (sessionValue) {
            // localStorage.removeItem('session');
            resetSession();
        }

=======
    const login = useCallback(async (username: string, password: string) => {
        const response = await api.login({
            username: username,
            password: password,
        }
        );
        if (response) {
            const session = {
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                lasttimeLogIn: new Date(),
            }
            localStorage.setItem('session', JSON.stringify(session));
            setSession(session);
            return true;
        }
        return false;
    }, [setSession, sessionValue])

    const logout = useCallback(() => {
        if (sessionValue) {
            localStorage.removeItem('session');
            resetSession();
        }
>>>>>>> features/reference-data
    }, [])
    return {
        login,
        logout,
        session: sessionValue,
        logout,
    }
}

//load token from localstorage
//jwt decode check refresh token exp
//if
//interval check refresh onLoad and every 1 minute 
//  if(onExpired < 1 min){
// call refreshToken to api 
//}
//