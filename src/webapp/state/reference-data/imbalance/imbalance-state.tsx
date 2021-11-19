import { atom } from "recoil"




export interface Iimbalance {
    id: string,
    imbalance: 'Commited < Actual Energy' | 'Commited > Actual Energy',
    type: 'seller' | 'buyer',
    scenario: string,
    imbalanceClearing: string,
    bahtPerKWh: number,
    effectiveTime: string,
    effectiveDate: string,
    editDate ?: Date,
}

export const imbalanceState = atom<Iimbalance[] | null>({
    key: 'imbalanceState',
    default: null
})