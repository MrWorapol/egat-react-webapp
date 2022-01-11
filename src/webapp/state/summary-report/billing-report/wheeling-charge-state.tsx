import { atom } from "recoil";

export interface IWheelingChargeTable {
    wheelingCharge: string,
    meterId: string,
    meterName: string,
    role: string,
    area: string,
    price: number,
}

export interface IWheelingSummaryChart {
    mea: number,
    pea: number,
    meaegat: number,
    peaegat: number,
    meapeaegat: number,

}

export interface INetWheelingSummaryChart {
    confidential: number,
    t: number,
    d: number,
    re: number,
    vat: number,
}

export interface IWheelingReportState {
    table: IWheelingChargeTable[],
    summary: IWheelingSummaryChart,
    netSummary: INetWheelingSummaryChart,
}
export const wheelingReportState = atom<IWheelingReportState | null>({
    key: 'wheelingReportState',
    default: null,
})