import { druidHost } from '../../constanst';
import { IGetAllUser } from '../../state/dashboard/dashboard-state';
import { IPeriod } from '../../state/summary-report/period-state';
import { IPowerData } from '../../state/summary-report/user-report/power-data-state';
import { IUserMeterInfo } from '../../state/summary-report/user-report/user-report-state';
import { IUserSession } from '../../state/user-sessions';

import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

interface IGetDruidBody {
    query: string,
    resultFormat: string,
}

interface IGetPowerInfosRequest {
    session: IUserSession,
    period?: IPeriod,
}
interface IGetPowerInfosResponse {
    powerData: IPowerData[],
    summaryPower: ISummaryPowerInfo,


}

interface ISummaryPowerInfo {
    inBattery: number,
    inGrid: number,
    inSolar: number,
    load: number,
}

interface IGetUserMeterInfoRequest {
    session: IUserSession,
    period: IPeriod,
    roles: string[],
    area: string,
}
interface IGetAllUserRequest {
    session: IUserSession,
}
interface IGetAllUserResponse {
    context: IGetAllUser[],
}

interface IGetUserMeterInfoResponse {
    context: IUserMeterInfo[],
}
interface IMeterAreaAndSite {
    "registrationDate": string,
    "meterId": string,
    "userId": string,
    "meterName": string,
    "role": string,
    "locationCode": string,
    "lat": string,
    "lng": string,
    "substationEgat": string,
    "substationPeaMea": string,
    "siteName": string,
    "area": string,
    "regionName": string,
}


interface IGetForecastDataRequest {
    session: IUserSession,
    meterId: string,
    period?: IPeriod,
}

interface IGetForecastDataResponse {
    context: IPowerData[]
}


export class UserAndEnergyReportAPI {
    private host = druidHost;//druidEndpoint;


    async getUserMeterInfo(req: IGetUserMeterInfoRequest): Promise<IGetUserMeterInfoResponse | null> {
        const { period } = req;
        let result: IUserMeterInfo[] = [];
        const body: IGetDruidBody = {
            "query": `SELECT 
            "registrationDate",
            "meterId",
            "userId",
            "meterName",
            "role",
            "locationCode",
            "lat",
            "lng",
            "substationEgat",
            "substationPeaMea",
            "payload.siteName" as "siteName",
            "payload.group" as "area",
            "payload.regionName" as "regionName"
          FROM (SELECT "payload.id" as meterId,
            LATEST("payload.locationCode",10) FILTER (WHERE "payload.locationCode" IS NOT NULL) as locationCode,
            LATEST("payload.meterName",100) FILTER (WHERE "payload.meterName" IS NOT NULL) as meterName,
            LATEST("payload.position.lat",10) FILTER (WHERE "payload.position.lat" IS NOT NULL) as lat,
            LATEST("payload.position.lng",10) FILTER (WHERE "payload.position.lng" IS NOT NULL) as lng,
            LATEST("payload.substationEgat",10) FILTER (WHERE "payload.substationEgat" IS NOT NULL) as substationEgat,
            LATEST("payload.substationPeaMea",10) FILTER (WHERE "payload.substationPeaMea" IS NOT NULL) as substationPeaMea,
            LATEST("payload.role",10) FILTER (WHERE "payload.role" IS NOT NULL) as role,
            LATEST("payload.active",10) FILTER (WHERE "payload.active" IS NOT NULL) as active,
            LATEST("payload.registrationDate",30) FILTER (WHERE "payload.registrationDate" IS NOT NULL) as registrationDate,
            LATEST("payload.userId",50) FILTER (WHERE "payload.userId" IS NOT NULL) as userId,
            LATEST("payload.userTypeName",50) FILTER (WHERE "payload.userTypeName" IS NOT NULL) as userTypeName
          FROM "MeterInfoOnEgat"
          GROUP BY "payload.id") as info
          INNER JOIN "MeterSiteDataTest" as site
          ON info."userTypeName" = site."payload.userTypeName"
          WHERE info."active" = true`,
            "resultFormat": "object"
        }
        //local: MeterInfoDataTest2 , egat : FROM MeterInfoOnEgat
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }
        try {
            const response = await fetch(this.host, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            // console.log(`userMeter Info response`);
            if (response.status !== 200) {
                throw Error(`CODE: ${response.status} \nMessage: ${response.statusText}`)
            }
            const rawData: IMeterAreaAndSite[] = await response.json();

            // console.log(rawData);
            // console.log(`diff Date select Call ${dayjs(period.startDate).startOf('day').toDate()}\t${(dayjs(period.endDate).startOf('day').toDate())}`);
            // console.log(`diff start and end ${dayjs(period.endDate).startOf('day').isSame(dayjs(period.startDate).startOf('day'))}`);
            // console.log(`case today query ${dayjs(period.startDate).startOf('day').isSame(dayjs().startOf('day'))}`);
            if (dayjs(period.endDate).startOf('day').isSame(dayjs(period.startDate).startOf('day')) // if same day
                && dayjs(period.startDate).startOf('day').isSame(dayjs().startOf('day'))) {//and today get all users
                rawData.forEach((row: IMeterAreaAndSite) => {
                    if (period.region === 'all' || period.region === row.regionName) {
                        result.push({
                            id: row.userId,
                            meterId: row.meterId,
                            area: row.area,
                            locationCode: row.locationCode,
                            meterName: row.meterName,
                            role: row.role,
                            siteName: row.siteName,
                            region: row.regionName,
                            address: {
                                lat: row.lat,
                                lng: row.lng,
                            },
                            peameaSubstation: row.substationPeaMea,
                            egatSubStation: row.substationEgat,
                        })
                    }
                })
            } else { //case period time

                rawData.forEach((row: IMeterAreaAndSite) => {
                    // console.log(row);
                    let inRange = dayjs(row.registrationDate).isBefore(dayjs(period.endDate).endOf('day'));
                    // console.log(` inrange:${inRange} registrationDate:${dayjs(row.registrationDate).format('DD/MM/YYYY')} :${dayjs(period.endDate).format('DD/MM/YYYY')}`)
                    if (inRange)
                        if (period.region === 'all' || period.region === row.regionName) {

                            result.push({
                                id: row.userId,
                                meterId: row.meterId,
                                area: row.area,
                                locationCode: row.locationCode,
                                meterName: row.meterName,
                                role: row.role,
                                siteName: row.siteName,
                                region: row.regionName,
                                address: {
                                    lat: row.lat,
                                    lng: row.lng,
                                },
                                peameaSubstation: row.substationPeaMea,
                                egatSubStation: row.substationEgat,
                            })
                        }
                })
            }
            return {
                context: result
            };
        } catch (e) {
            console.log(e);

            return null;
        }

    }

