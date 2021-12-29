import { atom } from "recoil"
import { IPowerData } from "./power-data-state"

export interface IPowerByMeter {
    meterId: string,
    peameaSubstation: string,
    egatSubStation: string,
    location: {
        lat: string,
        lng: string,
    }

    energySummary: IEnergyInfo,

    powerUsed?: {
        forecast: IPowerUsed[]
        actual: IPowerUsed[]
    }
}

interface IPowerUsed {
    pv: number,
    grid: number,
    timestamp: string,
}

export interface IEnergyInfo {
    pv: number,
    energyStorage: number,
    grid: number,
    energyLoad: number,
}



interface IForecastPower {

}
interface usedEnergyPeriod {
    period: string,
    usedEnergy: string,
}



export const locationSiteState = atom<IPowerByMeter | null>({
    key: 'locationSiteState',
    default: null
})