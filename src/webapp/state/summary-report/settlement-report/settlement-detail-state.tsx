import { atom } from "recoil";
import { ITradeContractReport } from "./settlement-report-state";

export interface ISettlementDetail {
    contractId: string,
    userType: string, //buyer| seller
    tradeMarket: string, //bilateral /pool market /long term 
    imbalanceType: string, //shorfall | excess | contract
    energyCommited: number, 
    energyDeliverd: number,
    netPrice: number,
    orderImbalance?: number,
    orderImbalanceAmount?: number,
    netEnergyPrice: number,
}

export const settlementDetailState = atom<ISettlementDetail | null>({
    key: 'settlementDetailState',
    default: null,
})