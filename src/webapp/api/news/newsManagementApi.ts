import { INewsDetail } from "../../state/news-management/news-detail";//done
import { NewsInfo } from "../../state/news-management/news-info";//already done
import { IUserSession } from "../../state/user-sessions";//Done?
import { newsApi } from '../../constanst';//{WIP}
import { IAdminRegistratoinState } from "../../state/user-management/admin-registration-state";//?

interface IPublishNewsRequest {
    token?: IUserSession,
    newsDetail :INewsDetail
}

interface IGetNewsRequest {
    token?: IUserSession,
    keyword : string
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

interface ICreateNewsResponse {
    status: number,
    newsInfo: NewsInfo,
}

interface IGetNewsResponse {
    newsInfos: NewsInfo[],
}

interface IPublishNewsResponse {
    status: string,
}

interface IDeleteNewsResponse {
    status: string,
}

let accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQcXBzb083c3loQ1NPUFBRaW93VVBfV19aVnJHY3VCWWJjSS1QMEZrc21rIn0.eyJleHAiOjE2NDI2MTExNTIsImlhdCI6MTY0MjU5MzE1MiwianRpIjoiMzI5Y2IyYzYtZmYxZC00YjFkLWI0M2QtZjk2YWQ2NjQyZjk0IiwiaXNzIjoiaHR0cDovL2tleWNsb2FrL2F1dGgvcmVhbG1zL2VnYXQiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNDQyZWI1MGEtMGU1OS00MmFiLThlZjAtOWNjMzc5YTNlMzA2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZWdhdC1wMnAtdHJhZGluZyIsInNlc3Npb25fc3RhdGUiOiIyNDljNjM5Ny1mM2IxLTRiYWMtOWU1OS01NzlkODcyMTMwMTAiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZWdhdCIsIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImVnYXQtcDJwLXRyYWRpbmciOnsicm9sZXMiOlsiYWRtaW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjI0OWM2Mzk3LWYzYjEtNGJhYy05ZTU5LTU3OWQ4NzIxMzAxMCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZWdhdC13ZWItYWRtaW4iLCJlbWFpbCI6ImVnYXQtd2ViLWFkbWluIn0.AzydPY2QYJnf1TP-CQlI0D5zp0lchfuzXMLwWIkEGjp3RPsB1l7ZNJF_ePglwAeyw1Li9prFEbNDUMz5ypSl4sEgtJruJkJtoj3umWOEP_p8kR5YwxfTbkI8j8k6j1tcSpeT7eTiRmsp81mf5sqkyZzv7pUGdwzfCMze6n-gvK9anOCcwhmv8mAC7vltsk8RSMpgDJr_KKIMxsI5qMa2xcl8LUcE4r2FYXmtUNPYOQqaWCYNwBH_m8b4V3jOyR9XW-xwuKPBiKRE2f3dciavdqcRf4TJhJ2Rnj4uQAZI8JKSuoJGqpTjbHmFWIyXRbfIVAUP1BwfpeqpoheedsrvZg";
export default class NewsManagementAPI {
    private host = newsApi;

    async getAllNews(): Promise<IGetNewsResponse | null> {
        const path = '/web-admin/news'
        const api = this.host + path;
        let response: Response;
        let token = 'token';
        //let accessToken = "";
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer ${accessToken}`,
        }
        try {
            response = await fetch(api.toString(), {
                method: "GET",
                headers
            });
            ///empty new
            
        } catch (e) {
            console.log(e);
            console.log('GET Error ');
            return null;
        }

        if(!response.ok){
            return null;
        }
        let result = await response.json();
        console.log(result);
        console.log(result.statusCode);
            let content: IGetNewsResponse = {
                newsInfos: result
            }
            return content;

        // let res = await fetchWithTimeout(uri.toString(), {
        //     method: "GET",
        //     headers,
        // })

        //mocking Data
        // const content: IGetNewsResponse = createMockData();
        // return Promise.resolve(content);
    }

    async getNews(request: IGetNewsRequest): Promise<IGetNewsResponse | null> {
        const path = '/web-admin/news/search'
        const api = new URL(this.host + path);
        let response: Response;
        let token = 'token';
        //let accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJBLWVFWExEU21pbFNwNU5ESjVyWmxnLS1FWDdRcEF4QVdRc3lsMHVPQU4wIn0.eyJleHAiOjE2NDIxNzA2NTAsImlhdCI6MTY0MjE1MjY1MCwianRpIjoiM2ZhMWYwOTYtNjk3MC00OGExLThjNDctZmI4MzlhNzljNGU5IiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5pa25vd3BsdXMuY28udGgvYXV0aC9yZWFsbXMvZWdhdCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkYjA4MzI3MS04NmI5LTQwMDUtYTBjYS02ZTQ5ZTc0MjI2YzYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJlZ2F0LXAycC10cmFkaW5nIiwic2Vzc2lvbl9zdGF0ZSI6ImYzODViYjNjLTlhNTctNGJkMS1iZDMyLTQyZjZjOTg0OWRjZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9lZ2F0LXAycC1sb2dpbi5kaS5pa25vd3BsdXMuY28udGgvIiwiaHR0cHM6Ly9lZ2F0LXAycC1yZWdpc3Rlci5kaS5pa25vd3BsdXMuY28udGgiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAvKiIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1lZ2F0Iiwib2ZmbGluZV9hY2Nlc3MiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiZWdhdC1wMnAtdHJhZGluZyI6eyJyb2xlcyI6WyJhZG1pbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiZjM4NWJiM2MtOWE1Ny00YmQxLWJkMzItNDJmNmM5ODQ5ZGNlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJlZ2F0LXdlYi1hZG1pbiIsImVtYWlsIjoiZWdhdC13ZWItYWRtaW4ifQ.fgeAUdZ7H9o5SWSecFt_BPEh5ju6181n-XGdMs9rUUFlL3W6Rp_PeWqBeEEKsHiGfOAUTh8lJ4-J0mklhn5QzyPm633Kph4LpRm3AIk7bS2k2iMiOT1rOJwV7p41purDBXe9m7f0k5bOCl70uPF47YkUNJOY3LrrgIEjMUTRDIG_FFNR5WPwbfCsRjddDgixz2jinwPubGMsbyzXjnSRHmxrJiMv8RzEHkbcuf9NE54cClX1SRLpYpOvEVQg1mORwe_vWxAF-6pN3AgMVnGXXjQo2WYxvs3VKgsygPJJnYiY1x7r6h8G8lOaz4YQFtI3xCRpxhND0hM-XQYUo5OcIQ";
        api.searchParams.append('value', request.keyword);
        console.log(`filter uri is : ${api.toString()}`);
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer ${accessToken}`,
        }
        try {
            response = await fetch(api.toString(), {
                method: "GET",
                headers
            });
            
        } catch (e) {
            console.log(e);
            console.log('GET Error ');
            return null;
        }

