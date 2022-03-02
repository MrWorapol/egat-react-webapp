import { druidHost } from '../../constanst';
import { IGetAllUser } from '../../state/dashboard/dashboard-state';
import { IPeriod } from '../../state/summary-report/period-state';
import { IPowerData } from '../../state/summary-report/user-report/power-data-state';
import { IUserMeterInfo } from '../../state/summary-report/user-report/user-report-state';
import { IUserSession } from '../../state/user-sessions';
import dayjs from '../../utils/customDayjs';

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
            LATEST(CAST("payload.position.lat" as VARCHAR),30) FILTER (WHERE "payload.position.lat" IS NOT NULL) as lat,
            LATEST(CAST("payload.position.lng"as VARCHAR),30) FILTER (WHERE "payload.position.lng" IS NOT NULL) as lng,
            LATEST("payload.substationEgat",10) FILTER (WHERE "payload.substationEgat" IS NOT NULL) as substationEgat,
            LATEST("payload.substationPeaMea",10) FILTER (WHERE "payload.substationPeaMea" IS NOT NULL) as substationPeaMea,
            LATEST("payload.role",10) FILTER (WHERE "payload.role" IS NOT NULL) as role,
            LATEST("payload.active",10) FILTER (WHERE "payload.active" IS NOT NULL) as active,
            LATEST("payload.registrationDate",30) FILTER (WHERE "payload.registrationDate" IS NOT NULL) as registrationDate,
            LATEST("payload.userId",50) FILTER (WHERE "payload.userId" IS NOT NULL) as userId,
            LATEST("payload.userTypeName",50) FILTER (WHERE "payload.userTypeName" IS NOT NULL) as userTypeName
          FROM "tmpMeterInfo"
          GROUP BY "payload.id") as info
          INNER JOIN "MeterSiteDataTest" as site
          ON info."userTypeName" = site."payload.userTypeName"
          WHERE info."active" = true AND info."meterId" != ''`,
            "resultFormat": "object"
        }
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

            if (response.status === 200) {

                const rawData: IMeterAreaAndSite[] = await response.json();

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
            LATEST(CAST("payload.position.lat" as VARCHAR),30) FILTER (WHERE "payload.position.lat" IS NOT NULL) as lat,
            LATEST(CAST("payload.position.lng"as VARCHAR),30) FILTER (WHERE "payload.position.lng" IS NOT NULL) as lng,
            LATEST("payload.substationEgat",10) FILTER (WHERE "payload.substationEgat" IS NOT NULL) as substationEgat,
            LATEST("payload.substationPeaMea",10) FILTER (WHERE "payload.substationPeaMea" IS NOT NULL) as substationPeaMea,
            LATEST("payload.role",10) FILTER (WHERE "payload.role" IS NOT NULL) as role,
            LATEST("payload.active",10) FILTER (WHERE "payload.active" IS NOT NULL) as active,
            LATEST("payload.registrationDate",30) FILTER (WHERE "payload.registrationDate" IS NOT NULL) as registrationDate,
            LATEST("payload.userId",50) FILTER (WHERE "payload.userId" IS NOT NULL) as userId,
            LATEST("payload.userTypeName",50) FILTER (WHERE "payload.userTypeName" IS NOT NULL) as userTypeName
          FROM "tmpMeterInfo"
          GROUP BY "payload.id") as info
          INNER JOIN "MeterSiteDataTest" as site
          ON info."userTypeName" = site."payload.userTypeName"
          WHERE info."meterId" != ''`,
            "resultFormat": "object"
        }
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

            if (response.status === 200) {
                const resultFromJSON: IGetAllUser[] = await response.json();
                console.log(`meter ID`)
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
            FROM "tmpPower"
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
                responseJSON.forEach((power: IPowerResponse) => {
                    let inRange = false;
                    if (period !== undefined) { //case query with period time
                        inRange = dayjs(power.timestamp).isBetween(dayjs(period.startDate), dayjs(period.endDate), null, '[]');
                    }

                    if (period === undefined || inRange) { //
                        powerData.push({
                            meterId: power.meterId,
                            timestamp: power.timestamp,
                            inSolar: Math.abs(power.inSolar) || 0,
                            outBattery: power.inBattery > 0 ? power.inBattery : 0,
                            inBattery: power.inBattery < 0 ? Math.abs(power.inBattery) : 0,
                            inGrid: power.inGrid > 0 ? power.inGrid : 0,//inGrid > 0 can sell
                            excessPv: power.inGrid < 0 ? Math.abs(power.inGrid) : 0, //inGrid <0 use too much
                            load: Math.abs(power.load) || 0
                        });
                        summaryPower.outBattery += power.inBattery > 0 ? power.inBattery : 0;
                        summaryPower.inBattery += +power.inBattery < 0 ? Math.abs(power.inBattery) : 0; //dont sure inBattery + or -
                        summaryPower.inGrid += power.inGrid > 0 ? power.inGrid : 0;//inGrid > 0 an sell
                        summaryPower.excessPv += power.inGrid < 0 ? Math.abs(power.inGrid) : 0; //inGrid <0 use too much
                        summaryPower.inSolar += Math.abs(power.inSolar) || 0;
                        summaryPower.load += Math.abs(power.load) || 0
                    }
                })
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
                FROM "tmpForecast"
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

                rawData.forEach((power: IPowerResponse) => {
                    let inRange = false;
                    if (period !== undefined) { //case query with period time
                        inRange = dayjs(power.timestamp).isBetween(dayjs(period.startDate), dayjs(period.endDate), null, '[]');
                    }
                    if (period === undefined || inRange) {
                        powerDatas.push({
                            meterId: power.meterId,
                            timestamp: power.timestamp,
                            inSolar: Math.abs(power.inSolar) || 0,
                            outBattery: power.inBattery > 0 ? power.inBattery : 0,
                            inBattery: power.inBattery < 0 ? Math.abs(power.inBattery) : 0,
                            inGrid: power.inGrid > 0 ? power.inGrid : 0,
                            excessPv: power.inGrid < 0 ? Math.abs(power.inGrid) : 0,
                            load: power.load,
                        });
                    }
                })
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
