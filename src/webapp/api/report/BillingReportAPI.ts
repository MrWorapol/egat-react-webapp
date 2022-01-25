import { druidHost } from "../../constanst";
import { IInvoice } from "../../state/summary-report/billing-report/billing-report-state";
import { IPeriod } from "../../state/summary-report/period-state";
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

interface IGetInvoiceRequest {
    session: IUserSession,
    period?: IPeriod
}

interface IGetInvoiceResponse {
    context: IInvoice[],

}

interface IInvoiceResponse {
    "timestamp": string,
    "expireTime": number,
    "invoiceId": string,
    "tradeId": string,
    "invoiceType": string,
    "issueToUserId": string,
    "price": number,
    "discountGridUsed": number,
    "discountAppFee": number,
    "gridUsedFt": number,
    "tradingFee": number,
    "vat": number,
    "wheelingChargeAs": number,
    "wheelingChargeD": number,
    "wheelingChargeRe": number,
    "wheelingChargeT": number,
    "wheelingChargeTotal": number,
    "reference.amount": number,
    "reference.discountAppFee": number,
    "reference.gridUsedDiscount": number,
    "reference.gridUsedFt": number,
    "reference.imbalanceBuyerOverCommit": number,
    "reference.imbalanceBuyerUnderCommit": number,
    "reference.imbalanceSellerOverCommit": number,
    "reference.imbalanceSellerUnderCommit": number,
    "reference.targetPrice": number,
    "reference.touTariff": number,
    "reference.touTariffClass": string,
    "reference.touTariffType": string,
    "reference.transactionFee": number,
    "reference.vat": number,
    "reference.wheelingAs": number,
    "reference.wheelingBuyerEgatAs": number,
    "reference.wheelingBuyerEgatD": number,
    "reference.wheelingBuyerEgatRe": number,
    "reference.wheelingBuyerEgatT": number,
    "reference.wheelingBuyerEgatTotal": number,
    "reference.wheelingD": number,
    "reference.wheelingRe": number,
    "reference.wheelingSellerEgatAs": number,
    "reference.wheelingSellerEgatD": number,
    "reference.wheelingSellerEgatRe": number,
    "reference.wheelingSellerEgatT": number,
    "reference.wheelingSellerEgatTotal": number,
    "reference.wheelingT": number,
    "reference.wheelingTotal": number,
}
export class BillingReportAPI {
    private host = druidHost;

    async getInvoiceReport(req: IGetInvoiceRequest): Promise<IGetInvoiceResponse | null> {
        const period = req.period;
        const body: IGetDruidBody = {
            "query":
                `SELECT "__time" as "timestamp",
                "payload.discountAppFee" as "discountAppFee", 
                "payload.discountGridUsed" as "discountGridUsed",
                "payload.expireTime" as "expireTime",  
                "payload.gridUsedFt" as "gridUsedFt", 
                "payload.id" as "invoiceId",
                "payload.invoiceType" as "invoiceType",
                "payload.issueToUserId" as "issueToUserId",
                "payload.price" as "price", 
                "payload.reference.amount" as "reference.amount", 
                "payload.reference.discountAppFee" as "reference.discountAppFee",
                "payload.reference.gridUsedDiscount" as "reference.gridUsedDiscount",
                "payload.reference.gridUsedFt" as "reference.gridUsedFt",
                "payload.reference.imbalanceBuyerOverCommit" as "reference.imbalanceBuyerOverCommit", 
                "payload.reference.imbalanceBuyerUnderCommit" as "reference.imbalanceBuyerUnderCommit",
                "payload.reference.imbalanceSellerOverCommit" as "reference.imbalanceSellerOverCommit",  
                "payload.reference.imbalanceSellerUnderCommit" as "reference.imbalanceSellerUnderCommit",
                "payload.reference.targetPrice" as "reference.targetPrice", 
                "payload.reference.touTariff" as "reference.touTariff", 
                "payload.reference.touTariffClass" as "reference.touTariffClass", 
                "payload.reference.touTariffType" as "reference.touTariffType", 
                "payload.reference.transactionFee" as "reference.transactionFee", 
                "payload.reference.vat" as "reference.vat",
                "payload.reference.wheelingAs" as "reference.wheelingAs",
                "payload.reference.wheelingBuyerEgatAs" as "reference.wheelingBuyerEgatAs", 
                "payload.reference.wheelingBuyerEgatD" as "reference.wheelingBuyerEgatD",
                "payload.reference.wheelingBuyerEgatRe" as "reference.wheelingBuyerEgatRe", 
                "payload.reference.wheelingBuyerEgatT" as "reference.wheelingBuyerEgatT", 
                "payload.reference.wheelingBuyerEgatTotal" as "reference.wheelingBuyerEgatTotal", 
                "payload.reference.wheelingD" as "reference.wheelingD", 
                "payload.reference.wheelingRe" as "reference.wheelingRe",
                "payload.reference.wheelingSellerEgatAs" as "reference.wheelingSellerEgatAs", 
                "payload.reference.wheelingSellerEgatD" as "reference.wheelingSellerEgatD",
                "payload.reference.wheelingSellerEgatRe" as "reference.wheelingSellerEgatRe", 
                "payload.reference.wheelingSellerEgatT" as "reference.wheelingSellerEgatT", 
                "payload.reference.wheelingSellerEgatTotal" as "reference.wheelingSellerEgatTotal", 
                "payload.reference.wheelingT" as "reference.wheelingT",
                "payload.reference.wheelingTotal" as "reference.wheelingTotal", 
                "payload.tradeId" as "tradeId", 
                "payload.tradingFee" as "tradingFee",
                "payload.vat" as "vat",
                "payload.wheelingChargeAs" as "wheelingChargeAs",
                "payload.wheelingChargeD" as "wheelingChargeD",
                "payload.wheelingChargeRe" as "wheelingChargeRe",
                "payload.wheelingChargeT" as "wheelingChargeT",
                "payload.wheelingChargeTotal" as "wheelingChargeTotal"
                FROM "InvoiceFinal"
                WHERE "__time" >= '2022-01-24T09:10:00.000Z'`,
            "resultFormat": "object"
        }
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }

