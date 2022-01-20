import { atom } from "recoil";

interface IMap {
    [key: string]: any;
}

export interface IOrderDetail extends IMap {
    tradeContractId?: string,
    userType: string,
    tradeMarket: string,
    orderDetail: IBuyDetail | ISellDetail | IOpenOrderDetail,
}

export interface ISellDetail extends IMap {
    deliverdTime: string,
    commitedAmount: number,
    offerToSell: number,
    tradingFee: number,
    estimatedSales: number,
}

export interface IBuyDetail extends IMap {
    amount: number,
    netBuy: number,
    netEnergyPrice: number,
    energyToBuy: number,
    energyTariff: number,
    energyPrice: number,
    wheelingChargeTariff: number,
    wheelingCharge: number,
    tradingFee: number,

}

export interface IOpenOrderDetail extends IMap {
    deliverdTime: string,
    price: number,
    commitedAmount: number,
}

export const orderDetailState = atom<IOrderDetail | null>({
    key: 'orderDetailState',
    default: null

})