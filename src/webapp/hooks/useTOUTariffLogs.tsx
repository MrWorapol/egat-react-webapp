import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import TOUTariffAPI from "../api/referenceData/TOUtariffAPI";
import { touTariffLogState } from "../state/reference-data/tou-traff/tou-tariff-log";
import { ITouTariff } from "../state/reference-data/tou-traff/tou-tariff-state";
import { userSessionState } from "../state/user-sessions";


export function useTOUTariffLogs(tariff: ITouTariff) {
    const [touTariffLogs, setTOUTariffLogs] = useRecoilState(touTariffLogState);
    const api = new TOUTariffAPI();
    const session = useRecoilValue(userSessionState);

    const refreshTOUTariffLog = useCallback(async () => {
        if(session)
      {  const result = await api.getTOUtariffLog({ touType: tariff.touType, title: tariff.title,session });
        // console.log('call tariff log api');
        if (result !== null) {
            console.info(result.context);
            setTOUTariffLogs(result.context);
        }}
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