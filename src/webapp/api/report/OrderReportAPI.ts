import { druidHost, localDruidEndpoint } from '../../constanst';
import { IOrderDetail } from '../../state/summary-report/order-report/order-detail-state';
import { IOrderInfo } from '../../state/summary-report/order-report/order-report-state';
import { IPeriod } from '../../state/summary-report/period-state';
import { IUserSession } from '../../state/user-sessions';

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
    roles?: string[],
    buyerType?: string,
    tradeMarket?: string,
    orderStatus?: string,
}

interface IGetOrderRequest {
    session: IUserSession,
}
interface IOrderResponseFromJSON {
    "payload.id": string,
    userId: string,
    status: string,
    settlementTime: string,
    targetPrice: string,
    targetAmount: string,

}
interface IGetOrderResponse {
    orderId: string,
    userId: string,
    userType: string
    tradeMarket: string,
    status: string,
    settlementTime: string,
    targetAmount: string,
    targetPrice: string,
}

interface IGetOrderTableResponse {
    context: IOrderInfo[],
}

export class OrderReportAPI {
    private endpoint = druidHost;

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
        
        let poolSellerOrders = await this.getPoolTradeOffer({ session: req.session });
        if (poolSellerOrders && poolSellerOrders.length > 0) {
            results.context.push(...poolSellerOrders);
        }
        let poolBuyerOrders = await this.getPoolTradeBid({ session: req.session });
        if (poolBuyerOrders && poolBuyerOrders.length > 0) {
            results.context.push(...poolBuyerOrders);
        }
        let bilateralSellerOrders = await this.getBilateralTradeOffer({ session: req.session });
        if (bilateralSellerOrders && bilateralSellerOrders.length > 0) {
            results.context.push(...bilateralSellerOrders);
        }
        let bilateralBuyerOrders = await this.getBilateralTradeSettlement({ session: req.session });
        if (bilateralBuyerOrders && bilateralBuyerOrders.length > 0) {
            results.context.push(...bilateralBuyerOrders);
        }

