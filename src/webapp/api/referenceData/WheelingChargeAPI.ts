import { egatGateway, localGateway } from "../../constanst";
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
    private uri = egatGateway;

    async getWheelingCharge(req: IGetWheelingChargeRequest): Promise<IGetWheelingChargeResponse | null> {
        const path = '/reference-data/wheeling-charge-setting'
        const api = this.uri + path;
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
            throw Error(`Unexpected handle error`);

        }
        if (response.status === 401) {
            throw Error(`Unauthorization`);
        }

        if (response.status === 200) {
            let result = await response.json();
            console.log(result);
            let content: IGetWheelingChargeResponse = {
                context: result
            }

            return content;
        } else {
            throw Error(`Unexpected Error Code: ${response.status}`);
        }
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
            throw Error(`Unexpected handle error`);

        }
        if (response.status === 401) {
            throw Error(`Unauthorization`);
        }

        if (response.status === 200) {
            let result = await response.json();
            console.info(result);
            let content: IGetLogsResponse = {
                context: result
            }
            return content;
        } else {
            throw Error(`Unexpected Error Code: ${response.status}`);

        }
    }

    async updatedWheelingCharge(req: IPutWheelingChargeRequest): Promise<boolean> {
        const path = `/reference-data/wheeling-charge-setting`;
        const api = this.uri + path;
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
            throw Error(`Unexpect handle Error`);
        }

        if (response.status === 204) {
            return true;
        } else {
            throw Error(`Error With Code: ${response.status}`);
        }


    }
}