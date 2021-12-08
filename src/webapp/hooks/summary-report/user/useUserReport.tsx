import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil"
import { UserReportAPI } from "../../../api/report/UserReportAPI";
import { locationSiteState } from "../../../state/summary-report/user-report/location-site-state";
import { userChartState } from "../../../state/summary-report/user-report/user-chart-state"
import { userReportState } from "../../../state/summary-report/user-report/user-report-state";
import usePeriodTime from "../usePeriodTime";


export default function useUserReport() {
    const [chartData, setChartData] = useRecoilState(userChartState);
    const [meterTable, setmeterTable] = useRecoilState(userReportState);
    const [locationSite, setLocationSite] = useRecoilState(locationSiteState);
    const api = new UserReportAPI();
    const { period, updatedPeriod } = usePeriodTime();
    const refreshUserData = useCallback(async () => {
        const resultChart = await api.getUserReport({ startDate: dayjs(period.startDate).toString(), endDate: dayjs(period.endDate).toString(), region: period.region });
        console.log(`call refresh User Data`);
        if (resultChart) {
            setChartData(resultChart.context);

        }
    }, []);

    const refreshUserTable = useCallback(async (roles: string[], area: string) => {
        console.log(`refresh user table`)
        const result = await api.getUserTable({ startDate: dayjs(period.startDate).toString(), endDate: dayjs(period.endDate).toString(), region: period.region, roles: roles, area: area })
        if (result) {
            setmeterTable(result.context);
            if (result.context.length > 0) {
                // console.log(`conditioned is meterTable !== null & `)
                refreshLocationSite(result.context[0].meterId);
            }
        }
    }, []);

    const refreshLocationSite = useCallback(async (meterId: string) => {
        console.log(`refresh location site`)
        const result = await api.getLocationSite({ meterId: meterId });
        // console.log(`result from refresh Location site`);
        // console.log(result?.context);
        if (result) {
            setLocationSite(result.context);

        }
        // console.info(`location site`);
        // console.log(locationSite);

    }, [])
    useEffect(() => {
        if (!chartData) {
            refreshUserData();
        }
        if (!meterTable) {
            refreshUserTable([], 'all');

        }
        return () => {
        }
    }, [])

    return {
        chartData,
        refreshUserData,
        meterTable,
        refreshUserTable,
        locationSite,
        refreshLocationSite,
    }
}