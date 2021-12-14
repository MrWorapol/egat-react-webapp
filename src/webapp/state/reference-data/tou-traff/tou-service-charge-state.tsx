import { atom } from "recoil";

export interface IServiceCharge {
    touType: string,
    bahtPerMonth: number,
    effectiveDate: string,
    effectiveTime: string,
    editDate?: string,
    effectiveHour?: string,
    effectiveMinute?: string,
}

export const serviceChargeType1State = atom<IServiceCharge | null>({
    key: 'serviceChargeType1State',
    default: null
})

export const serviceChargeType2State = atom<IServiceCharge | null>({
    key: 'serviceChargeType2State',
    default: null
})

export const serviceChargeLogsState = atom<IServiceCharge[] | null>({
    key: 'serviceChargeLogsState',
    default: null
})