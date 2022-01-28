import { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { UserAndEnergyReportAPI } from '../../api/report/UserReportAPI';
import { energyrDashboardState, IGetAllUser, ITradeDashboard, tradingDashboardState, userDashboardState } from '../../state/dashboard/dashboard-state';
import { NavigationCurrentType } from '../../state/navigation-current-state';
import { IUserSession, userSessionState } from '../../state/user-sessions';
import { useNavigationGet } from '../useNavigationGet';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { BillingReportAPI } from '../../api/report/BillingReportAPI';
import { IInvoice } from '../../state/summary-report/billing-report/billing-report-state';
import { OrderReportAPI } from '../../api/report/OrderReportAPI';
import { useSnackBarNotification } from '../useSnackBarNotification';
import { SettlementReportAPI } from '../../api/report/SettlementReportAPI';
dayjs.extend(utc);
dayjs.extend(timezone);


export default function useDashBoard() {
    const session = useRecoilValue(userSessionState);
    const [userDashboard, setUserDashboard] = useRecoilState(userDashboardState);
    const [energyDashboard, setEnergyDashboard] = useRecoilState(energyrDashboardState);
    const [tradingDashboard, setTradingDashboard] = useRecoilState(tradingDashboardState);
    const { currentState } = useNavigationGet();
    const { showSnackBar } = useSnackBarNotification();
    const userApi = new UserAndEnergyReportAPI();
    const orderApi = new OrderReportAPI();
    const billingAPI = new BillingReportAPI();
    const contractAPI = new SettlementReportAPI();
    const refreshUserSummary = useCallback(async (session: IUserSession) => {
        let result = {
            allmeter: 0,
            registeredUser: 0,
            newRegister: 0,
            aggregator: 0,
            prosumer: 0,
            consumer: 0,
            noUser: 0
        };
        try {
            let response = await userApi.getAllUser({ session });
            if (response?.context) {
                let users = response.context;
                users.forEach((user: IGetAllUser) => {
                    result.allmeter += 1;
                    if (user.active === "true") {
                        let isRegisterdToDay = dayjs(user.registrationDate).format('DD/MM/YYYY') === dayjs().format('DD/MM/YYYY');
                        // console.log(`user active:${user.meterId}\nregistration date: ${dayjs(user.registrationDate).format('DD/MM/YYYY')}\t to day: ${dayjs().format('DD/MM/YYYY')} \t isMatch :${isRegisterdToDay}`);
                        if (isRegisterdToDay) {
                            result.newRegister += 1;
                        } else {
                            result.registeredUser += 1;
                        }
                        switch (user.role) {
                            case "AGGREGATOR":
                                result.aggregator += 1;
                                break;
                            case "PROSUMER":
                                result.prosumer += 1
                                break;
                            case "CONSUMER":
                                result.consumer += 1
                                break;
                            default: break;
                        }; //count role
                    } else { //un register
                        // console.log(`no register user`)
                        // console.log(user.meterId);
                        result.noUser += 1;
                    }
                })
            }
            setUserDashboard({ ...result })
        } catch (err) {
            setUserDashboard({ ...result })
            showSnackBar({ serverity: "error", message: `${err}` });
        }
    }, []
    )
    const refreshEnergySummary = useCallback(async (session: IUserSession) => {
        try {
            let response = await userApi.getPowerInfos({ session });

            if (response) {
                setEnergyDashboard({
                    pv: response.summaryPower.inSolar,
                    gridUsed: response.summaryPower.excessPv - response.summaryPower.inGrid,
                    load: response.summaryPower.load,
                    charge: response.summaryPower.inBattery,
                    discharge: response.summaryPower.outBattery,
                })

            }
        } catch (err) {
            setEnergyDashboard({
                pv: 0,
                gridUsed: 0,
                load: 0,
                charge: 0,
                discharge: 0
            })
            showSnackBar({ serverity: "error", message: `Get Energy Summary Error\n${err}` });
        }
    }, []);

    const refershTradingSummary = useCallback(async (session: IUserSession) => {
        let summary: ITradeDashboard = {
            totalOrder: 0,
            totalContract: 0,
            netSale: 0,
            netBuy: 0,
            netImbalance: 0,
            netPayment: 0,
            totalEnergyNet: 0,
            totalGridNet: 0,
            totalWheelingNet: 0,
            accREC: 0
        }
        try {
            let allOrder = await orderApi.getOpenOrderAll({ session });
            if (allOrder) {
                summary.totalOrder = allOrder.context.length;
            }


            let powerDatas = await userApi.getPowerInfos({ session });
            if (powerDatas) {
                summary.accREC = powerDatas.summaryPower.inSolar;
            }
            let tradeContracts = await contractAPI.getTradeContractReport({session});
            if(tradeContracts && tradeContracts.context){
                summary.totalContract = tradeContracts.count;
            }
            let invoiceReports = await billingAPI.getInvoiceReport({ session });
            if (invoiceReports && invoiceReports.context.length > 0) {
                invoiceReports.context.forEach((invoice: IInvoice) => {
                    
                    switch (invoice.invoiceType) {
                        case "SELLER_CONTRACT":
                            summary.netSale += invoice.reference.amount;
                            break;
                        case "BUYER_CONTRACT":
                            summary.netBuy += invoice.reference.amount;
                            break;
                        case "BUYER_IMBALANCE_UNDERCOMMIT":
                        case "BUYER_IMBALANCE_OVERCOMMIT":
                        case "SELLER_IMBALANCE_UNDERCOMMIT":
                        case "SELLER_IMBALANCE_OVERCOMMIT":
                            summary.netImbalance += invoice.reference.amount; //summary data to net imbalance
                            break;
                        default: break;
                    }
                    summary.totalEnergyNet += invoice.price + invoice.tradingFee + (invoice.price * invoice.vat / 100) //energyTradepayment netPrice
                    summary.totalGridNet += invoice.reference.touTariff;
                    summary.totalWheelingNet += invoice.wheelingChargeTotal;
                });
            }
            summary.netPayment = summary.totalGridNet + summary.totalEnergyNet + summary.totalWheelingNet;
        } catch (err) {
            showSnackBar({ serverity: "error", message: `Trading Data \n${err}` });
        }

        setTradingDashboard(summary);
    }, []);

    const refreshDashBoard = useCallback(async () => {
        // console.log(`session on refresh Dash board`);
        // console.log(session);
        if (session) {
            refreshUserSummary(session);
            await refreshEnergySummary(session);
            await refershTradingSummary(session);
        }
    }, [])
    useEffect(() => {
        if (session && currentState === NavigationCurrentType.DASHBOARD) {
            if (!userDashboard && !energyDashboard) {
                refreshDashBoard();
            }
        }
    }, [session, currentState])

    return {
        userDashboard,
        energyDashboard,
        tradingDashboard
        // setDashboard
    }
}
