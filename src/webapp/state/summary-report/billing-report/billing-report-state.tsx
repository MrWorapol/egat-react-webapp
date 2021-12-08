import { atom } from "recoil";

export interface IBillingReport {

}


export interface INetPayment {
    meterId: string,
    meterName: string,
    role: string,
    netPrice: number,
}

export interface INetPaymentChart {
    tradingPaymeny: number,
    gridUsed: number,
    wheelingCharge: number,
}

export interface IEnergyTradingPayment {
    meterId: string,
    meterName: string,
    role: string,
    netPrice: number,
}

export interface IEnergyTradingPaymentChart {
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

export interface amountImbalanceChart {
    netSellerImPlus: number,
    netSellerImMinus: number,
    netBuyerImPlus: number,
    netBuyerImMinus: number,
}

export interface gridUsed { }
export const billingState = atom<INetPaymentChart | null>({
    key: 'billingState',
    default: null
})