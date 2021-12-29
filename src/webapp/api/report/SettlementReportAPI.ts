import { summaryApi } from "../../constanst";
import { ISettlementDetail } from "../../state/summary-report/settlement-report/settlement-detail-state";
import { ISettlementReport } from "../../state/summary-report/settlement-report/settlement-report-state";

import { IUserSession } from "../../state/user-sessions";


interface IGetSettlementReportRequest {
    session?: IUserSession,
    startDate: string,
    endDate: string,
    region: string,
    area: string,
    role: string,
    buyerType: string,
    tradeMarket: string,
    orderStatus: string,
}

interface IGetSettlementReportResponse {
    context: ISettlementReport[],
}

interface IGetSettlementDetailRequest {
    session?: IUserSession,
    contractId: string,
}

interface IGetSettlementDetailResponse {
    context: ISettlementDetail,
}

export class SettlementReportAPI {
    private host = summaryApi;

    async getSettlementReport(req: IGetSettlementReportRequest): Promise<IGetSettlementReportResponse> {
        return {
            context: [
                {
                    contractId: '1485434482',
                    area: '3 Villages',
                    role: 'aggregator',
                    tradeMarket: 'bilateral',
                    userType: 'seller',
                    imbalanceType: 'Energy Shortfall',

                }
            ]
        };

    }

    async getSettlementDetail(req: IGetSettlementDetailRequest): Promise<IGetSettlementDetailResponse> {
        return { context: {} as ISettlementDetail };
    }
}