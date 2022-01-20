import { egatHost, localGateway } from "../../constanst";
import { IOtherSettingLog } from "../../state/reference-data/other-setting/othersetting-log";
import { IOtherSetting } from "../../state/reference-data/other-setting/othersetting-state";
import { IUserSession } from "../../state/user-sessions";



interface IGetOtherSettingRequest {
    session: IUserSession,
}

interface IGetOtherSettingResponse {
    context: IOtherSetting,
}

interface IGetOtherSettingLogsRequest {
    session: IUserSession,
}

interface IGetOtherSettingLogsResponse {
    context: IOtherSettingLog[],
}
interface IPutOtherSettingRequest {
    session: IUserSession,
    setting: IOtherSetting
}

export class OtherSettingAPI {
    private uri = localGateway;

    async getOtherSetting(req: IGetOtherSettingRequest): Promise<IGetOtherSettingResponse | null> {
        const path = '/reference-data/other-setting'
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
            throw Error(`Unexpected handle error:${e}`);
        }
        if (response.status === 200) {
            let result = await response.json();
            console.log(result);
            let content: IGetOtherSettingResponse = {
                context: result
            }
            return content;
        } else {
            throw Error(`Error Code: ${response.status}`)
        }
    }

    async getOtherSettingLogs(req: IGetOtherSettingLogsRequest): Promise<IGetOtherSettingLogsResponse | null> {
        const path = `/reference-data/other-setting/log`;
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
            return null;
        }
        if (response.status === 200) {
            let result = await response.json();
            console.log(result);
            let content: IGetOtherSettingLogsResponse = {
                context: result
            }
            return content;
        } else {
            throw Error(`Error Code: ${response.status}`)
        }
    }
    async putOtherSetting(req: IPutOtherSettingRequest): Promise<boolean> {
        const path = `/reference-data/other-setting`;
        const api = this.uri + path;
        let response: Response;
        let token = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
        let body = JSON.stringify(req.setting);
        try {
            response = await fetch(api, {
                method: "PUT",
                headers,
                body
            });
        } catch (e) {
            throw Error(`Unexpected Handler Error`);
        }

        if (response.status === 204) {

            return true;
        } else{
            throw Error(`Error Code: ${response.status}`)
        }

    }
}