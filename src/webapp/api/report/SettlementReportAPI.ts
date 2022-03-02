import { druidHost } from "../../constanst";
import { IPeriod } from "../../state/summary-report/period-state";
import { ISettlementDetail } from "../../state/summary-report/settlement-report/settlement-detail-state";
import { IBilateralSettlement, IImbalanceReport, ITradeContractReport } from "../../state/summary-report/settlement-report/settlement-report-state";

import { IUserSession } from "../../state/user-sessions";
import dayjs from "../../utils/customDayjs";

interface OldITradeContractJSON {
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

interface TradeContractInfo {
    sellerId?: string;
    buyerId?: string;

    reference: {
        marketType: 'BILATERAL' | 'POOL' | 'LONGTERM_BILATERAL',
        bilateralTradeSettlementId?: string
        poolTradeSettlementId?: string
        isBilateralLongTerm: boolean

        wheelingAs: string;
        wheelingT: string;
        wheelingD: string;
        wheelingRe: string;
        wheelingTotal: string;

        wheelingBuyerEgatAs: string;
        wheelingBuyerEgatT: string;
        wheelingBuyerEgatD: string;
        wheelingBuyerEgatRe: string;
        wheelingBuyerEgatTotal: string;

        wheelingSellerEgatAs: string;
        wheelingSellerEgatT: string;
        wheelingSellerEgatD: string;
        wheelingSellerEgatRe: string;
        wheelingSellerEgatTotal: string;

        imbalanceSellerOverCommit: string;
        imbalanceSellerUnderCommit: string;
        imbalanceBuyerOverCommit: string;
        imbalanceBuyerUnderCommit: string;

        touTariff: string;
        touTariffType: 'PEAK_MONFRI' | 'OFFPEAK_MONFRI' | 'OFFPEAK_SATSUN' | 'OFFPEAK_HOLIDAY';
        touTariffClass: 'HIGH' | 'LOW';

        transactionFee: string;
        discountAppFee: string;

        gridUsedFt: string;
        gridUsedDiscount: string;

        vat: string;
        targetPrice: string;
    }
    amount: string
    price: string
    wheelingChargeFee: string;
    tradingFee: string;
}


interface ITradeContractJSON {
    tradeContractId?: string,
    sellerIds: string,
    buyerIds: string,
    priceRuleApplied: string,
    settlementTime: string,
    infos: string,
    timestamp: string,
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
            "query": `SELECT "__time" as "timestamp", 
            "payload._id" as "tradeContractId",
            LATEST("payload.buyerIds",1000)FILTER(WHERE "payload.buyerIds" is not NULL) as buyerIds,
            LATEST("payload.infos",999999)FILTER(WHERE "payload.infos" is not NULL) as infos,
            LATEST("payload.priceRuleApplied",20)FILTER(WHERE "payload.priceRuleApplied" is not NULL) as priceRuleApplied,
            LATEST("payload.sellerIds",1000)FILTER(WHERE "payload.sellerIds" is not NULL) as sellerIds,
            LATEST("payload.settlementTime",20)FILTER(WHERE "payload.settlementTime" is not NULL) as settlementTime
            FROM "TradeContract"
            GROUP BY "__time","payload._id"`,
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
            // console.log(reponseJSON);
            reponseJSON.length > 0 && reponseJSON.forEach((tradeContract: ITradeContractJSON) => {
                let inRange: boolean = false; //default is false
                if (period !== undefined) {//is select all in selected period
                    inRange = dayjs(tradeContract.timestamp).isBetween(dayjs(period.startDate), dayjs(period.endDate), null, '[]');
                }
                if (inRange || period === undefined) {
                    let buyerIds: string | string[] = tradeContract.buyerIds;
                    let sellerIds: string | string[] = tradeContract.sellerIds;;
                    tradeContract.infos = tradeContract.infos.replace(/=/gi, ':'); //convert = -> :
                    let newRegex = new RegExp(/[a-zA-Z0-9._-]+[a-zA-Z0-9._-]|[0-9]/g); // check start and end with text,number,".","_","-" , 0-9
                    let infosConvert = tradeContract.infos.replace(newRegex, '"$&"');//insert "" around every text
                    let reformatStartBracket = infosConvert.replace(/(\[")/, '[') // [" -> [
                    let reformatEndBracket = reformatStartBracket.replace(/("\])/, ']') // "] -> ]
                    let arrayInfos = reformatEndBracket.replace(/(}","{)/g, '},{');// between array object "," -> ,
                    if (tradeContract.buyerIds.match(/(\[\\")/)) {//check if buyerIds is array string
                        buyerIds = JSON.parse(tradeContract.buyerIds);
                    }
                    if (tradeContract.sellerIds.match(/(\[\\")/)) { //check if buyerIds is array string
                        sellerIds = JSON.parse(tradeContract.sellerIds);
                    }
                    let infosJSON: TradeContractInfo | TradeContractInfo[] = JSON.parse(arrayInfos);
                    if (!Array.isArray(infosJSON)) { //Bilateral market info's always isn't arrays 
                        if (infosJSON.reference.marketType === "BILATERAL") {
                       
                            context.push({
                                contractId: tradeContract.tradeContractId || '_',
                                buyerId: Array.isArray(buyerIds) ? tradeContract.buyerIds[0] : tradeContract.buyerIds,//if "_" is logic bug
                                sellerId: Array.isArray(sellerIds) ? tradeContract.sellerIds[0] : tradeContract.sellerIds,//if "_" is logic bug
                                energyCommitted: parseFloat(infosJSON.amount) || -99,//-99 if logic fail
                                priceCommitted: parseFloat(infosJSON.price) || -99, //-99 if logic fail
                                meterId: '_',
                                matchedMeterId: '_',
                                bilateralTradeSettlementId: infosJSON.reference.bilateralTradeSettlementId, // trade ID
                                userType: '_', //
                                tradeMarket: infosJSON.reference.isBilateralLongTerm ? "LONGTERM_BILATERAL" : infosJSON.reference.marketType, //short term, long term,pool market
                                settlementTime: +tradeContract.settlementTime, //settlement timedeliverd time
                                timestamp: tradeContract.timestamp, //unix Time
                                tradingFee: parseFloat(infosJSON.tradingFee) || -99, //-99 if logic fail
                                wheelingChargeFee: parseFloat(infosJSON.wheelingChargeFee) || -99,//-99 if logic fail
                                imbalanceStatus: "_",
                                priceRuleApplied: tradeContract.priceRuleApplied,
                            })
                        }
                    } else {//Pool market 
                        infosJSON.forEach((tradeInfo: TradeContractInfo) => {
                            context.push({
                                contractId: tradeContract.tradeContractId || '_',
                                buyerId: tradeInfo.buyerId !== "null" ? tradeInfo.buyerId || '' : "_",//if "_" is logic bug
                                sellerId: tradeInfo.sellerId !== "null" ? tradeInfo.sellerId || '' : "_",//if "_" is logic bug
                                energyCommitted: parseFloat(tradeInfo.amount) || -99,//-99 if logic fail
                                priceCommitted: parseFloat(tradeInfo.price) || -99, //-99 if logic fail
                                meterId: '_',
                                matchedMeterId: '_',
                                poolTradeSettlementId: tradeInfo.reference.poolTradeSettlementId, // trade ID
                                userType: '_', //
                                tradeMarket: tradeInfo.reference.marketType, //short term, long term,pool market
                                settlementTime: +tradeContract.settlementTime, //settlement timedeliverd time
                                timestamp: tradeContract.timestamp, //unix Time
                                tradingFee: parseFloat(tradeInfo.tradingFee) || -99, //-99 if logic fail
                                wheelingChargeFee: parseFloat(tradeInfo.wheelingChargeFee) || -99,//-99 if logic fail
                                imbalanceStatus: "_",
                                priceRuleApplied: tradeContract.priceRuleApplied,
                            })
                        })
                    }
                }
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
            "query": `SELECT DISTINCT
            "__time" as "timestamp",
            "payload.amount" as "amount", 
            "payload.buyerId" as "buyerId",
            "payload.buyerType" as "buyerType",
            "payload._id" as "tradeDataId",
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
            FROM "FinalTrade"
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

    // async getPoolSettlement(req: IGetSettlementReportRequest): Promise<IPoolSettlementJSON[] | null> {
    //     const period = req.period;

    //     let headers = {
    //         "Content-Type": "application/json",
    //         "Accept": "application/json",
    //         "Authorization": `Bearer ${req.session.accessToken}`,
    //     }
    //     const body: IGetDruidBody = {
    //         "query": `SELECT "__time" as "timestamp", 
    //         "payload.id",
    //         "payload.tradeContractId" as "tradeContractId",
    //         "payload.buyerId" as "buyerId", 
    //         "payload.sellerId" as "sellerId", 
    //         "payload.actualAmountProvided" as "actualSellerAmount", 
    //         "payload.actualAmountReceived" as "actualBuyerAmount",
    //         "payload.agreementAmount" as "agreementAmount",
    //         "payload.agreementPrice" as "agreementPrice",  
    //         "payload.agreementTradingFee" as "agreementTradingFee", 
    //         "payload.agreementWheelingChargeFee" as "agreementWheelingChargeFee", 
    //         "payload.priceRuleApplied" as "priceRuleApplied", 
    //         "payload.reference.discountAppFee" as "discountAppFee", 
    //         "payload.reference.gridUsedDiscount" as "gridUsedDiscount",
    //         "payload.reference.gridUsedFt" as "gridUsedFt",
    //         "payload.reference.imbalanceBuyerOverCommit" as "imbalanceBuyerOverCommit",
    //         "payload.reference.imbalanceBuyerUnderCommit" as "imbalanceBuyerUnderCommit",
    //         "payload.reference.imbalanceSellerOverCommit" as "imbalanceSellerOverCommit",
    //         "payload.reference.imbalanceSellerUnderCommit" as "imbalanceSellerUnderCommit",
    //         "payload.reference.targetPrice" as "targetPrice",
    //         "payload.reference.touTariff" as "touTariff",
    //         "payload.reference.touTariffClass" as "touTariffClass",
    //         "payload.reference.transactionFee" as "transactionFee", 
    //         "payload.reference.vat" as "vat",
    //         "payload.reference.wheelingBuyerEgatTotal", 
    //         "payload.reference.wheelingSellerEgatTotal", 
    //         "payload.reference.wheelingTotal" as "wheelingTotal"
    //         FROM "ClearingSettlementOnEgat"`,
    //         "resultFormat": "object"
    //     }
    //     let response: Response;

    //     try {
    //         response = await fetch(this.endpoint, {

    //             headers,
    //             method: "POST",
    //             body: JSON.stringify(body),
    //         })
    //         if (response.status === 200) {
    //             const result: IPoolSettlementJSON[] = [];
    //             const responseJSON: IPoolSettlementJSON[] = await response.json();
    //             if (responseJSON.length > 0) {
    //                 responseJSON.forEach((poolSettlement) => {
    //                     let inRange = false;
    //                     if (period) {
    //                         inRange = dayjs(poolSettlement.timestamp).isBetween(dayjs(period.startDate), dayjs(period.endDate), null, '[]');
    //                     }
    //                     if (period === undefined || inRange) {
    //                         result.push(poolSettlement);
    //                     }
    //                 })
    //             }
    //             return result;
    //         }

    //     } catch (e) {
    //         console.log(e);
    //         throw Error(`Unexpected handle error`);
    //     }
    //     return null;
    // }

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
