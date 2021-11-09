import { atom } from "recoil";

export interface IWheelingCharge {
    title: string,
    bahtPerKwh: number,
    mea: number,
    pea: number,
    meaegat: number,
    peaegat: number,
    meapeaegat: number,
    note: string,
    effictiveDate ?: string,
    effictiveTime ?: string,
}

export const wheelingChargeState = atom<IWheelingCharge[] | null>({
    key: 'wheelingCharge',
    default: null
})