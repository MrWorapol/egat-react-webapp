// import dayjs from 'dayjs';
// import React, { Component } from 'react'
// import { IMeterInfo } from '../../state/summary-report/user-report/location-site-state';
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
    // "payload.id": string,
    // "payload.locationCode": string,
    // "payload.meterName": string,
    // "payload.position.lat": string,
    // "payload.position.lng": string,
    // "payload.role": string,
    // "payload.substationEgat": string,
    // "payload.substationPeaMea": string,
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


interface IUserEnergyCollection {
    id: string,
    meterId: string,
    meterName: string,
    siteName: string,
    locationCode: string,
    role: string, //Aggregator | Prosumer | Consumer
    area: string,
    region: string,
    meterInfo: {
        peameaSubstation: string,
        egatSubStation: string,
        location: {
            lat: string,
            lng: string,
        }
        // energy: ,
    }

}


export class UserReportAPI {
    private endpoint = '';
    private druidEndpoint = 'http://localhost:3006/summary-report/druid';//druidEndpoint;


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
            // // const result: IGetMeterArea[] = mockMeterAreaDataColllection;
            // const rawMeterInfo = await this.getMeterInfo({ session: req.session, meterId: 1 });
            // if (rawMeterInfo === null) {
            //     throw new Error(`cannot get Meter Info.`);
            // }
            // console.log(`Meter Info`);
            // console.log(rawMeterInfo?.context);
            // rawData.map((row, i) => {
            //     // console.log(`parse meter ID from JSON`)
            //     let meterIds = JSON.parse(row['userId']);
            //     meterIds.map(async (meterId: string) => {
            //         // console.log(`Meter ID: ${meterId}`);
            //         if (rawMeterInfo && rawMeterInfo.context.length > 0) {
            //             let meterInfo = rawMeterInfo.context.find((meter) => {

            //                 return meter.meterId === meterId.toString();
            //             });
            //             if (meterInfo !== undefined) {
            //                 result.push({
            //                     id: meterInfo.userId,//row['payload.areaId'],
            //                     meterId,
            //                     area: row['area'],
            //                     locationCode: meterInfo.locationCode,
            //                     meterName: meterInfo.meterName,
            //                     role: meterInfo.role,
            //                     siteName: row['siteName'],
            //                     region: row['payload.regionName'],
            //                     address: {
            //                         lat: meterInfo.lat,
            //                         lng: meterInfo.lng,
            //                     },
            //                     peameaSubstation: meterInfo.substationPeaMea,
            //                     egatSubStation: meterInfo.substationEgat,
            //                 })
            //             }
            //         }
            //         // if (1) {
            //         //     result.push({
            //         //         id: meterId,//row['payload.areaId'],
            //         //         meterId,
            //         //         area: row['payload.area'],
            //         //         locationCode: meterId,//meterInfo.context['payload.locationCode'],
            //         //         meterName: meterId,//meterInfo.context['payload.meterName'],
            //         //         role: meterId,// meterInfo.context['payload.role'],
            //         //         siteName: row['payload.siteName'],
            //         //         region: row['payload.regionName'],
            //         //         address: {
            //         //             lat: meterId,// meterInfo.context['payload.position.lat'],
            //         //             lng: meterId,//meterInfo.context['payload.position.lng'],
            //         //         }

            //         //     })
            //         // }
            //     })
            // })
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

            query: `SELECT 
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

}
