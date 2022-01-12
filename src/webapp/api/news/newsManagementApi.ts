import { MeterDetail } from "../../state/user-management/meter-detail";//no need
import { IUserDetail } from "../../state/user-management/user-detail";//will delete 
import { INewsDetail } from "../../state/news-management/news-detail";//done
import { NewsInfo } from "../../state/news-management/news-info";//already done
import { IUserSession } from "../../state/user-sessions";//Done?
import { newsApi } from '../../constanst';//{WIP}
import { IAdminRegistratoinState } from "../../state/user-management/admin-registration-state";//?{To be create}



interface IPublishNewsRequest {
    token?: IUserSession,
    newsDetail :INewsDetail
}


interface ICreateNewsRequest {
    token?: IUserSession,
    //admin: IAdminRegistratoinState,
    newsInfo: NewsInfo,
}

interface IDeleteNewsRequest {
    token?: IUserSession,
    newsDetail :INewsDetail
}
/////////////////////////////////
interface ICreateNewsResponse {
    status: number,
    newsInfo: NewsInfo,
}

interface IGetNewsResponse {
    newsInfos: NewsInfo[],
}

interface IDeleteNewsResponse {
    status: number,
}

interface IPublishNewsResponse {
    status: number,
}

interface IGetUserByIDResponse {
    userDetail: IUserDetail,
    meterDetail: MeterDetail,
}

export default class NewsManagementAPI {
    private host = newsApi;

    // let response: Response;  
    async getAllNews(): Promise<IGetNewsResponse | null> {
        // const path = '/news'
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
        // let content: IGetNewsResponse = {
        //     newsInfos: result
        // }
        // return content;
        // let res = await fetchWithTimeout(uri.toString(), {
        //     method: "GET",
        //     headers,
        // })
        //mocking Data
        const content: IGetNewsResponse = createMockData();
        return Promise.resolve(content);
    }

    // async getUserByMeterID(meterId: string): Promise<IGetUserByIDResponse | null> {
    //     if (meterId === 'xxx') {
    //         return createMockUserByID();
    //     }
    //     const path = `/users/detail/${meterId}`;
    //     const api = this.host + path;
    //     let response: Response;
    //     let token = '';
    //     let headers = {
    //         "Content-Type": "application/json",
    //         // Authorization: `Bearer ${token}`
    //     }

    //     try {
    //         response = await fetch(api, {
    //             method: "GET",
    //             headers
    //         })
    //     } catch (e) {
    //         return null;
    //     }
    //     const result = await response.json();
    //     const userDetail: IUserDetail = result;
    //     const meterDetail: MeterDetail = result;
    //     const content: IGetUserByIDResponse = {
    //         userDetail: userDetail,
    //         meterDetail: meterDetail,
    //     }

    //     return content;
    //     // const response: UserDetailResponse = createMockDetail();
    //     // response.userDetail.idNumber = id;
    //     // return Promise.resolve(response);
    // }

    // // async postNewAccount(): Promise
    // // roles?=aggretator+prosumer+consumer
    // async getUserByFilter(request: IGetSearchUserRequest): Promise<IGetUsersResponse | null> {
    //     // https://egat-p2p-webadmin-profile.di.iknowplus.co.th/users/search?value=0123456789
    //     const text = request.text;
    //     const path = '/users/search'
    //     const api = new URL(this.host + path);
    //     api.searchParams.append('value', text);
    //     console.log(`filter uri is : ${api.toString()}`);
    //     let response: Response;
    //     // let accessToken = request.token.accessToken;
    //     let headers = {
    //         "Content-Type": "application/json",
    //         // Authorization: `Bearer ${accessToken}`,
    //     }
    //     try {
    //         response = await fetch(api.toString(), {
    //             method: "GET",
    //             headers
    //         });
    //     } catch (e) {
    //         return null;
    //     }

    //     let result = await response.json();
    //     console.log(result);
    //     let content: IGetUsersResponse = {
    //         userInfos: result
    //     }
    //     return content;


    // }
    
