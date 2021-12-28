// import dayjs from 'dayjs';
// import React, { Component } from 'react'
// import { IMeterInfo } from '../../state/summary-report/user-report/location-site-state';
import { IUserChart } from '../../state/summary-report/user-report/user-chart-state';
import { IUserMeterInfo } from '../../state/summary-report/user-report/user-report-state';
import { IUserSession } from '../../state/user-sessions';
import { mockMeterAreaDataColllection } from './mockDataCollection';


interface IGetDruidBody {
    query: string,
    resultFormat: string,
}

interface IGetUserReportRequest {
    startDate: string,
    endDate: string,
    region: string,

}
interface IGetUserReportResponse {
    context: IUserChart,

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
    "payload.areaId": string,
    "payload.id": string,
    "payload.siteName": string,
    "payload.area": string,
    "payload.meterId": string,
    "payload.regionName": string,
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

    async getUserReport(req: IGetUserReportRequest): Promise<IGetUserReportResponse | null> {
        return {
            context: {
                energy: { pv: 1, grid: 12, energyStorage: 12.33, energyConsumptions: 14 },
                user: { prosumer: 12, noUser: 40, consumer: 22, aggregator: 23 }
            }
        }
    }
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
            "query": `SELECT DISTINCT site."payload.areaId", 
            site."payload.id", 
            site."payload.siteName", 
            area."payload.area", 
            area."payload.meterId", 
            area."payload.regionName"
            FROM "MeterSiteDemoTest" 
            as site INNER JOIN "MeterAreaTest" 
            as area ON site."payload.areaId" = area."payload.id"`,
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
            console.log(`MeterArea Join Site`)
            // console.warn(rawData)
            console.log(rawData);

            // // const result: IGetMeterArea[] = mockMeterAreaDataColllection;
            const rawMeterInfo = await this.getMeterInfo({ session: req.session, meterId: 1 });
            if(rawMeterInfo === null){
                throw new Error(`cannot get Meter Info.`);
            }
            console.log(`Meter Info`);
            console.log(rawMeterInfo?.context);
            rawData.map((row, i) => {
                // console.log(`parse meter ID from JSON`)
                let meterIds = JSON.parse(row['payload.meterId']);
                meterIds.map(async (meterId: string) => {
                    // console.log(`Meter ID: ${meterId}`);
                    if (rawMeterInfo && rawMeterInfo.context.length >0) {
                        let meterInfo = rawMeterInfo.context.find((meter) => {
                            
                            return meter.meterId === meterId.toString();
                        });
                        if (meterInfo !== undefined) {
                            result.push({
                                id: meterInfo.userId,//row['payload.areaId'],
                                meterId,
                                area: row['payload.area'],
                                locationCode: meterInfo.locationCode,
                                meterName: meterInfo.meterName,
                                role: meterInfo.role,
                                siteName: row['payload.siteName'],
                                region: row['payload.regionName'],
                                address: {
                                    lat: meterInfo.lat,
                                    lng: meterInfo.lng,
                                },
                                peameaSubstation: meterInfo.substationPeaMea,
                                egatSubStation: meterInfo.substationEgat,
                            })
                        }
                    }
                    // if (1) {
                    //     result.push({
                    //         id: meterId,//row['payload.areaId'],
                    //         meterId,
                    //         area: row['payload.area'],
                    //         locationCode: meterId,//meterInfo.context['payload.locationCode'],
                    //         meterName: meterId,//meterInfo.context['payload.meterName'],
                    //         role: meterId,// meterInfo.context['payload.role'],
                    //         siteName: row['payload.siteName'],
                    //         region: row['payload.regionName'],
                    //         address: {
                    //             lat: meterId,// meterInfo.context['payload.position.lat'],
                    //             lng: meterId,//meterInfo.context['payload.position.lng'],
                    //         }

                    //     })
                    // }
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
            // query: `SELECT 
            // "payload.id",            
            // "payload.locationCode",
            // "payload.meterName",
            // "payload.position.lat",
            // "payload.position.lng",
            // "payload.role",
            // "payload.substationEgat",
            // "payload.substationPeaMea",
            // FROM "MeterInfoTest2"
            // WHERE "payload.id" = ${req.meterId}`,
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

            console.log(`call meter ID  successful`)
            // console.log(context);
            return {
                context: rawData,
            };
        } catch (e) {
            return null;
        }
    }
}