    async getAllUser(req: IGetAllUserRequest): Promise<IGetAllUserResponse | null> {
        const body: IGetDruidBody = {
            "query": `SELECT 
            "meterId",
            "userId",
            "meterName",
            "role",
            "locationCode",
            "active",
            "payload.siteName" as "siteName",
            "payload.group" as "area",
            "registrationDate",
            "payload.regionName" as "regionName"
          FROM (SELECT "payload.id" as meterId,
            LATEST("payload.locationCode",10) FILTER (WHERE "payload.locationCode" IS NOT NULL) as locationCode,
            LATEST("payload.meterName",100) FILTER (WHERE "payload.meterName" IS NOT NULL) as meterName,
            LATEST("payload.position.lat",10) FILTER (WHERE "payload.position.lat" IS NOT NULL) as lat,
            LATEST("payload.position.lng",10) FILTER (WHERE "payload.position.lng" IS NOT NULL) as lng,
            LATEST("payload.substationEgat",10) FILTER (WHERE "payload.substationEgat" IS NOT NULL) as substationEgat,
            LATEST("payload.substationPeaMea",10) FILTER (WHERE "payload.substationPeaMea" IS NOT NULL) as substationPeaMea,
            LATEST("payload.role",10) FILTER (WHERE "payload.role" IS NOT NULL) as role,
            LATEST("payload.active",10) FILTER (WHERE "payload.active" IS NOT NULL) as active,
            LATEST("payload.registrationDate",30) FILTER (WHERE "payload.registrationDate" IS NOT NULL) as registrationDate,
            LATEST("payload.userId",50) FILTER (WHERE "payload.userId" IS NOT NULL) as userId,
            LATEST("payload.userTypeName",50) FILTER (WHERE "payload.userTypeName" IS NOT NULL) as userTypeName
          FROM "MeterInfoOnEgat"
          GROUP BY "payload.id") as info
          INNER JOIN "MeterSiteDataTest" as site
          ON info."userTypeName" = site."payload.userTypeName"`,
            "resultFormat": "object"
        }
        //local: MeterInfoDataTest2 , egat : FROM MeterInfoOnEgat
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }
        try {
            const response = await fetch(this.host, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })

