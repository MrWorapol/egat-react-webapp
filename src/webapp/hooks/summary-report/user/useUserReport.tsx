import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil"
import { UserReportAPI } from "../../../api/report/UserReportAPI";
import { navigationCurrentState, NavigationCurrentType } from "../../../state/navigation-current-state";
import { locationSiteState } from "../../../state/summary-report/user-report/location-site-state";
import { userChartState } from "../../../state/summary-report/user-report/user-chart-state"
import { userReportState } from "../../../state/summary-report/user-report/user-report-state";
import { userSessionState } from "../../../state/user-sessions";
import usePeriodTime from "../usePeriodTime";


export default function useUserReport() {
    const currentState = useRecoilValue(navigationCurrentState);
    const [chartData, setChartData] = useRecoilState(userChartState);
    const [meterTable, setmeterTable] = useRecoilState(userReportState);
    const [locationSite, setLocationSite] = useRecoilState(locationSiteState);
    const api = new UserReportAPI();
    const { period } = usePeriodTime();
    const session = useRecoilValue(userSessionState);

    const calculateChartData = useCallback(async () => {
        console.log(`call refreshChart`);
        const resultChart = await api.getUserReport({ startDate: dayjs(period.startDate).toString(), endDate: dayjs(period.endDate).toString(), region: period.region });
        if (resultChart) {
            setChartData(resultChart.context);
        }
    }, []);

    const refreshUserTable = useCallback(async (roles: string[], area: string) => {
        console.log('refresh User Energy Table');
        const result = await api.getUserMeterInfo({ startDate: dayjs(period.startDate).toString(), endDate: dayjs(period.endDate).toString(), region: period.region, roles: roles, area: area, session: { accessToken: "1", refreshToken: '12', lasttimeLogIn: new Date() } })
        if (result) {
            // console.log(`refresh user table`);
            // console.log(result.context)
            setmeterTable(result.context);
            if (result.context.length > 0) {
                refreshLocationSite(result.context[0].meterId);
            }
            calculateChartData();
        }
    }, []);

    const refreshLocationSite = useCallback(async (meterId: string) => {
        // console.log(`refresh location site`)
        // const result = await api.getLocationSite({ meterId: meterId });
        // // console.log(`result from refresh Location site`);
        // // console.log(result?.context);
        // if (result) {
        //     setLocationSite(result.context);

        // }
        // console.info(`location site`);
        // console.log(locationSite);

    }, [])
    useEffect(() => {
        if (session && currentState === NavigationCurrentType.USER_REPORT) {
            console.log(`call useEffect useUserReport`);
            console.log(currentState);
            if (!meterTable) {
                refreshUserTable([], 'all');

            }

        }
        return () => {

        }
    }, [])

    return {
        chartData,
        refreshUserData: calculateChartData,
        meterTable,
        refreshUserTable,
        locationSite,
        refreshLocationSite,
    }
}
