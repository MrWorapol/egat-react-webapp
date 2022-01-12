import { atom } from "recoil";
interface IMap {
    [key: string]: {
        [attribute: string]: number,
    }
}
export interface ISettlementChart extends IMap {
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
        energyExcess: number,
        energyShortfall: number,
    },
    netImbalanceAmountByStatus: {
        sellerUnderCommit: number,
        sellerOverCommit: number,
        buyerUnderCommit: number,
        buyerOverCommit: number
    },
    netImbalanceAmount: {
        netSale: number,
        netBuy: number,
        netAll: number
    }

}


export const settlementChartState = atom<ISettlementChart | null>({
    key: 'settlementChartState',
    default: null
})