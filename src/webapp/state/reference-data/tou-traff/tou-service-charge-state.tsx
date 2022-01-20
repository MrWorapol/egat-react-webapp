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

export interface IServiceChargeLog {
    id: string,
    editDate: string,
    touType: string,
    serviceCharge: {
        touType: string,
        bahtPerMonth: 0,
        effectiveDate: string,
        effectiveTime: string,
        effectiveDateTime: string,
    },
    effectiveDateTime: string,
}

export const serviceChargeType1State = atom<IServiceCharge | null>({
    key: 'serviceChargeType1State',
    default: null
})

export const serviceChargeType2State = atom<IServiceCharge | null>({
    key: 'serviceChargeType2State',
    default: null
})

export const serviceChargeLogsState = atom<IServiceChargeLog[] | null>({
    key: 'serviceChargeLogsState',
    default: null
})