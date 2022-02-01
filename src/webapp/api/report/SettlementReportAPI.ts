import { druidHost } from "../../constanst";
import { IPeriod } from "../../state/summary-report/period-state";
import { ISettlementDetail } from "../../state/summary-report/settlement-report/settlement-detail-state";
import { IBilateralSettlement, IImbalanceReport, ITradeContractReport } from "../../state/summary-report/settlement-report/settlement-report-state";

import { IUserSession } from "../../state/user-sessions";
import dayjs from "../../utils/customDayjs";

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

interface IPoolSettlementJSON {
    "timestamp": string,
    "poolSettlementId": string,
    "tradeContractId": string,
    "buyerId": string,
    "sellerId": string,
    "actualSellerAmount": number,
    "actualBuyerAmount": number,
    "agreementAmount": number,
    "agreementPrice": number,
    "agreementTradingFee": number,
    "agreementWheelingChargeFee": number,
    "priceRuleApplied": string,
    "discountAppFee": number,
    "gridUsedDiscount": number,
    "gridUsedFt": number,
    "imbalanceBuyerOverCommit": number,
    "imbalanceBuyerUnderCommit": number,
    "imbalanceSellerOverCommit": number,
    "imbalanceSellerUnderCommit": number,
    "targetPrice": number,
    "touTariff": number,
    "touTariffClass": number,
    "transactionFee": number,
    "vat": number,
    "payload.reference.wheelingBuyerEgatTotal": number,
    "payload.reference.wheelingSellerEgatTotal": number,
    "wheelingTotal": number,


}
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

interface IGetTradeDataResponse {
    context: IImbalanceReport[]
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
            "payload.buyerId" as "buyerIds",
            "payload.sellerId" as "sellerIds",
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
                    inRange = dayjs(tradeContract.timestamp).isBetween(dayjs(period.startDate), dayjs(period.endDate), null, '[]');
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
                        let inRange = dayjs(trade.timestamp).isBetween(dayjs(period.startDate), dayjs(period.endDate), null, '[]');
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

    async getPoolSettlement(req: IGetSettlementReportRequest): Promise<IPoolSettlementJSON[] | null> {
        const period = req.period;

        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }
        const body: IGetDruidBody = {
            "query": `SELECT "__time" as "timestamp", 
            "payload.id",
            "payload.tradeContractId" as "tradeContractId",
            "payload.buyerId" as "buyerId", 
            "payload.sellerId" as "sellerId", 
            "payload.actualAmountProvided" as "actualSellerAmount", 
            "payload.actualAmountReceived" as "actualBuyerAmount",
            "payload.agreementAmount" as "agreementAmount",
            "payload.agreementPrice" as "agreementPrice",  
            "payload.agreementTradingFee" as "agreementTradingFee", 
            "payload.agreementWheelingChargeFee" as "agreementWheelingChargeFee", 
            "payload.priceRuleApplied" as "priceRuleApplied", 
            "payload.reference.discountAppFee" as "discountAppFee", 
            "payload.reference.gridUsedDiscount" as "gridUsedDiscount",
            "payload.reference.gridUsedFt" as "gridUsedFt",
            "payload.reference.imbalanceBuyerOverCommit" as "imbalanceBuyerOverCommit",
            "payload.reference.imbalanceBuyerUnderCommit" as "imbalanceBuyerUnderCommit",
            "payload.reference.imbalanceSellerOverCommit" as "imbalanceSellerOverCommit",
            "payload.reference.imbalanceSellerUnderCommit" as "imbalanceSellerUnderCommit",
            "payload.reference.targetPrice" as "targetPrice",
            "payload.reference.touTariff" as "touTariff",
            "payload.reference.touTariffClass" as "touTariffClass",
            "payload.reference.transactionFee" as "transactionFee", 
            "payload.reference.vat" as "vat",
            "payload.reference.wheelingBuyerEgatTotal", 
            "payload.reference.wheelingSellerEgatTotal", 
            "payload.reference.wheelingTotal" as "wheelingTotal"
            FROM "ClearingSettlementOnEgat"`,
            "resultFormat": "object"
        }
        let response: Response;

        try {
            response = await fetch(this.endpoint, {

                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            if (response.status === 200) {
                const result: IPoolSettlementJSON[] = [];
                const responseJSON: IPoolSettlementJSON[] = await response.json();
                if (responseJSON.length > 0) {
                    responseJSON.forEach((poolSettlement) => {
                        let inRange = false;
                        if (period) {
                            inRange = dayjs(poolSettlement.timestamp).isBetween(dayjs(period.startDate), dayjs(period.endDate), null, '[]');
                        }
                        if (period === undefined || inRange) {
                            result.push(poolSettlement);
                        }
                    })
                }
                return result;
            }

        } catch (e) {
            console.log(e);
            throw Error(`Unexpected handle error`);
        }
        return null;
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
