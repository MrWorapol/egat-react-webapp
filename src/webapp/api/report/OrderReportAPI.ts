import { IOrderDetail } from '../../state/summary-report/order-report/order-detail-state';
import { IOrderInfo } from '../../state/summary-report/order-report/order-report-state';
import { IUserSession } from '../../state/user-sessions';

interface IGetOrderDetailRequest {
    orderId: string,

}
interface IGetOrderDetailResponse {
    context: IOrderDetail,

}

export interface IGetOrderTableRequest {
    session?: IUserSession,
    startDate: string,
    endDate: string,
    region: string,
    role: string,
    buyerType: string,
    tradeMarket: string,
    orderStatus: string,
}

interface IGetOrderTableResponse {
    context: IOrderInfo[],
}
// interface IGetLocationSiteRequest {
//     session?: IUserSession,
//     meterId: string,
// }
// interface IGetLocationSiteResponse {
//     context: ILocationSite
// }
export class OrderReportAPI {
    private endpoint = '';

    async getOderDetail(req: IGetOrderDetailRequest): Promise<IGetOrderDetailResponse | null> {


        const result = {
            context: {
                orderId: req.orderId,
                orderType: 'buyer',
                tradeMarket: 'bileteral',
                orderDetail: {
                    amount: 12,
                    netBuy: 3,
                    netEnergyPrice: 2.35,
                    energyToBuy: 5,
                    energyTariff: 1,
                    energyPrice: 12,
                    wheelingChargeTariff: 1,
                    wheelingCharge: 3,
                    tradingFee: 0.69,
                }
            }
        }
        return result;
    }
    async getOrderTable(req: IGetOrderTableRequest): Promise<IGetOrderTableResponse | null> {
        let roles = '';
        if (req.role.length === 0) {
            roles = 'all'
        }
        console.log(req);
        return {
            context: [
                {
                    orderId: '0e00300',
                    tradeMarket: 'Bileteral',
                    area: '3 Villages',
                    orderType: 'buyer',
                    role: 'aggregator',
                    status: 'Matched'
                },
                {
                    orderId: '0e00300',
                    tradeMarket: 'Bileteral',
                    area: '3 Villages',
                    orderType: 'buyer',
                    role: 'aggregator',
                    status: 'Matched'
                },
                {
                    orderId: '0e00300',
                    tradeMarket: 'Bileteral',
                    area: '3 Villages',
                    orderType: 'buyer',
                    role: 'aggregator',
                    status: 'Matched'
                }
            ]
        }
    }


}
