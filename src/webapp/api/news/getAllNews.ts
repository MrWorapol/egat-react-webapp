import React from 'react'
import { useRecoilState } from "recoil";
import { newsApi } from '../../constanst';
import { NewsInfo } from "../../state/news-management/news-info";//already done
import {  IUserSession } from "../../state/user-sessions";

export interface GetAllNewsRequest {
    session: IUserSession
}

export interface GetAllNewsResponse {
    newsInfos: NewsInfo[]
}


export const getAllNews = async (
    request: GetAllNewsRequest
): Promise<GetAllNewsResponse | null> => {

    const path = '/news'
    const uri = new URL(newsApi + path);
    let response: Response;
    let token = request.session.accessToken;
    let headers = {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
    }
    try {
        response = await fetch(uri.toString(), {
            method: "GET",
            headers
        });
    } catch (e) {
        return null;
    }

    let result = await response.json();
    console.log(result);
    let content: GetAllNewsResponse = {
        newsInfos: result
    }
    return content;
    // let res = await fetchWithTimeout(uri.toString(), {
    //     method: "GET",
    //     headers,
    // })
    //mocking Data
    // const content: UserManagementResponse = createMockData();
    // return Promise.resolve(content);

}
