import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { UserAndEnergyReportAPI } from "../../../api/report/UserReportAPI";
import { navigationCurrentState, NavigationCurrentType } from "../../../state/navigation-current-state";
import { IPeriod, periodState } from "../../../state/summary-report/period-state";
import { IPowerGraph, locationSiteState } from "../../../state/summary-report/user-report/location-site-state";
import { IPowerData, powerDatastate } from "../../../state/summary-report/user-report/power-data-state";
import { IUserSummary, userChartState } from "../../../state/summary-report/user-report/user-chart-state"
import { IUserMeterInfo, userReportState } from "../../../state/summary-report/user-report/user-report-state";
import { userSessionState } from "../../../state/user-sessions";
import { useLoadingScreen } from "../../useLoadingScreen";
import { useSnackBarNotification } from "../../useSnackBarNotification";
import usePeriodTime from "../usePeriodTime";


export default function useUserReport() {
    const currentState = useRecoilValue(navigationCurrentState);
    const [chartData, setChartData] = useRecoilState(userChartState);
    const [meterTable, setmeterTable] = useRecoilState(userReportState);
    const [locationSite, setLocationSite] = useRecoilState(locationSiteState);
    const [actualPowers, setActualPowers] = useRecoilState(powerDatastate);
    const resetLocationSite = useResetRecoilState(locationSiteState);
    const api = new UserAndEnergyReportAPI();
    let resetChartData = useResetRecoilState(userChartState);
    let period = useRecoilValue(periodState);
    let session = useRecoilValue(userSessionState);

    const { showLoading, hideLoading } = useLoadingScreen();
    const { showSnackBar } = useSnackBarNotification();
    const getPowerDatas = useCallback(async (period?: IPeriod) => {
        if (session) {

            try {
                const result = await api.getPowerInfos({ period, session }); //period can be undefined because for support dashboard summary 
                if (result) {
                    setActualPowers(result.powerData);
                    return result;
                }
            } catch (err) {

                showSnackBar({ serverity: 'error', message: `${err}` });
            }

        }

    }, []);

    const refreshUserTable = async (period: IPeriod, roles: string[], area: string) => {
        // console.log('refresh User Energy Table');
        if (session) {
            showLoading(10);
            try {
                const userMeters = await api.getUserMeterInfo({ period, roles: roles, area: area, session })
                if (userMeters && userMeters.context.length > 0) {
                    let userSummary: IUserSummary = { AGGREGATOR: 0, CONSUMER: 0, PROSUMER: 0, noUser: 0 };
                    userMeters.context.forEach((meter: IUserMeterInfo) => {
                        userSummary[meter.role] += 1;
                    })
                    let powerData = await getPowerDatas(period);
                    if (powerData) {
                        resetChartData();
                        setChartData({
                            energy: {
                                pv: Math.floor(powerData.summaryPower.inSolar),
                                energyStorage: Math.floor(powerData.summaryPower.inBattery - powerData.summaryPower.outBattery),
                                load: Math.floor(powerData.summaryPower.load),
                                grid: Math.floor(powerData.summaryPower.excessPv - powerData.summaryPower.inGrid)
                            },
                            user: {
                                AGGREGATOR: userSummary.AGGREGATOR,
                                CONSUMER: userSummary.CONSUMER,
                                PROSUMER: userSummary.PROSUMER,
                                noUser: userSummary.noUser,
                            },
                        })
                        setActualPowers(powerData.powerData);
                    }
                    hideLoading(10);
                    refreshLocationSite(userMeters.context[0]);
                    setmeterTable(userMeters.context);
                } else {//if not found reset State
                    setmeterTable([]);
                    resetChartData();
                    resetLocationSite();
                    hideLoading(10);
                }
            } catch (e) {
                hideLoading(10);
                showSnackBar({ serverity: 'error', message: `${e}` });

            }
        }
    };


    const refreshLocationSite = async (meter: IUserMeterInfo) => {
        if (locationSite) {
            resetLocationSite();
        }
        if (session) {

            showLoading(10);
            try {
                let forecastPowerByMeter: IPowerGraph[] = await getForecastData(meter.meterId);
                let actualPowerByMeter: IPowerGraph[] = [];
                if (actualPowers && forecastPowerByMeter) {
                    let powerDataByMeterId = actualPowers.filter(
                        (row: IPowerData) => {
                            return meter.meterId.toString() === row.meterId.toString()
                        });
                    let energySummary = {
                        pv: 0,
                        energyStorage: 0,
                        load: 0,
                        grid: 0
                    }
                    if (powerDataByMeterId.length > 0) {
                        console.log(`actul power meter:${meter.meterId}`);
                        powerDataByMeterId.map((row: IPowerData) => {
                            console.log(row)
                            energySummary.pv += Math.floor(+row.inSolar);
                            energySummary.energyStorage += Math.floor(+row.inBattery - row.outBattery);
                            energySummary.grid += Math.floor(row.excessPv - row.inGrid);
                            energySummary.load += Math.floor(+row.load);
                            actualPowerByMeter.push({ //insert actual power in array
                                timestamp: row.timestamp,
                                grid: +row.inGrid,
                                pv: +row.excessPv
                            })
                        })
                    }
                    console.log(energySummary);
                    setLocationSite({
                        meterId: meter.meterId,
                        peameaSubstation: meter.peameaSubstation,
                        egatSubStation: meter.egatSubStation,
                        location: {
                            lat: meter.address.lat,
                            lng: meter.address.lng
                        },
                        energySummary: {
                            grid: energySummary.grid,
                            energyStorage: energySummary.energyStorage,
                            energyLoad: energySummary.load,
                            pv: energySummary.pv,
                        },
                        powerUsed: {
                            actual: actualPowerByMeter,
                            forecast: forecastPowerByMeter
                        }


                    })

                }
                hideLoading(10);
            } catch (e) {
                hideLoading(10);
                showSnackBar({ serverity: 'error', message: `${e}` });

            }
        };
    };

    const getForecastData = async (meterId: string): Promise<IPowerGraph[]> => {
        let powerGraph: IPowerGraph[] = [];
        if (session) {
            try {
                let forecastData = await api.getForecastData({ session, meterId });
                if (forecastData && forecastData.context.length > 0) {
                    forecastData.context.map((row: IPowerData) => {
                        powerGraph.push({ //insert actual power in array
                            timestamp: row.timestamp,
                            grid: row.inGrid,
                            pv: row.excessPv
                        }
                        )
                    })
                }
            }catch(e){
                showSnackBar({ serverity: 'error', message: `Cannot Load forecst Data ${e}` });
            }
            //load = row.inSolar + row.inGrid + row.inBattery
            //พลังงานที่ใช้ทั้งหมด = พลังงานโซล่า + grid + แบต
        }
        return powerGraph;
    };

    useEffect(() => {
        if (session && currentState === NavigationCurrentType.USER_REPORT) {
            if (!meterTable) {
                refreshUserTable(period, [], 'all');

            }
            // if (meterTable && !locationSite) {
            //     if (meterTable.length > 0) {
            //         refreshLocationSite(meterTable[0]);
            //     }
            // }

        }
        return () => {

        }
    }, [period])

    return {
        chartData,
        refreshUserData: getPowerDatas,
        meterTable,
        refreshUserTable,
        locationSite,
        refreshLocationSite,
    }
}
