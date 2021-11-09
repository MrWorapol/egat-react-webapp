import { MeterDetail } from "../../state/meter-detail";
import { UserDetail } from "../../state/user-detail";
import { UserInfo } from "../../state/user-info";
import { IUserSession } from "../../state/user-sessions";
import { userApi } from '../../constanst';
import { IUserRoles } from "../../pages/main/user-management/UserManagement";
import { IAdminRegistratoinState } from "../../state/admin-registration-state";


interface IGetUsersByRolesRequest {
    token?: IUserSession,
    roles: string[],
}
interface IGetSearchUserRequest {
    token?: IUserSession,
    text: string,
}

interface IEditUserRequest {
    token?: IUserSession,
    userDetail: UserDetail,
    meterDetail: MeterDetail,
}

interface ICreateAdminRequest {
    token?: IUserSession,
    admin: IAdminRegistratoinState,

}

interface ICreateAdminResponse {
    status: number,
    userInfo: UserInfo,
}

interface IGetUsersResponse {
    userInfos: UserInfo[],
}

interface IGetUserByIDResponse {
    userDetail: UserDetail,
    meterDetail: MeterDetail,
}

export default class UserManagementAPI {
    private host = userApi;
    // let response: Response;  
    async getAllUser(): Promise<IGetUsersResponse | null> {
        const path = '/users'
        const api = this.host + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
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
        let content: IGetUsersResponse = {
            userInfos: result
        }
        return content;
        // let res = await fetchWithTimeout(uri.toString(), {
        //     method: "GET",
        //     headers,
        // })
        //mocking Data
        // const content: IGetUsersResponse = createMockData();
        // return Promise.resolve(content);
    }

