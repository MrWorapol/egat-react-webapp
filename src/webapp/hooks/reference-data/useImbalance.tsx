import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ImbalanceAPI } from "../../api/referenceData/ImbalanceAPI";
import { NavigationCurrentType } from "../../state/navigation-current-state";
import { Iimbalance, imbalanceState } from "../../state/reference-data/imbalance/imbalance-state";
import { userSessionState } from "../../state/user-sessions";
import { useLoadingScreen } from "../useLoadingScreen";
import { useNavigationGet } from "../useNavigationGet";
import { useSnackBarNotification } from "../useSnackBarNotification";

export function useImbalance() {
    let session = useRecoilValue(userSessionState);
    const { currentState } = useNavigationGet();
    const [imbalance, setImbalance] = useRecoilState(imbalanceState);
    const api = new ImbalanceAPI();
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();
    const refreshImbalance = async () => {
        if (session) {
            try {
                showLoading(10);
                const response = await api.getImbalance({ session: session });
                if (response !== null) {
                    showSnackBar({
                        serverity: "success",
                        message: "Loading Successful"
                    })
                    console.info(response);
                    setImbalance(response.context);
                }
                hideLoading(10)
            } catch (e) {
                hideLoading(10)
                showSnackBar({ serverity: 'error', message: `${e}` })

            }
        }
    };


    const updateImbalance = async (imbalance: Iimbalance) => {
        if (session) {
            try {
                showLoading(10);    
                const response = await api.updateImbalance({ session: session, imbalance: imbalance });
                if (response === true) {
                    showSnackBar({
                        serverity: "success",
                        message: "update Successful"
                    })
                    console.info(`updated is : ${response}`);
                }
                hideLoading(10)
            } catch (e) {
                hideLoading(10)
                showSnackBar({ serverity: 'error', message: `${e}` })

            }
        }
    };
    useEffect(() => {
        if (session && currentState === NavigationCurrentType.IMBALANCE) {
            if (!imbalance) {
                refreshImbalance();
                console.debug('call ge wheelingChart');
                console.info(imbalance);
            }
        }
    }, [session,currentState])
    
    return {
        imbalance,
        refreshImbalance,
        updateImbalance,
    }

}