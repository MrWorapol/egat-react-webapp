import { useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { useRecoilState, useResetRecoilState } from "recoil";
import KeycloakAdminApi from "../api/keycloak/keycloakAdminApi";
import { NavigationCurrentType } from "../state/navigation-current-state";
import { userProfile } from "../state/user-profile";
import { userSessionState } from "../state/user-sessions";
import { useAuthGuard } from "./useAuthGuard";
import { useLoadingScreen } from "./useLoadingScreen";
import { useNavigationGet } from "./useNavigationGet";
import { useSnackBarNotification } from "./useSnackBarNotification";


export function useLogin() {
    let [sessionValue, setSession] = useRecoilState(userSessionState);
    const api = new KeycloakAdminApi();
    const resetSession = useResetRecoilState(userSessionState);
    const { showLoading, hideLoading } = useLoadingScreen();
    const { showSnackBar } = useSnackBarNotification();
    const history = useHistory();
    const { checkRefreshToken } = useAuthGuard();

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
                history.push('/');

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
        localStorage.removeItem('session');
        resetSession();
        history.push(`/login`);


    }, [])

    useEffect(() => {
        checkRefreshToken();
    }, []);


    return {
        login,
        logout,
        session: sessionValue,
    }
}

