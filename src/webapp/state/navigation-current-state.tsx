import {atom} from 'recoil';

export enum NavigationCurrentType{
    LOGIN,DASHBOARD,USER_MANAGEMENT,USER_DETAIL,
    WHEELING_CHARGE,IMBALANCE,TOU_TARIFF,OTHER_SETTING,
    USER_REPORT,ORDER_REPORT,SETTLEMENT_REPORT,BILLING_REPORT,
    NEWS_MANAGEMENT
}

export const navigationCurrentState = atom<NavigationCurrentType>({
    key: 'navigationCurrentState',
    default: NavigationCurrentType.DASHBOARD,
})