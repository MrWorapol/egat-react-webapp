import { atom } from "recoil";

export interface IOtherSetting {
    id: string,
    energyTradingPayment: {
        transactionFees: number,
        dicountAppFees: number
    },
    gridUsed: {
        ft: number,
        discountGridUsed: number
    },
    other: {
        vat: number
    },
    effectiveDate: string,
    effectiveTime: string,
    effectiveDateTime: string,
}


// {
//     "id": "other-setting",
//         "energyTradingPayment": {
//         "transactionFees": 0.015,
//             "dicountAppFees": 0
//     },
//     "gridUsed": {
//         "ft": -0.1532,
//             "discountGridUsed": 0
//     },
//     "other": {
//         "vat": 7
//     },
//     "effectiveDate": "25/08/2021",
//         "effectiveTime": "00:00",
//             "effectiveDateTime": "2021-08-24T17:00:00.000Z"
// }

export const otherSettingState = atom<IOtherSetting | null>({
    key: 'otherSettingState',
    default: null
})