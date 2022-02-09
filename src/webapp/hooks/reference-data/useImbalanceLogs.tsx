import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ImbalanceAPI } from "../../api/referenceData/ImbalanceAPI";
import { imbalanceLogsState } from "../../state/reference-data/imbalance/imbalance-log";
import { Iimbalance } from "../../state/reference-data/imbalance/imbalance-state";
import { userSessionState } from "../../state/user-sessions";
import { useLoadingScreen } from "../useLoadingScreen";
import { useSnackBarNotification } from "../useSnackBarNotification";


export function useImbalanceLogs(data: Iimbalance) {
    const [imbalanceLogs, setImbalanceLogs] = useRecoilState(imbalanceLogsState);
    const api = new ImbalanceAPI();
    const userSession = useRecoilValue(userSessionState);
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();
    const refreshImbalanceLogs = useCallback(async () => {
        if (userSession) {
            try {
                showLoading(10);
                const response = await api.getLogsImbalance({ session: userSession, imbalance: data.imbalance, type: data.type });
                if (response !== null) {
                    console.info(response);
                    setImbalanceLogs(response.context);
                    showSnackBar({ serverity: 'success', message: 'Get logs data successful' });
                    hideLoading(10);
                }
            } catch (err) {
                hideLoading(10);
                showSnackBar({ serverity: 'error', message: `Cannot get logs data\n ERROR: ${err}` });
            }
        }
    }, [])

    useEffect(() => {
        if (!imbalanceLogs) {
            refreshImbalanceLogs();
            // console.debug('call ge wheeling Logs');
            // console.info(imbalanceLogs);
        }

    }, [imbalanceLogs, refreshImbalanceLogs])
    return {
        imbalanceLogs,
        refreshImbalanceLogs
    }

}