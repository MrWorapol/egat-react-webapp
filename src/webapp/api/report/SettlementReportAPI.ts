import { druidHost, localDruidEndpoint, summaryApi } from "../../constanst";
import { IPeriod } from "../../state/summary-report/period-state";
import { ISettlementDetail } from "../../state/summary-report/settlement-report/settlement-detail-state";
import { IImbalanceReport, ITradeContractReport } from "../../state/summary-report/settlement-report/settlement-report-state";

import { IUserSession } from "../../state/user-sessions";

import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

interface IGetDruidBody {
    query: string,
    resultFormat: string,
}
interface IGetSettlementReportRequest {
    session: IUserSession,
    period?: IPeriod,
    area?: string,
    role?: string,
    buyerType?: string,
    tradeMarket?: string,
    orderStatus?: string,
}

interface IGetTradeContractResponse {
    context: ITradeContractReport[],
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

    async getTradeContractReport(req: IGetSettlementReportRequest): Promise<IGetTradeContractResponse | null> {
        const period = req.period;
        const body: IGetDruidBody = {
            "query": `SELECT DISTINCT "__time" as "timestamp", 
            "payload.id" as "contractId",
            "payload.amount" as "energyCommitted",
            "payload.price" as "priceCommitted",
            "payload.priceRuleApplied" as "priceRule", 
            "payload.reference.bilateralTradeSettlementId" as "bilateralTradeSettlementId",
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
            if (response.status !== 200) {
                return null;
            }

            const detailFromJSON: ITradeContractReport[] = await response.json();

            if (period !== undefined) {
                let settlementPeriod: ITradeContractReport[] = [];
                detailFromJSON.forEach((settlement: ITradeContractReport) => {
                    let inRange = dayjs(settlement.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                        && dayjs(settlement.timestamp).isBefore(dayjs(period.endDate).endOf('day'));
                    if (inRange) {
                        // if(settlement.bilateralTradeSettlementId){

                        // }
                        settlementPeriod.push(settlement);
                    }

                })
                return {
                    context: settlementPeriod,
                }

            }

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
        const period = req.period;
        const body: IGetDruidBody = {
            "query": `SELECT 
            "__time" as "timestamp",
            "payload.amount" as "amount", 
            "payload.buyerId" as "buyerId",
            "payload.buyerType" as "buyerType",
            "payload.id" as "tradeDataId",
            "payload.price" as "price",
            "payload.priceRuleApplied" as "priceRuleApplied",
            "payload.sellerId" as "sellerId",
            "payload.sellerType" as "sellerType",
            "payload.tradeContractIds" as "tradeContractIds",
            "payload.tradeType" as "tradeType",
            "payload.tradingFee" as "tradingFee",
            "payload.wheelingChargeTotal" as "wheelingChargeFee",
            "payload.priceRuleApplied" as "priceRuleApplied",
            "payload.reference.imbalanceBuyerOverCommit" as "imbalanceBuyerOverCommit",
            "payload.reference.imbalanceBuyerUnderCommit" as "imbalanceBuyerUnderCommit", 
            "payload.reference.imbalanceSellerOverCommit"as "imbalanceSellerOverCommit", 
            "payload.reference.imbalanceSellerUnderCommit" as "imbalanceSellerUnderCommit"
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
            if (response.status !== 200) {
                return null;
            }

            if (period !== undefined) {
                if (dayjs(period.endDate).startOf('day').isSame(dayjs(period.startDate).startOf('day')) // if start and end date is same day
                    && dayjs(period.startDate).startOf('day').isSame(dayjs().startOf('day'))) {//and is same today 
                    return {
                        context: resultFromJSON
                    };

                } else {
                    let tradePeriod: IImbalanceReport[] = [];
                    resultFromJSON.forEach((trade: IImbalanceReport) => {
                        let inRange = dayjs(trade.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                            && dayjs(trade.timestamp).isBefore(dayjs(period.endDate).endOf('day'));
                        if (inRange) {
                            tradePeriod.push(trade);
                        }

                    })
                    return {
                        context: tradePeriod,
                    }
                }
            }

            return {
                context: resultFromJSON
            };
            // return null;
        } catch (e) {
            console.log(e);

            return null;
        }
    }

    // async getSettlementDetail(req: IGetSettlementDetailRequest): Promise<IGetSettlementDetailResponse> {
    //     return { context: {} as ISettlementDetail };
    // }

}
