import { atom } from "recoil";

export interface ISettlementReport {
    contractId: string,
    role: string,
    buyerType: string, //buyer| seller
    tradeMarket: string,
    imbalanceType: string,
    area: string,
}

interface IRoleSummaryChart {
    prosumer: number,
    aggregate: number,
    consumer: number,
}

interface ITypeSummaryChart {
    seller: number,
    buyer: number,
}

interface ITradeMarketSummaryChart {
    bilateralTrade: number,
    poolMarketTrade: number,
}

interface IImbalanceSummaryChart {
    excess: number,
    shortfall: number,

}


export const settlementReportState = atom<ISettlementReport[] | null>({
    key: 'settlementReportState',
    default: null,
})