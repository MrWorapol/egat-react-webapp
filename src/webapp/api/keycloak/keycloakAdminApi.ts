
export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export default class KeycloakAdminApi {
    private host = 'https://egat-p2p-webadmin-login.di.iknowplus.co.th';
    // username -> egat-p2p-admin@gmail.com
    // password -> P@ssw0rd

    async login(request: LoginRequest): Promise<LoginResponse | null> {
        console.log(`call login API`);
        const path = '/login';
        // let header = new Headers({ 'Content-Type': 'application/'})
        const api = this.host + path;

        const body = JSON.stringify(request);
        let response: Response;

        try {
            response = await fetch(api, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });
        } catch (e) {
            return null;
        }

        if (response.status !== 200) {
            return null;
        }

        console.log(`from api method`);
        // console.log(response.json());
        return response.json();
    }

    async logout() {
        return;
    }

    async refreshToken(refreshToken: string) {
        return;
    }

}