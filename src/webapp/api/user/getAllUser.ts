import React from 'react'
import { useRecoilState } from "recoil";
import { userApi } from '../../constanst';
import { UserInfo } from '../../state/user-management/user-info';
import {  IUserSession } from "../../state/user-sessions";

export interface GetAllUserRequest {
    session: IUserSession
}

export interface GetAllUserResponse {
    userInfos: UserInfo[],
}
export const getAllUser = async (
    request: GetAllUserRequest
): Promise<GetAllUserResponse | null> => {

    const path = '/users'
    const uri = new URL(userApi + path);
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
    let content: GetAllUserResponse = {
        userInfos: result
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
