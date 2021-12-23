import { atom } from "recoil";

export interface IUserMeterInfo{
    id: string,
    meterId: string,
    meterName: string,
    siteName: string,
    locationCode: string,
    role: string, //Aggregator | Prosumer | Consumer
    area: string, //3 Villages | Thammasat University | VENUE FLOW | Perfect Park | CASA Premium
    region: string,
    address: {
        lat: string,
        lng: string,
    },
    peameaSubstation: string,
    egatSubStation: string,
}

export const userReportState = atom<IUserMeterInfo[] | null>({
    key: 'userReportState',
    default: null
})