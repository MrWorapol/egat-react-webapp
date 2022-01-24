import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfo } from "../state/user-management/user-info";
import UserManagementAPI from "../api/user/userManagementApi"
import { userSessionState } from "../state/user-sessions";
import { useLoadingScreen } from "./useLoadingScreen";
import { useSnackBarNotification } from "./useSnackBarNotification";

interface ISearchField {
    text?: string,
    roles?: string[],
}

export function useAllUser() {
    const api = new UserManagementAPI();
    const [userInfoDataValue, setUserInfoValue] = useRecoilState(userInfo);
    const session = useRecoilValue(userSessionState);
    const { showLoading, hideLoading } = useLoadingScreen();
    const { showSnackBar } = useSnackBarNotification();

    const refreshAllUser = useCallback(async (searchField?: ISearchField) => {
        if (session) {
            if (!searchField) {//get without filter
                showLoading(10);
                try {
                    const response = await api.getAllUser({ session });
                    if (response) {

                        setUserInfoValue(response.userInfos);
                        hideLoading(10);
                    } else {
                        setUserInfoValue([]);
                        hideLoading(10);

                    }
                } catch (err) {
                    hideLoading(10);

                    showSnackBar({ serverity: "error", message: `${err}` });

                }
            } else { //get with filter
                if (searchField.text) { //case search by text
                    showLoading(10);
                    try {
                        const response = await api.getUserByFilter({ text: searchField.text, session });
                        if (response && response.userInfos.length > 0) {

                            setUserInfoValue(response.userInfos);
                            hideLoading(10);
                        } else {
                            setUserInfoValue([]);
                            hideLoading(10);
                            showSnackBar({ serverity: "info", message: `${searchField.roles} not found` });
                        }
                    } catch (err) {
                        setUserInfoValue([]);
                        hideLoading(10);
                        showSnackBar({ serverity: "error", message: `${err}` });

                    }
                }
                if (searchField.roles) { //case search by roles
                    showLoading(10);
                    try {

                        const response = await api.getUsersByRoles({ roles: searchField.roles, session });
                        if (response && response.userInfos.length > 0) {
                            setUserInfoValue(response.userInfos);
                            hideLoading(10);

                        } else {
                            setUserInfoValue([]);
                            hideLoading(10);
                            showSnackBar({ serverity: "info", message: `${searchField.roles} not found` });
                        }
                    } catch (err) {
                        setUserInfoValue([]);
                        hideLoading(10);
                        showSnackBar({ serverity: "error", message: `${err}` });

                    }
                }
            }
        }
    }, [setUserInfoValue]);


    useEffect(() => {
        if (!userInfoDataValue) {
            refreshAllUser();
        }
        return (() => {
        })
    }, [userInfoDataValue, refreshAllUser]
    )
    return {
        userInfoData: userInfoDataValue,
        refreshAllUser,
    }
}