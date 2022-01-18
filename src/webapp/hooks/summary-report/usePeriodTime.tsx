import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useResetRecoilState } from 'recoil';
import { IPeriod, periodState } from '../../state/summary-report/period-state'

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

export default function usePeriodTime() {
    let [period, setPeriod] = useRecoilState(periodState);

    const updatedPeriod = (newData: IPeriod) => {
        // console.info(`new Data input  Day is ${newData.startDate},\t new End Day: ${newData.endDate}\t new Region: ${newData.region}`);
        setPeriod(
            {
                startDate: dayjs(newData.startDate).startOf('day').toDate(),
                endDate: dayjs(newData.endDate).startOf('day').toDate(),
                region: newData.region
            });

        // console.log(`after push data Day is ${period.startDate},\t new End Day: ${period.endDate}\t new Region: ${period.region}`);


    }
    useEffect(() => {
        if (!period) {
            setPeriod({
                startDate: dayjs().tz('Asia/Bangkok').toDate(),
                endDate: dayjs().tz('Asia/Bangkok').toDate(),
                region: 'all',
            })
        }


        return () => {
        }
    }, [period, setPeriod]);

    return {
        period,
        updatedPeriod,
        setPeriod
    }
}
