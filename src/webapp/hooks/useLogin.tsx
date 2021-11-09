import { useCallback } from "react";
import { useRecoilState } from "recoil";
import KeycloakAdminApi from "../api/keycloak/keycloakAdminApi";
import { userProfile } from "../state/user-profile";
import { session } from "../state/user-sessions";


export function useLogin() {
    const [, setProfile] = useRecoilState(userProfile);
    const [sessionValue, setSession] = useRecoilState(session);
    const api = new KeycloakAdminApi();

    const login = useCallback(async (username: string, password: string) => {

        // console.log(`after set session value`);
        // console.log(sessionValue)
        // console.log('`');
        // setSession({
        //     accessToken: 'accessToken',
        //     refreshToken: 'refreshToken',
        //     lasttimeLogIn: new Date(),
        // })
        console.log(`username: ${username}, password: ${password}`);
        const response = await api.login({
            username: username,
            password: password,
            // username: 'egat-p2p-admin@gmail.com',
            // password: 'P@ssw0rd',
        }
        );
        // console.log(response);
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
    }, [])
    return {
        login,
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