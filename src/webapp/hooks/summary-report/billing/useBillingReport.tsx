import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { BillingReportAPI } from "../../../api/report/BillingReportAPI";
import { UserAndEnergyReportAPI } from "../../../api/report/UserReportAPI";
import { NavigationCurrentType } from "../../../state/navigation-current-state";
import { billingState, IInvoice } from "../../../state/summary-report/billing-report/billing-report-state"
import { IUserSession, userSessionState } from "../../../state/user-sessions";
import { useNavigationGet } from "../../useNavigationGet";

import usePeriodTime from "../usePeriodTime";
import { IUserMeterInfo } from "../../../state/summary-report/user-report/user-report-state";
import { energyPaymentReportState, IEnergyPaymentState, IEnergyPaymentTable } from "../../../state/summary-report/billing-report/energy-payment-state";
import { INetPaymentState, netPaymentReportState, INetPaymentTable } from "../../../state/summary-report/billing-report/net-payment-state";
import { gridUsedReportState, IGridUsedState } from "../../../state/summary-report/billing-report/grid-used-state";
import { IWheelingReportState, wheelingReportState } from "../../../state/summary-report/billing-report/wheeling-charge-state";
import { SettlementReportAPI } from "../../../api/report/SettlementReportAPI";
import { IImbalanceReport } from "../../../state/summary-report/settlement-report/settlement-report-state";
import { useLoadingScreen } from "../../useLoadingScreen";
import { useSnackBarNotification } from "../../useSnackBarNotification";

