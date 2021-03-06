import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { UserAndEnergyReportAPI } from "../../../api/report/UserReportAPI";
import {
  navigationCurrentState,
  NavigationCurrentType,
} from "../../../state/navigation-current-state";
import {
  IPeriod,
  periodState,
} from "../../../state/summary-report/period-state";
import {
  IEnergyInfo,
  IPowerGraph,
  locationSiteState,
} from "../../../state/summary-report/user-report/location-site-state";
import {
  IPowerData,
  powerDatastate,
} from "../../../state/summary-report/user-report/power-data-state";
import {
  IUserSummary,
  userChartState,
} from "../../../state/summary-report/user-report/user-chart-state";
import {
  IUserMeterInfo,
  userReportState,
} from "../../../state/summary-report/user-report/user-report-state";
import { userSessionState } from "../../../state/user-sessions";
import { useLoadingScreen } from "../../useLoadingScreen";
import { useSnackBarNotification } from "../../useSnackBarNotification";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
var isToday = require("dayjs/plugin/isToday");

dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function useUserReport() {
  const [meterTable, setmeterTable] = useRecoilState(userReportState);
  const [chartData, setChartData] = useRecoilState(userChartState);
  const [locationSite, setLocationSite] = useRecoilState(locationSiteState);
  const [actualPowers, setActualPowers] = useRecoilState(powerDatastate);
  const resetUserReportState = useResetRecoilState(userReportState);
  const resetLocationSiteState = useResetRecoilState(locationSiteState);
  const resetChartDataState = useResetRecoilState(userChartState);
  const resetPowerDatastateState = useResetRecoilState(powerDatastate);
  const api = new UserAndEnergyReportAPI();
  let currentState = useRecoilValue(navigationCurrentState);
  let session = useRecoilValue(userSessionState);
  let period = useRecoilValue(periodState);
  const { showLoading, hideLoading } = useLoadingScreen();
  const { showSnackBar } = useSnackBarNotification();

  const getPowerDatas = async (period?: IPeriod) => {
    if (session) {
      try {
        const result = await api.getPowerInfos({ period, session }); //period can be undefined because for support dashboard summary
        if (result) {
          setActualPowers(result.powerData);
          return result;
        }
      } catch (err) {
        showSnackBar({ serverity: "error", message: `${err}` });
      }
    }
  };

  const refreshUserTable = async (period: IPeriod) => {
    if (session) {
      showLoading(10);
      try {
        const userMeters = await api.getUserMeterInfo({ period, session });
        if (userMeters && userMeters.context.length > 0) {
          let userSummary: IUserSummary = {
            AGGREGATOR: 0,
            CONSUMER: 0,
            PROSUMER: 0,
            noUser: 0,
          };
          userMeters.context.forEach((meter: IUserMeterInfo) => {
            userSummary[meter.role] += 1;
          });
          let powerData = await getPowerDatas(period);
          if (powerData) {
            resetChartDataState();
            setChartData({
              energy: {
                pv: Math.floor(powerData.summaryPower.inSolar),
                energyStorage: Math.floor(
                  powerData.summaryPower.inBattery -
                    powerData.summaryPower.outBattery
                ),
                load: Math.floor(powerData.summaryPower.load),
                grid: Math.floor(
                  powerData.summaryPower.excessPv -
                    powerData.summaryPower.inGrid
                ),
              },
              user: {
                AGGREGATOR: userSummary.AGGREGATOR,
                CONSUMER: userSummary.CONSUMER,
                PROSUMER: userSummary.PROSUMER,
                noUser: userSummary.noUser,
              },
            });
            setActualPowers(powerData.powerData);
          }
          hideLoading(10);
          // refreshLocationSite(userMeters.context[0]);
          setmeterTable(userMeters.context);
          resetLocationSiteState();
        } else {
          //if not found reset State
          setmeterTable([]);
          resetChartDataState();
          resetLocationSiteState();
          hideLoading(10);
        }
      } catch (e) {
        hideLoading(10);
        showSnackBar({ serverity: "error", message: `${e}` });
      }
    }
  };

  const refreshLocationSite = async (meter: IUserMeterInfo) => {
    if (locationSite) {
      resetLocationSiteState();
    }
    if (session) {
      showLoading(10);
      try {
        let forecastPowerByMeter: IPowerGraph[] = await getForecastData(
          meter.meterId
        );
        let actualPowerByMeter: IPowerGraph[] = [];
        if (actualPowers && forecastPowerByMeter) {
          let powerDataByMeterIdAndPeriod = actualPowers.filter(
            (row: IPowerData) => {
              if (period) {
                let inRange = dayjs(row.timestamp).isBetween(
                  dayjs(period.startDate),
                  dayjs(period.endDate),
                  null,
                  "[]"
                );
                // let inRange = dayjs(row.timestamp).isSame(dayjs(period.startDate).startOf('day')) ||
                //     (dayjs(row.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                //         && dayjs(row.timestamp).isBefore(dayjs(period.endDate).endOf('day')));
                if (inRange) {
                  return meter.meterId.toString() === row.meterId.toString();
                }
              } else {
                return meter.meterId.toString() === row.meterId.toString();
              }
            }
          );
          let energySummary: IEnergyInfo = {
            pv: 0,
            energyStorage: 0,
            inBattery: 0,
            outBattery: 0,
            energyLoad: 0,
            grid: 0,
          };
          if (powerDataByMeterIdAndPeriod.length > 0) {
            powerDataByMeterIdAndPeriod.map((row: IPowerData) => {
              energySummary.pv += +row.inSolar;
              energySummary.energyStorage += +row.inBattery - row.outBattery;
              energySummary.inBattery += row.inBattery;
              energySummary.outBattery += row.outBattery;
              energySummary.grid += row.excessPv - row.inGrid;
              energySummary.energyLoad += +row.load;
              actualPowerByMeter.push({
                //insert actual power in array
                timestamp: row.timestamp,
                grid: +row.inGrid,
                pv: +row.excessPv,
              });
            });
          }
          setLocationSite({
            meterId: meter.meterId,
            peameaSubstation: meter.peameaSubstation,
            egatSubStation: meter.egatSubStation,
            location: {
              lat: meter.address.lat,
              lng: meter.address.lng,
            },
            energySummary: {
              grid: energySummary.grid,
              inBattery: energySummary.inBattery,
              outBattery: energySummary.outBattery,
              energyStorage: energySummary.energyStorage,
              energyLoad: energySummary.energyLoad,
              pv: energySummary.pv,
            },
            powerUsed: {
              actual: actualPowerByMeter,
              forecast: forecastPowerByMeter,
            },
          });
        }
        hideLoading(10);
      } catch (e) {
        hideLoading(10);
        showSnackBar({ serverity: "error", message: `${e}` });
      }
    }
  };

  const getForecastData = async (meterId: string): Promise<IPowerGraph[]> => {
    let powerGraph: IPowerGraph[] = [];
    if (session) {
      try {
        let forecastData = await api.getForecastData({
          session,
          meterId,
          period,
        });
        if (forecastData && forecastData.context.length > 0) {
          forecastData.context.map((row: IPowerData) => {
            powerGraph.push({
              //insert actual power in array
              timestamp: row.timestamp,
              grid: row.inGrid,
              pv: row.excessPv,
            });
          });
        }
      } catch (e) {
        showSnackBar({
          serverity: "error",
          message: `Cannot Load forecst Data ${e}`,
        });
      }
    }
    return powerGraph;
  };

  useEffect(() => {
    if (session && currentState === NavigationCurrentType.USER_REPORT) {
      if (!meterTable) {
        refreshUserTable(period);
      }
    }
    return () => {
      //clean up state when unmount component. In this situation it means clear data in state when change page for new reload when comeback
      resetUserReportState();
      resetLocationSiteState();
      resetChartDataState();
      resetPowerDatastateState();
    };
  }, [period]);

  return {
    chartData,
    refreshUserData: getPowerDatas,
    meterTable,
    refreshUserTable,
    locationSite,
    refreshLocationSite,
  };
}
