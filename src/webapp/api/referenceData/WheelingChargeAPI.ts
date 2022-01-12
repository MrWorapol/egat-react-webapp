import dayjs from "dayjs";
import { egatHost } from "../../constanst";
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
    private uri = egatHost;

    async getWheelingCharge(req: IGetWheelingChargeRequest): Promise<IGetWheelingChargeResponse | null> {
        const path = '/reference-data/wheeling-charge-setting'
        const api = this.uri + path;
        let response: Response;
        // let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.session.accessToken}`,
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
        //             title: 'test1',
        //             bahtPerKwh: 0.071,
        //             mea: 0.071,
        //             meaegat: 0.071,
        //             meapeaegat: 0.071,
        //             pea: 0.071,
        //             peaegat: 0.071,
        //             note: 'testsing data',
        //             effectiveDate: new Date().toString(),
        //             effectiveTime: new Date().toString()
        //         }
        //     ]
        // }
        // return result;
    }

    async getLogByTypes(req: IGetLogsRequest) {
        const path = '/reference-data/wheeling-charge-setting/' + req.wheelingType + '/log'
        const api = this.uri + path;
        let response: Response;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.session.accessToken}`,
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
        // const result: IGetWheelingChargeResponse = {
        // context: [
        // {
        //     title: 'test1',
        //     bahtPerKwh: 0.071,
        //     mea: 0.071,
        //     meaegat: 0.071,
        //     meapeaegat: 0.071,
        //     pea: 0.071,
        //     peaegat: 0.071,
        //     note: 'testsing data',
        //     effectiveDate: new Date().toString(),
        //     effectiveTime: new Date().toString()
        // },
        // {
        //     title: 'test1',
        //     bahtPerKwh: 120.071,
        //     mea: 230.071,
        //     meaegat: 1032.071,
        //     meapeaegat: 120.071,
        //     pea: 20.071,
        //     peaegat: 30.071,
        //     note: 'tes3tsing data logs',
        //     effectiveDate: dayjs().add(7, 'day').toString(),
        //     effectiveTime: dayjs().add(8, 'hour').toString(),
        // }
        //         ]
        // }
        //     return result;
    }

    async updatedWheelingCharge(req: IPutWheelingChargeRequest): Promise<boolean> {
        const path = `/reference-data/wheeling-charge-setting/${req.wheelingCharge.title}`;
        const api = this.uri + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.session.accessToken}`,
        }

        let body = JSON.stringify(req.wheelingCharge);
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
            return true;
        } else {
            return false;
        }


    }
}