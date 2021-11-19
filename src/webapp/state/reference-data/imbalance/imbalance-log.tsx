import { atom } from "recoil"
import { Iimbalance } from "./imbalance-state"



export const imbalanceLogsState = atom<Iimbalance[] | null>({
    key: 'imbalanceLogs',
    default: null
})