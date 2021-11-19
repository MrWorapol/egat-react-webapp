import { atom } from "recoil";


export interface ITouTariff {
    id: string,
    touType: string,
    title: string,
    startTime: string,
    endTime: string,
    bahtPerKWh: number,
    effectiveDate: string,
    effectiveTime: string,
    editDate?: string,
}



export const touTariffState = atom<ITouTariff[] | null>({
    key: 'touTariffState',
    default: null,
})
