import { atom } from "recoil";
import { IBuyDetail, ISellDetail } from "./order-detail-state";

export interface IOrderInfo {
    orderId: string,
    tradeMarket: string,
    userType: string, //buyer| seller
    status: string,
    userId: string,
    settlementTime: string,
    targetPrice: number,
    targetAmount: number,
    role?: string, //Aggregator | Prosumer | Consumer
    area?: string, //3 Villages | Thammasat University | VENUE FLOW | Perfect Park | CASA Premium
    regionName?: string,
    tradeContractId?: string,
    orderDetail?: IBuyDetail | ISellDetail,
    meterId?: string,
    matchingMeterId?: string
}

export interface IOrderContract {
    contractId: string,
    buyerId: string,
    sellerId: string,
    status: string,
    userId: string,
    userType: string, //buyer| seller
    tradeMarket: string,
    
    settlementTime: string,
    targetPrice: string,
    targetAmount: string,
    role?: string, //Aggregator | Prosumer | Consumer
    area?: string, //3 Villages | Thammasat University | VENUE FLOW | Perfect Park | CASA Premium
    regionName?: string,
}

export const orderState = atom<IOrderInfo[] | null>({
    key: 'orderState',
    default: null
})