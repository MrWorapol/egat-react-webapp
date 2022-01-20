import { egatHost, localGateway } from "../../constanst";
import { IPackage, IGridPackage } from "../../state/reference-data/tou-traff/grid-package-state";
import { IHoliday, IHolidayLogs } from "../../state/reference-data/tou-traff/holiday-state";
import { IServiceCharge, IServiceChargeLog } from "../../state/reference-data/tou-traff/tou-service-charge-state";
import { ITouTariffLog } from "../../state/reference-data/tou-traff/tou-tariff-log";
import { ITouTariff } from "../../state/reference-data/tou-traff/tou-tariff-state";
import { IUserSession } from "../../state/user-sessions";

interface IGetTOURequest {
    session: IUserSession,
}

interface IGetTOUResponse {
    context: ITouTariff[],
}

interface IGetServiceChargeRequest {
    session: IUserSession,
    touType: string,
}
interface IGetServiceChargeResponse {
    context: IServiceCharge,
}

interface IPutServiceChargeRequest {
    session: IUserSession,
    serviceCharge: IServiceCharge,
}

interface IGetServiceChargeLogsRequest {
    session: IUserSession,
    touType: string,
}
interface IGetServiceChargeLogsResponse {
    context: IServiceChargeLog[]
}

interface IGetTOULogsRequest {
    session: IUserSession,
    touType: string,
    title: string,
}

interface IGetTOULogsResponse {
    context: ITouTariffLog[],
}
interface IUpdateTOURequest {
    session: IUserSession,
    tariff: ITouTariff
}

interface IGetGridPackageResponse {
    context: IGridPackage,
}

interface IPutGridUsedPackageRequest {
    session: IUserSession,
    package: string,
}


interface IGetHolidayLogsRequest {
    session: IUserSession,
    touType: string,
    year?: string,
}

interface IGetHolidayLogsResponse {
    context: IHolidayLogs,
}

interface IPutHolidayRequest {
    session: IUserSession,
    touType: string,
    holidays: IHoliday[],
}

export default class TOUTariffAPI {
    private uri = localGateway;

    async getTOUtariff(req: IGetTOURequest): Promise<IGetTOUResponse | null> {
        const path = '/reference-data/tou-tariff-setting'
        const api = this.uri + path;
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }
        try {
            response = await fetch(api, {
                method: "GET",
                headers
            });
        } catch (e) {
            return null;
        }

        let result = await response.json();
        console.log(result);
        let content: IGetTOUResponse = {
            context: result
        }
        return content;

    }

    async putTOUTariff(req: IUpdateTOURequest): Promise<boolean> {
        const path = '/reference-data/tou-tariff-setting';
        const api = this.uri + path;
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }

        let body = JSON.stringify(req.tariff);
        console.log(`body data`);
        console.info(body);
        try {
            response = await fetch(api, {
                method: "PUT",
                headers,
                body
            });
        } catch (e) {
            throw Error(`UnExpected Handler Error`);
        }

        if (response.status === 204) {

            return true;
        } else {
            throw Error(`Error With Code: ${response.status}`);
        }

    }
    async getTOUtariffLog(req: IGetTOULogsRequest): Promise<IGetTOULogsResponse | null> {
        const path = `/reference-data/tou-tariff-setting/${req.touType}/${req.title}/log`
        const api = this.uri + path;
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }
        try {
            response = await fetch(api, {
                method: "GET",
                headers
            });
        } catch (e) {
            return null;
        }

        let result = await response.json();
        console.log(`get tariff logs`);
        console.log(result);
        let content: IGetTOULogsResponse = {
            context: result
        }
        return content;
    }
    async getServiceCharge(req: IGetServiceChargeRequest): Promise<IGetServiceChargeResponse | null> {
        // return {
        //     context: [{
        //         touType: "tou-1",
        //         bahtPerMonth: 83730010.18856233,
        //         effectiveDate: "occaecat aute fugiat culpa",
        //         effectiveTime: "reprehenderit nisi laboris sed sint"

        //     }]
        // }
        const path = `/reference-data/tou-tariff-setting/${req.touType}/service-charge`;
        const api = this.uri + path;
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }
        try {
            response = await fetch(api, {
                method: "GET",
                headers
            });
        } catch (e) {
            return null;
        }

        let result = await response.json();
        // console.log(result);
        let content: IGetServiceChargeResponse = {
            context: result
        }
        return content;
    }

    async putServiceCharge(req: IPutServiceChargeRequest): Promise<boolean> {
        const path = `/reference-data/tou-tariff-setting/${req.serviceCharge.touType}/service-charge`;
        const api = this.uri + path;
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }
        let body = JSON.stringify(req.serviceCharge);
        try {
            response = await fetch(api, {
                method: "PUT",
                headers,
                body
            });
        } catch (e) {
            throw Error(`UnExpected Handler Error`);
        }

        if (response.status === 204) {

            return true;
        } else {
            throw Error(`Error With Code: ${response.status}`);
        }
    }
    async getServiceChargeLog(req: IGetServiceChargeLogsRequest): Promise<IGetServiceChargeLogsResponse | null> {
        const path = `/reference-data/tou-tariff-setting/${req.touType}/service-charge/log`
        const api = this.uri + path;
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }
        try {
            response = await fetch(api, {
                method: "GET",
                headers
            });
        } catch (e) {
            return null;
        }

        let result = await response.json();

        let content: IGetServiceChargeLogsResponse = {
            context: result
        }
        return content;
    }
    async getGridPackage(req: IGetTOURequest): Promise<IGetGridPackageResponse | null> {
        const path = '/reference-data/tou-tariff-setting/grid-used-package'
        const api = this.uri + path;
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }
        try {
            response = await fetch(api, {
                method: "GET",
                headers
            });
        } catch (e) {
            return null;
        }

        let result = await response.json();
        let content: IGetGridPackageResponse = {
            context: result
        }
        return content;
    }

    async putGridUsedPackage(req: IPutGridUsedPackageRequest): Promise<boolean> {
        const path = `/reference-data/tou-tariff-setting/grid-used-package/${req.package}`;
        const api = this.uri + path;
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }
        try {
            response = await fetch(api, {
                method: "PUT",
                headers,
            });
        } catch (e) {
            throw Error(`UnExpected Handler Error`);
        }

        if (response.status === 204) {

            return true;
        } else {
            throw Error(`Error With Code: ${response.status}`);
        }
    }

    async getHolidaysLog(req: IGetHolidayLogsRequest): Promise<IGetHolidayLogsResponse | null> {
        const path = `/reference-data/tou-tariff-setting/${req.touType}/holidays`;
        const api = new URL(this.uri + path);
        if (req.year) {
            api.searchParams.append('year', req.year);

        }
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }
        try {
            response = await fetch(api.toString(), {
                method: "GET",
                headers
            });
        } catch (e) {
            return null;
        }

        let result = await response.json();

        let content: IGetHolidayLogsResponse = {
            context: result
        }
        return content;
    }
    async putHolidays(req: IPutHolidayRequest): Promise<boolean> {
        const path = `/reference-data/tou-tariff-setting/${req.touType}/holidays`;
        const api = this.uri + path;
        let response: Response;
        let session = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        }

        let body = JSON.stringify({
            touType: req.touType,
            holidays: req.holidays
        });

        try {
            response = await fetch(api, {
                method: "PUT",
                headers,
                body
            });
        } catch (e) {
            return false;
        }

        if (response.status === 204) {

            console.warn(response);
            return true;
        } else {
            return false;
        }
    }
}
