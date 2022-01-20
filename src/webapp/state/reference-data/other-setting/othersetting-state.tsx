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
    
}

export const otherSettingState = atom<IOtherSetting | null>({
    key: 'otherSettingState',
    default: null
})