    async createNews(request: ICreateNewsRequest): Promise<ICreateNewsResponse | null> {
        const path = '/news';
        const api = new URL(this.host + path);
        let response: Response;
        // let accessToken = request.token.accessToken ;
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify({
            newsInfos: request.newsInfo,
        });//to be edit

        console.log(`----------------body context--------------`);
        console.log(body);
        console.log(`----------------body context END----------`);
        try {
            response = await fetch(api.toString(), {
                method: "POST",
                headers,
                body: body
            });
            let result = await response.json();
            console.log(result);
            let content: ICreateNewsResponse = {
                status: result.status,
                newsInfo: result.newsInfo,
            }
            return content;
        } catch (e) {
            console.log(e);
            return null;
        }

    }

    async publishNews(request: IPublishNewsRequest): Promise<boolean> {
        const path = '/news';
        const api = new URL(this.host + path );//(+ Locate)
        let response: Response;
        // let accessToken = request.token.accessToken ;
        
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify({
            newsDetail: request.newsDetail,
        });

        console.log(`----------------body context--------------`);
        console.log(body);
        console.log(`----------------body context END----------`);
        try {
            response = await fetch(api.toString(), {
                method: "PUT",
                headers,
                body: body
            });
        } catch (e) {
            console.log(e);
            return false;
        }

        let result = await response.json();
            console.log(result);
            let content: IPublishNewsResponse = {
                status: result.status,
            }
            return true;

    }

    //WIP
    async deleteNews(request: IDeleteNewsRequest): Promise<boolean> {
        const path = '/news';
        const api = new URL(this.host + path );//(+ Locate)
        let response: Response;
        // let accessToken = request.token.accessToken ;
        
        //To be change
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify({
            newsDetail: request.newsDetail,
        });//to be edit

        console.log(`----------------body context--------------`);
        console.log(body);
        console.log(`----------------body context END----------`);
        try {
            response = await fetch(api.toString(), {
                method: "Delete",
                headers,
                body: body
            });
        } catch (e) {
            return false;
        }

        let result = await response.json();
            console.log(result);
            let content: IDeleteNewsResponse = {
                status: result.status,
            }
            return true;

    }

}

// function createMockUserByID(): IGetUserByIDResponse {
//     const result: IGetUserByIDResponse = {
//         meterDetail: {
//             meterId: '0001',
//             typeOfBusiness: '0001', // 'home' | 'school' | 'hospital' | 'government' | 'cooperative' | 'business' | 'industry' | 'other' ;
//             ca: '0001',
//             position: {
//                 lat: 10001,
//                 lng: 20002,
//             },
//             typeOfUser: '0001', //'house1.1' | 'house1.2' | 'house1.3' | 's-business2.1' | 's-business2.2' | 'm-business3.1' |  'm-business3.2'| 'l-business4.1' | 'l-business4.2' | 'special-business5.1' | 'special-business5.2' ;
//             sizeOfMeter: 202,
//             voltage: 30,
//             numberOfPhases: 12,
//             produceInfo: 'string',
//             brand: 'string',
//             model: 'string',
//             numberOfBoard: 12223,
//             powerOfProduce: 1,
//             typeOfBoard: 'string',
//             sizeOfSetup: 34,
//             invertor: 'string',
//             expectedDate: 'string',
//             address: {
//                 buildingNumber: '1',
//                 village: 'village',
//                 soi: 'soi',
//                 road: 'roads',
//                 subDistrict: 'subdistrict',
//                 district: 'district',
//                 province: 'bkk',
//                 zipCode: '10900',
//                 country: 'Thailand',
//             }
//         },
//         userDetail: {
//             email: 'string@email.com',
//             fullName: 'alice wonderland',
//             phoneNumber: '1234rt6y7890',
//             role: 'roles',
//             citizenId: '1234567890123',
//             meterId: '0001',

//         }
//     }

//     return result
// }

function createMockData(): IGetNewsResponse {
    return {
        newsInfos: [
            {
                id: '0001',
                title: 'title',
                date: '1/1/2012',
                content: 'Text',
                status: 'Publish',
            },{
                id: '0002',
                title: 'italicized',
                date: '2/1/2012',
                content: '*italicized text*',
                status: 'Publish',
            },{
                id: '0003',
                title: 'bold',
                date: '3/1/2012',
                content: '**bold text**',
                status: 'Publish',
            },{
                id: '0004',
                title: 'Order',
                date: '3/1/2012',
                content: "1. First item 2. Second item 3. Third item",
                status: 'Publish',
            },
        ],
    }
}
