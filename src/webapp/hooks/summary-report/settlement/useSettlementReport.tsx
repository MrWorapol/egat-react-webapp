import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { SettlementReportAPI } from "../../../api/report/SettlementReportAPI";
import { UserAndEnergyReportAPI } from "../../../api/report/UserReportAPI";
import { NavigationCurrentType } from "../../../state/navigation-current-state";
import { settlementChartState } from "../../../state/summary-report/settlement-report/settlement-chart-state";
import { ISettlementDetail, settlementDetailState } from "../../../state/summary-report/settlement-report/settlement-detail-state";
import { IImbalanceReport, ITradeContractReport, settlementReportState } from "../../../state/summary-report/settlement-report/settlement-report-state";
import { IUserMeterInfo } from "../../../state/summary-report/user-report/user-report-state";
import { userSessionState } from "../../../state/user-sessions";
import { useLoadingScreen } from "../../useLoadingScreen";
import { useNavigationGet } from "../../useNavigationGet";
import { useSnackBarNotification } from "../../useSnackBarNotification";
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
    const settlementAPI = new SettlementReportAPI();
    const userMeterApi = new UserAndEnergyReportAPI();

    const { showLoading, hideLoading } = useLoadingScreen();
    const { showSnackBar } = useSnackBarNotification();

    const refreshSettlementReport = async (role: string, area: string, buyerType: string, tradeMarket: string, orderStatus: string) => {
        if (session) {
            try {
                showLoading(10);
                const userMeterInfos = await userMeterApi.getUserMeterInfo({ period, roles: [role], area: area, session });
                const req = {
                    period,
                    area,
                    role,
                    buyerType,
                    tradeMarket,
                    orderStatus,
                    session
                }
                const tradeContractReports = await settlementAPI.getTradeContractReport(req);
                const tradeDataReport = await settlementAPI.getTradeDataReport(req);
                const bilateralSettlement = await settlementAPI.getBilateralSettlementLongTerm(req);
                console.log(`longterm settlement`);
                console.log(bilateralSettlement);
                let summaryRole: ISummaryMap = { 'aggregator': 0, 'prosumer': 0, 'consumer': 0 };
                let summaryUserType: ISummaryMap = { 'seller': 0, 'buyer': 0 };
                let summaryTradeMarket: ISummaryMap = { 'bilateral': 0, 'pool': 0 };
                let summaryImbalanceType: ISummaryMap = { 'energyExcess': 0, 'energyShortfall': 0 };
                let summaryImbalnceAmount: ISummaryMap = {
                    sellerOverCommit: 0,
                    buyerOverCommit: 0,
                    sellerUnderCommit: 0,
                    buyerUnderCommit: 0
                };
                let summaryNet: ISummaryMap = {
                    netSale: 0,
                    netBuy: 0,
                    netImbalance: 0
                };

                if ((tradeContractReports && userMeterInfos && tradeDataReport && bilateralSettlement)
                    && tradeContractReports.context.length > 0 && userMeterInfos.context.length > 0 && tradeDataReport.context.length > 0) {
                    let longTermTradeContracts = bilateralSettlement.context.length > 0 && bilateralSettlement.context;
                    let output: ITradeContractReport[] = [];
                    tradeContractReports.context.forEach((contract: ITradeContractReport) => { //map tractContract 
                        let buyerMeter = userMeterInfos.context.find((user: IUserMeterInfo) => { return user.id.toString() === contract.buyerId.toString() })
                        let sellerMeter = userMeterInfos.context.find((user: IUserMeterInfo) => { return user.id.toString() === contract.sellerId.toString() })
                        if (contract.bilateralTradeSettlementId) {
                            if (longTermTradeContracts) {
                                let isLongTermContract = longTermTradeContracts.find((settlement) => { return contract.bilateralTradeSettlementId === settlement.bilateralTradeSettlementId });
                                if (isLongTermContract) {
                                    contract.tradeMarket = "LONGTERM_BILATERAL";
                                }
                            }
                        }

                        contract.imbalance = []; //create array variable for insert imbalance Data
                        let tradeDataMapContractId: IImbalanceReport[] = tradeDataReport.context.filter((imbalance: IImbalanceReport) => {
                            return imbalance.tradeContractIds.toString() === contract.contractId.toString();
                        })
                        if (tradeDataMapContractId.length > 0) {
                            if (tradeDataMapContractId.every((tradeData) => { console.log(`tradeData.tradeType ${tradeData.tradeType}`); return tradeData.tradeType === "SELLER_CONTRACT" || tradeData.tradeType === "BUYER_CONTRACT" })) { //case CONTRACT Not use

                            } else {
                                let imbalanceCase = tradeDataMapContractId.filter((tradeData) => { return tradeData.tradeType !== "SELLER_CONTRACT" && tradeData.tradeType !== "BUYER_CONTRACT" }) //select only imbalance Case
                                if (imbalanceCase.length > 0) {
                                    imbalanceCase.forEach((imbalance) => {
                                        switch (imbalance.tradeType) {
                                            //case over commit
                                            case "SELLER_IMBALANCE_OVERCOMMIT":
                                                contract.imbalanceStatus = "energyExcess";
                                                contract.imbalance?.push(imbalance);
                                                summaryNet["netSale"] += contract.priceCommitted + contract.tradingFee + contract.wheelingChargeFee;
                                                summaryNet["netImbalance"] += imbalance.price;
                                                summaryImbalnceAmount["sellerOverCommit"] += imbalance.amount;
                                                break;
                                            case "BUYER_IMBALANCE_OVERCOMMIT":
                                                // console.log(`OVER_COMMITT`);
                                                contract.imbalanceStatus = "energyExcess";
                                                contract.imbalance?.push(imbalance);
                                                summaryNet["netBuy"] += contract.priceCommitted + contract.tradingFee + contract.wheelingChargeFee;
                                                summaryNet["netImbalance"] += imbalance.price;
                                                summaryImbalnceAmount["buyerOverCommit"] += imbalance.amount;
                                                break;
                                            //case under commit
                                            case "SELLER_IMBALANCE_UNDERCOMMIT":

                                                console.log('SELLER_IMBALANCE_UNDERCOMMIT');
                                                console.log(imbalance);
                                                contract.imbalanceStatus = "energyShortfall";
                                                contract.imbalance?.push(imbalance);
                                                summaryNet["netSale"] += contract.priceCommitted + contract.tradingFee + contract.wheelingChargeFee;
                                                summaryNet["netImbalance"] += imbalance.price;
                                                summaryImbalnceAmount["sellerUnderCommit"] += imbalance.amount;
                                                break;
                                            case "BUYER_IMBALANCE_UNDERCOMMIT":
                                                console.log('BUYER_IMBALANCE_UNDERCOMMIT');
                                                console.log(imbalance);
                                                contract.imbalanceStatus = "energyShortfall";
                                                contract.imbalance?.push(imbalance);
                                                summaryNet["netBuy"] += contract.priceCommitted + contract.tradingFee + contract.wheelingChargeFee;
                                                summaryNet["netImbalance"] += imbalance.price;
                                                summaryImbalnceAmount["buyerUnderCommit"] += imbalance.amount;
                                                break;
                                            default:
                                                break;
                                        }
                                    })
                                }

                            }

                        }
                        if (buyerMeter && sellerMeter) {
                            //insert buyer row
                            summaryTradeMarket[contract.tradeMarket.toLowerCase()] += 1;
                            summaryRole[buyerMeter.role.toLowerCase()] += 1; //count  role user
                            summaryUserType["BUYER".toLowerCase()] += 1;
                            summaryImbalanceType[contract.imbalanceStatus] += 1;

                            output.push({
                                ...contract,
                                userType: "BUYER",
                                regionName: buyerMeter.region,
                                area: buyerMeter.area,
                                role: buyerMeter.role,
                                meterId: buyerMeter.meterId,
                                matchedMeterId: sellerMeter.meterId
                            })
                            //insert seller row
                            summaryTradeMarket[contract.tradeMarket.toLowerCase()] += 1;
                            summaryRole[sellerMeter.role.toLowerCase()] += 1; //count  role user
                            summaryUserType["SELLER".toLowerCase()] += 1;
                            summaryImbalanceType[contract.imbalanceStatus] += 1;

                            output.push({
                                ...contract,
                                userType: "SELLER",
                                regionName: sellerMeter.region,
                                area: sellerMeter.area,
                                role: sellerMeter.role,
                                meterId: sellerMeter.meterId,
                                matchedMeterId: buyerMeter.meterId
                            })
                        }
                    });
                    setSettlementReport(output);
                    refreshSettlementDetail(output[0]);
                } else {
                    setSettlementReport([]);
                    resetSettlementDetail();
                }

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
                            energyExcess: summaryImbalanceType.energyExcess,
                            energyShortfall: summaryImbalanceType.energyShortfall
                        },
                        netImbalanceAmount: {
                            netSale: summaryNet["netSale"],
                            netBuy: summaryNet["netBuy"],
                            netAll: summaryNet["netImbalance"],
                        },
                        netImbalanceAmountByStatus: {
                            sellerOverCommit: summaryImbalnceAmount["sellerOverCommit"],
                            sellerUnderCommit: summaryImbalnceAmount["sellerUnderCommit"],
                            buyerOverCommit: summaryImbalnceAmount["buyerOverCommit"],
                            buyerUnderCommit: summaryImbalnceAmount["buyerUnderCommit"],
                        }
                    }
                );
                hideLoading(10);

            } catch (e) {
                hideLoading(10);
                showSnackBar({ serverity: 'error', message: `${e}` });
            }
        }
    };


    const refreshSettlementDetail = async (settlement: ITradeContractReport) => {
        if (settlementDetail) { //clear state of detail 
            resetSettlementDetail();
        }
        let newSettlementDetail: ISettlementDetail = {
            contractId: settlement.contractId,
            userType: settlement.userType,
            energyCommited: settlement.energyCommitted,
            netPrice: settlement.priceCommitted + settlement.tradingFee + settlement.wheelingChargeFee, // NET Buy | NET sale
            imbalanceType: settlement.imbalanceStatus,
            tradeMarket: settlement.tradeMarket,
            meterId: settlement.meterId,
            matchedMeterId: settlement.matchedMeterId,
            settlementTime: settlement.settlementTime
        } as ISettlementDetail;

        if (settlement.imbalance && settlement.imbalance.length === 0) { //case CONTRACT
            newSettlementDetail.energyDeliverd = settlement.energyCommitted;// energy deliverd = committed
            newSettlementDetail.netEnergyPrice = newSettlementDetail.netPrice / settlement.energyCommitted; // = Price / energyPerKWh
        } else { // CASE IMBALANCE
            switch (newSettlementDetail.userType) {
                case "BUYER":

                    // if (settlement.imbalanceStatus === "energyShortfall") { //case shortfall user have to buy DSO to commit imbalance amount
                    let shortfallBuyer = settlement.imbalance && settlement.imbalance.find((tradeData) => { return settlement.buyerId === tradeData.buyerId || settlement.buyerId === tradeData.sellerId });
                    if (shortfallBuyer) {
                        newSettlementDetail.energyDeliverd = settlement.energyCommitted - shortfallBuyer.amount;
                        newSettlementDetail.orderImbalanceAmount = shortfallBuyer.amount;
                        newSettlementDetail.orderImbalance = shortfallBuyer.price;
                        newSettlementDetail.netEnergyPrice = newSettlementDetail.energyDeliverd === 0 ? 0 : newSettlementDetail.netPrice / newSettlementDetail.energyDeliverd;
                    }
                    // }
                    else { // settlement.imbalanceStatus === energyExcess

                    }
                    break;
                case "SELLER":
                    let shortfallSeller = settlement.imbalance && settlement.imbalance.find((tradeData) => { return settlement.sellerId === tradeData.buyerId || settlement.sellerId === tradeData.sellerId });
                    if (shortfallSeller) {
                        newSettlementDetail.energyDeliverd = settlement.energyCommitted - shortfallSeller.amount;
                        newSettlementDetail.orderImbalanceAmount = shortfallSeller.amount;
                        newSettlementDetail.orderImbalance = shortfallSeller.price;
                        newSettlementDetail.netEnergyPrice = newSettlementDetail.energyDeliverd === 0 ? 0 : newSettlementDetail.netPrice / newSettlementDetail.energyDeliverd;
                    }
                    break;
                default: break;
            }

        }

        setSettlementDetail(newSettlementDetail);

    };


    useEffect(() => {
        if (session && currentState === NavigationCurrentType.SETTLEMENT_REPORT) {
            if (!settlementReport) {
                refreshSettlementReport('all', 'all', 'all', 'all', 'all');
            }

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