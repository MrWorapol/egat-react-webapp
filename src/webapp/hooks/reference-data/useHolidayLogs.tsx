import dayjs from 'dayjs';
import React, { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import TOUTariffAPI from '../../api/referenceData/TOUtariffAPI';
import { holidayLogsState, IHoliday } from '../../state/reference-data/tou-traff/holiday-state'
import { userSessionState } from '../../state/user-sessions';
import { useLoadingScreen } from '../useLoadingScreen';
import { useSnackBarNotification } from '../useSnackBarNotification';

export default function useHolidayLogs(touType: string) {
    const [holidayLogs, setHolidayLogs] = useRecoilState(holidayLogsState);
    const api = new TOUTariffAPI();
    const session = useRecoilValue(userSessionState);
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();
    const refreshHolidayLogs = useCallback(async (searchYear?: string) => {
        if (session) {
            try {
                showLoading(10);
                const result = await api.getHolidaysLog({  session, touType: touType, year: searchYear });
                // console.log('call tariff log api');
                if (result !== null) {
                    setHolidayLogs(result.context);
                    showSnackBar({ serverity: 'success', message: `Loading successful` });
                    hideLoading(10);
                }
                hideLoading(10);

            } catch (e) {
                hideLoading(10);
                showSnackBar({ serverity: 'error', message: `${e}` });
            }
        }
    }, [])

    const createHoliday = useCallback(async (data: IHoliday[]) => {
        if (session) {
            try {
                showLoading(10);
            const result = await api.putHolidays({  session, touType: touType, holidays: data });
            if (result) {
                hideLoading(10);
                showSnackBar({ serverity: 'success', message: `create holiday successful` });
                refreshHolidayLogs();
            }
        } catch (e) {
            hideLoading(10);
            showSnackBar({ serverity: 'error', message: `${e}` });
        }
        }
    }, [])

    useEffect(() => {
        if (!holidayLogs) {

            refreshHolidayLogs(dayjs().year().toString());

        }

    }, [holidayLogs, refreshHolidayLogs])

    return {
        holidayLogs,
        refreshHolidayLogs,
        createHoliday
    }


}
