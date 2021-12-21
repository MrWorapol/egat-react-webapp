import { atom } from "recoil";
import { ITouTariff } from "./tou-tariff-state";

export interface ITouTariffLog {
    id: string,
    editDate: string,
    touId: string,
    touType: string,
    title: string,
    touTariffSetting: {
        id: string,
        touType: string,
        title: string,
        startTime: string,
        endTime: string,
        bahtPerKWh: 0,
        effectiveDate: string,
        effectiveTime: string,
        effectiveDateTime: string,
    },
    effectiveDateTime: string,
}
export const touTariffLogState = atom<ITouTariffLog[] | null>({
    key: 'touTariffLogs',
    default: null,
})