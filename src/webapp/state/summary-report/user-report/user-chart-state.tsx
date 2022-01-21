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
    pv: number, //inSolar
    energyStorage: number, // Math.abs(inBatt <0)
    grid: number, // Math.abs(inGrid <0)
    load: number,
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
            load: 0,
        },
        user: {
            AGGREGATOR: 0,
            CONSUMER: 0,
            PROSUMER: 0,
            noUser: 0
        }
    },
})