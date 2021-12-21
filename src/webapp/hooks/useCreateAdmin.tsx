import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import UserManagementAPI from "../api/user/userManagementApi";
import { IAdminRegistratoinState, adminRegistration } from '../state/user-management/admin-registration-state';
import { userSessionState } from "../state/user-sessions";
import { useAllUser } from "./useAllUser";

export function useCreateAdmin() {
    const api = new UserManagementAPI();
    const [adminRegistationValue, setadminRegistrationValue] = useRecoilState(adminRegistration);
    const sessionUser = useRecoilValue(userSessionState);
    const { refreshAllUser } = useAllUser();

    const createAdmin = useCallback(async (admin: IAdminRegistratoinState) => {
        if (sessionUser) {
            try {
                const response = await api.createAdmin({
                    session: sessionUser,
                    admin: admin,
                });
                if (response) {
                    console.log(`response from api`);
                    console.log(response);
                    refreshAllUser();
                    return true;
                }
            } catch (err) {
                return false;
            }
        }
    }, [refreshAllUser])


    return {
        adminRegistration,
        createAdmin,
    }

}