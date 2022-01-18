import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { IGetOrderTableRequest, OrderReportAPI } from "../../../api/report/OrderReportAPI";
import { UserAndEnergyReportAPI } from "../../../api/report/UserReportAPI";
import { NavigationCurrentType } from "../../../state/navigation-current-state";
import { orderChartState } from "../../../state/summary-report/order-report/order-chart-state";
import { orderDetailState } from "../../../state/summary-report/order-report/order-detail-state";
import { IOrderInfo, orderState } from "../../../state/summary-report/order-report/order-report-state";
import { IUserMeterInfo } from "../../../state/summary-report/user-report/user-report-state";
import { userSessionState } from "../../../state/user-sessions";
import { useNavigationGet } from "../../useNavigationGet";
import usePeriodTime from "../usePeriodTime";
interface ISummaryMap {
    [key: string]:
    number
}

export default function useOrderReport() {
    // console.log(`call Use ORDER REPORT`);
    const session = useRecoilValue(userSessionState);
    const { currentState } = useNavigationGet();
    const [orderReport, setOrderReport] = useRecoilState(orderState)
    const [orderDetail, setOrderDetail] = useRecoilState(orderDetailState);
    const [orderChart, setOrderChart] = useRecoilState(orderChartState);
    const resetOrderDetail = useResetRecoilState(orderDetailState);
    const { period } = usePeriodTime();
    const orderApi = new OrderReportAPI();
    const userMeterApi = new UserAndEnergyReportAPI();

    const refreshOrderReport = useCallback(async (roles: string[], buyerType: string, tradeMarket: string, orderStatus: string, area: string) => {
        console.log(`call api`);
        console.log(session);
        if (session !== null) { //check session before call api
            const userMeterInfos = await userMeterApi.getUserMeterInfo({ period, roles: roles, area: area, session })
            const req: IGetOrderTableRequest = {
                period,
                roles,
                buyerType,
                tradeMarket,
                orderStatus,
                session,
            }
            let allOrder = await orderApi.getOrderTable(req);
            let summaryRole: ISummaryMap = { 'aggregator': 0, 'prosumer': 0, 'consumer': 0 };
            let summaryUserType: ISummaryMap = { 'seller': 0, 'buyer': 0 };
            let summaryTradeMarket: ISummaryMap = { 'bilateral': 0, 'pool': 0 };
            let summaryStatus: ISummaryMap = { 'open': 0, 'matched': 0 }
            if (allOrder && userMeterInfos) {
                console.log(`user Meter Infos`);
                console.log(userMeterInfos);
                let output: IOrderInfo[] = [];
                allOrder.context.map((order: IOrderInfo) => {
                    let meterInfo = userMeterInfos.context.find((user: IUserMeterInfo) => { return user.id.toString() === order.userId.toString() })
                    console.log(`get meter Info`);
                    console.log(meterInfo);
                    if (meterInfo && meterInfo !== undefined) {

                        summaryRole[meterInfo.role.toLowerCase()] += 1;
                        summaryTradeMarket[order.tradeMarket.toLowerCase()] += 1;
                        summaryUserType[order.userType.toLowerCase()] += 1;
                        summaryStatus[order.status.toLowerCase()] += 1;
                        output.push({
                            ...order,
                            role: meterInfo.role,
                            area: meterInfo.area,
                            regionName: meterInfo.region,
                        })

                    }
                })
                console.log(summaryRole);
                setOrderChart(
                    {
                        role: {
                            aggregator: summaryRole.aggregator,
                            prosumer: summaryRole.prosumer,
                            consumer: summaryRole.consumer,
                        },
                        buyerType: {
                            seller: summaryUserType.seller,
                            buyer: summaryUserType.buyer,
                        },
                        trade: {
                            bilateral: summaryTradeMarket.bilateral,
                            pool: summaryTradeMarket.pool,
                        },
                        status: {
                            matched: summaryStatus.matched,
                            open: summaryStatus.open
                        }
                    })
                setOrderReport(output);
                refreshOrderDetail(allOrder.context[0]);

            }
        }
    }, [])


    const refreshOrderDetail = useCallback(async (orderInfo: IOrderInfo) => {

        if (orderDetail) { //clear state of detail 
            resetOrderDetail();
        }
        if (orderInfo.status.toLowerCase() === 'open') {
            setOrderDetail({
                userType: orderInfo.userType,
                tradeMarket: orderInfo.tradeMarket,
                orderDetail: {
                    settlementTime: orderInfo.settlementTime,
                    price: orderInfo.targetPrice,
                    commitedAmount: orderInfo.targetAmount
                }
            })
        }
        // if (session) {

        //     const result = await orderApi.getOderDetail({ session: session, traceContractId: orderInfo.userId });
        //     // if (result) {
        //     //     setOrderDetail(result.context);
        //     // }
        //     // setOrderDetail({

        //     // })
        // }
    }, []);

    useEffect(() => {
        if (session && currentState === NavigationCurrentType.ORDER_REPORT) {
            if (!orderReport) {
                refreshOrderReport([], 'all', 'all', 'all', 'all');
            }
        }
        // if (orderReport && !orderDetail) { //table has data and automatic get detail from first row in table
        // refreshOrderDetail(orderReport[0].orderId);
        // }
        return () => {

        }
    }, [])


    return {
        orderReport,
        refreshOrderReport,
        orderDetail,
        refreshOrderDetail,
        orderChart
    }
}