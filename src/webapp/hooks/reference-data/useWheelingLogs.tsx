import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { WheelingChargeAPI } from "../../api/referenceData/WheelingChargeAPI";
import { wheelingLogsState } from "../../state/reference-data/wheeling-chart/wheeling-log-state";
import { userSessionState } from "../../state/user-sessions";
import { useLoadingScreen } from "../useLoadingScreen";
import { useSnackBarNotification } from "../useSnackBarNotification";


export function useWheelingLogs(wheelingType: 'AS' | 'T' | 'D' | 'RE') {
    const [wheelingLogs, setWheelingLogs] = useRecoilState(wheelingLogsState);
    const api = new WheelingChargeAPI();
    const userSession = useRecoilValue(userSessionState);
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();
    const refreshWheelingLogs = useCallback(async () => {
        if (userSession) {
            try {
                showLoading(10);
                const response = await api.getLogByTypes({ session: userSession, wheelingType: wheelingType });
                console.log('call wheeling log api');
                if (response !== null) {
                    console.info(response);
                    setWheelingLogs(response.context);
                    hideLoading(10);
                }
                hideLoading(10);
            }catch(e){
                hideLoading(10);
                showSnackBar({serverity:'error',message:`${e}`})
            }
        }
    }, [])

    useEffect(() => {
        if (!wheelingLogs) {
            refreshWheelingLogs();
        }

    }, [wheelingLogs, refreshWheelingLogs])
    return {
        wheelingLogs,
        refreshWheelingLogs
    }

}