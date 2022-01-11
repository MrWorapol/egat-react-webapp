import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { UserReportAPI } from "../../../api/report/UserReportAPI";
import { navigationCurrentState, NavigationCurrentType } from "../../../state/navigation-current-state";
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
    const [powerData, setPowerData] = useRecoilState(powerDatastate);
    const resetLocationSite = useResetRecoilState(locationSiteState);
    const api = new UserReportAPI();
    const { period } = usePeriodTime();
    const session = useRecoilValue(userSessionState);

    const { showLoading, hideLoading } = useLoadingScreen();
    const getPowerDatas = useCallback(async () => {
        if (session) {
            const result = await api.getPowerInfos({ session });
            console.log(`callculate Power Data`)
            console.log(result);
            if (result) {
                setPowerData(result.powerData);
                return result;
            }
        }

    }, []);

    const refreshUserTable = useCallback(async (roles: string[], area: string) => {
        console.log('refresh User Energy Table');
        if (session) {
            showLoading(10);
            const userMeters = await api.getUserMeterInfo({ startDate: dayjs(period.startDate).toString(), endDate: dayjs(period.endDate).toString(), region: period.region, roles: roles, area: area, session })
            if (userMeters) {
                // console.log(`refresh user table`);
                // console.log(result.context)
                let userSummary: IUserSummary = { AGGREGATOR: 0, CONSUMER: 0, PROSUMER: 0, noUser: 0 };
                userMeters.context.map((meter: IUserMeterInfo) => {
                    userSummary[meter.role] += 1;
                })
                // console.log(`userSummary `);
                // console.log(userSummary);
                let powerData = await getPowerDatas();
                if (powerData) {
                    console.log(`energySummary`);
                    console.log(powerData);
                    setChartData({
                        energy: {
                            pv: Math.floor(powerData.summaryPower.load + powerData.summaryPower.inSolar + powerData.summaryPower.inGrid + powerData.summaryPower.inBattery),
                            energyStorage: Math.floor(powerData.summaryPower.inSolar + powerData.summaryPower.inBattery),
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
                    setPowerData(powerData.powerData);
                }

                setmeterTable(userMeters.context);
            }
            hideLoading(10);
        }
    }, []);


    const refreshLocationSite = useCallback(async (meter: IUserMeterInfo) => {

        if (locationSite) {
            // if (locationSite.meterId.toString() === meter.meterId.toString()) { //no need rerender when select same meter
            // return;
            // }
            resetLocationSite();
        }
        if (session) {
            let forecastPower: IPowerGraph[] = await getForecastData(meter.meterId);
            let actualPower: IPowerGraph[] = [];
            if (powerData && forecastPower) {
                let powerDataByMeterId = powerData.filter(
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
                        energySummary.pv += Math.floor(+row.load + +row.inSolar + +row.inGrid + +row.inBattery);
                        energySummary.energyStorage += Math.floor(+row.inSolar + +row.inBattery);
                        energySummary.energyConsumptions += Math.floor(+row.load);
                        energySummary.grid += Math.floor(+row.inGrid);
                        actualPower.push({ //insert actual power in array
                            timestamp: row.timestamp,
                            grid: +row.inGrid,
                            pv: +row.load + +row.inSolar + +row.inGrid + +row.inBattery
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
                        actual: actualPower,
                        forecast: forecastPower
                    }


                })

            }
        };
    }, [])

    const getForecastData = useCallback(async (meterId: string): Promise<IPowerGraph[]> => {
        let powerGraph: IPowerGraph[] = [];
        if (session) {
            let forecastData = await api.getForecastData({ session, meterId });
            if (forecastData && forecastData.context.length > 0) {
                forecastData.context.map((row: IPowerData) => {
                    powerGraph.push({ //insert actual power in array
                        timestamp: row.timestamp,
                        grid: row.inGrid,
                        pv: row.load + row.inSolar + row.inGrid + row.inBattery
                    }
                    )
                })
            }

        }
        return powerGraph;
    }, [])
    useEffect(() => {
        if (session && currentState === NavigationCurrentType.USER_REPORT) {
            if (!meterTable) {
                refreshUserTable([], 'all');

            }
            if (meterTable && !locationSite) {
                refreshLocationSite(meterTable[0]);
            }

        }
        return () => {

        }
    }, [])

    return {
        chartData,
        refreshUserData: getPowerDatas,
        meterTable,
        refreshUserTable,
        locationSite,
        refreshLocationSite,
    }
}
