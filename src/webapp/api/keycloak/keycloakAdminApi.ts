import { egatHost } from "../../constanst";

export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export default class KeycloakAdminApi {
    private host = egatHost;
    

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
            return null;
        }
        if (response.status === 401) {

        }
        if (response.status !== 200) {

            return null;
        }

        console.log(`from api method`);
        return response.json();
    }

    async logout() {
        return;
    }

    async refreshToken(refreshToken: string) {
        return;
    }

}