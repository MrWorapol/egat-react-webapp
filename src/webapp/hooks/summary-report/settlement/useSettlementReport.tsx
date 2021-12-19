import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil"
import { IGetOrderTableRequest } from "../../../api/report/OrderReportAPI";
import { SettlementReportAPI } from "../../../api/report/SettlementReportAPI";
import { settlementDetailState } from "../../../state/summary-report/settlement-report/settlement-detail-state";
import { settlementReportState } from "../../../state/summary-report/settlement-report/settlement-report-state";
import usePeriodTime from "../usePeriodTime";


export function useSettlementReport() {
    const [settlementReport, setSettlementReport] = useRecoilState(settlementReportState);
    const [settlementDetail, setSettlementDetail] = useRecoilState(settlementDetailState);
    const resetSettlementDetail = useResetRecoilState(settlementDetailState);
    const { period } = usePeriodTime();

    const api = new SettlementReportAPI();
    const refreshSettlementReport = useCallback(async (role: string, area: string, buyerType: string, tradeMarket: string, orderStatus: string) => {
        const req = {
            startDate: dayjs(period.startDate).toString(),
            endDate: dayjs(period.endDate).toString(),
            region: period.region,
            area,
            role,
            buyerType,
            tradeMarket,
            orderStatus
        }
        const result = await api.getSettlementReport(req);
        if (result) {
            setSettlementReport(result.context);
            refreshSettlementDetail(result.context[0].contractId);

        }
    }, [])

    const refreshSettlementDetail = useCallback(async (contractId: string) => {
        if (settlementDetail) { //clear state of detail 
            resetSettlementDetail();
        }
        const result = await api.getSettlementDetail({ contractId });
        if (result) {
            setSettlementDetail(result.context);
        }
    }, []);

    
    useEffect(() => {
        if (!settlementReport) {
            refreshSettlementReport('all', 'all', 'all', 'all', 'all');
        }
        // if (orderReport && !orderDetail) { //table has data and automatic get detail from first row in table
        // refreshOrderDetail(orderReport[0].orderId);
        // }
        return () => {

        }
    }, [])

    return {
        settlementReport,
        refreshSettlementReport,
        settlementDetail,
        refreshSettlementDetail,

    }
}