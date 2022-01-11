import { atom } from "recoil";

export interface IGridUsedTable {
    meterId: string,
    meterName: string,
    role: string,
    area: string,
    gridPrice: number,
    gridUsedType: string,
}

export interface IGridUsedChart {
    gridUsed: number,
    serviceCharge: number,
    ft: number,
    amount: number,
    vat: number,
    discount: number,
}

export interface ITOUTariffChart {
    peak: number,
    offPeak: number,
    offPeakWeekend: number,
    offPeakHoliday: number,
}

export interface IGridUsedState {
    table: IGridUsedTable[],
    gridChart: IGridUsedChart,
    netTOUTariff: ITOUTariffChart,
    amountTOUTariff: ITOUTariffChart
}
export const gridUsedReportState = atom<IGridUsedState | null>({
    key: 'gridUsedState',
    default: null,
})