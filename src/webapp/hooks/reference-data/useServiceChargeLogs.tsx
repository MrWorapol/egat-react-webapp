import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import TOUTariffAPI from "../../api/referenceData/TOUtariffAPI";
import { IServiceCharge, serviceChargeLogsState } from "../../state/reference-data/tou-traff/tou-service-charge-state";
import { userSessionState } from "../../state/user-sessions";


export function useServiceChargeLogs(serviceCharge: IServiceCharge) {
    const [serviceChargeLogs, setserviceChargeLogs] = useRecoilState(serviceChargeLogsState);
    const api = new TOUTariffAPI();
    const userSession = useRecoilValue(userSessionState);
    const refreshServiceChargeLogs = useCallback(async () => {
        if (userSession) {
            const result = await api.getServiceChargeLog({ session: userSession, touType: serviceCharge.touType });
            // console.log('call tariff log api');
            if (result !== null) {
                console.info(result.context);
                setserviceChargeLogs(result.context);
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