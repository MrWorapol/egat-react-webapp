import dayjs from "dayjs";
import { egatHost } from "../../constanst";
import { Iimbalance } from "../../state/reference-data/imbalance/imbalance-state";
import { IUserSession } from "../../state/user-sessions";

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
    private uri = egatHost;

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
            return null;
        }

        let result = await response.json();
        console.log(result);
        let content: IGetImbalanceResponse = {
            context: result
        }
        return content;
        // const result: IGetImbalanceResponse = {
        //     context: [
        //         {
        //             id: '1',
        //             imbalance: 'Commited > Actual Energy',
        //             scenario: 'Grid (DSO/EGAT) รับซื้อด้วยอัตรา',
        //             imbalanceClearing: 'Solar ภาคประชาชน',
        //             bahtPerKWh: 77,
        //             type: 'seller',
        //             effectiveDate: '10/10/2021',
        //             effectiveTime: '9:00',
        //             editDate: dayjs().add(-1).toDate(),
        //         },
        //         {
        //             id: '99',
        //             imbalance: 'Commited > Actual Energy',
        //             scenario: 'จ่ายเงินให้ผู้ขายตามจำนวนที่ใช้จริง + บทลงโทษเท่ากับค่าไฟส่วนต่างระหว่างค่าไฟที่ตกลงซื้อขายกัน - ค่าไฟที่ Grid (DSO/EGAT) ต้องรับซื้อไฟส่วนเกินที่ใช้ไม่ครบนั้น',
        //             imbalanceClearing: 'Commited price - ราคาที่่ Grid รับซื้อ',
        //             bahtPerKWh: 79,
        //             type: 'buyer',
        //             effectiveDate: '11/10/2021',
        //             effectiveTime: '9:00',
        //             editDate: dayjs().add(-1).toDate(),
        //         }
        //     ]
        // }
        // return result;
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
            return null;
        }

        let result = await response.json();
        console.log(result);
        let content: IGetLogsResponse = {
            context: result
        }
        return content;
        // const result: IGetLogsResponse = {
        //     context: [
        //         {
        //             id: '1',
        //             imbalance: 'Commited > Actual Energy',
        //             scenario: 'scenario 1',
        //             imbalanceClearing: 'Solar ภาคประชาชน',
        //             bahtPerKWh: 77,
        //             type: 'buyer',
        //             editDate: dayjs().add(-1).toDate(),
        //             effectiveDate: dayjs().add(-1).toDate().toString(),
        //         },
        //         {
        //             id: '1',
        //             imbalance: 'Commited > Actual Energy',
        //             scenario: 'scenario 12',
        //             imbalanceClearing: 'Commited price - ราคาที่่ Grid รับซื้อ',
        //             bahtPerKWh: 79,
        //             type: 'buyer',
        //             editDate: dayjs().add(-1).toDate(),
        //             effectiveDate: dayjs().add(-1).toDate().toString(),
        //         }
        //     ]
        // }
        // return result;
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