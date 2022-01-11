import { useCallback } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import KeycloakAdminApi from "../api/keycloak/keycloakAdminApi";
import { userProfile } from "../state/user-profile";
import { userSessionState } from "../state/user-sessions";


export function useLogin() {
    const [, setProfile] = useRecoilState(userProfile);
    const [sessionValue, setSession] = useRecoilState(userSessionState);
    const api = new KeycloakAdminApi();
    const resetSession = useResetRecoilState(userSessionState);

    const login = useCallback(async (username: string, password: string) => {

        console.log(`username: ${username}, password: ${password}`);
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
        }
    }, [setSession, sessionValue])

    const logout = useCallback(() => {
        //clear local storage
        if (localStorage.getItem('session')) {
            localStorage.removeItem('session');
        }
        if (sessionValue) {
            // localStorage.removeItem('session');
            resetSession();
        }

    }, [])
    return {
        login,
        logout,
        session: sessionValue,
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