            // console.log(response);
            if (response.status !== 200) {
                throw Error(`CODE: ${response.status} \nMessage: ${response.statusText}`)
            }
            const resultFromJSON: IGetAllUser[] = await response.json();
            console.log(`get ALL USER`);
            console.log(resultFromJSON);
            return {
                context: resultFromJSON
            };
        } catch (e) {
            console.log(e);

            return null;
        }

    }

    async getPowerInfos(req: IGetPowerInfosRequest): Promise<IGetPowerInfosResponse | null> {
        const period = req?.period;
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }

        const body: IGetDruidBody = {

            query: `SELECT DISTINCT
            "__time" as "timestamp",
            "payload.id",
            "payload.inBattery" as "inBattery", 
            "payload.inGrid" as "inGrid", 
            "payload.inSolar" as "inSolar", 
            "payload.load" as "load",
            "payload.meterId" as "meterId"
            FROM "PowerOnEgatF"`,
            resultFormat: "object",
        }


        try {
            const response = await fetch(this.host, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const rawData: IPowerData[] = await response.json();
            if (period !== undefined) { //case query with period time
                let powerArray: IPowerData[] = [];
                let summaryPower = {
                    inBattery: 0,
                    inGrid: 0,
                    inSolar: 0,
                    load: 0,
                }
                if (dayjs(period.endDate).startOf('day').isSame(dayjs(period.startDate).startOf('day')) // if start = end  and isToday return all 
                    && dayjs(period.startDate).startOf('day').isSame(dayjs().startOf('day'))) {//is startday = Today
                    rawData.forEach((power: ISummaryPowerInfo) => {
                        summaryPower.inBattery += +power.inBattery;
                        summaryPower.inGrid += +power.inGrid;
                        summaryPower.inSolar += +power.inSolar;
                        summaryPower.load += +power.load;
                    })
                    powerArray = [...rawData];
                } else { //case from start day at 00:00 to end day at 23:59
                    let scopeRange = period;
                    rawData.forEach((power: IPowerData) => {
                        let inRange = dayjs(power.timestamp).isAfter(dayjs(scopeRange.startDate).startOf('day'))
                            && dayjs(power.timestamp).isBefore(dayjs(scopeRange.endDate).endOf('day'))
                        if (inRange) {
                            powerArray.push(power);
                            summaryPower.inBattery += +power.inBattery;
                            summaryPower.inGrid += +power.inGrid;
                            summaryPower.inSolar += +power.inSolar;
                            summaryPower.load += +power.load;
                        }
                    })
                }
                console.log(`summaryPower`);
                console.log(`${summaryPower.inBattery}`)
                return {
                    powerData: powerArray, //return array of power with all user meter. incase of period will return array power in range of date with all user meter
                    summaryPower: summaryPower,//summary power for graph
                };
            }
            const result = {
                inBattery: 0,
                inGrid: 0,
                inSolar: 0,
                load: 0,
            }
            rawData.forEach((power: ISummaryPowerInfo) => {
                result.inBattery += +power.inBattery;
                result.inGrid += +power.inGrid;
                result.inSolar += +power.inSolar;
                result.load += +power.load;
            })
            return { // incase of dashboard get data
                powerData: rawData,
                summaryPower: result,
            };
        } catch (e) {
            return null;
        }
    }

    async getForecastData(req: IGetForecastDataRequest): Promise<IGetForecastDataResponse | null> {
        let period = req?.period;
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }

        const body: IGetDruidBody = {

            query: `SELECT DISTINCT "__time" as "timestamp",
                "payload.meterId" as "meterId", 
                "payload.inBattery" as "inBattery",
                "payload.inGrid" as "inGrid",
                "payload.inSolar" as "inSolar",
                "payload.load" as "load" 
                FROM "ForecastOnEgatF"
                WHERE "payload.meterId" = ${+req.meterId}`,
            resultFormat: "object",
        }


        try {
            const response = await fetch(this.host, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const rawData: IPowerData[] = await response.json();
            // console.log(`get Power Forecast By MeterId:${req.meterId} and Type: ${typeof (+req.meterId)}`);
            // console.log(resultFromJSON);
            if (period !== undefined) { //case query with period time
                let powerArray: IPowerData[] = [];

                if (dayjs(period.endDate).startOf('day').isSame(dayjs(period.startDate).startOf('day')) // if start = end  and isToday return all 
                    && dayjs(period.startDate).startOf('day').isSame(dayjs().startOf('day'))) {//is startday = Today
                    powerArray = [...rawData];
                } else { //case from start day at 00:00 to end day at 23:59
                    let scopeRange = period;
                    rawData.forEach((power: IPowerData) => {
                        let inRange = dayjs(power.timestamp).isAfter(dayjs(scopeRange.startDate).startOf('day'))
                            && dayjs(power.timestamp).isBefore(dayjs(scopeRange.endDate).endOf('day'))
                        if (inRange) {
                            powerArray.push(power);
                        }
                    })
                }
                return {
                    context: powerArray, //return array of power with all user meter. incase of period will return array power in range of date with all user meter

                };
            } else {
                return {
                    context: rawData
                };
            }
        } catch (e) {
            return null;
        }
    }

}
