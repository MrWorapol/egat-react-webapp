import { atom } from "recoil";

export interface UserDetail {
    email: string,
    fullName: string,
    phoneNumber: string,
    role: string,
    citizenId: string,
    address: {
        buildingNumber: string,
        village: string,
        soi: string,
        road: string,
        subDistrict: string,
        district: string,
        province: string,
        zipCode: string,
        country: string,
    },
    // typeOfBusiness?: string; // 'home' | 'school' | 'hospital' | 'government' | 'cooperative' | 'business' | 'industry' | 'other' ;
    // ca?: string;
    // meterCode?: string;
    // latitude?: number;
    // longitude?: number;
    // typeOfUser?: string; //'house1.1' | 'house1.2' | 'house1.3' | 's-business2.1' | 's-business2.2' | 'm-business3.1' |  'm-business3.2'| 'l-business4.1' | 'l-business4.2' | 'special-business5.1' | 'special-business5.2' ;
    // sizeOfMeter?: string;
    // pressure?: string;
    // phase?: string;
    // produceInfo?: 'prosumer' | 'investor';


}


export const userDetail = atom<UserDetail | null>({
    key: 'userDetail',
    default: null
})