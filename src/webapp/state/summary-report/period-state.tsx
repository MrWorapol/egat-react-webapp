import dayjs from "dayjs";
import { atom } from "recoil";

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);


interface IPeriod {
    startDate: Date,
    endDate?: Date,
    region: string, // ALL N E W S NE CENTER

}

export const periodState = atom<IPeriod>({
    key: 'periodState',
    default: {
        startDate: dayjs().tz('Asia/Bangkok').toDate(),
        region: 'all',
    }
})