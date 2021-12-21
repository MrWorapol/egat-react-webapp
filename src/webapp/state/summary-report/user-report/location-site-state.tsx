import { atom } from "recoil"

export interface ILocationSite {
    meterId: string,
    peameaSubstation: string,
    egatSubStation: string,
    location: {
        lat: string,
        lng: string,
    }
    energy: IEnergyInfo,
}
export interface IEnergyInfo {
    meterId: string,
    pv: number,
    energyStorage: number,
    grid: number,
    energyLoad: number,
}



interface usedEnergyPeriod{
    period: string,
    usedEnergy: string,
}



export const locationSiteState = atom<ILocationSite| null>({
    key: 'locationSiteState',
    default: null
})