import { atom } from "recoil";

export interface UserInfo {
    email?: string,
    fullName?: string,
    phoneNumber?: string,
    role: string,
    meterId?: string,
    photo?: string,
    citizenId: string,
}

export const userInfo = atom<UserInfo[] | null>({
    key: 'userInfo',
    default: null,
})