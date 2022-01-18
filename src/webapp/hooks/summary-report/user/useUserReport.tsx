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
    const getPowerDatas = useCallback(async (period?: IPeriod) => {
        if (session) {
            const result = await api.getPowerInfos({ period, session }); //period can be undefined because for support dashboard summary 
            if (result) {
                setActualPowers(result.powerData);
                return result;
            }
        }

    }, []);

    const refreshUserTable = async (period: IPeriod, roles: string[], area: string) => {
        // console.log('refresh User Energy Table');
        if (session) {
            showLoading(10);
            const userMeters = await api.getUserMeterInfo({ period, roles: roles, area: area, session })
            if (userMeters && userMeters.context.length > 0) {
                let userSummary: IUserSummary = { AGGREGATOR: 0, CONSUMER: 0, PROSUMER: 0, noUser: 0 };
                userMeters.context.forEach((meter: IUserMeterInfo) => {
                    userSummary[meter.role] += 1;
                })
                let powerData = await getPowerDatas(period);
                if (powerData) {
                    setChartData({
                        energy: {
                            pv: Math.floor(powerData.summaryPower.inSolar),
                            energyStorage: Math.floor( powerData.summaryPower.inBattery),
                            energyConsumptions: Math.floor(powerData.summaryPower.load),
                            grid: Math.floor(powerData.summaryPower.inGrid)
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
                refreshLocationSite(userMeters.context[0]);
                setmeterTable(userMeters.context);
            } else {//if not found reset State
                setmeterTable([]);
                resetChartData();
                resetLocationSite();
            }
            hideLoading(10);
        }
    };


    const refreshLocationSite = async (meter: IUserMeterInfo) => {
        if (locationSite) {
            resetLocationSite();
        }
        if (session) {
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
                    energyConsumptions: 0,
                    grid: 0
                }
                if (powerDataByMeterId.length > 0) {
                    powerDataByMeterId.map((row: IPowerData) => {
                        energySummary.pv += Math.floor( +row.inSolar);
                        energySummary.energyStorage += Math.floor(+row.inBattery);
                        energySummary.energyConsumptions += Math.floor(+row.load);
                        energySummary.grid += Math.floor(+row.inGrid);
                        actualPowerByMeter.push({ //insert actual power in array
                            timestamp: row.timestamp,
                            grid: +row.inGrid,
                            pv: +row.inSolar 
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
                        energyLoad: energySummary.energyConsumptions,
                        pv: energySummary.pv,
                    },
                    powerUsed: {
                        actual: actualPowerByMeter,
                        forecast: forecastPowerByMeter
                    }


                })

            }
        };
    };

    const getForecastData = async (meterId: string): Promise<IPowerGraph[]> => {
        let powerGraph: IPowerGraph[] = [];
        if (session) {
            let forecastData = await api.getForecastData({ session, meterId });
            if (forecastData && forecastData.context.length > 0) {
                forecastData.context.map((row: IPowerData) => {
                    powerGraph.push({ //insert actual power in array
                        timestamp: row.timestamp,
                        grid: row.inGrid,
                        pv: row.inSolar 
                    }
                    )
                })
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
