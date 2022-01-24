import { egatGateway, localGateway } from "../../constanst";

export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}
interface refreshRequest {
    refreshToken: string;
}

export default class KeycloakAdminApi {
    private host = egatGateway;


    async login(request: LoginRequest): Promise<LoginResponse | null> {

        const path = '/web-admin/login';

        const api = this.host + path;

        const body = JSON.stringify({ username: request.username, password: request.password });
        let response: Response;

        try {
            response = await fetch(api, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ZWdhdDpmYjIyN2ZlMS1mNWNhLTRjOTItYmE2My03NTg1NjQ5MTU2NTg=',
                },
                body: body
            });
        } catch (e) {
            console.log(e);
            throw Error(`Unexpected Error`);
        }
        if (response.status === 401) {
            throw Error(`Username or Password incorrect`)
        }
        if (response.status === 500) {
            throw Error(`Internal Server Error`)
        }
        if (response.status === 504) {
            throw Error(`Gateway timeout`)
        }
        if (response.status !== 200) {
            throw Error(`Username or Password incorrect`)

        }
        return response.json();
    }

    async refreshToken(req: refreshRequest): Promise<LoginResponse | null> {
        const path = '/web-admin/login/refresh-token';

        const api = this.host + path;
        const body = JSON.stringify({ refreshToken: req.refreshToken });
        let response: Response;
        try {
            response = await fetch(api, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ZWdhdDpmYjIyN2ZlMS1mNWNhLTRjOTItYmE2My03NTg1NjQ5MTU2NTg=',
                },
                body: body
            });
            if (response.status === 200) {
                return response.json();
            }
            if (response.status === 401) {
                throw Error(`Token Expired`);
            }
            if (response.status >= 500) {
                throw Error(`Internal Server Error`);
            }
            if (response.status >= 300) {
                throw Error(`Token information not match`);
            }
            else {
                throw Error(`Error Code: ${response.status}`);

            }
        } catch (e) {
            throw Error(`Unexpected handle error`);
        }

    }
    async logout() {

        return;
    }

}