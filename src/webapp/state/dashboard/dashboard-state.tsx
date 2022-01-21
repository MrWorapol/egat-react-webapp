import { atom } from "recoil"

export interface IDashboard {
    user?: {
        allmeter: number,
        registeredUser: number,
        newRegister: number,
        aggregator: number,
        prosumer: number,
        consumer: number,
        noUser: number,
    },
    energy?: {
        pv: number,
        storage: number,
        gridUsed: number,
        load: number,
    },
    trading?: {

    }

}

export interface IGetAllUser {
    "meterId": string,
    "userId": string | null,
    "role": string | null,
    "active": string,
    "registrationDate": string
}


export interface IUserDashboard {
    allmeter: number,
    registeredUser: number,
    newRegister: number,
    aggregator: number,
    prosumer: number,
    consumer: number,
    noUser: number,
}

export interface IEnergyDashboard {
    pv: number,
    charge: number,
    discharge: number,
    gridUsed: number,
    load: number,
}

export interface ITradeDashboard {
    totalOrder: number,
    totalContract: number,
    netSale: number,
    netBuy: number,
    netImbalance: number,
    netPayment: number,
    totalEnergyNet: number,
    totalGridNet: number,
    totalWheelingNet: number,
    accREC: number

}
export const dashboardState = atom<IDashboard | null>({
    key: 'dashboardState',
    default: null

})

export const userDashboardState = atom<IUserDashboard | null>({
    key: 'userDashboardState',
    default: null
})

export const energyrDashboardState = atom<IEnergyDashboard | null>({
    key: 'energyDashboardState',
    default: null
})

export const tradingDashboardState = atom<ITradeDashboard | null>({
    key: 'tradeDashboardState',
    default: null
})