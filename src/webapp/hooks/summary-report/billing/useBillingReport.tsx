import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { BillingReportAPI } from "../../../api/report/BillingReportAPI";
import { UserReportAPI } from "../../../api/report/UserReportAPI";
import { NavigationCurrentType } from "../../../state/navigation-current-state";
import { billingState, IInvoice } from "../../../state/summary-report/billing-report/billing-report-state"
import { userSessionState } from "../../../state/user-sessions";
import { useNavigationGet } from "../../useNavigationGet";
import dayjs from 'dayjs';
import usePeriodTime from "../usePeriodTime";
import { IUserMeterInfo } from "../../../state/summary-report/user-report/user-report-state";
import { energyPaymentReportState, IEnergyPaymentState, IEnergyPaymentTable } from "../../../state/summary-report/billing-report/energy-payment-state";
import { INetPaymentState, netPaymentReportState, INetPaymentTable } from "../../../state/summary-report/billing-report/net-payment-state";
import { gridUsedReportState, IGridUsedState, IGridUsedTable } from "../../../state/summary-report/billing-report/grid-used-state";
import { IWheelingChargeTable, IWheelingReportState, wheelingReportState } from "../../../state/summary-report/billing-report/wheeling-charge-state";
import { SettlementReportAPI } from "../../../api/report/SettlementReportAPI";
import { IImbalanceReport } from "../../../state/summary-report/settlement-report/settlement-report-state";
import { useAuthGuard } from "../../useAuthGuard";

