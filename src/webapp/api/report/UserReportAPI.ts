import { druidEndpoint } from '../../constanst';
import { IPowerData } from '../../state/summary-report/user-report/power-data-state';
import { IEnergySummary } from '../../state/summary-report/user-report/user-chart-state';
import { IUserMeterInfo } from '../../state/summary-report/user-report/user-report-state';
import { IUserSession } from '../../state/user-sessions';
import { mockMeterAreaDataColllection } from './mockDataCollection';


interface IGetDruidBody {
    query: string,
    resultFormat: string,
}

interface IGetPowerInfosRequest {
    session: IUserSession,
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
    startDate: string,
    endDate: string,
    region: string,
    roles: string[],
    area: string,
}
interface IGetUserMeterInfoResponse {
    context: IUserMeterInfo[],
}
interface IMeterAreaAndSite {
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

interface IMeterInfo {
    active: string,
    lat: string,
    lng: string,
    locationCode: string,
    meterId: string,
    meterName: string,
    registrationDate: string,
    role: string,
    substationEgat: string,
    substationPeaMea: string,
    userId: string,
}
interface IGetMeterInfoRequest {
    session: IUserSession,
    meterId: number,
}
interface IGetMeterInfoResponse {
    context: IMeterInfo[],
}


interface IGetForecastDataRequest {
    session: IUserSession,
    meterId: string,

}

interface IGetForecastDataResponse {
    context: IPowerData[]
}

interface IForecastData {
    timestamp: number,
    inBattery: number,
    inGrid: number,
    inSolar: number,
    load: number,
}

export class UserReportAPI {
    private endpoint = '';
    private druidEndpoint = druidEndpoint;//druidEndpoint;


    // async getUserTable(req: IGetUserTableRequest): Promise<IGetUserTableResponse | null> {
    //     await this.getUserMeterInfo();
    //     return null;
    // }

    // async getLocationSite(req: IGetLocationSiteRequest): Promise<IGetLocationSiteResponse | null> {
    //     // return null;
    //     // return {
    //     //     context: {
    //     //         meterId: req.meterId,
    //     //         egatSubStation: 'กฟผ สฟ. CHW',
    //     //         peameaSubstation: ' กฟน. สต.แจ้งวัฒนะ(JWT) 115 kV BUS A2',
    //     //         location: {
    //     //             lat: '1112',
    //     //             lng: '434'
    //     //         },
    //     //         energy: {
    //     //             pv: 3.7,
    //     //             grid: 12,
    //     //             energyStorage: 20,
    //     //             energyLoad: 2,
    //     //             meterId: req.meterId,
    //     //         }
    //     //     }
    //     // };
    // }
    // async getUserTable(req: IGetUserTableRequest): Promise<IGetUserTableResponse | null> {

    async getUserMeterInfo(req: IGetUserMeterInfoRequest): Promise<IGetUserMeterInfoResponse | null> {
        // console.log(`call druid api`);
        let result: IUserMeterInfo[] = [];
        const body: IGetDruidBody = {
            "query": `SELECT 
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
            LATEST("payload.userTypeName",50) FILTER (WHERE "payload.userTypeName" is not null) as userTypeName
          FROM "MeterInfoDataTest2"
          GROUP BY "payload.id") as info
          INNER JOIN "MeterSiteDataTest" as site
          ON info."userTypeName" = site."payload.userTypeName"
          WHERE info."active" = true`,
            "resultFormat": "object"
        }
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }
        try {
            const response = await fetch(this.druidEndpoint, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })

            console.log(response);
            if (response.status !== 200) {
                throw Error(`CODE: ${response.status} \nMessage: ${response.statusText}`)
            }
            const rawData: IMeterAreaAndSite[] = await response.json();
            // console.log(`MeterArea Join Site`)
            // // console.warn(rawData)
            // console.log(rawData);

            rawData.map((row: IMeterAreaAndSite) => {
                result.push({
                    id: row.userId,//row['payload.areaId'],
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
            })
            return {
                context: result
            };
        } catch (e) {
            console.log(e);
            
            return null;
        }

    }


    async getMeterInfo(req: IGetMeterInfoRequest): Promise<IGetMeterInfoResponse | null> {

        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${req.session.accessToken}`,
        }

        const body: IGetDruidBody = {
            query: `SELECT "payload.id" as meterId,
            LATEST("payload.locationCode",10) FILTER (WHERE "payload.locationCode" IS NOT NULL) as locationCode,
            LATEST("payload.meterName",100) FILTER (WHERE "payload.meterName" IS NOT NULL) as meterName,
            LATEST("payload.position.lat",10) FILTER (WHERE "payload.position.lat" IS NOT NULL) as lat,
            LATEST("payload.position.lng",10) FILTER (WHERE "payload.position.lng" IS NOT NULL) as lng,
            LATEST("payload.substationEgat",10) FILTER (WHERE "payload.substationEgat" IS NOT NULL) as substationEgat,
            LATEST("payload.substationPeaMea",10) FILTER (WHERE "payload.substationPeaMea" IS NOT NULL) as substationPeaMea,
            LATEST("payload.role",10) FILTER (WHERE "payload.role" IS NOT NULL) as role,
            LATEST("payload.active",10) FILTER (WHERE "payload.active" IS NOT NULL) as active,
            LATEST("payload.registrationDate",50) FILTER (WHERE "payload.registrationDate" IS NOT NULL) as registrationDate,
            LATEST("payload.userId",30) FILTER (WHERE "payload.userId" IS NOT NULL) as userId
          FROM "MeterInfoDataTest"
          GROUP BY "payload.id"`,
            resultFormat: "object",
        }


        try {
            const response = await fetch(this.druidEndpoint, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const rawData: IMeterInfo[] = await response.json();


            return {
                context: rawData,
            };
        } catch (e) {
            return null;
        }
    }

    async getPowerInfos(req: IGetPowerInfosRequest): Promise<IGetPowerInfosResponse | null> {
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
            FROM "Power"`,
            resultFormat: "object",
        }


        try {
            const response = await fetch(this.druidEndpoint, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const rawData: IPowerData[] = await response.json();
            const result = {
                inBattery: 0,
                inGrid: 0,
                inSolar: 0,
                load: 0,
            }
            rawData.map((power: ISummaryPowerInfo) => {
                result.inBattery += power.inBattery;
                result.inGrid += power.inGrid;
                result.inSolar += power.inSolar;
                result.load += power.load;
            })
            return {
                powerData: rawData,
                summaryPower: result,
            };
        } catch (e) {
            return null;
        }
    }

    async getForecastData(req: IGetForecastDataRequest): Promise<IGetForecastDataResponse | null> {
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
                FROM "ForecastDemoTest"
                WHERE "payload.meterId" = ${+req.meterId}`,
            resultFormat: "object",
        }


        try {
            const response = await fetch(this.druidEndpoint, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const resultFromJSON: IPowerData[] = await response.json();
            console.log(`get Power Forecast By MeterId:${req.meterId} and Type: ${typeof (+req.meterId)}`);
            console.log(resultFromJSON);

            return {
                context: resultFromJSON
            };
        } catch (e) {
            return null;
        }
    }

}
