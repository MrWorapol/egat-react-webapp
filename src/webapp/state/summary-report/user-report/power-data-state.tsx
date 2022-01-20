import { atom } from "recoil";

export interface IPowerData {
    meterId: string,
    timestamp: string,
    inBattery: number,
    inGrid: number,
    inSolar: number,
    load: number,
}

export const powerDatastate = atom<IPowerData[]| null>({
    key: 'powerData',
    default: null
})