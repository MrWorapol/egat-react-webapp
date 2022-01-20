import dayjs from 'dayjs';
import { druidHost, localDruidEndpoint } from '../../constanst';
import { IOrderDetail } from '../../state/summary-report/order-report/order-detail-state';
import { IOrderInfo } from '../../state/summary-report/order-report/order-report-state';
import { IPeriod } from '../../state/summary-report/period-state';
import { ITradeContractReport } from '../../state/summary-report/settlement-report/settlement-report-state';
import { IUserSession } from '../../state/user-sessions';
import { SettlementReportAPI } from './SettlementReportAPI';

interface IGetOrderDetailRequest {
    session: IUserSession,
    traceContractId: string,
}
interface IGetOrderDetailResponse {
    context: IOrderDetail,

}
interface IGetDruidBody {
    query: string,
    resultFormat: string,
}


export interface IGetOrderTableRequest {
    session: IUserSession,
    period?: IPeriod,
}

interface IGetOrderRequest {
    session: IUserSession,
    period?: IPeriod,
}
interface IOrderResponseFromJSON {
    "payload.id": string,
    timestamp: string,
    userId: string,
    status: string,
    settlementTime: string,
    targetPrice: number,
    targetAmount: number,

}
interface IGetOrderResponse {
    timestamp: string,
    orderId: string,
    userId: string,
    userType: string
    tradeMarket: string,
    status: string,
    settlementTime: string,
    targetAmount: number,
    targetPrice: number,
}

interface ISettlementOrder {
    id: string,
    settlementTime: string,
    createTime: string,
    matches: IPoolMatchedOrder[] | IBilateralMatchedOrder[]

}
interface IPoolMatchedOrder {
    tradeOfferId: string,
    tradeBidId: string,
    offerUserId: string,
    bidUserId: string,
    amount: number,
    price: number,
}
interface IBilateralMatchedOrder {
    tradeOfferId: string,
    tradeBidId: string,
    offerUserId: string,
    bidUserId: string,
    amount: number,
    price: number,
}
interface IGetOrderTableResponse {
    context: IOrderInfo[],
}
interface IGetMathOrderResponse {
    context: IOrderInfo[],
}
export class OrderReportAPI {
    private endpoint = druidHost;
    private tradeContractAPI = new SettlementReportAPI();
    async getOderDetail(req: IGetOrderDetailRequest): Promise<IGetOrderDetailResponse | null> {

        const body: IGetDruidBody = {
            "query": `SELECT DISTINCT "__time", 
            "payload.amount",
            "payload.buyerId",
            "payload.id",
            "payload.price",
            "payload.priceRuleApplied", 
            "payload.reference.bilateralTradeSettlementId",
            "payload.reference.marketType",
            "payload.sellerId",
            "payload.settlementTime",
            "payload.timestamp",
            "payload.tradingFee",
            "payload.wheelingChargeFee"
            FROM "TradeContractOnEgat"
            WHERE "payload.id" = '61ad40610cf1ac18b2e25c1a'`,
            "resultFormat": "object"
        }
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }
        try {
            const response = await fetch(this.endpoint, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const detailFromJSON = await response.json();
            const results: IGetOrderResponse[] = detailFromJSON.map((order: IOrderResponseFromJSON) => {
                return {
                    orderId: order[`payload.id`],
                    userId: order.userId,
                    status: order.status,
                    targetAmount: order.targetAmount,
                    targetPrice: order.targetPrice,
                    userType: "SELLER",
                    tradeMarket: "POOL",
                    settlementTime: order.settlementTime

                }
            })
            console.log(`get Order Detail`);
            console.log(detailFromJSON);
            // return results;
            return null;
        } catch (e) {
            console.log(e);

            return null;
        }
    }
    async getOrderTable(req: IGetOrderTableRequest): Promise<IGetOrderTableResponse | null> {

        let results: IGetOrderTableResponse = { context: [] };

        let poolSellerOpenOrders = await this.getPoolTradeOffer({ session: req.session, period: req.period });
        if (poolSellerOpenOrders && poolSellerOpenOrders.length > 0) {
            results.context.push(...poolSellerOpenOrders);
        }
        let poolBuyerOpenOrders = await this.getPoolMarketBid({ session: req.session, period: req.period });
        if (poolBuyerOpenOrders && poolBuyerOpenOrders.length > 0) {
            console.log(poolBuyerOpenOrders)
            results.context.push(...poolBuyerOpenOrders);
        }
        let bilateralSellerOpenOrders = await this.getBilateralTradeOffer({ session: req.session, period: req.period });
        if (bilateralSellerOpenOrders && bilateralSellerOpenOrders.length > 0) {
            console.log(bilateralSellerOpenOrders)
            results.context.push(...bilateralSellerOpenOrders);
        }
        let matchOrders = await this.getMatchedOrder({ session: req.session, period: req.period });
        if (matchOrders && matchOrders.context.length > 0) {
            results.context.push(...matchOrders.context);
        }
        return results;
    }


