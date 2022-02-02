import { useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";
import UserManagementAPI from "../api/user/userManagementApi";
import { IAdminRegistratoinState, adminRegistration } from '../state/user-management/admin-registration-state';
import { userSessionState } from "../state/user-sessions";
import { useAllUser } from "./useAllUser";

export function useCreateAdmin() {
    const api = new UserManagementAPI();
    const session = useRecoilValue(userSessionState);
    const { refreshAllUser } = useAllUser();

    const createAdmin = useCallback(async (admin: IAdminRegistratoinState) => {
        if (session) {
            try {
                const response = await api.createAdmin({
                    session,
                    admin: admin,
                });
                if (response) {
                    console.log(`response from api`);
                    console.log(response);
                    refreshAllUser();
                }
            } catch (err) {

            }
        }
    }, [refreshAllUser])


    return {
        adminRegistration,
        createAdmin,
    }

}