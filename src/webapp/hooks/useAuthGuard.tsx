import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { NavigationCurrentType } from "../state/navigation-current-state";
import { session, IUserSession } from "../state/user-sessions";
import { useNavigationGet } from "./useNavigationGet";

interface allowNavigationScope {
    fallbackRoute: string;


}

export function useAuthGuard() {
    const [init, setInit] = useState(false);
    const previousRoute = window.location.pathname;
    const [sessionValue, setSessionValue] = useRecoilState(session);
    const { currentState } = useNavigationGet();
    const history = useHistory();

    useEffect(() => {
        if (init) { //changeto  !init when integration
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
            setInit(!init);
        } else {

            //case not login
            // if (!sessionValue) {
            //     if (previousRoute !== '/' && previousRoute !== '/login') {
            //         history.push('/login?redirect=' + previousRoute);
            //     } else {
            //         history.push('/login');
            //         return;
            //     }
            // }
            //case try to access login but already logined
            if (currentState === NavigationCurrentType.LOGIN && sessionValue) {
                history.push('/dashboard');
                return;
            }


        }

    }, [sessionValue, currentState]);

}