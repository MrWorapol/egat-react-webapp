import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil"
import { UserReportAPI } from "../../../api/report/UserReportAPI";
import { summaryState } from "../../../state/summary-report/user-report/summary-state"
import { userReportState } from "../../../state/summary-report/user-report/user-report-state";


export default function useUserReport() {
    const [chartData, setChartData] = useRecoilState(summaryState);
    const [meterTable, setmeterTable] = useRecoilState(userReportState);
    const api = new UserReportAPI();

    const refreshChartData = useCallback(async () => {

    }, []);

    useEffect(() => {
        if (!chartData) {
            refreshChartData();
        }
        return () => {
        }
    }, [])

    return {

    }
}