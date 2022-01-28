import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

//https://day.js.org/docs/en/plugin/is-between reference to use isBetween 

export default dayjs ; 