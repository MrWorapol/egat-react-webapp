import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { NavigationCurrentType } from "../state/navigation-current-state";
import { userSessionState, IUserSession } from "../state/user-sessions";
import { useNavigationGet } from "./useNavigationGet";

interface allowNavigationScope {
    fallbackRoute: string;


}

export function useAuthGuard() {
    const [init, setInit] = useState(false);
    const previousRoute = window.location.pathname;
    const [sessionValue, setSessionValue] = useRecoilState(userSessionState);
    const { currentState } = useNavigationGet();
    const history = useHistory();

    const loadLocalStorage = useCallback(async () => {
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
        setInit(!init);
    }, []);

    useEffect(() => {
        if (init === false) { //changeto  !init when integration
            loadLocalStorage();
        } else {

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