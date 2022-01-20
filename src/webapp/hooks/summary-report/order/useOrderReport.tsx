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
import { useAuthGuard } from "../../useAuthGuard";
import { useLoadingScreen } from "../../useLoadingScreen";
import { useNavigationGet } from "../../useNavigationGet";
import usePeriodTime from "../usePeriodTime";
interface ISummaryMap {
    [key: string]:
    number
}

export default function useOrderReport() {
    // console.log(`call Use ORDER REPORT`);
    const { session } = useAuthGuard();
    const { currentState } = useNavigationGet();
    const [orderReport, setOrderReport] = useRecoilState(orderState)
    const [orderDetail, setOrderDetail] = useRecoilState(orderDetailState);
    const [orderChart, setOrderChart] = useRecoilState(orderChartState);
    const resetOrderDetail = useResetRecoilState(orderDetailState);
    const resetOrderReport = useResetRecoilState(orderState);
    const resetChart = useResetRecoilState(orderChartState);
    const { period } = usePeriodTime();
    const orderApi = new OrderReportAPI();
    const userMeterApi = new UserAndEnergyReportAPI();
    const { showLoading, hideLoading } = useLoadingScreen();

    const refreshOrderReport = async (roles: string[], buyerType: string, tradeMarket: string, orderStatus: string, area: string) => {
        console.log(`call api`);
        console.log(session);
        if (session !== null) { //check session before call api
            resetOrderReport();
            resetOrderDetail();
            resetChart();
            showLoading(10);
            const userMeterInfos = await userMeterApi.getUserMeterInfo({ period, roles: roles, area: area, session })
            const req: IGetOrderTableRequest = {
                session,
                period,
            }
            let allOrder = await orderApi.getOrderTable(req);
            let summaryRole: ISummaryMap = { 'aggregator': 0, 'prosumer': 0, 'consumer': 0 };
            let summaryUserType: ISummaryMap = { 'seller': 0, 'buyer': 0 };
            let summaryTradeMarket: ISummaryMap = { 'bilateral': 0, 'pool': 0 };
            let summaryStatus: ISummaryMap = { 'open': 0, 'matched': 0 }
            if (allOrder && allOrder.context.length > 0 && userMeterInfos) {
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
                console.log(summaryStatus);
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
            hideLoading(10);
        }
    };


    const refreshOrderDetail = async (orderInfo: IOrderInfo) => {

        if (orderDetail) { //clear state of detail 
            resetOrderDetail();
        }
        if (orderInfo.orderDetail === undefined) {//case open order
            console.log(`order Detail`)
            console.log(orderInfo);
            setOrderDetail({
                userType: orderInfo.userType,
                tradeMarket: orderInfo.tradeMarket,
                orderDetail: {
                    deliverdTime: orderInfo.settlementTime,
                    price: orderInfo.targetPrice,
                    commitedAmount: orderInfo.targetAmount
                }
            })
        } else {
            setOrderDetail({
                userType: orderInfo.userType,
                tradeMarket: orderInfo.tradeMarket,
                tradeContractId: orderInfo.tradeContractId,
                orderDetail: orderInfo.orderDetail
            })
        }

    };

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