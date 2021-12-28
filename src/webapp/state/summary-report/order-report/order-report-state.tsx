import { atom } from "recoil";

export interface IOrderInfo {
    orderId: string,
    tradeMarket: string,
    userType: string, //buyer| seller
    status: string,
    userId: string,
    settlementTime: string,
    targetPrice: string,
    targetAmount: string,
    role?: string, //Aggregator | Prosumer | Consumer
    area?: string, //3 Villages | Thammasat University | VENUE FLOW | Perfect Park | CASA Premium
    regionName?: string,
    contractId?: string,
}

export const orderState = atom<IOrderInfo[] | null>({
    key: 'orderState',
    default: null
})