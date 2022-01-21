import { useCallback } from "react";
import { useHistory } from "react-router";
import { useRecoilState, useResetRecoilState } from "recoil";
import KeycloakAdminApi from "../api/keycloak/keycloakAdminApi";
import { userProfile } from "../state/user-profile";
import { userSessionState } from "../state/user-sessions";
import { useLoadingScreen } from "./useLoadingScreen";
import { useSnackBarNotification } from "./useSnackBarNotification";


export function useLogin() {
    const [, setProfile] = useRecoilState(userProfile);
    const [sessionValue, setSession] = useRecoilState(userSessionState);
    const api = new KeycloakAdminApi();
    const resetSession = useResetRecoilState(userSessionState);
    const { showLoading, hideLoading } = useLoadingScreen();
    const { showSnackBar } = useSnackBarNotification();

    const history = useHistory();
    const login = useCallback(async (username: string, password: string) => {
        try {
            showLoading(10);
            const response = await api.login({
                username: username,
                password: password,
            });

            if (response) {
                hideLoading(10);
                showSnackBar({
                    serverity: "success",
                    message: "login successful",
                })
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
            hideLoading(10);
            showSnackBar({
                serverity: "error",
                message: `${err}`,
            })
        }

    }, [setSession, sessionValue])

    const logout = useCallback(() => {
        if (localStorage.getItem('session')) {
            localStorage.removeItem('session');
            resetSession();
        }
        if (sessionValue) {
            resetSession();
        }

    }, [])
    return {
        login,
        logout,
        session: sessionValue,
    }
}

