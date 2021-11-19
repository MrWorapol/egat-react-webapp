import { atom } from "recoil";
import { IWheelingCharge } from "./wheeling-charge-state";

export interface IWheelingLogs {
    id: string,
    wheelingType: 'AS' | 'T' | 'D' | 'RE',
    title: string,
    bahtPerKWh: number,
    mea: number,
    pea: number,
    meaEgat: number,
    peaEgat: number,
    meaPeaEgat: number,
    note: string,
    effectiveDate?: string,
    effectiveTime?: string,
    editDate: Date,
}

export const wheelingLogsState = atom<IWheelingLogs[] | null>({
    key: 'wheelingLogs',
    default: null
})