import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import TOUTariffAPI from "../../api/referenceData/TOUtariffAPI";
import { touTariffLogState } from "../../state/reference-data/tou-traff/tou-tariff-log";
import { ITouTariff } from "../../state/reference-data/tou-traff/tou-tariff-state";
import { userSessionState } from "../../state/user-sessions";
import { useLoadingScreen } from "../useLoadingScreen";
import { useSnackBarNotification } from "../useSnackBarNotification";


export function useTOUTariffLogs(tariff: ITouTariff) {
    const [touTariffLogs, setTOUTariffLogs] = useRecoilState(touTariffLogState);
    const api = new TOUTariffAPI();
    const userSession = useRecoilValue(userSessionState);
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();
    const resetLogs = useResetRecoilState(touTariffLogState);
    const refreshTOUTariffLog = useCallback(async () => {
        if (userSession) {
            if(touTariffLogs){
                resetLogs();
            }
            try {
                showLoading(10);
                const result = await api.getTOUtariffLog({ session: userSession, touType: tariff.touType, title: tariff.title });
                // console.log('call tariff log api');
                if (result !== null) {
                    console.info(result.context);
                    setTOUTariffLogs(result.context);
                    showSnackBar({ serverity: 'success', message: `Loading ${tariff.title} successful` });
                }
                hideLoading(10);
            } catch (e) {
                hideLoading(10);
                showSnackBar({ serverity: 'error', message: `${e}` });
            }
        }
    }, [])

    useEffect(() => {
        if (!touTariffLogs) {
            refreshTOUTariffLog();
            console.debug('call ge tariff logs');
            // console.info(wheelingCharge);
        }

    }, [touTariffLogs, refreshTOUTariffLog])

    return { touTariffLogs, refreshTOUTariffLog }
}