import { refApi } from "../../constanst";
import { IOtherSettingLog } from "../../state/reference-data/other-setting/othersetting-log";
import { IOtherSetting } from "../../state/reference-data/other-setting/othersetting-state";
import { IUserSession } from "../../state/user-sessions";



interface IGetOtherSettingRequest {
    token?: IUserSession,
}

interface IGetOtherSettingResponse {
    context: IOtherSetting,
}

interface IGetOtherSettingLogsRequest {
    token?: IUserSession,
}

interface IGetOtherSettingLogsResponse {
    context: IOtherSettingLog[],
}
interface IPutOtherSettingRequest {
    token?: IUserSession,
    setting: IOtherSetting
}

export class OtherSettingAPI {
    private host = refApi;

    async getOtherSetting(req: IGetOtherSettingRequest): Promise<IGetOtherSettingResponse | null> {
        const path = '/reference-data/other-setting'
        const api = this.host + path;
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
        let content: IGetOtherSettingResponse = {
            context: result[0]
        }
        return content;
        // const result: IGetOtherSettingResponse = {
        //     context:

        //     {
        //         id: "other-setting",
        //         energyTradingPayment: {
        //             transactionFees: 0.015,
        //             dicountAppFees: 0
        //         },
        //         gridUsed: {
        //             ft: -0.1532,
        //             discountGridUsed: 0
        //         },
        //         other: {
        //             vat: 7
        //         },
        //         effectiveDate: "25/08/2021",
        //         effectiveTime: "00:00",
        //         effectiveDateTime: "2021-08-24T17:00:00.000Z"
        //     }


        // }
        // return result;
    }

    async getOtherSettingLogs(req: IGetOtherSettingLogsRequest): Promise<IGetOtherSettingLogsResponse | null> {
        const path = `/reference-data/other-setting/log`;
        const api = this.host + path;
        let response: Response;
        // let token = 'token';
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
        let content: IGetOtherSettingLogsResponse = {
            context: result
        }
        return content;
        // const result: IGetOtherSettingLogsResponse = {
        //     context:

        //         [{
        //             id: "other-setting",
        //             energyTradingPayment: {
        //                 transactionFees: 0.015,
        //                 dicountAppFees: 0
        //             },
        //             gridUsed: {
        //                 ft: -0.1532,
        //                 discountGridUsed: 0
        //             },
        //             other: {
        //                 vat: 7
        //             },
        //             effectiveDate: "25/08/2021",
        //             effectiveTime: "00:00",
        //             effectiveDateTime: "2021-08-24T17:00:00.000Z"
        //         }]


        // }
        // return result;
    }
    async putOtherSetting(req: IPutOtherSettingRequest): Promise<boolean> {
        const path = `/reference-data/other-setting`;
        const api = this.host + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            //     // Authorization: `Bearer ${token}`,
        }
        let body = JSON.stringify(req.setting);
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