import { atom } from "recoil";
import { ITouTariff } from "./tou-tariff-state";


export const touTariffLogState = atom<ITouTariff[] | null>({
    key: 'touTariffLogs',
    default: null,
})