import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ImbalanceAPI } from "../../api/referenceData/ImbalanceAPI";
import { imbalanceLogsState } from "../../state/reference-data/imbalance/imbalance-log";
import { Iimbalance } from "../../state/reference-data/imbalance/imbalance-state";
import { userSessionState } from "../../state/user-sessions";


export function useImbalanceLogs(data: Iimbalance) {
    const [imbalanceLogs, setImbalanceLogs] = useRecoilState(imbalanceLogsState);
    const api = new ImbalanceAPI();
    const userSession = useRecoilValue(userSessionState);
    const refreshImbalanceLogs = useCallback(async () => {
        if (userSession) {
            const response = await api.getLogsImbalance({ session: userSession, imbalance: data.imbalance, type: data.type });
            console.log('call wheeling log api');
            if (response !== null) {
                console.info(response);
                setImbalanceLogs(response.context);
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