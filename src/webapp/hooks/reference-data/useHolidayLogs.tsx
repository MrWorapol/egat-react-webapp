import dayjs from 'dayjs';
import React, { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import TOUTariffAPI from '../../api/referenceData/TOUtariffAPI';
import { holidayLogsState, IHoliday } from '../../state/reference-data/tou-traff/holiday-state'
import { userSessionState } from '../../state/user-sessions';

export default function useHolidayLogs(touType: string) {
    const [holidayLogs, setHolidayLogs] = useRecoilState(holidayLogsState);
    const api = new TOUTariffAPI();
    const userSession = useRecoilValue(userSessionState);
    const refreshHolidayLogs = useCallback(async (searchYear?: string) => {
        if (userSession) {
            const result = await api.getHolidaysLog({ session: userSession, touType: touType, year: searchYear });
            // console.log('call tariff log api');
            if (result !== null) {
                setHolidayLogs(result.context);
            }
        }
    }, [])

    const createHoliday = useCallback(async (data: IHoliday[]) => {
        if (userSession) {
            const result = await api.putHolidays({ session: userSession, touType: touType, holidays: data });
            if (result) {
                refreshHolidayLogs();
            }
        }
    }, [])

    useEffect(() => {
        if (!holidayLogs) {

            refreshHolidayLogs(dayjs().year().toString());
            console.debug('call ge tariff logs');
            // console.info(wheelingCharge);
        }

    }, [holidayLogs, refreshHolidayLogs])

    return {
        holidayLogs,
        refreshHolidayLogs,
        createHoliday
    }


}