export default function useBillingReport() {
    const session = useRecoilValue(userSessionState);
    const { currentState } = useNavigationGet();
    const { period } = usePeriodTime();
    const { showLoading, hideLoading } = useLoadingScreen();
    const billingAPI = new BillingReportAPI();
    const userMeterApi = new UserAndEnergyReportAPI();
    const settlementAPI = new SettlementReportAPI();


    const [invoiceReport, setInvoiceReport] = useRecoilState(billingState);
    const [netPaymentReport, setNetPaymentReport] = useRecoilState(netPaymentReportState);
    const [energyPaymentReport, setEnergyPaymentReport] = useRecoilState(energyPaymentReportState);
    const [gridUsedReport, setGridUsedReport] = useRecoilState(gridUsedReportState);
    const [wheelingChargeReport, setWheelingChargeReport] = useRecoilState(wheelingReportState);

    const resetNetPayment = useResetRecoilState(netPaymentReportState);
    const resetEnergyPayment = useResetRecoilState(energyPaymentReportState);
    const resetGridUsed = useResetRecoilState(gridUsedReportState);
    const resetWheelingCharge = useResetRecoilState(wheelingReportState);

    const { showSnackBar } = useSnackBarNotification();
    const refreshInvoice = async (session: IUserSession, role?: string, area?: string) => {

        resetGridUsed();
        resetWheelingCharge();
        resetNetPayment();
        resetEnergyPayment();
        showLoading(15);
        if (session !== null) {
            try {
                let userMeterFromApi = await userMeterApi.getUserMeterInfo({ period, roles: ["dont use"], area: "dont use", session })
                // filterUser 
                let userMeterInfos: IUserMeterInfo[] | undefined = [];
                if (role && area) {
                    userMeterInfos = userMeterFromApi?.context.filter((user: IUserMeterInfo) => {
                        return (role === "all" || user.role.toLowerCase() === role.toLowerCase()) && (area === 'total' || user.area.toLowerCase() === area.toLowerCase())
                    })
                } else {
                    userMeterInfos = userMeterFromApi?.context;
                }

                let invoiceReports = await billingAPI.getInvoiceReport({ session, period });
                let tradeDatas = await settlementAPI.getTradeDataReport({ session, period });
                //initialize variable for insert to State
                let netPaymentData: INetPaymentState = { table: [], chart: { gridUsed: 0, tradingPayment: 0, wheelingCharge: 0 } };
                let energyPaymentData: IEnergyPaymentState = { table: [], energyPaymentChart: { appTransaction: 0, vat: 0, discountFees: 0, netBuys: 0, netImbalance: 0, netSales: 0 }, amountImbalanceChart: { amountBuyerImbalanceUnderCommited: 0, amountBuyerImbalanceOverCommited: 0, amountSellerImbalanceOverCommited: 0, amountSellerImbalanceUnderCommited: 0 }, netImbalanceChart: { netBuyerImbalanceUnderCommited: 0, netBuyerImbalanceOverCommited: 0, netSellerImbalanceOverCommited: 0, netSellerImbalanceUnderCommited: 0 } };
                let gridUsedData: IGridUsedState = {
                    table: [],
                    gridChart: { discount: 0, ft: 0, vat: 0, amount: 0, serviceCharge: 0, gridUsed: 0 },
                    netTOUTariff: { peak: 0, offPeak: 0, offPeakWeekend: 0, offPeakHoliday: 0 },
                    amountTOUTariff: { peak: 0, offPeak: 0, offPeakWeekend: 0, offPeakHoliday: 0 }
                };
                let wheelingData: IWheelingReportState = {
                    table: [], summary: {
                        mea: 0,
                        pea: 0,
                        meaegat: 0,
                        peaegat: 0,
                        meapeaegat: 0
                    },
                    netSummary: {
                        confidential: 0,
                        t: 0,
                        d: 0,
                        re: 0,
                        vat: 0,
                    }
                };
                if (userMeterInfos && userMeterInfos.length > 0 && invoiceReports?.context && invoiceReports?.context.length > 0) {
                    let invoiceData = invoiceReports; //use for map to user avoid null data when mapping in userMeterInofos.map Data method
                    userMeterInfos.map((user: IUserMeterInfo) => {
                        let invoiceWithMeter = invoiceData.context.filter((invoice: IInvoice) => { return invoice.issueToUserId === user.id })
                        if (invoiceWithMeter.length > 0) {
                            // console.log(/invoiceWithMeter);
                            InsertNetPaymentReport(netPaymentData, invoiceWithMeter, user);
                            InsertEnergyPaymentReport(energyPaymentData, invoiceWithMeter, user);
                            InsertGridUsedReport(gridUsedData, invoiceWithMeter, user);
                            if (tradeDatas) {
                                InsertWheelingChargeReport(wheelingData, invoiceWithMeter, user, tradeDatas.context);
                            }
                        }
                    })
                    setInvoiceReport(invoiceReports.context);
                    setNetPaymentReport(netPaymentData);
                    setEnergyPaymentReport(energyPaymentData);
                    setGridUsedReport(gridUsedData);
                    setWheelingChargeReport(wheelingData);
                }
            } catch (e) {
                showSnackBar({ serverity: 'error', message: `${e}` });
            }
        }
        hideLoading(15);

    };

    const InsertNetPaymentReport = (netPaymentData: INetPaymentState, invoiceWithMeters: IInvoice[], user: IUserMeterInfo) => {
        let row: INetPaymentTable = {
            meterId: user.meterId,
            meterName: user.meterName,
            role: user.role,
            area: user.area,
            netPrice: 0
        };
        invoiceWithMeters.map((invoiceWithMeter) => { //sum by meterId
            row.netPrice +=
                invoiceWithMeter.price + invoiceWithMeter.tradingFee + (invoiceWithMeter.price * invoiceWithMeter.vat / 100) //energyTradepayment netPrice
                + invoiceWithMeter.reference.touTariff //GridUsed Price
                + invoiceWithMeter.wheelingChargeTotal; //WheelingCharge Price

            netPaymentData.chart.tradingPayment += invoiceWithMeter.price + invoiceWithMeter.tradingFee + (invoiceWithMeter.price * invoiceWithMeter.vat / 100) //energyTradepayment netPrice
            netPaymentData.chart.gridUsed += invoiceWithMeter.reference.touTariff; //GridUsed Price
            netPaymentData.chart.wheelingCharge += invoiceWithMeter.wheelingChargeTotal; //GridUsed Price
            // console.log(`tradingPayment : ${netPaymentData.chart.tradingPayment}`);
            // console.log(`gridUsed : ${netPaymentData.chart.gridUsed}`);
            // console.log(`wheelingCharge: ${netPaymentData.chart.wheelingCharge}`);
        })
        netPaymentData.table.push(row);
    }

    const InsertEnergyPaymentReport = (energyPaymentData: IEnergyPaymentState, invoiceWithMeters: IInvoice[], user: IUserMeterInfo) => {
        let row: IEnergyPaymentTable = { meterId: user.meterId, meterName: user.meterName, role: user.role, area: user.area, netPrice: 0 };
        invoiceWithMeters.map((invoiceWithMeter: IInvoice) => {
            row.netPrice += invoiceWithMeter.price + invoiceWithMeter.tradingFee + invoiceWithMeter.wheelingChargeTotal + (invoiceWithMeter.price * invoiceWithMeter.vat / 100) //energyTradepayment netPrice
            switch (invoiceWithMeter.invoiceType) {
                case "SELLER_CONTRACT":
                    energyPaymentData.energyPaymentChart.netSales += invoiceWithMeter.price;
                    break;
                case "BUYER_CONTRACT":
                    energyPaymentData.energyPaymentChart.netBuys += invoiceWithMeter.price;
                    break;
                case "BUYER_IMBALANCE_UNDERCOMMIT":
                    energyPaymentData.netImbalanceChart.netBuyerImbalanceUnderCommited += invoiceWithMeter.price;
                    energyPaymentData.amountImbalanceChart.amountBuyerImbalanceUnderCommited += invoiceWithMeter.reference.amount;
                    energyPaymentData.energyPaymentChart.netImbalance += invoiceWithMeter.price; //summary data to net imbalance
                    break;
                case "BUYER_IMBALANCE_OVERCOMMIT":
                    energyPaymentData.netImbalanceChart.netBuyerImbalanceOverCommited += invoiceWithMeter.price;
                    energyPaymentData.amountImbalanceChart.amountBuyerImbalanceOverCommited += invoiceWithMeter.reference.amount;
                    energyPaymentData.energyPaymentChart.netImbalance += invoiceWithMeter.price; //summary data to net imbalance
                    break;
                case "SELLER_IMBALANCE_UNDERCOMMIT":
                    energyPaymentData.netImbalanceChart.netSellerImbalanceUnderCommited += invoiceWithMeter.price;
                    energyPaymentData.amountImbalanceChart.amountSellerImbalanceUnderCommited += invoiceWithMeter.reference.amount;
                    energyPaymentData.energyPaymentChart.netImbalance += invoiceWithMeter.price; //summary data to net imbalance
                    break;
                case "SELLER_IMBALANCE_OVERCOMMIT":
                    energyPaymentData.netImbalanceChart.netSellerImbalanceOverCommited += invoiceWithMeter.price;
                    energyPaymentData.amountImbalanceChart.amountSellerImbalanceOverCommited += invoiceWithMeter.reference.amount;
                    energyPaymentData.energyPaymentChart.netImbalance += invoiceWithMeter.price; //summary data to net imbalance
                    break;
                default: break;
            }
            energyPaymentData.energyPaymentChart.appTransaction += invoiceWithMeter.tradingFee;
            energyPaymentData.energyPaymentChart.vat += (invoiceWithMeter.price * invoiceWithMeter.vat / 100);
            energyPaymentData.energyPaymentChart.discountFees += invoiceWithMeter.reference.discountAppFee;

        });
        energyPaymentData.table.push(row);

    };

    //wait for confirm with p'chin about  data are already use or need to query with trade Table
    const InsertGridUsedReport = (gridUsedData: IGridUsedState, invoiceWithMeters: IInvoice[], user: IUserMeterInfo) => {
        let gridPriceByGridUsedAndMeterSummary: { [key: string]: number } = { "PEAK_MONFRI": 0, "OFFPEAK_MONFRI": 0, "OFFPEAK_SATSUN": 0, "OFFPEAK_HOLIDAY": 0 };
        // let row: IGridUsedTable = {
        //     meterId: user.meterId,
        //     meterName: user.meterName,
        //     role: user.role,
        //     area: user.area,
        //     gridPrice: invoiceWithMeter.reference.touTariff, //tariff because calculate from mobile
        //     gridUsedType: invoiceWithMeter.reference.touTariffType
        // };
        invoiceWithMeters.map((invoiceWithMeter) => {
            switch (invoiceWithMeter.reference.touTariffType) {
                case "PEAK_MONFRI":
                    gridUsedData.netTOUTariff.peak += invoiceWithMeter.reference.touTariff;
                    gridUsedData.amountTOUTariff.peak += invoiceWithMeter.reference.amount;
                    gridPriceByGridUsedAndMeterSummary["PEAK_MONFRI"] += invoiceWithMeter.reference.touTariff;
                    break;
                case "OFFPEAK_MONFRI":
                    gridUsedData.netTOUTariff.offPeak += invoiceWithMeter.reference.touTariff;
                    gridUsedData.amountTOUTariff.offPeak += invoiceWithMeter.reference.amount;
                    gridPriceByGridUsedAndMeterSummary["OFFPEAK_MONFRI"] += invoiceWithMeter.reference.touTariff;
                    break;
                case "OFFPEAK_SATSUN":
                    gridUsedData.netTOUTariff.offPeakWeekend += invoiceWithMeter.reference.touTariff;
                    gridUsedData.amountTOUTariff.offPeakWeekend += invoiceWithMeter.reference.amount;
                    gridPriceByGridUsedAndMeterSummary["OFFPEAK_SATSUN"] += invoiceWithMeter.reference.touTariff;

                    break;
                case "OFFPEAK_HOLIDAY": //
                    gridUsedData.netTOUTariff.offPeakHoliday += invoiceWithMeter.reference.touTariff;
                    gridUsedData.amountTOUTariff.offPeakHoliday += invoiceWithMeter.reference.amount;
                    gridPriceByGridUsedAndMeterSummary["OFFPEAK_HOLIDAY"] += invoiceWithMeter.reference.touTariff;
                    break;
                default: break;
            }
            gridUsedData.gridChart.gridUsed += 0;
            gridUsedData.gridChart.serviceCharge += 0; //
            gridUsedData.gridChart.ft += invoiceWithMeter.gridUsedFt;
            gridUsedData.gridChart.amount += invoiceWithMeter.reference.amount;
            gridUsedData.gridChart.vat += invoiceWithMeter.reference.vat;
            gridUsedData.gridChart.discount += invoiceWithMeter.reference.gridUsedDiscount;
            // gridUsedData.table.push(row);
        })
        Object.keys(gridPriceByGridUsedAndMeterSummary).forEach((gridUsedType: string) => {
            if (gridPriceByGridUsedAndMeterSummary[gridUsedType] > 0) {
                gridUsedData.table.push(
                    {
                        meterId: user.meterId,
                        meterName: user.meterName,
                        role: user.role,
                        area: user.area,
                        gridPrice: gridPriceByGridUsedAndMeterSummary[gridUsedType], //tariff because calculate from mobile
                        gridUsedType: gridUsedType
                    }
                )
            }
        });
    };
    //issue about data
    const InsertWheelingChargeReport = (wheelingData: IWheelingReportState, invoiceWithMeters: IInvoice[], user: IUserMeterInfo, tradeDatas: IImbalanceReport[]) => {
        let wheelingChargeByMeterSummary: { [key: string]: number } = { "mea": 0, "pea": 0, "meaegat": 0, "peaegat": 0, "meapeaegat": 0 };
        invoiceWithMeters.map((invoiceWithMeter) => {
            let wheelingChargeType = tradeDatas.find((tradeData) => { return tradeData.tradeDataId === invoiceWithMeter.tradeId });
            if (wheelingChargeType && wheelingChargeType.priceRuleApplied) {
                switch (wheelingChargeType.priceRuleApplied.toLowerCase()) {
                    case "mea":
                        wheelingChargeByMeterSummary.mea += invoiceWithMeter.wheelingChargeTotal;
                        wheelingData.summary.mea += invoiceWithMeter.wheelingChargeTotal;
                        break;
                    case "pea":
                        wheelingChargeByMeterSummary.pea += invoiceWithMeter.wheelingChargeTotal;
                        wheelingData.summary.pea += invoiceWithMeter.wheelingChargeTotal;
                        break;
                    case "meaegat":
                        wheelingChargeByMeterSummary.meaegat += invoiceWithMeter.wheelingChargeTotal;
                        wheelingData.summary.meaegat += invoiceWithMeter.wheelingChargeTotal;
                        break;
                    case "peaegat":
                        wheelingChargeByMeterSummary.peaegat += invoiceWithMeter.wheelingChargeTotal;
                        wheelingData.summary.peaegat += invoiceWithMeter.wheelingChargeTotal;
                        break;
                    case "meapeaegat":
                        wheelingChargeByMeterSummary.meapeaegat += invoiceWithMeter.wheelingChargeTotal;
                        wheelingData.summary.meapeaegat += invoiceWithMeter.wheelingChargeTotal;
                        break;
                    default:
                        break;
                }

            }
            wheelingData.netSummary.confidential += invoiceWithMeter.wheelingChargeAs;
            wheelingData.netSummary.t += invoiceWithMeter.wheelingChargeT;
            wheelingData.netSummary.d += invoiceWithMeter.wheelingChargeD;
            wheelingData.netSummary.re += invoiceWithMeter.wheelingChargeRe;
            wheelingData.netSummary.vat += invoiceWithMeter.vat;
        });
        Object.keys(wheelingChargeByMeterSummary).forEach((wheelingType: string) => {
            if (wheelingChargeByMeterSummary[wheelingType] > 0) {
                wheelingData.table.push(
                    {
                        meterId: user.meterId,
                        meterName: user.meterName,
                        role: user.role,
                        area: user.area,
                        price: wheelingChargeByMeterSummary[wheelingType],
                        wheelingCharge: wheelingType
                    }
                )
            }
        })
    }

    useEffect(() => {
        if (session && currentState === NavigationCurrentType.BILLING_REPORT) {
            if (!energyPaymentReport && !gridUsedReport && !wheelingChargeReport) {
                refreshInvoice(session);
            }
        }
        return () => {

        }
    }, [currentState])


    return {
        invoiceReport,
        refreshInvoice,
        netPaymentReport,
        energyPaymentReport,
        gridUsedReport,
        wheelingChargeReport
    }

}
