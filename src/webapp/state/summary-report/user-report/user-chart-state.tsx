import { atom } from "recoil";
interface IMap {
    [key: string]: number;
}
export interface IUserSummary extends IMap {
    AGGREGATOR: number,
    PROSUMER: number,
    CONSUMER: number,
    noUser: number,
}

export interface IEnergySummary extends IMap {
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
    default: {
        energy: {
            pv: 0,
            energyStorage: 0,
            grid: 0,
            energyConsumptions: 0,
        },
        user: {
            AGGREGATOR: 0,
            CONSUMER: 0,
            PROSUMER: 0,
            noUser: 0
        }
    },
})