    // async getPoolTradeOffer(req: IGetOrderRequest): Promise<IGetOrderResponse[] | null> {
    //     const body: IGetDruidBody = {
    //         "query": `SELECT 
            
    //         "payload.id" , 
    //         LATEST("payload.sellerId",50)FILTER(WHERE "payload.sellerId" IS NOT NULL) as userId, 
    //         LATEST("payload.status",10) FILTER (WHERE "payload.status" is not null) status,
    //         LATEST(CAST("__time" as VARCHAR) ,50 ) FILTER(WHERE "__time" is not null) settlementTime,
    //         LATEST(CAST("payload.targetPrice" as VARCHAR),10 ) FILTER(WHERE "payload.targetPrice" is not null) targetPrice,
    //         LATEST(CAST("payload.targetAmount" as VARCHAR),10 ) FILTER(WHERE "payload.targetAmount" is not null) targetAmount
    //         FROM "PoolMarketOfferOnEgatF"
    //         WHERE status = "OPEN"
    //         GROUP BY "payload.id"`,
    //         "resultFormat": "object"
    //     }
    //     let headers = {
    //         "Content-Type": "application/json",
    //         "Accept": "application/json",
    //         "Authorization": `Bearer ${req.session.accessToken}`,
    //     }
    //     try {
    //         const response = await fetch(this.endpoint, {
    //             headers,
    //             method: "POST",
    //             body: JSON.stringify(body),
    //         })
    //         const ordersFromJSON: IOrderResponseFromJSON[] = await response.json();
    //         const results: IGetOrderResponse[] = ordersFromJSON.map((order: IOrderResponseFromJSON) => {
    //             return {
    //                 timestamp: order.timestamp,
    //                 orderId: order[`payload.id`],
    //                 userId: order.userId,
    //                 status: order.status,
    //                 targetAmount: order.targetAmount,
    //                 targetPrice: order.targetPrice,
    //                 userType: "SELLER",
    //                 tradeMarket: "POOL",
    //                 settlementTime: order.settlementTime

    //             }
    //         })
    //         return results;
    //     } catch (e) {
    //         console.log(e);

    //         return null;
    //     }
    // }

