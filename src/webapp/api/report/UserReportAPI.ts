// import dayjs from 'dayjs';
// import React, { Component } from 'react'
import { ILocationSite } from '../../state/summary-report/user-report/location-site-state';
import { IUserChart } from '../../state/summary-report/user-report/user-chart-state';
import { meterInfo } from '../../state/summary-report/user-report/user-report-state';
import { IUserSession } from '../../state/user-sessions';

interface IGetUserReportRequest {
    startDate: string,
    endDate: string,
    region: string,

}
interface IGetUserReportResponse {
    context: IUserChart,

}

interface IGetUserTableRequest {
    session?: IUserSession,
    startDate: string,
    endDate: string,
    region: string,
    roles: string[],
    area: string,
}

interface IGetUserTableResponse {
    context: meterInfo[],
}
interface IGetLocationSiteRequest {
    session?: IUserSession,
    meterId: string,
}
interface IGetLocationSiteResponse {
    context: ILocationSite
}

interface IGetDruidRequest {
    session: IUserSession,
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
    async getUserTable(req: IGetUserTableRequest): Promise<IGetUserTableResponse | null> {
        let roles = '';
        if (req.roles.length === 0) {
            roles = 'all'
        }
        console.log(req);
        return {
            context: [
                {
                    meterId: '0e00300',
                    meterName: 'Aggregator 1',
                    area: '3 Villages',
                    locationCode: 'mea1',
                    role: 'aggregator',
                    siteName: 'VENUE FLOW'
                },
                {
                    meterId: '0e00301',
                    meterName: 'Aggregator 2',
                    area: '3 Villages',
                    locationCode: 'mea1',
                    role: 'aggregator',
                    siteName: 'VENUE FLOW'
                },
                {
                    meterId: '0e00302',
                    meterName: 'Aggregator 3',
                    area: '3 Villages',
                    locationCode: 'mea1',
                    role: 'aggregator',
                    siteName: 'VENUE FLOW'
                }
            ]
        }
    }

    async getLocationSite(req: IGetLocationSiteRequest): Promise<IGetLocationSiteResponse | null> {
        // return null;
        return {
            context: {
                meterId: req.meterId,
                egatSubStation: 'กฟผ สฟ. CHW',
                peameaSubstation: ' กฟน. สต.แจ้งวัฒนะ(JWT) 115 kV BUS A2',
                location: {
                    lat: '1112',
                    lng: '434'
                },
                energy: {
                    pv: 3.7,
                    grid: 12,
                    energyStorage: 20,
                    energyLoad: 2,
                    meterId: req.meterId,
                }
            }
        };
    }

    async getDruidData(req: IGetDruidRequest) {
        console.log(`call druid api`);
        const body = {
            "query": `SELECT site."payload.areaId", 
            site."payload.id", 
            site."payload.siteName", 
            area."payload.area", 
            area."payload.meterId", 
            area."payload.regionName"
            FROM "MeterSiteTest" 
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
            const result = await fetch(this.druidEndpoint, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            })
            const context = result.json();
            console.log(`call druid successful`)
            console.log(context);
            return context;
        } catch (e) {
            return false;
        }

    }
}
