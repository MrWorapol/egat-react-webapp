import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import TOUTariffAPI from "../api/referenceData/TOUtariffAPI";
import { IServiceCharge, serviceChargeLogsState } from "../state/reference-data/tou-traff/tou-service-charge-state";
import { touTariffLogState } from "../state/reference-data/tou-traff/tou-tariff-log";
import { ITouTariff } from "../state/reference-data/tou-traff/tou-tariff-state";


export function useServiceChargeLogs(serviceCharge: IServiceCharge) {
    const [serviceChargeLogs, setserviceChargeLogs] = useRecoilState(serviceChargeLogsState);
    const api = new TOUTariffAPI();
    const refreshServiceChargeLogs = useCallback(async () => {
        const result = await api.getServiceChargeLog({ touType: serviceCharge.touType });
        // console.log('call tariff log api');
        if (result !== null) {
            console.info(result.context);
            setserviceChargeLogs(result.context);
        }
    }, [])

    useEffect(() => {
        if (!serviceChargeLogs) {
            refreshServiceChargeLogs();
            console.debug('call ge tariff logs');
            // console.info(wheelingCharge);
        }

    }, [serviceChargeLogs, refreshServiceChargeLogs])

    return { serviceChargeLogs,  refreshServiceChargeLogs }
}