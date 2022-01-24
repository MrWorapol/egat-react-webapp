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
    outBattery: number,
    excessPv: number,
    inGrid: number,

    inSolar: number,
    load: number,
}

interface IPowerResponse {
    meterId: string,
    timestamp: string,
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
            if (response.status === 200) {

                const rawData: IMeterAreaAndSite[] = await response.json();

                rawData.forEach((row: IMeterAreaAndSite) => {
                    console.log(rawData);

                    // let inRange = dayjs(row.registrationDate).isBefore(dayjs(period.endDate).endOf('day'));
                    // console.log(` inrange:${inRange} registrationDate:${dayjs(row.registrationDate).format('DD/MM/YYYY')} :${dayjs(period.endDate).format('DD/MM/YYYY')}`)
                    // if (inRange)
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
                }
                )
                return {
                    context: result
                };
            } else {
                throw Error(`CODE: ${response.status} \nMessage: ${response.statusText}`)
            }
        } catch (e) {
            console.log(e);
            throw Error(`การเชื่อมต่อเซิฟเวอร์ขัดข้อง`);
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
            if (response.status === 200) {
                const resultFromJSON: IGetAllUser[] = await response.json();
                console.log(`get ALL USER`);
                console.log(resultFromJSON);
                return {
                    context: resultFromJSON
                };
            }
            else {
                throw Error(`CODE: ${response.status} \nMessage: ${response.statusText}`)
            }
        } catch (e) {
            console.log(e);
            throw Error(`การเชื่อมต่อเซิฟเวอร์ขัดข้อง`);
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
            FROM "PowerOnEgatF"
            WHERE "__time" >= '2022-01-24T13:00:00.000Z'`,
            resultFormat: "object",
        }


        try {
            const response = await fetch(this.host, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            if (response.status === 200) {
                const responseJSON: IPowerResponse[] = await response.json();
                let powerData: IPowerData[] = [];
                let summaryPower: ISummaryPowerInfo = {
                    inBattery: 0,
                    outBattery: 0,
                    excessPv: 0,
                    inGrid: 0,
                    inSolar: 0,
                    load: 0,
                }
                if (period !== undefined) { //case query with period time
                    responseJSON.forEach((power: IPowerResponse) => {
                        let inRange = dayjs(power.timestamp).isAfter(dayjs(period.startDate).startOf('day'))
                            && dayjs(power.timestamp).isBefore(dayjs(period.endDate).endOf('day'))
                        if (inRange) {
                            powerData.push({
                                meterId: power.meterId,
                                timestamp: power.timestamp,
                                inSolar: Math.abs(power.inSolar) || 0,
                                inBattery: power.inBattery < 0 ? Math.abs(power.inBattery) : 0,
                                outBattery: power.inBattery > 0 ? power.inBattery : 0,
                                inGrid: power.inGrid < 0 ? Math.abs(power.inGrid) : 0, //inGrid <0 use too much
                                excessPv: power.inGrid > 0 ? power.inGrid : 0,//inGrid > 0 can sell
                                load: Math.abs(power.load) || 0
                            });
                            summaryPower.inBattery += +power.inBattery;
                            summaryPower.outBattery += power.inBattery < 0 ? Math.abs(power.inBattery) : 0;
                            summaryPower.excessPv += power.inGrid > 0 ? power.inGrid : 0;//inGrid > 0 an sell
                            summaryPower.inGrid += power.inGrid < 0 ? Math.abs(power.inGrid) : 0; //inGrid <0 use too much
                            summaryPower.inSolar += Math.abs(power.inSolar) || 0;
                            summaryPower.load += Math.abs(power.load) || 0
                        }
                    })
                } else {
                    responseJSON.forEach((power: IPowerResponse) => {
                        powerData.push({
                            meterId: power.meterId,
                            timestamp: power.timestamp,
                            inSolar: Math.abs(power.inSolar) || 0,
                            inBattery: power.inBattery < 0 ? Math.abs(power.inBattery) : 0,
                            outBattery: power.inBattery > 0 ? power.inBattery : 0,
                            inGrid: power.inGrid < 0 ? Math.abs(power.inGrid) : 0, //inGrid <0 use too much
                            excessPv: power.inGrid > 0 ? power.inGrid : 0,//inGrid > 0 can sell
                            load: Math.abs(power.load) || 0
                        });
                        summaryPower.inBattery += +power.inBattery < 0 ? Math.abs(power.inBattery) : 0; //dont sure inBattery + or -
                        summaryPower.outBattery += power.inBattery > 0 ? power.inBattery : 0; //dont sure inBattery + or -
                        summaryPower.excessPv += power.inGrid > 0 ? power.inGrid : 0;//inGrid > 0 an sell
                        summaryPower.inGrid += power.inGrid < 0 ? Math.abs(power.inGrid) : 0; //inGrid <0 use too much
                        summaryPower.inSolar += Math.abs(power.inSolar) || 0;
                        summaryPower.load += Math.abs(power.load) || 0
                    })
                }
                return {
                    powerData, //return array of power with all user meter. incase of period will return array power in range of date with all user meter
                    summaryPower,//summary power for graph
                };
            } else {
                throw Error(`CODE: ${response.status} \nMessage: ${response.statusText}`)
            }
        } catch (e) {
            console.log(e);
            throw Error(`การเชื่อมต่อเซิฟเวอร์ขัดข้อง`);
        }

    }

    async getForecastData(req: IGetForecastDataRequest): Promise<IGetForecastDataResponse | null> {
        const period = req?.period;
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
                WHERE "payload.meterId" = ${req.meterId} AND "__time" >= '2022-01-24T13:00:00.000Z'`,
            resultFormat: "object",
        }


        try {
            const response = await fetch(this.host, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            if (response.status === 200) {
                const rawData: IPowerResponse[] = await response.json();
                let powerDatas: IPowerData[] = [];
                if (period !== undefined) { //case query with period time
                    let scopeRange = period;
                    rawData.forEach((power: IPowerResponse) => {
                        let inRange = dayjs(power.timestamp).isAfter(dayjs(scopeRange.startDate).startOf('day'))
                            && dayjs(power.timestamp).isBefore(dayjs(scopeRange.endDate).endOf('day'))
                        if (inRange) {
                            powerDatas.push({
                                meterId: power.meterId,
                                timestamp: power.timestamp,
                                inSolar: Math.abs(power.inSolar) || 0,
                                inBattery: power.inBattery < 0 ? Math.abs(power.inBattery) : 0,
                                outBattery: power.inBattery > 0 ? power.inBattery : 0,
                                inGrid: power.inGrid < 0 ? Math.abs(power.inGrid) : 0, //inGrid <0 use too much
                                excessPv: power.inGrid > 0 ? power.inGrid : 0,//inGrid > 0 can sell
                                load: power.load,
                            });
                        }
                    })
                } else {
                    rawData.forEach((power: IPowerResponse) => {
                        powerDatas.push({
                            meterId: power.meterId,
                            timestamp: power.timestamp,
                            inSolar: Math.abs(power.inSolar) || 0,
                            inBattery: power.inBattery < 0 ? Math.abs(power.inBattery) : 0,
                            outBattery: power.inBattery > 0 ? power.inBattery : 0,
                            inGrid: power.inGrid < 0 ? Math.abs(power.inGrid) : 0, //inGrid <0 use too much
                            excessPv: power.inGrid > 0 ? power.inGrid : 0,//inGrid > 0 can sell
                            load: power.load,
                        });
                    })
                }

                return {
                    context: powerDatas
                }


            } else {
                throw Error(`CODE: ${response.status} \nMessage: ${response.statusText}`)
            }
        } catch (e) {
            console.log(e);
            throw Error(`การเชื่อมต่อเซิฟเวอร์ขัดข้อง`);
        }
    }

}
