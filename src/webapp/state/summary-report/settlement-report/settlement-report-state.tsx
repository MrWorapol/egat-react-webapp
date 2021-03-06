import { atom } from "recoil";

export interface ITradeContractReport {
    contractId: string,
    meterId: string,
    matchedMeterId: string,
    bilateralTradeSettlementId?: string, // trade ID
    poolTradeSettlementId?: string, // trade ID
    userType: string, //buyer| seller
    tradeMarket: string, //short term, long term,pool market
    role?: string,
    area?: string,
    regionName?: string,
    buyerId: string,
    sellerId: string,
    priceCommitted: number, // price
    energyCommitted: number, // amount
    settlementTime: number, //deliverd time
    timestamp: string, //unix Time
    tradingFee: number,
    wheelingChargeFee: number,
    imbalance?: IImbalanceReport[]
    imbalanceStatus: string,
    priceRuleApplied: string,

}

export interface IImbalanceReport {
    timestamp: number,
    tradeContractIds: string,
    tradeDataId: string,
    tradeType: string, // CONTRACT | SELLER_IMBALANCE_UNDERCOMMIT | SELLER_IMBALANCE_OVERCOMMIT | BUYER_IMBALANCE_UNDERCOMMIT | BUYER_IMBALANCE_OVERCOMMIT
    price: number, //price Deliverd 
    amount: number,//energy Deliverd
    buyerId?: string, // case DSO id is null
    sellerId?: string, // case DSO id is null
    buyerType: string, // USER | DSO
    sellerType: string, // USER | DSO
    tradingFee: number,
    priceRuleApplied: string,
    imbalanceBuyerOverCommit: number,
    imbalanceBuyerUnderCommit: number,
    imbalanceSellerOverCommit: number,
    imbalanceSellerUnderCommit: number
}

export interface IBilateralSettlement {
    timestamp: string,
    bilateralTradeSettlementId: string,
    longtermTradeContractId: string,
}
export const settlementReportState = atom<ITradeContractReport[] | null>({
    key: 'settlementReportState',
    default: null,
})