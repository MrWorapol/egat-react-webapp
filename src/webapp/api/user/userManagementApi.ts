import { MeterDetail } from "../../state/user-management/meter-detail";
import { IUserDetail } from "../../state/user-management/user-detail";
import { UserInfo } from "../../state/user-management/user-info";
import { IUserSession } from "../../state/user-sessions";
import { egatGateway, localGateway } from '../../constanst';
import { IAdminRegistratoinState } from "../../state/user-management/admin-registration-state";
import fetchWithTimeout from "../../utils/fetchWithTimeout";


interface IGetUsersByRolesRequest {
    session: IUserSession,
    roles: string[],
}
interface IGetSearchUserRequest {
    session: IUserSession,
    text: string,
}

interface IEditUserRequest {
    session: IUserSession,
    userDetail: IUserDetail,
    meterDetail: MeterDetail,
}

interface ICreateAdminRequest {
    session: IUserSession,
    admin: IAdminRegistratoinState,

}

interface ICreateAdminResponse {
    status: number,
    userInfo: UserInfo,
}
interface IGetUserRequest {
    session: IUserSession
}
interface IGetUsersResponse {

    userInfos: UserInfo[],
}

interface IGetUserByIDRequest {
    session: IUserSession,
    meterId: string,
}
interface IGetUserByIDResponse {
    userDetail: IUserDetail,
    meterDetail: MeterDetail,
}

export default class UserManagementAPI {
    private host = egatGateway;

    async getAllUser(req: IGetUserRequest): Promise<IGetUsersResponse | null> {
        const path = '/web-admin/users'
        const api = this.host + path;
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
        if (response.status === 200) {
            let result = await response.json();
            // console.log(result);
            let content: IGetUsersResponse = {
                userInfos: result
            }
            return content;
        } else {
            throw Error(`Error Code: ${response.status}`);
        }


    }

    async getUserByMeterID(req: IGetUserByIDRequest): Promise<IGetUserByIDResponse | null> {
        const path = `/web-admin/users/detail/${req.meterId}`;
        const api = this.host + path;
        let response: Response;
        let token = req.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }

        try {
            response = await fetch(api, {
                method: "GET",
                headers
            })
        } catch (e) {
            throw Error(`Unexpected handle error`);
        }
        if (response.status === 200) {
            const result: IGetUserByIDResponse = await response.json();
            const userDetail: IUserDetail = result.userDetail;
            const meterDetail: MeterDetail = result.meterDetail;
            const content: IGetUserByIDResponse = {
                userDetail: userDetail,
                meterDetail: meterDetail,
            }
            console.log(`get userDetail API `);
            console.log(content)
            return content;
        } else {
            throw Error(`Error Code: ${response.status}`);
        }
    }

    // async postNewAccount(): Promise
    // roles?=aggretator+prosumer+consumer
    async getUserByFilter(request: IGetSearchUserRequest): Promise<IGetUsersResponse | null> {
        // https://egat-p2p-webadmin-profile.di.iknowplus.co.th/users/search?value=0123456789
        const text = request.text;
        const path = '/web-admin/users/search'
        const api = new URL(this.host + path);
        api.searchParams.append('value', text);
        console.log(`filter uri is : ${api.toString()}`);
        let response: Response;
        let accessToken = request.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
        try {
            response = await fetch(api.toString(), {
                method: "GET",
                headers
            });
        } catch (e) {
            throw Error(`Unexpected handle error`);
        }
        if (response.status === 200) {

            let result = await response.json();
            console.log(result);
            let content: IGetUsersResponse = {
                userInfos: result
            }
            return content;
        } else {
            throw Error(`Error Code: ${response.status}`);
        }

    }

    async editUser(request: IEditUserRequest): Promise<boolean> {
        const path = '/web-admin/users/detail/';
        const api = new URL(this.host + path + request.meterDetail.meterId);
        let response: Response;
        let accessToken = request.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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
            throw Error(`Unexpected handle error`);
        }
        if (response.status === 204) {
            return true;
        } else {
            throw Error(`Error Code: ${response.status}`);
        }
    }




    async getUsersByRoles(request: IGetUsersByRolesRequest): Promise<IGetUsersResponse | null> {
        // https://egat-p2p-webadmin-profile.di.iknowplus.co.th/users/filter?roles=admin

        const rolesParams = request.roles.join('+');
        console.log(`hello from getUserByRoles API`);
        console.log(rolesParams);
        const path = '/web-admin/users/filter'
        const api = new URL(this.host + path);
        api.searchParams.append('roles', rolesParams);
        let response: Response;
        let accessToken = request.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
        try {
            response = await fetch(api.toString(), {
                method: "GET",
                headers
            });
        } catch (e) {
            throw Error(`Unexpected handle error`);
        }
        if (response.status === 200) {
            let result = await response.json();
            console.log(result);
            let content: IGetUsersResponse = {
                userInfos: result
            }
            return content;
        } else {
            throw Error(`Error Code: ${response.status}`);

        }
    }


    async createAdmin(request: ICreateAdminRequest): Promise<ICreateAdminResponse | null> {
        const path = '/web-admin/users/admin';
        const api = new URL(this.host + path);
        let response: Response;
        let accessToken = request.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify(request.admin);
        console.log(`----------------body context--------------`);
        console.log(body);
        console.log(`----------------body context END----------`);
        try {
            response = await fetchWithTimeout(api.toString(), {
                method: "POST",
                headers,
                body: body
            });
            // response = await fetch(api.toString(), {
            //     method: "POST",
            //     headers,
            //     body: body
            // });
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