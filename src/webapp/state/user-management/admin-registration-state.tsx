import { atom } from "recoil";

export interface IAdminRegistratoinState {
    email: string,
    fullName: string,
    phoneNumber: string,
    password: string,
    
}
export const adminRegistration = atom<IAdminRegistratoinState | null> ({
    key: 'adminRegistration',
    default: null
})