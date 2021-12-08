import { atom } from "recoil";


export interface IEnergyPaymentTable {
    meterId: string,
    meterName: string,
    role: string,
    netPrice: number,
}

export interface IEnergyPaymentChart {
    netSales: number,
    netBuys: number,
    netImbalance: number,
    appTransaction: number,
    vat: number,
    discountFees: number,
}
export interface INetImbalanceSummaryChart {
    netSellerImPlus: number,
    netSellerImMinus: number,
    netBuyerImPlus: number,
    netBuyerImMinus: number,
}

export interface IAmountImbalanceSummaryChart {
    netSellerImPlus: number,
    netSellerImMinus: number,
    netBuyerImPlus: number,
    netBuyerImMinus: number,
}

export interface IEnergyPaymentState {
    table: IEnergyPaymentTable,
    paymentChart: IEnergyPaymentChart,
    netImbalanceChart: INetImbalanceSummaryChart,
    amountImbalanceChart: IAmountImbalanceSummaryChart,

}
export const energyPaymentState = atom<IEnergyPaymentState| null>({
    key: 'energyPaymentState',
    default: null,
})