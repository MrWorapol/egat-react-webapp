import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { WheelingChargeAPI } from "../../api/referenceData/WheelingChargeAPI";
import { wheelingLogsState } from "../../state/reference-data/wheeling-chart/wheeling-log-state";
import { userSessionState } from "../../state/user-sessions";


export function useWheelingLogs(wheelingType: 'AS' | 'T' | 'D' | 'RE') {
    const [wheelingLogs, setWheelingLogs] = useRecoilState(wheelingLogsState);
    const api = new WheelingChargeAPI();
    const userSession = useRecoilValue(userSessionState);
    const refreshWheelingLogs = useCallback(async () => {
        if (userSession) {
            const response = await api.getLogByTypes({ session: userSession, wheelingType: wheelingType });
            console.log('call wheeling log api');
            if (response !== null) {
                console.info(response);
                setWheelingLogs(response.context);
            }
        }
    }, [])

    useEffect(() => {
        if (!wheelingLogs) {
            refreshWheelingLogs();
            console.debug('call ge wheeling Logs');
            console.info(wheelingLogs);
        }

    }, [wheelingLogs, refreshWheelingLogs])
    return {
        wheelingLogs,
        refreshWheelingLogs
    }

}