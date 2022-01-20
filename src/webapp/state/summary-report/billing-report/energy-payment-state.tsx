import { atom } from "recoil";


export interface IEnergyPaymentTable {
    meterId: string,
    meterName: string,
    role: string,
    area: string,
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
    netSellerImbalanceOverCommited: number,
    netSellerImbalanceUnderCommited: number,
    netBuyerImbalanceOverCommited: number,
    netBuyerImbalanceUnderCommited: number,
}

export interface IAmountImbalanceSummaryChart {
    amountSellerImbalanceOverCommited: number,
    amountSellerImbalanceUnderCommited: number,
    amountBuyerImbalanceOverCommited: number,
    amountBuyerImbalanceUnderCommited: number,
}

export interface IEnergyPaymentState {
    table: IEnergyPaymentTable[],
    energyPaymentChart: IEnergyPaymentChart,
    netImbalanceChart: INetImbalanceSummaryChart,
    amountImbalanceChart: IAmountImbalanceSummaryChart,

}
export const energyPaymentReportState = atom<IEnergyPaymentState| null>({
    key: 'energyPaymentState',
    default: null,
})