        try {
            const response = await fetch(this.host, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const jsonResponse: IInvoiceResponse[] = await response.json();
            let invoices: IInvoice[] = [];

            if (period) {
                jsonResponse.forEach((invoice: IInvoiceResponse) => {
                    let inRange = dayjs(invoice.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                        && dayjs(invoice.timestamp).isBefore(dayjs(period.endDate).endOf('day'))
                    if (inRange) {
                        invoices.push({
                            timestamp: invoice.timestamp,
                            discountAppFee: invoice.discountAppFee,
                            discountGridUsed: invoice.discountGridUsed,
                            expireTime: invoice.expireTime,
                            gridUsedFt: invoice.gridUsedFt,
                            invoiceId: invoice.invoiceId,
                            invoiceType: invoice.invoiceType,
                            issueToUserId: invoice.issueToUserId,
                            price: invoice.price,
                            tradeId: invoice.tradeId,
                            tradingFee: invoice.tradingFee,
                            vat: invoice.vat,
                            wheelingChargeAs: invoice.wheelingChargeAs,
                            wheelingChargeD: invoice.wheelingChargeD,
                            wheelingChargeRe: invoice.wheelingChargeRe,
                            wheelingChargeT: invoice.wheelingChargeT,
                            wheelingChargeTotal: invoice.wheelingChargeTotal,
                            reference: {
                                "amount": invoice["reference.amount"],
                                "discountAppFee": invoice["reference.discountAppFee"],
                                "gridUsedDiscount": invoice["reference.gridUsedDiscount"],
                                "gridUsedFt": invoice["reference.gridUsedFt"],
                                "imbalanceBuyerOverCommit": invoice["reference.imbalanceBuyerOverCommit"],
                                "imbalanceBuyerUnderCommit": invoice["reference.imbalanceBuyerUnderCommit"],
                                "imbalanceSellerOverCommit": invoice["reference.imbalanceSellerOverCommit"],
                                "imbalanceSellerUnderCommit": invoice["reference.imbalanceSellerUnderCommit"],
                                "targetPrice": invoice["reference.targetPrice"],
                                "touTariff": invoice["reference.touTariff"],
                                "touTariffClass": invoice["reference.touTariffClass"],
                                "touTariffType": invoice["reference.touTariffType"],
                                "transactionFee": invoice["reference.transactionFee"],
                                "vat": invoice["reference.vat"],
                                "wheelingAs": invoice["reference.wheelingAs"],
                                "wheelingBuyerEgatAs": invoice["reference.wheelingBuyerEgatAs"],
                                "wheelingBuyerEgatD": invoice["reference.wheelingBuyerEgatD"],
                                "wheelingBuyerEgatRe": invoice["reference.wheelingBuyerEgatRe"],
                                "wheelingBuyerEgatT": invoice["reference.wheelingBuyerEgatT"],
                                "wheelingBuyerEgatTotal": invoice["reference.wheelingBuyerEgatTotal"],
                                "wheelingD": invoice["reference.wheelingD"],
                                "wheelingRe": invoice["reference.wheelingRe"],
                                "wheelingSellerEgatAs": invoice["reference.wheelingSellerEgatAs"],
                                "wheelingSellerEgatD": invoice["reference.wheelingSellerEgatD"],
                                "wheelingSellerEgatRe": invoice["reference.wheelingSellerEgatRe"],
                                "wheelingSellerEgatT": invoice["reference.wheelingSellerEgatT"],
                                "wheelingSellerEgatTotal": invoice["reference.wheelingSellerEgatTotal"],
                                "wheelingT": invoice["reference.wheelingT"],
                                "wheelingTotal": invoice["reference.wheelingTotal"],
                            }
                        });
                    }
                })
            } else { // no period use for dashboard
                invoices = jsonResponse.map((invoice: IInvoiceResponse) => {
                    return {
                        timestamp: invoice.timestamp,
                        discountAppFee: invoice.discountAppFee,
                        discountGridUsed: invoice.discountGridUsed,
                        expireTime: invoice.expireTime,
                        gridUsedFt: invoice.gridUsedFt,
                        invoiceId: invoice.invoiceId,
                        invoiceType: invoice.invoiceType,
                        issueToUserId: invoice.issueToUserId,
                        price: invoice.price,
                        tradeId: invoice.tradeId,
                        tradingFee: invoice.tradingFee,
                        vat: invoice.vat,
                        wheelingChargeAs: invoice.wheelingChargeAs,
                        wheelingChargeD: invoice.wheelingChargeD,
                        wheelingChargeRe: invoice.wheelingChargeRe,
                        wheelingChargeT: invoice.wheelingChargeT,
                        wheelingChargeTotal: invoice.wheelingChargeTotal,
                        reference: {
                            "amount": invoice["reference.amount"],
                            "discountAppFee": invoice["reference.discountAppFee"],
                            "gridUsedDiscount": invoice["reference.gridUsedDiscount"],
                            "gridUsedFt": invoice["reference.gridUsedFt"],
                            "imbalanceBuyerOverCommit": invoice["reference.imbalanceBuyerOverCommit"],
                            "imbalanceBuyerUnderCommit": invoice["reference.imbalanceBuyerUnderCommit"],
                            "imbalanceSellerOverCommit": invoice["reference.imbalanceSellerOverCommit"],
                            "imbalanceSellerUnderCommit": invoice["reference.imbalanceSellerUnderCommit"],
                            "targetPrice": invoice["reference.targetPrice"],
                            "touTariff": invoice["reference.touTariff"],
                            "touTariffClass": invoice["reference.touTariffClass"],
                            "touTariffType": invoice["reference.touTariffType"],
                            "transactionFee": invoice["reference.transactionFee"],
                            "vat": invoice["reference.vat"],
                            "wheelingAs": invoice["reference.wheelingAs"],
                            "wheelingBuyerEgatAs": invoice["reference.wheelingBuyerEgatAs"],
                            "wheelingBuyerEgatD": invoice["reference.wheelingBuyerEgatD"],
                            "wheelingBuyerEgatRe": invoice["reference.wheelingBuyerEgatRe"],
                            "wheelingBuyerEgatT": invoice["reference.wheelingBuyerEgatT"],
                            "wheelingBuyerEgatTotal": invoice["reference.wheelingBuyerEgatTotal"],
                            "wheelingD": invoice["reference.wheelingD"],
                            "wheelingRe": invoice["reference.wheelingRe"],
                            "wheelingSellerEgatAs": invoice["reference.wheelingSellerEgatAs"],
                            "wheelingSellerEgatD": invoice["reference.wheelingSellerEgatD"],
                            "wheelingSellerEgatRe": invoice["reference.wheelingSellerEgatRe"],
                            "wheelingSellerEgatT": invoice["reference.wheelingSellerEgatT"],
                            "wheelingSellerEgatTotal": invoice["reference.wheelingSellerEgatTotal"],
                            "wheelingT": invoice["reference.wheelingT"],
                            "wheelingTotal": invoice["reference.wheelingTotal"],
                        },
                    }
                })
            }
            return {
                context: invoices
            };
        } catch (e) {
            console.log(e);
            throw Error(`การเชื่อมต่อเซิฟเวอร์ขัดข้อง`);
        }
    }



}