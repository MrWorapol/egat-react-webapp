import { atom } from "recoil"
import { Iimbalance } from "./imbalance-state"


export interface IImbalanceLog {
    id: string,
    editDate: string,
    imbalanceId: string,
    type: string,
    imbalance: string,
    imbalanceSetting: {
        id: string,
        type: string,
        imbalance: string,
        scenario: string,
        imbalanceClearing: string,
        bahtPerKWh: string,
        effectiveDate: string,
        effectiveTime: string,
        effectiveDateTime: string
    },
    effectiveDateTime: string
}

export const imbalanceLogsState = atom<IImbalanceLog[] | null>({
    key: 'imbalanceLogs',
    default: null
})