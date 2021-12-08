import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil"
import { IGetOrderTableRequest, OrderReportAPI } from "../../../api/report/OrderReportAPI";
import { orderDetailState } from "../../../state/summary-report/order-report/order-detail-state";
import { orderState } from "../../../state/summary-report/order-report/order-report-state";
import usePeriodTime from "../usePeriodTime";


export function useOrderReport() {
    const [orderReport, setOrderReport] = useRecoilState(orderState)
    const [orderDetail, setOrderDetail] = useRecoilState(orderDetailState);
    const resetOrderDetail = useResetRecoilState(orderDetailState);
    const { period, updatedPeriod } = usePeriodTime();
    const api = new OrderReportAPI();
    const refreshOrderReport = useCallback(async (role: string, buyerType: string, tradeMarket: string, orderStatus: string) => {
        const req: IGetOrderTableRequest = {
            startDate: dayjs(period.startDate).toString(),
            endDate: dayjs(period.endDate).toString(),
            region: period.region,
            role,
            buyerType,
            tradeMarket,
            orderStatus
        }
        const result = await api.getOrderTable(req);
        if (result) {
            setOrderReport(result.context);
            refreshOrderDetail(result.context[0].orderId);

        }
    }, [])

    const refreshOrderDetail = useCallback(async (orderId: string) => {
        // if (orderDetail) { //clear state of detail 
        //     resetOrderDetail();
        // }
        const result = await api.getOderDetail({ orderId });
        if (result) {
            setOrderDetail(result.context);
        }
    }, []);
    useEffect(() => {
        if (!orderReport) {
            refreshOrderReport('all', 'all', 'all', 'all');
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