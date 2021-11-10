import { IUserSession } from "../../state/user-sessions";
import { IWheelingCharge } from "../../state/wheeling-charge-state";

interface IGetWheelingChargeRequest {
    token?: IUserSession,
}
interface IGetWheelingChargeResponse {
    context: IWheelingCharge[],
}
export class WheelingChargeAPI {
    private host = '';

    async getWheelingCharge(req: IGetWheelingChargeRequest): Promise<IGetWheelingChargeResponse | null> {
        // const path = '/users'
        // const api = this.host + path;
        // let response: Response;
        // let token = 'token';
        // let headers = {
        //     "Content-Type": "application/json",
        //     // Authorization: `Bearer ${token}`,
        // }
        // try {
        //     response = await fetch(api, {
        //         method: "GET",
        //         headers
        //     });
        // } catch (e) {
        //     return null;
        // }

        // let result = await response.json();
        // console.log(result);
        // let content: IGetWheelingChargeResponse = {
        //     context: result
        // }
        // return content;
        const result: IGetWheelingChargeResponse = {
            context: [
                {
                    title: 'test1',
                    bahtPerKwh: 0.071,
                    mea: 0.071,
                    meaegat: 0.071,
                    meapeaegat: 0.071,
                    pea: 0.071,
                    peaegat: 0.071,
                    note: 'testsing data',
                    effictiveDate: '',
                    effictiveTime: ''
                }
            ]
        }
        return result;
    }
}