export default function useBillingReport() {
    const [invoiceReport, setInvoiceReport] = useRecoilState(billingState);
    const [netPaymentReport, setNetPaymentReport] = useRecoilState(netPaymentReportState);
    const [energyPaymentReport, setEnergyPaymentReport] = useRecoilState(energyPaymentReportState);
    const [gridUsedReport, setGridUsedReport] = useRecoilState(gridUsedReportState);
    const [wheelingChargeReport, setWheelingChargeReport] = useRecoilState(wheelingReportState);

    // const session = useRecoilValue(userSessionState);
    const {session} = useAuthGuard();
    const { currentState } = useNavigationGet();
    const { period } = usePeriodTime();

    const billingAPI = new BillingReportAPI();
    const userMeterApi = new UserReportAPI();
    const settlementAPI = new SettlementReportAPI();

    const refreshInvoice = useCallback(async () => {
        if (session) {
            const userMeterInfos = await userMeterApi.getUserMeterInfo({ startDate: dayjs(period.startDate).toString(), endDate: dayjs(period.endDate).toString(), region: period.region, roles: ["roles"], area: "area", session })
            let invoiceReports = await billingAPI.getInvoiceReport({ session });
            let tradeDatas = await settlementAPI.getTradeDataReport({ session });
            console.log(invoiceReports);
            if (userMeterInfos !== null && invoiceReports) {
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

                let invoiceData = invoiceReports; //use for map to user avoid null data when mapping in userMeterInofos.map Data method
                userMeterInfos.context.map((user: IUserMeterInfo) => {
                    let invoiceWithMeter = invoiceData.context.filter((invoice: IInvoice) => { return invoice.issueToUserId === user.id })
                    if (invoiceWithMeter.length > 0) {
                        // console.log(invoiceWithMeter);
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
                console.log(`set Billing Report State`);
            }
        }

    }, [])
    const InsertNetPaymentReport = useCallback((netPaymentData: INetPaymentState, invoiceWithMeters: IInvoice[], user: IUserMeterInfo) => {
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
        })
        netPaymentData.table.push(row);
    }, []);

    const InsertEnergyPaymentReport = useCallback((energyPaymentData: IEnergyPaymentState, invoiceWithMeters: IInvoice[], user: IUserMeterInfo) => {
        let row: IEnergyPaymentTable = { meterId: user.meterId, meterName: user.meterName, role: user.role, area: user.area, netPrice: 0 };
        invoiceWithMeters.map((invoiceWithMeter: IInvoice) => {
            row.netPrice += invoiceWithMeter.price + invoiceWithMeter.tradingFee + (invoiceWithMeter.price * invoiceWithMeter.vat / 100) //energyTradepayment netPrice
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

    }, []);

    //wait for confirm with p'chin about  data are already use or need to query with trade Table
    const InsertGridUsedReport = useCallback((gridUsedData: IGridUsedState, invoiceWithMeters: IInvoice[], user: IUserMeterInfo) => {
        invoiceWithMeters.map((invoiceWithMeter) => {
            let row: IGridUsedTable = {
                meterId: user.meterId,
                meterName: user.meterName,
                role: user.role,
                area: user.area,
                gridPrice: invoiceWithMeter.reference.touTariff, //tariff because calculate from mobile
                gridUsedType: invoiceWithMeter.reference.touTariffType
            };
            switch (invoiceWithMeter.reference.touTariffType) {
                case "PEAK_MONFRI":
                    gridUsedData.netTOUTariff.peak += invoiceWithMeter.reference.touTariff;
                    gridUsedData.amountTOUTariff.peak += invoiceWithMeter.reference.amount;
                    break;
                case "OFFPEAK_MONFRI":
                    gridUsedData.netTOUTariff.offPeak += invoiceWithMeter.reference.touTariff;
                    gridUsedData.amountTOUTariff.offPeak += invoiceWithMeter.reference.amount;
                    break;
                case "OFFPEAK_SATSUN":
                    gridUsedData.netTOUTariff.offPeakWeekend += invoiceWithMeter.reference.touTariff;
                    gridUsedData.amountTOUTariff.offPeakWeekend += invoiceWithMeter.reference.amount;
                    break;
                case "OFFPEAK_HOLIDAY": //
                    gridUsedData.netTOUTariff.offPeakHoliday += invoiceWithMeter.reference.touTariff;
                    gridUsedData.amountTOUTariff.offPeakHoliday += invoiceWithMeter.reference.amount;
                    break;
                default: break;
            }
            gridUsedData.gridChart.gridUsed += 0;
            gridUsedData.gridChart.serviceCharge += 0; //
            gridUsedData.gridChart.ft += invoiceWithMeter.gridUsedFt;
            gridUsedData.gridChart.amount += invoiceWithMeter.reference.amount;
            gridUsedData.gridChart.vat += invoiceWithMeter.reference.vat;
            gridUsedData.gridChart.discount += invoiceWithMeter.reference.gridUsedDiscount;
            gridUsedData.table.push(row);
        })
    }, []);
    //issue about data
    const InsertWheelingChargeReport = useCallback((wheelingData: IWheelingReportState, invoiceWithMeters: IInvoice[], user: IUserMeterInfo, tradeDatas: IImbalanceReport[]) => {

        invoiceWithMeters.map((invoiceWithMeter) => {
            let wheelingChargeType = tradeDatas.find((tradeData) => { return tradeData.tradeDataId === invoiceWithMeter.tradeId });

            let row: IWheelingChargeTable = {
                meterId: user.meterId, meterName: user.meterName, role: user.role, area: user.area,
                price: invoiceWithMeter.wheelingChargeTotal,/*dont sure is correct for wheelingcharge fee  */
                wheelingCharge: wheelingChargeType?.priceRuleApplied || "Cannot Find Type", //how to get type of wheeling charge

            };
            if (wheelingChargeType && wheelingChargeType.priceRuleApplied) {
                switch (wheelingChargeType.priceRuleApplied.toLowerCase()) {
                    case "mea":
                        wheelingData.summary.mea += invoiceWithMeter.wheelingChargeTotal;
                        break;
                    case "pea":
                        wheelingData.summary.pea += invoiceWithMeter.wheelingChargeTotal;
                        break;
                    case "meaegat":
                        wheelingData.summary.meaegat += invoiceWithMeter.wheelingChargeTotal;
                        break;
                    case "peaegat":
                        wheelingData.summary.peaegat += invoiceWithMeter.wheelingChargeTotal;
                        break;
                    case "meapeaegat":
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
            wheelingData.table.push(row);
        });
    }, []);
    useEffect(() => {
        if (session && currentState === NavigationCurrentType.BILLING_REPORT) {
            if (!invoiceReport) {
                console.log(`call refresh Invoice`);
                refreshInvoice();
            }
        }
    })
    return {
        invoiceReport,
        refreshInvoice,
        netPaymentReport,
        energyPaymentReport,
        gridUsedReport,
        wheelingChargeReport
    }

}
