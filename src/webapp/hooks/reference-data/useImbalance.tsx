import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ImbalanceAPI } from "../../api/referenceData/ImbalanceAPI";
import { Iimbalance, imbalanceState } from "../../state/reference-data/imbalance/imbalance-state";
import { userSessionState } from "../../state/user-sessions";
import { useSnackBarNotification } from "../useSnackBarNotification";

export function useImbalance() {
    const [imbalance, setImbalance] = useRecoilState(imbalanceState);
    const sessionUser = useRecoilValue(userSessionState);
    const api = new ImbalanceAPI();
    const { showSnackBar } = useSnackBarNotification();
    const refreshImbalance = useCallback(async () => {
        if (sessionUser) {
            const response = await api.getImbalance({ session: sessionUser });
            console.log('call wheeling chart api');
            if (response !== null) {
                showSnackBar({
                    serverity: "success",
                    message: "Loading Successful"
                })
                console.info(response);
                setImbalance(response.context);
            }
        }
    }, [])


    const updateImbalance = useCallback(async (imbalance: Iimbalance) => {
        if (sessionUser) {
            const response = await api.updateImbalance({ session: sessionUser, imbalance: imbalance });
            if (response !== null) {
                showSnackBar({
                    serverity: "success",
                    message: "update Successful"
                })
                console.info(`updated is : ${response}`);

            }
        }
    }, [])
    useEffect(() => {
        if (!imbalance) {
            refreshImbalance();
            console.debug('call ge wheelingChart');
            console.info(imbalance);
        }

    }, [imbalance, refreshImbalance])
    return {
        imbalance,
        refreshImbalance,
        updateImbalance,
    }

}