import dayjs from "dayjs";
import { egatHost, localGateway } from "../../constanst";
import { Iimbalance } from "../../state/reference-data/imbalance/imbalance-state";
import { IUserSession } from "../../state/user-sessions";
import { IImbalanceLog } from "../../state/reference-data/imbalance/imbalance-log";

interface IGetImbalanceRequest {
    session: IUserSession,
}
interface IGetImbalanceResponse {
    context: Iimbalance[],
}

interface IGetLogsRequest {
    session: IUserSession,
    type: 'buyer' | 'seller',
    imbalance: 'Commited < Actual Energy' | 'Commited > Actual Energy',
}
interface IGetLogsResponse {
    context: IImbalanceLog[],
}

interface IUpdateImbalanceRequest {
    session: IUserSession,
    imbalance: Iimbalance
}
export class ImbalanceAPI {
    private uri = localGateway;

    async getImbalance(req: IGetImbalanceRequest): Promise<IGetImbalanceResponse | null> {
        const path = '/reference-data/imbalance-setting'
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
            throw Error(`UnExpected Handler Error`);
        }
        if (response.status === 200) {
            let result = await response.json();
            let content: IGetImbalanceResponse = {
                context: result
            }
            return content;
        } else {
            throw Error(`Error With Code: ${response.status}`);
        }

    }

    async getLogsImbalance(req: IGetLogsRequest) {
        const path = `/reference-data/imbalance-setting/${req.type}/${req.imbalance}/log`;
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
            throw Error(`Unexpected handle error `);
        }
        if (response.status === 200) {
            let result = await response.json();
            let content: IGetLogsResponse = {
                context: result
            }
            return content;

        } else {
            throw Error(`Error With Code: ${response.status}`);
        }
    }

    async updateImbalance(req: IUpdateImbalanceRequest): Promise<boolean> {
        const path = '/reference-data/imbalance-setting';
        const api = this.uri + path;
        let response: Response;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.session.accessToken}`,
        }

        let body = JSON.stringify(req.imbalance);
        console.log(`body data`);
        console.info(body);
        try {
            response = await fetch(api, {
                method: "PUT",
                headers,
                body
            });
        } catch (e) {
            throw Error(`Unexpected handle error `);
        }
        if (response.status === 204) {

            console.warn(response);
            return true;
        }
        else {
            throw Error(`Cannot updated Data \n ERROR CODE: ${response.status}`)
        }

    }
}