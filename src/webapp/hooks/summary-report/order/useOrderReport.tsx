import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { IGetOrderTableRequest, OrderReportAPI } from "../../../api/report/OrderReportAPI";
import { UserReportAPI } from "../../../api/report/UserReportAPI";
import { NavigationCurrentType } from "../../../state/navigation-current-state";
import { orderDetailState } from "../../../state/summary-report/order-report/order-detail-state";
import { orderState } from "../../../state/summary-report/order-report/order-report-state";
import { userSessionState } from "../../../state/user-sessions";
import { useNavigationGet } from "../../useNavigationGet";
import usePeriodTime from "../usePeriodTime";


export function useOrderReport() {
    console.log(`call Use ORDER REPORT`);
    const session = useRecoilValue(userSessionState);
    const { currentState } = useNavigationGet();
    const [orderReport, setOrderReport] = useRecoilState(orderState)
    const [orderDetail, setOrderDetail] = useRecoilState(orderDetailState);

    const resetOrderDetail = useResetRecoilState(orderDetailState);
    const { period } = usePeriodTime();
    const orderApi = new OrderReportAPI();
    const userMeterApi = new UserReportAPI();
    const refreshOrderReport = useCallback(async (roles: string[], buyerType: string, tradeMarket: string, orderStatus: string, area: string) => {
        if (session !== null) {
            // const userMeterInfos = await userMeterApi.getUserMeterInfo({ startDate: dayjs(period.startDate).toString(), endDate: dayjs(period.endDate).toString(), region: period.region, roles: roles, area: area, session: { accessToken: "1", refreshToken: '12', lasttimeLogIn: new Date() } })
            const req: IGetOrderTableRequest = {
                startDate: dayjs(period.startDate).toString(),
                endDate: dayjs(period.endDate).toString(),
                region: period.region,
                roles,
                buyerType,
                tradeMarket,
                orderStatus,
                session,
            }
            let allOrder = await orderApi.getOrderTable(req);

            if (allOrder) {//&& userMeterInfos) {

                setOrderReport(allOrder.context);
                refreshOrderDetail(allOrder.context[0].orderId);

            }
        }
    }, [])

    const refreshOrderDetail = useCallback(async (orderId: string) => {
        // if (orderDetail) { //clear state of detail 
        //     resetOrderDetail();
        // }
        const result = await orderApi.getOderDetail({ orderId });
        if (result) {
            setOrderDetail(result.context);
        }
    }, []);
    useEffect(() => {
        if (session && currentState === NavigationCurrentType.ORDER_REPORT) {
            console.log(`call useEffect useOrderReport`);
            console.log(session);
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

    }
}