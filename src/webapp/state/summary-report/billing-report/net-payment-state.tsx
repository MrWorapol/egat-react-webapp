import { atom } from "recoil";

export interface INetPaymentTable {
    meterId: string,
    meterName: string,
    role: string,
    area: string,
    netPrice: number,
}

export interface INetPaymentChart {
    tradingPayment: number,
    gridUsed: number,
    wheelingCharge: number,
}

export interface INetPaymentState {
    table: INetPaymentTable[],
    chart: INetPaymentChart,
}

export const netPaymentReportState = atom<INetPaymentState | null>({
    key: 'netPaymentState',
    default: null,
})