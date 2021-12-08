import { atom } from "recoil";

export interface IUserSummary {
    aggregator: number,
    prosumer: number,
    consumer: number,
    noUser: number,
}

export interface IEnergySummary {
    pv: number,
    energyStorage: number,
    grid: number,
    energyConsumptions: number,
}

export interface IUserChart {
    energy: IEnergySummary,
    user: IUserSummary
}
export const userChartState = atom<IUserChart | null>({
    key: 'userChartState',
    default: null,
})