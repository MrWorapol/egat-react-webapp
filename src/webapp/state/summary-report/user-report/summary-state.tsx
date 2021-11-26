import { atom } from "recoil";

interface UserSummary {
    aggregator: number,
    prosumer: number,
    consumer: number,
    noUser: number,
}

interface EnergySummary {
    pv: number,
    energyStorage: number,
    grid: number,
    energyConsumptions: number,
}

interface ISummaryState {
    energy: EnergySummary,
    user: UserSummary
}
export const summaryState = atom<ISummaryState | null>({
    key: 'summaryState',
    default: null,
})