    async getPoolTradeOffer(req: IGetOrderRequest): Promise<IGetOrderResponse[] | null> {
        const period = req.period;
        const body: IGetDruidBody = {
            "query": `SELECT "payload.id",
            LATEST(CAST("__time" as VARCHAR),100) FILTER (WHERE "__time" is not null) as "timestamp",
            LATEST("payload.sellerId",50)FILTER(WHERE "payload.sellerId" IS NOT NULL) as userId, 
            LATEST("payload.status",10) FILTER (WHERE "payload.status" is not null) status,
            LATEST(CAST("payload.settlementTime" as VARCHAR),50 ) FILTER(WHERE "payload.settlementTime" is not null) settlementTime,
            LATEST(CAST("payload.targetPrice" as VARCHAR),10 ) FILTER(WHERE "payload.targetPrice" is not null) targetPrice,
            LATEST(CAST("payload.targetAmount" as VARCHAR),10 ) FILTER(WHERE "payload.targetAmount" is not null) targetAmount
            FROM "PoolMarketOfferOnEgatF"
            WHERE "payload.status" = 'OPEN'
            GROUP BY "payload.id"`,
            "resultFormat": "object"
        }
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }
        try {
            const response = await fetch(this.endpoint, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const ordersFromJSON: IOrderResponseFromJSON[] = await response.json();
            let results: IGetOrderResponse[] = [];
            ordersFromJSON.forEach((order: IOrderResponseFromJSON) => {
                if (period) {
                    let inRange = dayjs(order.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                        && dayjs(order.timestamp).isBefore(dayjs(period.endDate).endOf('day'))
                    console.log(`is ${dayjs(order.timestamp).toDate()} inRange:${inRange} of :${dayjs(period.startDate).startOf('day')}\t to ${dayjs(period.endDate).endOf('day')}`);
                    if (inRange) {
                        results.push({
                            timestamp: order.timestamp,
                            orderId: order[`payload.id`],
                            userId: order.userId,
                            status: order.status,
                            targetAmount: order.targetAmount,
                            targetPrice: order.targetPrice,
                            userType: "SELLER",
                            tradeMarket: "POOL",
                            settlementTime: order.settlementTime

                        })
                    } else {
                        results.push({
                            timestamp: order.timestamp,
                            orderId: order[`payload.id`],
                            userId: order.userId,
                            status: order.status,
                            targetAmount: order.targetAmount,
                            targetPrice: order.targetPrice,
                            userType: "SELLER",
                            tradeMarket: "POOL",
                            settlementTime: order.settlementTime

                        })
                    }
                }
            })
            // console.log(`result from pool trade Offer`);
            // console.log(results);
            return results;
        } catch (e) {
            console.log(e);

            return null;
        }
    }//wait for 

    async getPoolMarketBid(req: IGetOrderRequest): Promise<IGetOrderResponse[] | null> { //new query
        const period = req.period;
        const body: IGetDruidBody = {
            "query": `SELECT "payload.id",
            LATEST(CAST("__time" as VARCHAR),100) FILTER (WHERE "__time" is not null) as "timestamp",
            LATEST("payload.bidderId",50)FILTER(WHERE "payload.bidderId" IS NOT NULL) as userId, 
            LATEST("payload.status",10) FILTER (WHERE "payload.status" is not null) status,
            LATEST(CAST("payload.settlementTime" as VARCHAR),50 ) FILTER(WHERE "payload.settlementTime" is not null) settlementTime,
            LATEST(CAST("payload.targetPrice" as VARCHAR),10 ) FILTER(WHERE "payload.targetPrice" is not null) targetPrice,
            LATEST(CAST("payload.targetAmount" as VARCHAR),10 ) FILTER(WHERE "payload.targetAmount" is not null) targetAmount
            FROM "PoolMarketBidOnEgatF"
            WHERE "payload.status" = 'OPEN'
            GROUP BY "payload.id"`,
            "resultFormat": "object"
        }
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }
        try {
            const response = await fetch(this.endpoint, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const ordersFromJSON: IOrderResponseFromJSON[] = await response.json();
            let results: IGetOrderResponse[] = [];
            ordersFromJSON.forEach((order: IOrderResponseFromJSON) => {
                if (period) {
                    let inRange = dayjs(order.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                        && dayjs(order.timestamp).isBefore(dayjs(period.endDate).endOf('day'))
                    if (inRange) {
                        results.push({
                            timestamp: order.timestamp,
                            orderId: order[`payload.id`],
                            userId: order.userId,
                            status: order.status,
                            targetAmount: order.targetAmount,
                            targetPrice: order.targetPrice,
                            userType: "BUYER",
                            tradeMarket: "POOL",
                            settlementTime: order.settlementTime
                        })
                    }
                }
                else {
                    results.push({
                        timestamp: order.timestamp,
                        orderId: order[`payload.id`],
                        userId: order.userId,
                        status: order.status,
                        targetAmount: order.targetAmount,
                        targetPrice: order.targetPrice,
                        userType: "BUYER",
                        tradeMarket: "POOL",
                        settlementTime: order.settlementTime
                    })
                }
            })

            console.log(`Get Pool Market Bid`);
            console.log(results);
            return results;
        } catch (e) {
            console.log(e);

            return null;
        }
    }

    async getBilateralTradeOffer(req: IGetOrderRequest): Promise<IGetOrderResponse[] | null> {  //new query
        const period = req.period;
        const body: IGetDruidBody = {
            "query": `SELECT "payload.id",
            LATEST(CAST("__time" as VARCHAR),100) FILTER (WHERE "__time" is not null) as "timestamp",
            LATEST("payload.sellerId",50)FILTER(WHERE "payload.sellerId" IS NOT NULL) as userId, 
            LATEST("payload.status",10) FILTER (WHERE "payload.status" is not null) status,
            LATEST(CAST("payload.settlementTime" as VARCHAR),50 ) FILTER(WHERE "payload.settlementTime" is not null) settlementTime,
            LATEST(CAST("payload.targetPrice" as VARCHAR),10 ) FILTER(WHERE "payload.targetPrice" is not null) targetPrice,
            LATEST(CAST("payload.targetAmount" as VARCHAR),10 ) FILTER(WHERE "payload.targetAmount" is not null) targetAmount
            FROM "BilateralTradeOfferOnEgat"
            WHERE "payload.status" = 'OPEN'
            GROUP BY "payload.id"`,
            "resultFormat": "object"
        }
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }
        try {
            const response = await fetch(this.endpoint, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const ordersFromJSON: IOrderResponseFromJSON[] = await response.json();
            console.log(`response offer bilateral`)
            console.log(ordersFromJSON);
            let results: IGetOrderResponse[] = [];
            ordersFromJSON.forEach((order: IOrderResponseFromJSON) => {
                if (period) {
                    let inRange = dayjs(order.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                        && dayjs(order.timestamp).isBefore(dayjs(period.endDate).endOf('day'))
                    console.log(`is ${dayjs(order.timestamp).toDate()} inRange:${inRange} of :${dayjs(period.startDate).startOf('day')}\t to ${dayjs(period.endDate).endOf('day')}`);
                    if (inRange) {
                        results.push({
                            timestamp: order.timestamp,
                            orderId: order[`payload.id`],
                            userId: order.userId,
                            status: order.status,
                            targetAmount: order.targetAmount,
                            targetPrice: order.targetPrice,
                            userType: "SELLER",
                            tradeMarket: "BILATERAL",
                            settlementTime: order.settlementTime
                        })
                    }
                } else {
                    results.push({
                        timestamp: order.timestamp,
                        orderId: order[`payload.id`],
                        userId: order.userId,
                        status: order.status,
                        targetAmount: order.targetAmount,
                        targetPrice: order.targetPrice,
                        userType: "SELLER",
                        tradeMarket: "BILATERAL",
                        settlementTime: order.settlementTime
                    })
                }
            })
            console.log(`get seller bilateral`)
            console.log(results);
            return results;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    // async getBilateralTradeSettlement(req: IGetOrderRequest): Promise<IGetOrderResponse[] | null> {
    //     const period = req.period;
    //     const body: IGetDruidBody = {
    //         "query": `SELECT "payload.id", 
    //         "payload.buyerId" as userId, 
    //         "payload.settlementTime" settlementTime,
    //         "payload.amount" as targetAmount,
    //         "payload.price" as targetPrice
    //         FROM "BilateralSettlementOnEgat"
    //         WHERE "__time" > '2021-12-07T00:00:00.000Z'`,
    //         "resultFormat": "object"
    //     }
    //     let headers = {
    //         "Content-Type": "application/json",
    //         "Accept": "application/json",
    //         "Authorization": `Bearer ${req.session.accessToken}`,
    //     }
    //     try {
    //         const response = await fetch(this.endpoint, {
    //             headers,
    //             method: "POST",
    //             body: JSON.stringify(body),
    //         })
    //         const ordersFromJSON: IOrderResponseFromJSON[] = await response.json();
    //         let results: IGetOrderResponse[] = [];
    //         ordersFromJSON.forEach((order: IOrderResponseFromJSON) => {
    //             if (period) {
    //                 let inRange = dayjs(order.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
    //                     && dayjs(order.timestamp).isBefore(dayjs(period.endDate).endOf('day'))
    //                 if (inRange) {
    //                     results.push({
    //                         timestamp: order.timestamp,
    //                         orderId: order[`payload.id`],
    //                         userId: order.userId,
    //                         status: order.status,
    //                         targetAmount: order.targetAmount,
    //                         targetPrice: order.targetPrice,
    //                         userType: "BUYER",
    //                         tradeMarket: "BILATERAL",
    //                         settlementTime: order.settlementTime
    //                     })
    //                 }
    //             } else {
    //                 results.push({
    //                     timestamp: order.timestamp,
    //                     orderId: order[`payload.id`],
    //                     userId: order.userId,
    //                     status: order.status,
    //                     targetAmount: order.targetAmount,
    //                     targetPrice: order.targetPrice,
    //                     userType: "BUYER",
    //                     tradeMarket: "BILATERAL",
    //                     settlementTime: order.settlementTime
    //                 })
    //             }
    //         })

    //         return results;
    //     } catch (e) {
    //         console.log(e);

    //         return null;
    //     }
    // }
    // async getBilateralSettlement(req: IGetOrderRequest) {

    //     const period = req.period;
    //     const body: IGetDruidBody = {
    //         "query": `SELECT 

    //         "payload.id" , 
    //         LATEST("payload.sellerId",50)FILTER(WHERE "payload.sellerId" IS NOT NULL) as userId, 
    //         LATEST("payload.status",10) FILTER (WHERE "payload.status" is not null) status,
    //         LATEST(CAST("__time" as VARCHAR) ,50 ) FILTER(WHERE "__time" is not null) settlementTime,
    //         LATEST(CAST("payload.targetPrice" as VARCHAR),10 ) FILTER(WHERE "payload.targetPrice" is not null) targetPrice,
    //         LATEST(CAST("payload.targetAmount" as VARCHAR),10 ) FILTER(WHERE "payload.targetAmount" is not null) targetAmount
    //         FROM "PoolMarketOfferOnEgat"
    //         WHERE status = "OPEN"
    //         GROUP BY "payload.id"`,
    //         "resultFormat": "object"
    //     }
    //     let headers = {
    //         "Content-Type": "application/json",
    //         "Accept": "application/json",
    //         "Authorization": `Bearer ${req.session.accessToken}`,
    //     }
    //     try {
    //         const response = await fetch(this.endpoint, {
    //             headers,
    //             method: "POST",
    //             body: JSON.stringify(body),
    //         })
    //         const ordersFromJSON: IOrderResponseFromJSON[] = await response.json();
    //         if (ordersFromJSON) {

    //         }
    //     } catch (e) {
    //         throw e;
    //     }
    // }

    async getMatchedOrder(req: IGetOrderRequest): Promise<IGetMathOrderResponse | null> {
        const contracts = await this.tradeContractAPI.getTradeContractReport({ ...req });
        const period = req.period;
        let results: IGetMathOrderResponse = { context: [] };

        if (contracts && contracts.context.length > 0) {
            contracts.context.forEach((contract: ITradeContractReport) => {
                if (period) {
                    let inRange = dayjs(contract.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                        && dayjs(contract.timestamp).isBefore(dayjs(period.endDate).endOf('day'))
                    if (inRange) {
                        results.context.push({ // insert seller Matched
                            orderId: contract.contractId,
                            userId: contract.sellerId,
                            status: "MATCHED",
                            targetAmount: contract.energyCommitted,
                            targetPrice: contract.priceCommitted,
                            userType: "SELLER",
                            tradeMarket: contract.tradeMarket,
                            settlementTime: contract.settlementTime,
                            tradeContractId: contract.contractId,
                            orderDetail: {
                                deliverdTime: contract.settlementTime,
                                commitedAmount: contract.energyCommitted,
                                offerToSell: contract.priceCommitted,
                                tradingFee: contract.tradingFee,
                                estimatedSales: contract.priceCommitted
                            }
                        })
                        results.context.push({//insert buyer Matched
                            orderId: contract.contractId,
                            userId: contract.buyerId,
                            status: "MATCHED",
                            targetAmount: contract.energyCommitted,
                            targetPrice: contract.priceCommitted,
                            userType: "BUYER",
                            tradeMarket: contract.tradeMarket,
                            settlementTime: contract.settlementTime,
                            tradeContractId: contract.contractId,
                            orderDetail: {
                                amount: contract.energyCommitted,
                                netBuy: contract.priceCommitted + contract.wheelingChargeFee + contract.tradingFee, //sum of Data
                                netEnergyPrice: contract.priceCommitted,
                                energyToBuy: contract.energyCommitted,
                                energyTariff: Math.round(contract.energyCommitted / contract.priceCommitted), //dont sure
                                energyPrice: (contract.priceCommitted * contract.energyCommitted), // dont sure
                                wheelingChargeTariff: Math.round((contract.wheelingChargeFee / contract.energyCommitted)), //dont sure
                                wheelingCharge: contract.wheelingChargeFee,
                                tradingFee: contract.tradingFee,
                            }
                        })
                    }

                } else {
                    results.context.push({ // insert seller Matched
                        orderId: contract.contractId,
                        userId: contract.sellerId,
                        status: "MATCHED",
                        targetAmount: contract.energyCommitted,
                        targetPrice: contract.priceCommitted,
                        userType: "SELLER",
                        tradeMarket: contract.tradeMarket,
                        settlementTime: contract.settlementTime,
                        tradeContractId: contract.contractId,
                        orderDetail: {
                            deliverdTime: contract.settlementTime,
                            commitedAmount: contract.energyCommitted,
                            offerToSell: contract.priceCommitted,
                            tradingFee: contract.tradingFee,
                            estimatedSales: contract.priceCommitted
                        }
                    })
                    results.context.push({//insert buyer Matched
                        orderId: contract.contractId,
                        userId: contract.buyerId,
                        status: "MATCHED",
                        targetAmount: contract.energyCommitted,
                        targetPrice: contract.priceCommitted,
                        userType: "BUYER",
                        tradeMarket: contract.tradeMarket,
                        settlementTime: contract.settlementTime,
                        tradeContractId: contract.contractId,
                        orderDetail: {
                            amount: contract.energyCommitted,
                            netBuy: contract.priceCommitted + contract.wheelingChargeFee + contract.tradingFee, //sum of Data
                            netEnergyPrice: contract.priceCommitted,
                            energyToBuy: contract.energyCommitted,
                            energyTariff: Math.round(contract.energyCommitted / contract.priceCommitted), //dont sure
                            energyPrice: (contract.priceCommitted * contract.energyCommitted), // dont sure
                            wheelingChargeTariff: Math.round((contract.wheelingChargeFee / contract.energyCommitted)), //dont sure
                            wheelingCharge: contract.wheelingChargeFee,
                            tradingFee: contract.tradingFee,
                        }
                    })
                }

            })
        }

        return results;
    }

}
