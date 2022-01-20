import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ImbalanceAPI } from "../../api/referenceData/ImbalanceAPI";
import { OtherSettingAPI } from "../../api/referenceData/OhterSettingAPI";
import { imbalanceLogsState } from "../../state/reference-data/imbalance/imbalance-log";
import { Iimbalance } from "../../state/reference-data/imbalance/imbalance-state";
import { otherSettingLogState } from "../../state/reference-data/other-setting/othersetting-log";
import { IUserSession, userSessionState } from "../../state/user-sessions";
import { useLoadingScreen } from "../useLoadingScreen";
import { useSnackBarNotification } from "../useSnackBarNotification";


export function useOtherSettingLogs() {
    const session = useRecoilValue(userSessionState);
    const [otherSettingLogs, setotherSettingLogs] = useRecoilState(otherSettingLogState);
    const api = new OtherSettingAPI();
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();

    const refreshOtherSettingLogs = useCallback(async (session: IUserSession) => {
        try {
            showLoading(10);
            const response = await api.getOtherSettingLogs({ session, });
            console.log('call wheeling log api');
            if (response !== null) {
                showSnackBar({ serverity: 'success', message: "Loading successful" })
                setotherSettingLogs(response.context);
            }
            if(response && response.context.length ===0){
                showSnackBar({ serverity: 'success', message: "No Logs Display" })
            }
            hideLoading(10);
            
        } catch (e) {
            hideLoading(10);
            showSnackBar({ serverity: 'error', message: `Error :${e}` })
        }
    }, [])

    useEffect(() => {
        if (!otherSettingLogs && session) {
            refreshOtherSettingLogs(session);
            // console.debug('call ge wheeling Logs');
            // console.info(otherSettingLogs);
        }

    }, [otherSettingLogs, refreshOtherSettingLogs])

    return {
        otherSettingLogs,
        refreshOtherSettingLogs
    }

}