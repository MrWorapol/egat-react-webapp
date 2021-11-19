import { atom } from "recoil";
import { IOtherSetting } from "./othersetting-state";


export interface IOtherSettingLog{
    editDate: string,
    id: string,
    otherSetting: IOtherSetting
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

export const otherSettingLogState = atom<IOtherSettingLog[] | null>({
    key: 'otherSettingLog',
    default: null
})