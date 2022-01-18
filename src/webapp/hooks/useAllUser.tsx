import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfo } from "../state/user-management/user-info";
import UserManagementAPI from "../api/user/userManagementApi"
import { userSessionState } from "../state/user-sessions";

interface ISearchField {
    text?: string,
    roles?: string[],
}

export function useAllUser() {
    const api = new UserManagementAPI();
    const [userInfoDataValue, setUserInfoValue] = useRecoilState(userInfo);
    const session = useRecoilValue(userSessionState);

    const refreshAllUser = useCallback(async (searchField?: ISearchField) => {
        if (session) {
            if (!searchField) {//get without filter
                const response = await api.getAllUser({ session });
                if (response) {

                    setUserInfoValue(response.userInfos);

                } else {
                    setUserInfoValue([]);
                }
            } else { //get with filter
                if (searchField.text) { //case search by text
                    const response = await api.getUserByFilter({ text: searchField.text,session });
                    if (response) {
                        setUserInfoValue(response.userInfos);
                    } else {
                        setUserInfoValue([]);
                    }
                    return;
                }
                if (searchField.roles) { //case search by roles
                    const response = await api.getUsersByRoles({ roles: searchField.roles,session });
                    if (response) {
                        setUserInfoValue(response.userInfos);
                    } else {
                        setUserInfoValue([]);
                    }
                    return;
                }
            }
        }
    }, [setUserInfoValue]);


    useEffect(() => {
        if (!userInfoDataValue) {
            refreshAllUser();
        }
    }, [userInfoDataValue, refreshAllUser]
    )
    return {
        userInfoData: userInfoDataValue,
        refreshAllUser,
    }
}