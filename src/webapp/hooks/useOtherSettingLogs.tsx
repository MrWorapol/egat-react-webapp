import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ImbalanceAPI } from "../api/referenceData/ImbalanceAPI";
import { OtherSettingAPI } from "../api/referenceData/OhterSettingAPI";
import { imbalanceLogsState } from "../state/reference-data/imbalance/imbalance-log";
import { Iimbalance } from "../state/reference-data/imbalance/imbalance-state";
import { otherSettingLogState } from "../state/reference-data/other-setting/othersetting-log";
import { userSessionState } from "../state/user-sessions";


export function useOtherSettingLogs() {
    const session = useRecoilValue(userSessionState);
    const [otherSettingLogs, setotherSettingLogs] = useRecoilState(otherSettingLogState);
    const api = new OtherSettingAPI();
    const refreshOtherSettingLogs = useCallback(async () => {
        if (session) {
            const response = await api.getOtherSettingLogs({ session });
            console.log('call wheeling log api');
            if (response !== null) {
                console.info(response);
                setotherSettingLogs(response.context);
            }
        }
    }, [])

    useEffect(() => {
        if (!otherSettingLogs) {
            refreshOtherSettingLogs();
            console.debug('call ge wheeling Logs');
            console.info(otherSettingLogs);
        }

    }, [otherSettingLogs, refreshOtherSettingLogs])
    return {
        otherSettingLogs,
        refreshOtherSettingLogs
    }

}