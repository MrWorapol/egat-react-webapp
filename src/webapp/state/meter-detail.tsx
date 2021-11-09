import { atom } from "recoil";

export interface MeterDetail {
    meterId: string,
    typeOfBusiness: string, // 'home' | 'school' | 'hospital' | 'government' | 'cooperative' | 'business' | 'industry' | 'other' ;
    ca: string,
    position: {
        lat: number,
        lng: number,
    },
    typeOfUser: string, //'house1.1' | 'house1.2' | 'house1.3' | 's-business2.1' | 's-business2.2' | 'm-business3.1' |  'm-business3.2'| 'l-business4.1' | 'l-business4.2' | 'special-business5.1' | 'special-business5.2' ;
    sizeOfMeter: number,
    voltage: number,
    numberOfPhases: number,
    produceInfo: string,
    brand: string,
    model: string,
    numberOfBoard: number,
    powerOfProduce: number,
    typeOfBoard: string,
    sizeOfSetup: number,
    invertor: string,
    expectedDate: string,


}


export const meterDetail = atom<MeterDetail | null>({
    key: 'meterDetail',
    default: null
})