import { atom } from "recoil";
import { ISettlementReport } from "./settlement-report-state";

export interface ISettlementDetail {
    contractId: string,
    orderType: string, //buyer| seller
    tradeMarket: string,
    imbalanceType: string,
    energyCommited: number,
    energyDeliverd: number,
    netBuy: number,
    buyerImbalance: number,
    buyerImbalanceAmount: number,
    netEnergyPrice: number,
}

export const settlementDetailState = atom<ISettlementReport | null>({
    key: 'settlementDetailState',
    default: null,
})