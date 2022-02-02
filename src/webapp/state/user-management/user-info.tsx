import { atom } from "recoil";

export interface UserInfo {
    email?: string,
    displayName?: string,
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