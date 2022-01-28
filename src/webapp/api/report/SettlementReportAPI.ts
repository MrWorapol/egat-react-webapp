import { druidHost } from "../../constanst";
import { IPeriod } from "../../state/summary-report/period-state";
import { ISettlementDetail } from "../../state/summary-report/settlement-report/settlement-detail-state";
import { IBilateralSettlement, IImbalanceReport, ITradeContractReport } from "../../state/summary-report/settlement-report/settlement-report-state";

import { IUserSession } from "../../state/user-sessions";
import dayjs from "../../utils/customDayjs";


interface IGetDruidBody {
    query: string,
    resultFormat: string,
}

interface IGetSettlementReportRequest {
    session: IUserSession,
    period?: IPeriod,
}

interface IGetTradeContractResponse {
    context: ITradeContractReport[],
    count: number,
}

interface ITradeContractJSON {
    "timestamp": string,
    "contractId": string,
    "energyCommitted": number,
    "priceCommitted": number,

    bilateralTradeSettlementId?: string,
    poolTradeSettlementId?: string,
    isBilateralLongTerm?: boolean,
    "tradeMarket": string,
    "buyerIds": string[],
    "sellerIds": string[],
    "settlementTime": number,//unix time 13 digits
    "tradingFee": number,
    "wheelingChargeFee": number,
    "priceRuleApplied": string
}

interface IGetTradeDataResponse {
    context: IImbalanceReport[]
}

interface IGetBilateralSettlementResponse {
    context: IBilateralSettlement[]
}

export class SettlementReportAPI {
    private endpoint = druidHost;

