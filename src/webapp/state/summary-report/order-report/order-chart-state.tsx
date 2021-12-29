import { atom } from "recoil";
interface IMap {
    [key: string]: {
        [x: string]: number,
    }
}
export interface IOrderChart extends IMap{
    role: {
        "aggregator": number,
        "prosumer": number,
        "consumer": number,
    },
    buyerType: {
        seller: number,
        buyer: number,
    },
    trade: {
        bilateral: number,
        pool: number,
    },
    status: {
        matched: number,
        open: number,
    }
}


export const orderChartState = atom<IOrderChart | null>({
    key: 'orderChartState',
    default: null
})