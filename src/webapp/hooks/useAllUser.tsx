import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfo } from "../state/user-info";
import UserManagementAPI from "../api/user/userManagementApi"
import { useNavigationGet } from "./useNavigationGet";
import { NavigationCurrentType } from "../state/navigation-current-state";
import { session } from "../state/user-sessions";

interface ISearchField {
    text?: string,
    roles?: string[],
}

export function useAllUser() {
    const api = new UserManagementAPI();
    const [userInfoDataValue, setUserInfoValue] = useRecoilState(userInfo);
    const { currentState } = useNavigationGet();
    const sessionUser = useRecoilValue(session);

    const refreshAllUser = useCallback(async (searchField?: ISearchField) => {
        // console.log(`call get All User`);
        // if (sessionUser) {
            if (!searchField) {//get without filter
                const response = await api.getAllUser();
                if (response) {
                    // console.log(`result from response${response.userInfos}`);
                    setUserInfoValue(response.userInfos);
                    // console.log(userInfoDataValue);
                } else {
                    setUserInfoValue([]);
                }
            } else { //get with filter
                if (searchField.text) { //case search by text
                    const response = await api.getUserByFilter({  text: searchField.text });
                    if (response) {
                        setUserInfoValue(response.userInfos);
                    } else {
                        setUserInfoValue([]);
                    }
                    return;
                }
                if (searchField.roles) { //case search by roles
                    const response = await api.getUsersByRoles({ roles: searchField.roles });
                    if (response) {
                        setUserInfoValue(response.userInfos);
                    } else {
                        setUserInfoValue([]);
                    }
                    return;
                }
            }
        // }
    }, [setUserInfoValue]);


    useEffect(() => {

        console.log(`Use Effect userInfo  data from ${userInfoDataValue}`);
        if (!userInfoDataValue) {
            refreshAllUser();
        }

        // await getUserInfo();
    }, [userInfoDataValue, refreshAllUser]
    )
    return {
        userInfoData: userInfoDataValue,
        refreshAllUser,
    }
}