        // console.log(`result from pool trade Offer`);
        // console.log(poolSellerOrders);
        // console.log(`Get Pool Trade Bid`);
        // console.log(poolBuyerOrders);
        // console.log(`get Bilateral Trade Offer`);
        // console.log(bilateralSellerOrders);
        // console.log(`Get Bilateral Trade Settlement`);
        // console.log(bilateralBuyerOrders);
        return results;

    }


    async getPoolTradeOffer(req: IGetOrderRequest): Promise<IGetOrderResponse[] | null> {
        const body: IGetDruidBody = {
            "query": `SELECT "payload.id" , 
            LATEST("payload.sellerId",50)FILTER(WHERE "payload.sellerId" IS NOT NULL) as userId, 
            LATEST("payload.status",10) FILTER (WHERE "payload.status" is not null) status,
            LATEST(CAST("__time" as VARCHAR) ,50 ) FILTER(WHERE "__time" is not null) settlementTime,
            LATEST(CAST("payload.targetPrice" as VARCHAR),10 ) FILTER(WHERE "payload.targetPrice" is not null) targetPrice,
            LATEST(CAST("payload.targetAmount" as VARCHAR),10 ) FILTER(WHERE "payload.targetAmount" is not null) targetAmount
            FROM "PoolMarketOfferOnEgat"
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
            const results: IGetOrderResponse[] = ordersFromJSON.map((order: IOrderResponseFromJSON) => {
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
            // console.log(`result from pool trade Offer`);
            // console.log(results);
            return results;
        } catch (e) {
            console.log(e);

            return null;
        }
    }
    async getPoolTradeBid(req: IGetOrderRequest): Promise<IGetOrderResponse[] | null> {
        const body: IGetDruidBody = {
            "query": `SELECT "payload.id", 
            LATEST("payload.bidderId",50)FILTER(WHERE "payload.bidderId" IS NOT NULL) as userId, 
            LATEST("payload.status",10) FILTER (WHERE "payload.status" is not null) status,
            LATEST(CAST("payload.settlementTime" as VARCHAR),50 ) FILTER(WHERE "payload.settlementTime" is not null) settlementTime,
            LATEST(CAST("payload.targetPrice" as VARCHAR),10 ) FILTER(WHERE "payload.targetPrice" is not null) targetPrice,
            LATEST(CAST("payload.targetAmount" as VARCHAR),10 ) FILTER(WHERE "payload.targetAmount" is not null) targetAmount
            FROM "PoolMarketBidOnEgat"
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
            const results: IGetOrderResponse[] = ordersFromJSON.map((order: IOrderResponseFromJSON) => {
                return {
                    orderId: order[`payload.id`],
                    userId: order.userId,
                    status: order.status,
                    targetAmount: order.targetAmount,
                    targetPrice: order.targetPrice,
                    userType: "BUYER",
                    tradeMarket: "POOL",
                    settlementTime: order.settlementTime

                }
            })
            console.log(`Get Pool Trade Bid`);
            console.log(results);
            return results;
        } catch (e) {
            console.log(e);

            return null;
        }
    }

    async getBilateralTradeOffer(req: IGetOrderRequest): Promise<IGetOrderResponse[] | null> {
        const body: IGetDruidBody = {
            "query": `SELECT "payload.id", 
            LATEST("payload.sellerId",50)FILTER(WHERE "payload.sellerId" IS NOT NULL) as userId, 
            LATEST("payload.status",10) FILTER (WHERE "payload.status" is not null) status,
            LATEST(CAST("payload.settlementTime" as VARCHAR),50 ) FILTER(WHERE "payload.settlementTime" is not null) settlementTime,
            LATEST(CAST("payload.targetPrice" as VARCHAR),10 ) FILTER(WHERE "payload.targetPrice" is not null) targetPrice,
            LATEST(CAST("payload.targetAmount" as VARCHAR),10 ) FILTER(WHERE "payload.targetAmount" is not null) targetAmount
            FROM "BilateralTradeOfferOnEgat"
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
            const results: IGetOrderResponse[] = ordersFromJSON.map((order: IOrderResponseFromJSON) => {
                return {
                    orderId: order[`payload.id`],
                    userId: order.userId,
                    status: order.status,
                    targetAmount: order.targetAmount,
                    targetPrice: order.targetPrice,
                    userType: "SELLER",
                    tradeMarket: "BILATERAL",
                    settlementTime: order.settlementTime

                }
            })
            // console.log(`get Bilateral Trade Offer`);
            // console.log(results);
            return results;
        } catch (e) {
            console.log(e);

            return null;
        }
    }

    async getBilateralTradeSettlement(req: IGetOrderRequest): Promise<IGetOrderResponse[] | null> {
        const body: IGetDruidBody = {
            "query": `SELECT "payload.id", 
            "payload.buyerId" as userId, 
            "payload.settlementTime" settlementTime,
            "payload.amount" as targetAmount,
            "payload.price" as targetPrice
            FROM "BilateralSettlementOnEgat"
            WHERE "__time" > '2021-12-07T00:00:00.000Z'`,
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
            const results: IGetOrderResponse[] = ordersFromJSON.map((order: IOrderResponseFromJSON) => {
                if (order.status === undefined) {
                    order.status = "MATCHED"
                }
                return {
                    orderId: order[`payload.id`],
                    userId: order.userId,
                    status: order.status,
                    targetAmount: order.targetAmount,
                    targetPrice: order.targetPrice,
                    userType: "BUYER",
                    tradeMarket: "BILATERAL",
                    settlementTime: order.settlementTime

                }
            })
            // console.log(`Get Bilateral Trade Settlement`);
            // console.log(results);
            return results;
        } catch (e) {
            console.log(e);

            return null;
        }
    }


}
