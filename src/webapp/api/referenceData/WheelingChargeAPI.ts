import dayjs from "dayjs";
import { refApi } from "../../constanst";
import { IUserSession } from "../../state/user-sessions";
import { IWheelingCharge } from "../../state/reference-data/wheeling-chart/wheeling-charge-state";
import { IWheelingLogs } from "../../state/reference-data/wheeling-chart/wheeling-log-state";

interface IGetWheelingChargeRequest {
    session: IUserSession,
}
interface IGetWheelingChargeResponse {
    context: IWheelingCharge[],
}

interface IPutWheelingChargeRequest {
    session: IUserSession,
    wheelingCharge: IWheelingCharge,
}

interface IGetLogsRequest {
    session: IUserSession,
    wheelingType: 'AS' | 'T' | 'D' | 'RE',
}
interface IGetLogsResponse {
    context: IWheelingLogs[],
}
export class WheelingChargeAPI {
    private host = refApi;

    async getWheelingCharge(req: IGetWheelingChargeRequest): Promise<IGetWheelingChargeResponse | null> {
        const path = '/reference-data/wheeling-charge-setting'
        const api = this.host + path;
        let response: Response;
        let token = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
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
        let content: IGetWheelingChargeResponse = {
            context: result
        }
        return content;
        // const result: IGetWheelingChargeResponse = {
        //     context: [
        //         {
        //             id: '99',
        //             title: 'test1',
        //             bahtPerKWh: 0.071,
        //             mea: 0.071,
        //             meaEgat: 0.071,
        //             meaPeaEgat: 0.071,
        //             pea: 0.071,
        //             peaEgat: 0.071,
        //             note: 'testsing data',
        //             wheelingType: "T",
        //             effectiveDate: dayjs().format('DD/MM/YYYY'),
        //             effectiveTime: dayjs().format('DD/MM/YYYY')
        //         }
        //     ]
        // }
        // return result;
    }

    async getLogByTypes(req: IGetLogsRequest) {
        const path = '/reference-data/wheeling-charge-setting/' + req.wheelingType + '/log'
        const api = this.host + path;
        let response: Response;
        let token = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        console.info(result);
        let content: IGetLogsResponse = {
            context: result
        }
        return content;
        // const result: IGetLogsResponse = {
        //     context: [
        //         {
        //             id: '1',
        //             title: 'test1',
        //             bahtPerKWh: 0.071,
        //             mea: 0.071,
        //             meaEgat: 0.071,
        //             meaPeaEgat: 0.071,
        //             pea: 0.071,
        //             peaEgat: 0.071,
        //             note: 'testsing data',
        //             wheelingType: 'AS',
        //             effectiveDate: dayjs().format('DD/MM/YYYY'),
        //             effectiveTime: dayjs().format('DD/MM/YYYY'),
        //             editDate: new Date(),
        //         },
        //         {
        //             id: '2',
        //             title: 'test1',
        //             bahtPerKWh: 120.071,
        //             mea: 230.071,
        //             meaEgat: 1032.071,
        //             meaPeaEgat: 120.071,
        //             pea: 20.071,
        //             peaEgat: 30.071,
        //             note: 'tes3tsing data logs',
        //             effectiveDate: dayjs().add(7, 'day').toString(),
        //             effectiveTime: dayjs().add(8, 'hour').toString(),
        //             wheelingType: 'T',
        //             editDate: new Date(),
        //         }
        //     ]
        // }
        // return result;
    }

    async updatedWheelingCharge(req: IPutWheelingChargeRequest): Promise<boolean> {
        const path = `/reference-data/wheeling-charge-setting/${req.wheelingCharge.title}`;
        const api = this.host + path;
        let response: Response;
        let token = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }

        let body = JSON.stringify(req.wheelingCharge);
        // console.log(`body data`);
        // console.info(body);
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
}