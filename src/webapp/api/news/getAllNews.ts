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

    const path = '/web-admin/news'
    const uri = new URL(newsApi + path);
    let response: Response;
    let token = request.session.accessToken;
    // let accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJBLWVFWExEU21pbFNwNU5ESjVyWmxnLS1FWDdRcEF4QVdRc3lsMHVPQU4wIn0.eyJleHAiOjE2NDIxNjUxMDIsImlhdCI6MTY0MjE0NzEwMiwianRpIjoiOTUwMjhlN2EtMDIzNS00ZjM2LWE1MmUtODNiZWQ5MmNjYTdhIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5pa25vd3BsdXMuY28udGgvYXV0aC9yZWFsbXMvZWdhdCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkYjA4MzI3MS04NmI5LTQwMDUtYTBjYS02ZTQ5ZTc0MjI2YzYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJlZ2F0LXAycC10cmFkaW5nIiwic2Vzc2lvbl9zdGF0ZSI6IjIzMzdkY2IxLWQ4ZjMtNGRkYi05NzdhLTc4MTgyNmJlNjZlMSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9lZ2F0LXAycC1sb2dpbi5kaS5pa25vd3BsdXMuY28udGgvIiwiaHR0cHM6Ly9lZ2F0LXAycC1yZWdpc3Rlci5kaS5pa25vd3BsdXMuY28udGgiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAvKiIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1lZ2F0Iiwib2ZmbGluZV9hY2Nlc3MiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiZWdhdC1wMnAtdHJhZGluZyI6eyJyb2xlcyI6WyJhZG1pbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMjMzN2RjYjEtZDhmMy00ZGRiLTk3N2EtNzgxODI2YmU2NmUxIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJlZ2F0LXdlYi1hZG1pbiIsImVtYWlsIjoiZWdhdC13ZWItYWRtaW4ifQ.hUAmMRe1camC2-zCBPiSRWlpNeX54LBc9lsI3jD7VTPNnr80wbeLWhi_hziscHnNqL669CmClT02tVpY0jBzykaxRI0TRwbXMmcREhDzD_qo7jXcPndXNMgeNw2jUx9WWEnb8AaV1jx-gIP5kRLeHymsWRK7CMm7rit5H84LoIVbGktPmsfvC1iXJxD6RXNNCwOJojeQ4ZxiARJA7wV04B-z9biJZ2nlXQF9rVesUj3zUGAe77I0o9mRyMfCrRUTJUZK4e4mxXP5zhI6UV5-nq1lviiPJyBIt5i-X-F8_VYNkn_fgfFMqm0axiZihql_q97E0slKFASUqYANhO5Ssg";
        
    let headers = {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
        // Authorization: `Bearer ${accessToken}`,
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
