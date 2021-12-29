import { atom } from "recoil";

export interface ISettlementReport {
    contractId: string,
    role: string,
    userType: string, //buyer| seller
    tradeMarket: string,
    imbalanceType: string,
    area: string,
}



interface IImbalanceSummaryChart {
    excess: number,
    shortfall: number,

}


export const settlementReportState = atom<ISettlementReport[] | null>({
    key: 'settlementReportState',
    default: null,
})