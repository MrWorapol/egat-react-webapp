import { atom } from "recoil";

export interface IOrderInfo {
    orderId: string,
    tradeMarket: string,
    role: string, //Aggregator | Prosumer | Consumer
    orderType: string, //buyer| seller
    status: string,
    area: string, //3 Villages | Thammasat University | VENUE FLOW | Perfect Park | CASA Premium
}

export const orderState = atom<IOrderInfo[] | null>({
    key: 'orderState',
    default: null
})