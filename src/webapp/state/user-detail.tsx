import { atom } from "recoil";

export interface IUserDetail {
    email: string,
    fullName: string,
    phoneNumber: string,
    role: string,
    citizenId: string,
    meterId: string,
    photo?: string,


}


export const userDetail = atom<IUserDetail | null>({
    key: 'userDetail',
    default: null
})