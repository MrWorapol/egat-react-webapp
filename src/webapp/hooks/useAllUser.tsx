import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfo } from "../state/user-management/user-info";
import UserManagementAPI from "../api/user/userManagementApi"
import { userSessionState } from "../state/user-sessions";
import { useLoadingScreen } from "./useLoadingScreen";

interface ISearchField {
    text?: string,
    roles?: string[],
}

export function useAllUser() {
    const api = new UserManagementAPI();
    const [userInfoDataValue, setUserInfoValue] = useRecoilState(userInfo);
    const session = useRecoilValue(userSessionState);
    const { showLoading, hideLoading } = useLoadingScreen();
    const refreshAllUser = useCallback(async (searchField?: ISearchField) => {
        if (session) {
            if (!searchField) {//get without filter
                showLoading(10);
                const response = await api.getAllUser({ session });
                if (response) {

                    setUserInfoValue(response.userInfos);
                    hideLoading(10);
                } else {
                    setUserInfoValue([]);
                    hideLoading(10);

                }
            } else { //get with filter
                if (searchField.text) { //case search by text
                    showLoading(10);
                    const response = await api.getUserByFilter({ text: searchField.text, session });
                    if (response) {
                        hideLoading(10);

                        setUserInfoValue(response.userInfos);
                    } else {
                        setUserInfoValue([]);
                        hideLoading(10);

                    }
                    return;
                }
                if (searchField.roles) { //case search by roles
                    showLoading(10);
                    const response = await api.getUsersByRoles({ roles: searchField.roles, session });
                    if (response) {
                        setUserInfoValue(response.userInfos);
                        hideLoading(10);

                    } else {
                        setUserInfoValue([]);
                        hideLoading(10);

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