    async getTradeContractReport(req: IGetSettlementReportRequest): Promise<IGetTradeContractResponse | null> {
        const period = req.period; //undefined is select all 
        const body: IGetDruidBody = {
            "query": `SELECT DISTINCT "__time" as "timestamp", 
            "payload.id" as "contractId",
            "payload.amount" as "energyCommitted",
            "payload.price" as "priceCommitted",
            "payload.reference.bilateralTradeSettlementId" as "bilateralTradeSettlementId",
            "payload.reference.isBilateralLongTerm" as "isBilateralLongTerm",
            "payload.reference.poolTradeSettlementId" as "poolTradeSettlementId",
            "payload.reference.marketType" as "tradeMarket",
            "payload.buyerIds" as "buyerIds",
            "payload.sellerIds" as "sellerIds",
            "payload.settlementTime" as "settlementTime",
            "payload.tradingFee" as "tradingFee",
            "payload.wheelingChargeFee" as "wheelingChargeFee",
            "payload.priceRuleApplied" as "priceRuleApplied"
            FROM "TradeContractFinal"
            WHERE "__time" >= '2022-01-24T09:10:00.000Z'`,
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
                throw Error(`Error With Code: ${response.status}`);
            }

            const reponseJSON: ITradeContractJSON[] = await response.json();
            let context: ITradeContractReport[] = [];

            reponseJSON.length > 0 && reponseJSON.forEach((tradeContract: ITradeContractJSON) => {
                let inRange: boolean = false; //default is false
                if (period !== undefined) {//is select all in selected period
                    inRange = dayjs(tradeContract.timestamp).isBetween(dayjs(period.startDate),dayjs(period.endDate),null,'[]');

                    // inRange = dayjs(tradeContract.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                    //     && dayjs(tradeContract.timestamp).isBefore(dayjs(period.endDate).endOf('day'));
                }
                if (tradeContract.bilateralTradeSettlementId) {
                    if (tradeContract.isBilateralLongTerm) {
                        tradeContract.tradeMarket = "LONGTERM_BILATERAL"
                    }
                }
                if (tradeContract.poolTradeSettlementId) {
                    if (tradeContract.buyerIds.length > 0) {
                        tradeContract.buyerIds.forEach((buyerId: string) => {
                            if (inRange || period === undefined) {
                                context.push({
                                    contractId: tradeContract.contractId,
                                    buyerId: buyerId || '-1',//if -1 is logic bug
                                    sellerId: 'POOL',
                                    energyCommitted: tradeContract.energyCommitted,
                                    priceCommitted: tradeContract.priceCommitted,
                                    meterId: '-1',
                                    matchedMeterId: '-1',
                                    bilateralTradeSettlementId: tradeContract.bilateralTradeSettlementId, // trade ID
                                    poolTradeSettlementId: tradeContract.poolTradeSettlementId, // trade ID
                                    userType: 'BUYER', //buyer| seller
                                    tradeMarket: tradeContract.tradeMarket, //short term, long term,pool market
                                    settlementTime: tradeContract.settlementTime, //settlement timedeliverd time
                                    timestamp: tradeContract.timestamp, //unix Time
                                    tradingFee: tradeContract.tradingFee,
                                    wheelingChargeFee: tradeContract.wheelingChargeFee,
                                    imbalanceStatus: "CONTRACT",
                                    priceRuleApplied: tradeContract.priceRuleApplied,
                                })
                            }
                        })
                    } if (tradeContract.sellerIds.length > 0) {
                        tradeContract.sellerIds.forEach((sellerId: string) => {
                            if (inRange || period === undefined) {
                                context.push({
                                    contractId: tradeContract.contractId,
                                    buyerId: 'POOL',
                                    sellerId: sellerId || '-1',//if -1 is logic bug
                                    energyCommitted: tradeContract.energyCommitted,
                                    priceCommitted: tradeContract.priceCommitted,
                                    meterId: '-1',
                                    matchedMeterId: '-1',
                                    bilateralTradeSettlementId: tradeContract.bilateralTradeSettlementId, // trade ID
                                    poolTradeSettlementId: tradeContract.poolTradeSettlementId, // trade ID
                                    userType: 'BUYER', //buyer| seller
                                    tradeMarket: tradeContract.tradeMarket, //short term, long term,pool market
                                    settlementTime: tradeContract.settlementTime, //settlement timedeliverd time
                                    timestamp: tradeContract.timestamp, //unix Time
                                    tradingFee: tradeContract.tradingFee,
                                    wheelingChargeFee: tradeContract.wheelingChargeFee,
                                    imbalanceStatus: "CONTRACT",
                                    priceRuleApplied: tradeContract.priceRuleApplied,
                                })
                            }
                        })
                    }
                }
                if (inRange || period === undefined) {
                    context.push({
                        contractId: tradeContract.contractId,
                        buyerId: tradeContract.buyerIds[0] || '-1',//if -1 is logic bug
                        sellerId: tradeContract.sellerIds[0] || '-1',//if -1 is logic bug
                        energyCommitted: tradeContract.energyCommitted,
                        priceCommitted: tradeContract.priceCommitted,
                        meterId: '-1',
                        matchedMeterId: '-1',
                        bilateralTradeSettlementId: tradeContract.bilateralTradeSettlementId, // trade ID
                        poolTradeSettlementId: tradeContract.poolTradeSettlementId, // trade ID
                        userType: '', //buyer| seller
                        tradeMarket: tradeContract.tradeMarket, //short term, long term,pool market
                        settlementTime: tradeContract.settlementTime, //settlement timedeliverd time
                        timestamp: tradeContract.timestamp, //unix Time
                        tradingFee: tradeContract.tradingFee,
                        wheelingChargeFee: tradeContract.wheelingChargeFee,
                        imbalanceStatus: "CONTRACT",
                        priceRuleApplied: tradeContract.priceRuleApplied,
                    })
                }
                // else {
                //     context.push({
                //         contractId: tradeContract.contractId,
                //         buyerId: tradeContract.buyerIds[0] || '-1', //if -1 is logic bug
                //         sellerId: tradeContract.sellerIds[0] || '-1',//if -1 is logic bug
                //         energyCommitted: tradeContract.energyCommitted,
                //         priceCommitted: tradeContract.priceCommitted,
                //         meterId: '-1',
                //         matchedMeterId: '-1',
                //         bilateralTradeSettlementId: tradeContract.bilateralTradeSettlementId, // trade ID
                //         poolTradeSettlementId: tradeContract.poolTradeSettlementId, // trade ID
                //         userType: '', //buyer| seller
                //         tradeMarket: tradeContract.tradeMarket, //short term, long term,pool market
                //         settlementTime: tradeContract.settlementTime, //settlement timedeliverd time
                //         timestamp: tradeContract.timestamp, //unix Time
                //         tradingFee: tradeContract.tradingFee,
                //         wheelingChargeFee: tradeContract.wheelingChargeFee,
                //         imbalanceStatus: "CONTRACT",
                //         priceRuleApplied: tradeContract.priceRuleApplied,
                //     })
                // }
            })
            return {
                context: context,
                count: reponseJSON.length
            };
        } catch (e) {
            console.log(e);
            throw Error(`การเชื่อมต่อเซิฟเวอร์ขัดข้อง`);
        }

    }

    async getTradeDataReport(req: IGetSettlementReportRequest): Promise<IGetTradeDataResponse | null> {
        const period = req.period;
        const body: IGetDruidBody = {
            "query": `SELECT 
            "__time" as "timestamp",
            "payload.amount" as "amount", 
            "payload.buyerId" as "buyerId",
            "payload.buyerType" as "buyerType",
            "payload.id" as "tradeDataId",
            "payload.price" as "price",
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
            FROM "TradeFinal"
            WHERE "__time" >= '2022-01-24T09:10:00.000Z'`,
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
            if (response.status === 200) {
                const resultFromJSON: IImbalanceReport[] = await response.json();

                if (period !== undefined) {
                    let tradePeriod: IImbalanceReport[] = [];
                    resultFromJSON.forEach((trade: IImbalanceReport) => {
                        let inRange = dayjs(trade.timestamp).isBetween(dayjs(period.startDate),dayjs(period.endDate),null,'[]');

                        // dayjs(trade.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                        //     && dayjs(trade.timestamp).isBefore(dayjs(period.endDate).endOf('day'));
                        if (inRange) {
                            tradePeriod.push(trade);
                        }

                    })
                    return {
                        context: tradePeriod,
                    }
                }

                return {
                    context: resultFromJSON
                };
            } else {
                throw Error(`ERROR WITH CODE:${response.status}`);
            }
        } catch (e) {
            console.log(e);
            throw Error(`Unexpected handle error`);
        }
    }

    // async getBilateralSettlementLongTerm(req: IGetSettlementReportRequest): Promise<IGetBilateralSettlementResponse | null> {
    //     const period = req.period;
    //     const body: IGetDruidBody = {
    //         "query": `SELECT "__time" as "timestamp", 
    //         "payload.id" as "bilateralTradeSettlementId", 
    //         "payload.longtermTradeContractId"  as "longtermTradeContractId"
    //         FROM "BilateralSettlementFinal"
    //         WHERE "__time" >= '2022-01-24T09:10:00.000Z'
    //         AND "payload.longtermTradeContractId" != ''`,
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
    //         if (response.status === 200) {
    //             const resultFromJSON: IBilateralSettlement[] = await response.json();

    //             if (period !== undefined) {
    //                 let bilateralPeriod: IBilateralSettlement[] = [];
    //                 resultFromJSON.forEach((bilateralSettlement: IBilateralSettlement) => {
    //                     let inRange = dayjs(bilateralSettlement.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
    //                         && dayjs(bilateralSettlement.timestamp).isBefore(dayjs(period.endDate).endOf('day'));
    //                     if (inRange) {
    //                         bilateralPeriod.push(bilateralSettlement);
    //                     }

    //                 })
    //                 return {
    //                     context: bilateralPeriod,
    //                 }
    //             }

    //             return {
    //                 context: resultFromJSON
    //             };
    //         } else {
    //             throw Error(`ERROR WITH CODE:${response.status}`);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         throw Error(`Unexpected handle error`);
    //     }
    // }

}
