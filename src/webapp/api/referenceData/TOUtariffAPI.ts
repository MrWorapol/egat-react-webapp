import { refApi } from "../../constanst";
import { IPackage, IGridPackage } from "../../state/reference-data/tou-traff/grid-package-state";
import { IHoliday, IHolidayLogs } from "../../state/reference-data/tou-traff/holiday-state";
import { IServiceCharge } from "../../state/reference-data/tou-traff/tou-service-charge-state";
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
    context: IServiceCharge[],
}

interface IPutServiceChargeRequest {
    session: IUserSession,
    serviceCharge: IServiceCharge,
}

interface IGetServiceChargeLogsRequest {
    session: IUserSession,
    touType: string,
}


interface IGetTOULogsRequest {
    session: IUserSession,
    touType: string,
    title: string,
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
    private endpoint = refApi;

    async getTOUtariff(req: IGetTOURequest): Promise<IGetTOUResponse | null> {
        const path = '/reference-data/tou-tariff-setting'
        const api = this.endpoint + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
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
        // const result: IGetTOUResponse = {
        //     context: [
        //         {
        //             id: "tou-1-off-peak-holiday",
        //             touType: "tou-1",
        //             title: "Off Peak (วันหยุด)",
        //             startTime: "0:00",
        //             endTime: "24:00",
        //             bahtPerKWh: 2.6037,
        //             effectiveDate: "25/08/2021",
        //             effectiveTime: "00:00",
        //         },
        //         {
        //             id: "tou-1-off-peak-mon-fri",
        //             touType: "tou-1",
        //             title: "Off Peak (Mon-Fri)",
        //             startTime: "22:00",
        //             endTime: "9:00",
        //             bahtPerKWh: 2.6037,
        //             effectiveDate: "25/08/2021",
        //             effectiveTime: "00:00",
        //         },
        //         {
        //             id: "tou-1-off-peak-sat-sun",
        //             touType: "tou-1",
        //             title: "Off Peak (Sat-Sun)",
        //             startTime: "0:00",
        //             endTime: "24:00",
        //             bahtPerKWh: 2.6037,
        //             effectiveDate: "25/08/2021",
        //             effectiveTime: "00:00",
        //         },
        //         {
        //             id: "tou-1-peak-mon-fri",
        //             touType: "tou-1",
        //             title: "Peak (Mon-Fri)",
        //             startTime: "9:00",
        //             endTime: "22:00",
        //             bahtPerKWh: 5.1135,
        //             effectiveDate: "25/08/2021",
        //             effectiveTime: "00:00",
        //         },
        //         {
        //             id: "tou-2-off-peak-holiday",
        //             touType: "tou-2",
        //             title: "Off Peak (วันหยุด)",
        //             startTime: "0:00",
        //             endTime: "24:00",
        //             bahtPerKWh: 2.6369,
        //             effectiveDate: "25/08/2021",
        //             effectiveTime: "00:00",
        //         },
        //         {
        //             id: "tou-2-off-peak-mon-fri",
        //             touType: "tou-2",
        //             title: "Off Peak (Mon-Fri)",
        //             startTime: "22:00",
        //             endTime: "9:00",
        //             bahtPerKWh: 2.636,
        //             effectiveDate: "25/08/2021",
        //             effectiveTime: "00:00",
        //         },
        //         {
        //             id: "tou-2-off-peak-sat-sun",
        //             touType: "tou-2",
        //             title: "Off Peak (Sat-Sun)",
        //             startTime: "0:00",
        //             endTime: "24:00",
        //             bahtPerKWh: 2.6369,
        //             effectiveDate: "25/08/2021",
        //             effectiveTime: "00:00",
        //         },
        //         {
        //             id: "tou-2-peak-mon-fri",
        //             touType: "tou-2",
        //             title: "Peak (Mon-Fri)",
        //             startTime: "9:00",
        //             endTime: "22:00",
        //             bahtPerKWh: 5.7982,
        //             effectiveDate: "25/08/2021",
        //             effectiveTime: "00:00",
        //         }
        //     ]
        // }
        // return result;
    }
    async putTOUTariff(req: IUpdateTOURequest): Promise<boolean> {
        const path = '/reference-data/tou-tariff-setting';
        const api = this.endpoint + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
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
            return false;
        }

        if (response.status === 204) {

            console.warn(response);
            return true;
        } else {
            return false;
        }

    }
    async getTOUtariffLog(req: IGetTOULogsRequest): Promise<IGetTOUResponse | null> {
        const path = `/reference-data/tou-tariff-setting/${req.touType}/${req.title}/log`
        const api = this.endpoint + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
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
        let content: IGetTOUResponse = {
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
        const api = this.endpoint + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
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
        const api = this.endpoint + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
        }
        let body = JSON.stringify(req.serviceCharge);
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

            return true;
        } else {
            return false;
        }
    }
    async getServiceChargeLog(req: IGetServiceChargeLogsRequest): Promise<IGetServiceChargeResponse | null> {
        const path = `/reference-data/tou-tariff-setting/${req.touType}/service-charge/log`
        const api = this.endpoint + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
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

        let content: IGetServiceChargeResponse = {
            context: result
        }
        return content;
    }
    async getGridPackage(req: IGetTOURequest): Promise<IGetGridPackageResponse | null> {
        const path = '/reference-data/tou-tariff-setting/grid-used-package'
        const api = this.endpoint + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
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
        const api = this.endpoint + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
        }
        try {
            response = await fetch(api, {
                method: "PUT",
                headers,
            });
        } catch (e) {
            return false;
        }

        if (response.status === 204) {

            return true;
        } else {
            return false;
        }
    }
    async getHolidaysLog(req: IGetHolidayLogsRequest): Promise<IGetHolidayLogsResponse | null> {
        const path = `/reference-data/tou-tariff-setting/${req.touType}/holidays`;
        const api = new URL(this.endpoint + path);
        if (req.year) {
            api.searchParams.append('year', req.year);

        }
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
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
        const api = this.endpoint + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
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
