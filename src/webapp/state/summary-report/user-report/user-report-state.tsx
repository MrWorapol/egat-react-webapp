import { atom } from "recoil";





export interface meterInfo{
    meterId: string,
    meterName: string,
    siteName: string,
    locationCode: string,
    role: string, //Aggregator | Prosumer | Consumer
    area: string, //3 Villages | Thammasat University | VENUE FLOW | Perfect Park | CASA Premium
}

export const userReportState = atom<meterInfo[] | null>({
    key: 'userReportState',
    default: null
})