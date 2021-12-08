import { atom } from "recoil";

export interface IBillingReport {

}





export interface INetImbalanceSummaryChart {
    netSellerImPlus: number,
    netSellerImMinus: number,
    netBuyerImPlus: number,
    netBuyerImMinus: number,

}

export interface amountImbalanceChart {
    netSellerImPlus: number,
    netSellerImMinus: number,
    netBuyerImPlus: number,
    netBuyerImMinus: number,
}

export interface gridUsed { }
export const billingState = atom<null>({
    key: 'billingState',
    default: null
})