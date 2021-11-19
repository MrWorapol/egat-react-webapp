import { atom } from "recoil";

export interface IWheelingCharge {
    id: string,
    wheelingType:  'AS'|'T' |'D'| 'RE',
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
}

export const wheelingChargeState = atom<IWheelingCharge[] | null>({
    key: 'wheelingCharge',
    default: null
})