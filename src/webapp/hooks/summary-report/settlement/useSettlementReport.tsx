import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { IGetOrderTableRequest } from "../../../api/report/OrderReportAPI";
import { SettlementReportAPI } from "../../../api/report/SettlementReportAPI";
import { UserReportAPI } from "../../../api/report/UserReportAPI";
import { NavigationCurrentType } from "../../../state/navigation-current-state";
import { settlementChartState } from "../../../state/summary-report/settlement-report/settlement-chart-state";
import { settlementDetailState } from "../../../state/summary-report/settlement-report/settlement-detail-state";
import { IImbalanceReport, ISettlementReport, settlementReportState } from "../../../state/summary-report/settlement-report/settlement-report-state";
import { IUserMeterInfo } from "../../../state/summary-report/user-report/user-report-state";
import { userSessionState } from "../../../state/user-sessions";
import { useNavigationGet } from "../../useNavigationGet";
import usePeriodTime from "../usePeriodTime";

interface ISummaryMap {
    [key: string]:
    number
}

export function useSettlementReport() {
    const session = useRecoilValue(userSessionState);
    const { currentState } = useNavigationGet();

    const [settlementReport, setSettlementReport] = useRecoilState(settlementReportState);
    const [settlementDetail, setSettlementDetail] = useRecoilState(settlementDetailState);
    const [settlementChart, setSettlementChart] = useRecoilState(settlementChartState);
    const resetSettlementDetail = useResetRecoilState(settlementDetailState);
    const { period } = usePeriodTime();
    const api = new SettlementReportAPI();
    const userMeterApi = new UserReportAPI();

    const refreshSettlementReport = useCallback(async (role: string, area: string, buyerType: string, tradeMarket: string, orderStatus: string) => {
        if (session) {
            const userMeterInfos = await userMeterApi.getUserMeterInfo({ startDate: dayjs(period.startDate).toString(), endDate: dayjs(period.endDate).toString(), region: period.region, roles: [role], area: area, session });
            const req = {
                startDate: dayjs(period.startDate).toString(),
                endDate: dayjs(period.endDate).toString(),
                region: period.region,
                area,
                role,
                buyerType,
                tradeMarket,
                orderStatus,
                session
            }
            const settlementReports = await api.getSettlementReport(req);
            const imbalanceReport = await api.getImbalanceReport(req);
            // console.log(`imbalance Report from API : `)
            // console.log(imbalanceReport);
            let summaryRole: ISummaryMap = { 'aggregator': 0, 'prosumer': 0, 'consumer': 0 };
            let summaryUserType: ISummaryMap = { 'seller': 0, 'buyer': 0 };
            let summaryTradeMarket: ISummaryMap = { 'bilateral': 0, 'pool': 0 };
            let summaryImbalance: ISummaryMap = { 'energyExcess': 0, 'energyShortfall': 0 };
            //wait for summary Imbalance

            if (settlementReports && userMeterInfos && imbalanceReport) {
                let output: ISettlementReport[] = [];
                settlementReports.context.map((report: ISettlementReport) => {
                    report.imbalance = []; //prepare for insert imbalance Data
                    let imbalanceData: IImbalanceReport[] = imbalanceReport.context.filter((imbalance: IImbalanceReport) => {
                        return imbalance.tradeContractId.toString() === report.contractId.toString()
                    })
                    if (imbalanceData.length > 0) {
                        if (imbalanceData.every((data) => { return data.tradeType === "CONTRACT" })) { //case CONTRACT Only
                            report.imbalance.push(...imbalanceData);
                            report.imbalanceStatus = "CONTRACT";
                        } else {
                            let imbalanceCase = imbalanceData.find((imbalance) => { return imbalance.tradeType !== "CONTRACT" })
                            if (imbalanceCase) {
                                // console.log(`get Imbalance Case`);
                                // console.log(imbalanceCase);
                                switch (imbalanceCase.tradeType) {
                                    case "SELLER_IMBALANCE_OVERCOMMIT":
                                    case "BUYER_IMBALANCE_OVERCOMMIT":
                                        report.imbalanceStatus = "energyExcess";
                                        report.imbalance?.push(imbalanceCase);
                                        // summaryImbalance["energyExcess"] += 1;
                                        break;
                                    case "SELLER_IMBALANCE_UNDERCOMMIT":
                                    case "BUYER_IMBALANCE_UNDERCOMMIT":
                                        report.imbalanceStatus = "energyShortfall";
                                        report.imbalance?.push(imbalanceCase);
                                        // summaryImbalance["energyShortfall"] += 1;
                                        break;
                                    default:
                                        break;
                                }

                            }
                        }

                    }
                    let buyerId = userMeterInfos.context.find((user: IUserMeterInfo) => { return user.id.toString() === report.buyerId.toString() })
                    if (buyerId) {
                        summaryTradeMarket[report.tradeMarket.toLowerCase()] += 1;
                        summaryRole[buyerId.role.toLowerCase()] += 1; //count  role user
                        summaryUserType["BUYER".toLowerCase()] += 1;
                        summaryImbalance[report.imbalanceStatus] += 1;

                        output.push({
                            ...report,
                            userType: "BUYER",
                            regionName: buyerId.region,
                            area: buyerId.area,
                            role: buyerId.role,
                        })
                    }
                    let sellerId = userMeterInfos.context.find((user: IUserMeterInfo) => { return user.id.toString() === report.sellerId.toString() })
                    if (sellerId) {
                        summaryTradeMarket[report.tradeMarket.toLowerCase()] += 1;
                        summaryRole[sellerId.role.toLowerCase()] += 1; //count  role user
                        summaryUserType["SELLER".toLowerCase()] += 1;
                        summaryImbalance[report.imbalanceStatus] += 1;

                        output.push({
                            ...report,
                            userType: "SELLER",
                            regionName: sellerId.region,
                            area: sellerId.area,
                            role: sellerId.role,
                        })
                    }
                });
                console.log(`output from summary Imbalance With userMeter`);
                console.log(summaryImbalance);
                setSettlementReport(output);
                setSettlementChart(
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
                            energyExcess: summaryImbalance.energyExcess,
                            energyShortfall: summaryImbalance.energyShortfall
                        }
                    }
                );
                refreshSettlementDetail(output[0]);
            }
            // console.log(`get Settlement Report State Value`)
            // console.log(settlementReport);
        }
    }, [])


    const refreshSettlementDetail = useCallback(async (settlement: ISettlementReport) => {
        if (settlementDetail) { //clear state of detail 
            resetSettlementDetail();
        }
        // const result = await api.getSettlementDetail({ contractId });
        // if (result) {
        setSettlementDetail(settlement);
        // }
    }, []);


    useEffect(() => {
        if (session && currentState === NavigationCurrentType.SETTLEMENT_REPORT) {

            if (!settlementReport) {
                refreshSettlementReport('all', 'all', 'all', 'all', 'all');
            }
            // if (orderReport && !orderDetail) { //table has data and automatic get detail from first row in table
            // refreshOrderDetail(orderReport[0].orderId);
            // }
            return () => {

            }
        }
    }, [])

    return {
        settlementReport,
        refreshSettlementReport,
        settlementDetail,
        refreshSettlementDetail,
        settlementChart

    }
}