        ///empty new
        if(!response.ok){
            return null;
        }
        else{
            let result = await response.json();
            console.log(result);
            console.log(result.statusCode);
            let content: IGetNewsResponse = {
                newsInfos: result
            }
            return content;
        }
        
        
        

        // let res = await fetchWithTimeout(uri.toString(), {
        //     method: "GET",
        //     headers,
        // })

        //mocking Data
        // const content: IGetNewsResponse = createMockData();
        // return Promise.resolve(content);
    }

    async createNews(request: ICreateNewsRequest): Promise<ICreateNewsResponse | null> {
        const path = '/web-admin/news';
        const api = new URL(this.host + path);
        let response: Response;
        //let accessToken = request.token.accessToken ;
        // let accessToken = "";
        let headers = {
            "Content-Type": "application/json",
             Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify({
            title: request.newsInfo.title,
            content: request.newsInfo.content,
        });

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
            throw new Error('error')
        }
        
        // if (response.status){
        //     console.log(response.status)
        // }
    }

    async publishNews(request: IPublishNewsRequest): Promise<void> {
        const path = `/web-admin/news/${request.newsDetail.id}`;
        const api = new URL(this.host + path );//(+ Locate)
        let response: Response;
        // let accessToken = "";
        // let accessToken = request.token.accessToken ;
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
             Authorization: `Bearer ${accessToken}`,
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
                // body: body
            });
        } catch (e) {
            console.log('error')
            throw new Error('error')
        }

        if (response.status){
            console.log(response.status)
        }

        // let result = await response.json();
        //     console.log(result);
        //     let content: IPublishNewsResponse = {
        //         status: result.status,
        //     }
        //     return content;

    }

    async deleteNews(request: IDeleteNewsRequest): Promise<void> {
        const path = `/web-admin/news/${request.newsDetail.id}`;
        const api = new URL(this.host + path );//(+ Locate)
        let response: Response;
        // let accessToken = request.token.accessToken ;
        // let accessToken = "";
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
            Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify({
            newsDetail: request.newsDetail,
        });

        console.log(`----------------body context--------------`);
        console.log(body);
        console.log(`----------------body context END----------`);
        try {
            response = await fetch(api.toString(), {
                method: "Delete",
                headers,
                // body: body
            });
        } catch (e) {
            console.log('error')
            throw new Error('error')
        }
        
        if (response.status){
            console.log(response.status)
        }

        // let result = await response.json();
        //     console.log(result);
        //     let content: IDeleteNewsResponse = {
        //         status: result.status,
        //     }
        //     return content;
    }
}

function createMockData(): IGetNewsResponse {
    return {
        newsInfos: [
            {
                id: '0001',
                title: 'title',
                date: '1/1/2012',
                content: 'Text',
                status: 'PUBLISHED',
            },{
                id: '0002',
                title: 'italicized',
                date: '2/1/2012',
                content: '*italicized text*',
                status: 'PUBLISHED',
            },{
                id: '0003',
                title: 'bold',
                date: '3/1/2012',
                content: '**bold text**',
                status: 'PUBLISHED',
            },{
                id: '0004',
                title: 'Order',
                date: '3/1/2012',
                content: "1. First item 2. Second item 3. Third item",
                status: 'DRAFT',
            },
        ],
    }
}