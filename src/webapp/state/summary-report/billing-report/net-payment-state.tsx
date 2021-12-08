import { atom } from "recoil";

export interface INetPaymentTable {
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

export interface INetPaymentState {
    table: INetPaymentTable[],
    chart: INetPaymentChart,
}

export const netPaymentState = atom<INetPaymentState | null>({
    key: 'netPaymentState',
    default: null,
})