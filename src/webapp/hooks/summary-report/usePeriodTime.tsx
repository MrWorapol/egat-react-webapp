import dayjs from 'dayjs';
import React, { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { IPeriod, periodState } from '../../state/summary-report/period-state'

export default function usePeriodTime() {
    const [period, setPeriod] = useRecoilState(periodState);

    const updatedPeriod = useCallback(
        (newData: IPeriod) => {
            setPeriod(newData);
            // console.info(`new Start Day is ${period.startDate},\t new End Day: ${period.endDate}\t new Region: ${period.region}`);

        }, []
    )
    useEffect(() => {
        if (!period) {
            updatedPeriod({ region: 'all', startDate: dayjs().toDate(), endDate: dayjs().toDate() })
        }
        return () => {

        }
    }, []);

    return {
        period,
        updatedPeriod,
    }
}
