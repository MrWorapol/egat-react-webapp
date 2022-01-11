import { druidHost, localDruidEndpoint, summaryApi } from "../../constanst";
import { ISettlementDetail } from "../../state/summary-report/settlement-report/settlement-detail-state";
import { IImbalanceReport, ISettlementReport } from "../../state/summary-report/settlement-report/settlement-report-state";

import { IUserSession } from "../../state/user-sessions";

interface IGetDruidBody {
    query: string,
    resultFormat: string,
}
interface IGetSettlementReportRequest {
    session: IUserSession,
    startDate?: string,
    endDate?: string,
    region?: string,
    area?: string,
    role?: string,
    buyerType?: string,
    tradeMarket?: string,
    orderStatus?: string,
}

interface IGetSettlementReportResponse {
    context: ISettlementReport[],
}


interface IGetImbalanceReport {
    context: IImbalanceReport[]
}

interface IGetSettlementDetailRequest {
    session?: IUserSession,
    contractId: string,
}

interface IGetSettlementDetailResponse {
    context: ISettlementDetail,
}

export class SettlementReportAPI {
    private endpoint = druidHost;

    async getTradeContractReport(req: IGetSettlementReportRequest): Promise<IGetSettlementReportResponse | null> {
        const body: IGetDruidBody = {
            "query": `SELECT DISTINCT "__time" as "timestamp", 
            "payload.id" as "contractId",
            "payload.amount" as "energyCommitted",
            "payload.price" as "priceCommitted",
            "payload.priceRuleApplied" as "priceRule", 
            "payload.reference.bilateralTradeSettlementId",
            "payload.reference.marketType" as "tradeMarket",
            "payload.buyerId" as "buyerId",
            "payload.sellerId" as "sellerId",
            "payload.settlementTime" as "settlementTime",
            "payload.tradingFee" as "tradingFee",
            "payload.wheelingChargeFee" as "wheelingChargeFee",
            "payload.priceRuleApplied" as "priceRuleApplied"
            FROM "TradeContractOnEgat"`,
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
            const detailFromJSON: ISettlementReport[] = await response.json();
            console.log(`get Settlement`);
            console.log(detailFromJSON);
            return {
                context: detailFromJSON
            };
            // return null;
        } catch (e) {
            console.log(e);

            return null;
        }

    }

    async getTradeDataReport(req: IGetSettlementReportRequest): Promise<IGetImbalanceReport | null> {
        const body: IGetDruidBody = {
            "query": `SELECT "payload.amount" as "amount", 
            "payload.buyerId" as "buyerId",
            "payload.buyerType" as "buyerType",
            "payload.id" as "tradeDataId",
            "payload.price" as "price",
            "payload.priceRuleApplied" as "priceRuleApplied",
            "payload.sellerId" as "sellerId",
            "payload.sellerType" as "sellerType",
            "payload.tradeContractIds" as "tradeContractId",
            "payload.tradeType" as "tradeType",
            "payload.tradingFee" as "tradingFee",
            "payload.wheelingChargeTotal" as "wheelingChargeFee",
            "payload.priceRuleApplied" as "priceRuleApplied"
            FROM "TradeOnEgat2"`,
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
            const resultFromJSON: IImbalanceReport[] = await response.json();

            console.log(`get Imbalance Report`);
            console.log(resultFromJSON);
            return {
                context: resultFromJSON
            };
            // return null;
        } catch (e) {
            console.log(e);

            return null;
        }
    }

    async getSettlementDetail(req: IGetSettlementDetailRequest): Promise<IGetSettlementDetailResponse> {
        return { context: {} as ISettlementDetail };
    }

}
