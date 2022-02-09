import { INewsDetail } from "../../state/news-management/news-detail";//done
import { NewsInfo } from "../../state/news-management/news-info";//already done
import { IUserSession } from "../../state/user-sessions";//Done?
import { egatGateway, localGateway } from '../../constanst';//{WIP}

interface IPublishNewsRequest {
    session: IUserSession,
    newsDetail: INewsDetail
}

interface IGetNewsRequest {
    session: IUserSession,
    keyword?: string
}

interface ICreateNewsRequest {
    session: IUserSession,
    //admin: IAdminRegistratoinState,
    newsInfo: NewsInfo,
}

interface IDeleteNewsRequest {
    session: IUserSession,
    newsDetail: INewsDetail
}

interface ICreateNewsResponse {
    status: number,
    newsInfo: NewsInfo,
}

interface IGetNewsResponse {
    newsInfos: NewsInfo[],
}

let accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQcXBzb083c3loQ1NPUFBRaW93VVBfV19aVnJHY3VCWWJjSS1QMEZrc21rIn0.eyJleHAiOjE2NDI2MTExNTIsImlhdCI6MTY0MjU5MzE1MiwianRpIjoiMzI5Y2IyYzYtZmYxZC00YjFkLWI0M2QtZjk2YWQ2NjQyZjk0IiwiaXNzIjoiaHR0cDovL2tleWNsb2FrL2F1dGgvcmVhbG1zL2VnYXQiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNDQyZWI1MGEtMGU1OS00MmFiLThlZjAtOWNjMzc5YTNlMzA2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZWdhdC1wMnAtdHJhZGluZyIsInNlc3Npb25fc3RhdGUiOiIyNDljNjM5Ny1mM2IxLTRiYWMtOWU1OS01NzlkODcyMTMwMTAiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZWdhdCIsIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImVnYXQtcDJwLXRyYWRpbmciOnsicm9sZXMiOlsiYWRtaW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjI0OWM2Mzk3LWYzYjEtNGJhYy05ZTU5LTU3OWQ4NzIxMzAxMCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZWdhdC13ZWItYWRtaW4iLCJlbWFpbCI6ImVnYXQtd2ViLWFkbWluIn0.AzydPY2QYJnf1TP-CQlI0D5zp0lchfuzXMLwWIkEGjp3RPsB1l7ZNJF_ePglwAeyw1Li9prFEbNDUMz5ypSl4sEgtJruJkJtoj3umWOEP_p8kR5YwxfTbkI8j8k6j1tcSpeT7eTiRmsp81mf5sqkyZzv7pUGdwzfCMze6n-gvK9anOCcwhmv8mAC7vltsk8RSMpgDJr_KKIMxsI5qMa2xcl8LUcE4r2FYXmtUNPYOQqaWCYNwBH_m8b4V3jOyR9XW-xwuKPBiKRE2f3dciavdqcRf4TJhJ2Rnj4uQAZI8JKSuoJGqpTjbHmFWIyXRbfIVAUP1BwfpeqpoheedsrvZg";
export default class NewsManagementAPI {
    private host = egatGateway;

    async getAllNews(req: IGetNewsRequest): Promise<IGetNewsResponse | null> {
        let session = req.session;
        const path = '/web-admin/news'
        const api = this.host + path;
        let response: Response;

        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
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

        if (!response.ok) {
            return null;
        }
        let result = await response.json();
        // console.log(result);
        // console.log(result.statusCode);
        let content: IGetNewsResponse = {
            newsInfos: result
        }
        return content;
    }

    async getNews(req: IGetNewsRequest): Promise<IGetNewsResponse | null> {

        const path = '/web-admin/news/search'
        const api = new URL(this.host + path);
        let response: Response;
        if (req.keyword) {
            api.searchParams.append('value', req.keyword);
        }
        // console.log(`filter uri is : ${api.toString()}`);
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer ${req.session.accessToken}`,
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
        if (!response.ok) {
            return null;
        }
        else {
            let result = await response.json();
            // console.log(result);
            // console.log(result.statusCode);
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
        let accessToken = request.session.accessToken;
        // let accessToken = "";
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify({
            title: request.newsInfo.title,
            content: request.newsInfo.content,
        });


        try {
            response = await fetch(api.toString(), {
                method: "POST",
                headers,
                body: body
            });
            let result = await response.json();

            let content: ICreateNewsResponse = {
                status: result.status,
                newsInfo: result.newsInfo,
            }
            return content;
        } catch (e) {
            throw new Error('error')
        }
    }

    async publishNews(request: IPublishNewsRequest): Promise<void> {
        const path = `/web-admin/news/${request.newsDetail.id}`;
        const api = new URL(this.host + path);//(+ Locate)
        let response: Response;
        let accessToken = request.session.accessToken;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify({
            newsDetail: request.newsDetail,
        });

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

        if (response.status !== 204) {
            throw new Error(`${response.status} : ${response.statusText}`);
        }

    }

    async deleteNews(request: IDeleteNewsRequest): Promise<void> {
        const path = `/web-admin/news/${request.newsDetail.id}`;
        const api = new URL(this.host + path);//(+ Locate)
        let response: Response;
        let accessToken = request.session.accessToken;
        // let accessToken = "";
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
            Authorization: `Bearer ${accessToken}`,
        }
        const body = JSON.stringify({
            newsDetail: request.newsDetail,
        });

       
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

        if (response.status !== 204) {
            throw new Error(`${response.status} : ${response.statusText}`);
        }
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
            }, {
                id: '0002',
                title: 'italicized',
                date: '2/1/2012',
                content: '*italicized text*',
                status: 'PUBLISHED',
            }, {
                id: '0003',
                title: 'bold',
                date: '3/1/2012',
                content: '**bold text**',
                status: 'PUBLISHED',
            }, {
                id: '0004',
                title: 'Order',
                date: '3/1/2012',
                content: "1. First item 2. Second item 3. Third item",
                status: 'DRAFT',
            },
        ],
    }
}
