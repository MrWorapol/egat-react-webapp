import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import TOUTariffAPI from "../../api/referenceData/TOUtariffAPI";
import { IServiceCharge, serviceChargeLogsState } from "../../state/reference-data/tou-traff/tou-service-charge-state";
import { userSessionState } from "../../state/user-sessions";
import { useLoadingScreen } from "../useLoadingScreen";
import { useSnackBarNotification } from "../useSnackBarNotification";


export function useServiceChargeLogs(serviceCharge: IServiceCharge) {
    const [serviceChargeLogs, setserviceChargeLogs] = useRecoilState(serviceChargeLogsState);
    const api = new TOUTariffAPI();
    const session = useRecoilValue(userSessionState);
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();
    const refreshServiceChargeLogs = useCallback(async () => {
        if (session) {
            try {
                showLoading(10);

                const result = await api.getServiceChargeLog({  session, touType: serviceCharge.touType });
                // console.log('call tariff log api');
                if (result !== null) {
                    console.info(result.context);
                    setserviceChargeLogs(result.context);
                }
                hideLoading(10);
            } catch (e) {
                hideLoading(10);
                showSnackBar({ serverity: 'error', message: `${e}` })
            }
        }
    }, [])

    useEffect(() => {
        if (!serviceChargeLogs) {
            refreshServiceChargeLogs();
            console.debug('call ge tariff logs');
            // console.info(wheelingCharge);
        }

    }, [serviceChargeLogs, refreshServiceChargeLogs])

    return { serviceChargeLogs, refreshServiceChargeLogs }
}