    async getUserByMeterID(meterId: string): Promise<IGetUserByIDResponse | null> {
        if (meterId === 'xxx') {
            return createMockUserByID();
        }
        const path = `/users/detail/${meterId}`;
        const api = this.host + path;
        let response: Response;
        let token = '';
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`
        }

        try {
            response = await fetch(api, {
                method: "GET",
                headers
            })
        } catch (e) {
            return null;
        }
        const result = await response.json();
        const userDetail: UserDetail = result;
        const meterDetail: MeterDetail = result;
        const content: IGetUserByIDResponse = {
            userDetail: userDetail,
            meterDetail: meterDetail,
        }

        return content;
        // const response: UserDetailResponse = createMockDetail();
        // response.userDetail.idNumber = id;
        // return Promise.resolve(response);
    }

    // async postNewAccount(): Promise
    // roles?=aggretator+prosumer+consumer
    async getUserByFilter(request: IGetSearchUserRequest): Promise<IGetUsersResponse | null> {
        // https://egat-p2p-webadmin-profile.di.iknowplus.co.th/users/search?value=0123456789
        const text = request.text;
        const path = '/users/search'
        const api = new URL(this.host + path);
        api.searchParams.append('value', text);
        console.log(`filter uri is : ${api.toString()}`);
        let response: Response;
        // let accessToken = request.token.accessToken;
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
        }
        try {
            response = await fetch(api.toString(), {
                method: "GET",
                headers
            });
        } catch (e) {
            return null;
        }

        let result = await response.json();
        console.log(result);
        let content: IGetUsersResponse = {
            userInfos: result
        }
        return content;


    }

    async editUser(request: IEditUserRequest): Promise<boolean> {
        const path = '/users/detail/';
        const api = new URL(this.host + path + request.meterDetail.meterId);
        let response: Response;
        // let accessToken = request.token.accessToken ;
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify({
            userDetail: request.userDetail,
            meterDetail: request.meterDetail,
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
            return false;
        }

        let result = await response.json();
        console.log(result);
        let content: IGetUsersResponse = {
            userInfos: result
        }
        return true;

    }

    async getUsersByRoles(request: IGetUsersByRolesRequest): Promise<IGetUsersResponse | null> {
        // https://egat-p2p-webadmin-profile.di.iknowplus.co.th/users/filter?roles=admin

        const rolesParams = request.roles.join('+');

        console.log(`hello from getUserByRoles API`);
        console.log(rolesParams);
        const path = '/users/filter'
        const api = new URL(this.host + path);
        api.searchParams.append('roles', rolesParams);
        let response: Response;
        // let accessToken = request.token.accessToken ;
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
        }
        try {
            response = await fetch(api.toString(), {
                method: "GET",
                headers
            });
        } catch (e) {
            return null;
        }

        let result = await response.json();
        console.log(result);
        let content: IGetUsersResponse = {
            userInfos: result
        }
        return content;
    }


    async createAdmin(request: ICreateAdminRequest): Promise<ICreateAdminResponse | null> {
        const path = '/users/admin';
        const api = new URL(this.host + path);
        let response: Response;
        // let accessToken = request.token.accessToken ;
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify(request.admin);

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
            let content: ICreateAdminResponse = {
                status: result.status,
                userInfo: result.userInfo,
            }
            return content;
        } catch (e) {
            console.log(e);
            return null;
        }

    }
}

function createMockUserByID(): IGetUserByIDResponse {
    const result: IGetUserByIDResponse = {
        meterDetail: {
            meterId: '0001',
            typeOfBusiness: '0001', // 'home' | 'school' | 'hospital' | 'government' | 'cooperative' | 'business' | 'industry' | 'other' ;
            ca: '0001',
            position: {
                lat: 10001,
                lng: 20002,
            },
            typeOfUser: '0001', //'house1.1' | 'house1.2' | 'house1.3' | 's-business2.1' | 's-business2.2' | 'm-business3.1' |  'm-business3.2'| 'l-business4.1' | 'l-business4.2' | 'special-business5.1' | 'special-business5.2' ;
            sizeOfMeter: 202,
            voltage: 30,
            numberOfPhases: 12,
            produceInfo: 'string',
            brand: 'string',
            model: 'string',
            numberOfBoard: 12223,
            powerOfProduce: 1,
            typeOfBoard: 'string',
            sizeOfSetup: 34,
            invertor: 'string',
            expectedDate: 'string',
        },
        userDetail: {
            email: 'string@email.com',
            fullName: 'alice wonderland',
            phoneNumber: '1234rt6y7890',
            role: 'roles',
            citizenId: '1234567890123',
            address: {
                buildingNumber: '1',
                village: 'village',
                soi: 'soi',
                road: 'roads',
                subDistrict: 'subdistrict',
                district: 'district',
                province: 'bkk',
                zipCode: '10900',
                country: 'Thailand',
            }
        }
    }

    return result
}

function createMockData(): IGetUsersResponse {
    return {
        userInfos: [
            {
                meterId: '0001',
                fullName: 'user1',
                email: 'user1@email.com',
                phoneNumber: '1234567890',
                role: 'Prosumer',
            },
            {
                meterId: '0002',
                fullName: 'user2',
                email: 'user2@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0003',
                fullName: 'user3',
                email: 'user3@email.com',
                phoneNumber: '1234567899',
                role: 'Admin'
            }, {
                meterId: '0004',
                fullName: 'user4',
                email: 'user4@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0005',
                fullName: 'user5',
                email: 'user5@email.com',
                phoneNumber: '1234567899',
                role: 'Agregator    '
            }, {
                meterId: '0006',
                fullName: 'user6',
                email: 'user6@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0007',
                fullName: 'user7',
                email: 'user7@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0008',
                fullName: 'user8',
                email: 'user8@email.com',
                phoneNumber: '1234567899',
                role: 'Admin'
            }, {
                meterId: '0009',
                fullName: 'user9',
                email: 'user9@email.com',
                phoneNumber: '1234567899',
                role: 'Agregator'
            }, {
                meterId: '0010',
                fullName: 'user10',
                email: 'user10@email.com',
                phoneNumber: '1234567899',
                role: 'Prosumer'
            },
            {
                meterId: '0011',
                fullName: 'user1',
                email: 'user1@email.com',
                phoneNumber: '1234567890',
                role: 'Prosumer'
            },
            {
                meterId: '0012',
                fullName: 'user2',
                email: 'user2@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0013',
                fullName: 'user3',
                email: 'user3@email.com',
                phoneNumber: '1234567899',
                role: 'Admin'
            }, {
                meterId: '0014',
                fullName: 'user4',
                email: 'user4@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0015',
                fullName: 'user5',
                email: 'user5@email.com',
                phoneNumber: '1234567899',
                role: 'Agregator    '
            }, {
                meterId: '0016',
                fullName: 'user6',
                email: 'user6@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0017',
                fullName: 'user7',
                email: 'user7@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0018',
                fullName: 'user8',
                email: 'user8@email.com',
                phoneNumber: '1234567899',
                role: 'Admin'
            }, {
                meterId: '0019',
                fullName: 'user9',
                email: 'user9@email.com',
                phoneNumber: '1234567899',
                role: 'Agregator'
            }, {
                meterId: '0020',
                fullName: 'user10',
                email: 'user10@email.com',
                phoneNumber: '1234567899',
                role: 'Prosumer'
            },
            {
                meterId: '0021',
                fullName: 'user1',
                email: 'user1@email.com',
                phoneNumber: '1234567890',
                role: 'Prosumer'
            },
            {
                meterId: '0022',
                fullName: 'user2',
                email: 'user2@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0023',
                fullName: 'user3',
                email: 'user3@email.com',
                phoneNumber: '1234567899',
                role: 'Admin'
            }, {
                meterId: '0024',
                fullName: 'user4',
                email: 'user4@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0025',
                fullName: 'user5',
                email: 'user5@email.com',
                phoneNumber: '1234567899',
                role: 'Agregator    '
            }, {
                meterId: '0026',
                fullName: 'user6',
                email: 'user6@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0027',
                fullName: 'user7',
                email: 'user7@email.com',
                phoneNumber: '1234567899',
                role: 'Consumer'
            }, {
                meterId: '0028',
                fullName: 'user8',
                email: 'user8@email.com',
                phoneNumber: '1234567899',
                role: 'Admin'
            }, {
                meterId: '0029',
                fullName: 'user9',
                email: 'user9@email.com',
                phoneNumber: '1234567899',
                role: 'Agregator'
            }, {
                meterId: '0030',
                fullName: 'user10',
                email: 'user10@email.com',
                phoneNumber: '1234567899',
                role: 'Prosumer'
            },
        ],
    }
}
