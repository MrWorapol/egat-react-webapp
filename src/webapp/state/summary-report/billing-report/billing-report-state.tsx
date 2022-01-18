import { atom } from "recoil";

export interface IBillingReport {

}





export interface IInvoice {
    "timestamp": string,
    "expireTime": number,
    "invoiceId": string,
    "tradeId": string,
    "invoiceType": string,
    "issueToUserId": string,
    "price": number,
    "discountAppFee": number,
    "discountGridUsed": number,
    "gridUsedFt": number,
    "tradingFee": number,
    "vat": number,
    "wheelingChargeAs": number,
    "wheelingChargeD": number,
    "wheelingChargeRe": number,
    "wheelingChargeT": number,
    "wheelingChargeTotal": number
    "reference": IReferenceInvoice,
}

interface IReferenceInvoice {
    "amount": number,
    "discountAppFee": number,
    "gridUsedDiscount": number,
    "gridUsedFt": number,
    "imbalanceBuyerOverCommit": number,
    "imbalanceBuyerUnderCommit": number,
    "imbalanceSellerOverCommit": number,
    "imbalanceSellerUnderCommit": number,
    "targetPrice": number,
    "touTariff": number,
    "touTariffClass": string,
    "touTariffType": string,
    "transactionFee": number,
    "vat": number,
    "wheelingAs": number,
    "wheelingBuyerEgatAs": number,
    "wheelingBuyerEgatD": number,
    "wheelingBuyerEgatRe": number,
    "wheelingBuyerEgatT": number,
    "wheelingBuyerEgatTotal": number,
    "wheelingD": number,
    "wheelingRe": number,
    "wheelingSellerEgatAs": number,
    "wheelingSellerEgatD": number,
    "wheelingSellerEgatRe": number,
    "wheelingSellerEgatT": number,
    "wheelingSellerEgatTotal": number,
    "wheelingT": number,
    "wheelingTotal": number,
}

export interface amountImbalanceChart {
    netSellerImPlus: number,
    netSellerImMinus: number,
    netBuyerImPlus: number,
    netBuyerImMinus: number,
}

// export interface gridUsed { }
export const billingState = atom<IInvoice[] | null>({
    key: 'billingState',
    default: null
})