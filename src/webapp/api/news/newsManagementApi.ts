import { INewsDetail } from "../../state/news-management/news-detail";//done
import { NewsInfo } from "../../state/news-management/news-info";//already done
import { IUserSession } from "../../state/user-sessions";//Done?
import { newsApi } from '../../constanst';//{WIP}
import { IAdminRegistratoinState } from "../../state/user-management/admin-registration-state";//?

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



export default class NewsManagementAPI {
    private host = newsApi;

    async getAllNews(): Promise<IGetNewsResponse | null> {
        const path = '/news'
        const api = this.host + path;
        let response: Response;
        let token = 'token';
        let headers = {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
        }
        // try {
        //     response = await fetch(api, {
        //         method: "GET",
        //         headers
        //     });
        // } catch (e) {
        //     console.log(e);
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

    async publishNews(request: IPublishNewsRequest): Promise<boolean> {
        const path = `/news/${request.newsDetail.id}`;
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
            throw new Error('error')
        }

        if (response.status){
            console.log(response.status)
        }

        let result = await response.json();
            console.log(result);
            let content: IPublishNewsResponse = {
                status: result.status,
            }
            return true;

    }

    async deleteNews(request: IDeleteNewsRequest): Promise<boolean> {
        const path = `/news/${request.newsDetail.id}`;
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
                method: "Delete",
                headers,
                body: body
            });
        } catch (e) {
            throw new Error('error')
        }
        
        if (response.status){
            console.log(response.status)
        }

        let result = await response.json();
            console.log(result);
            let content: IDeleteNewsResponse = {
                status: result.status,
            }
            return true;
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
