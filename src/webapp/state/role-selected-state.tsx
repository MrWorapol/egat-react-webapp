import { atom } from "recoil";

interface RoleSelectedState {
    aggregate: boolean,
    prosumer: boolean,
    consumer: boolean,
    admin: boolean,
}

export const roleSelectedState = atom<RoleSelectedState>({
    key: "roleSelectedState",
    default: {
        aggregate: false,
        prosumer: false,
        consumer: false,
        admin: false,
    }
})