import { atom } from "recoil";

export interface IGridUsedTable {
    meterId: string,
    meterName: string,
    role: string,
    gridPrice: number,
    gridUsed: string,
}

export interface IGridUsedChart {
    gridUsed: number,
    serviceCharge: number,
    ft: number,
    summary: number,
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
export const gridUsedState = atom<IGridUsedState| null>({
    key: 'gridUsedState',
    default: null,
})