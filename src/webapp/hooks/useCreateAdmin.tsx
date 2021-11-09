import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import UserManagementAPI from "../api/user/userManagementApi";
import { IAdminRegistratoinState, adminRegistration } from '../state/admin-registration-state';
import { session } from "../state/user-sessions";
import { useAllUser } from "./useAllUser";

export function useCreateAdmin() {
    const api = new UserManagementAPI();
    const [adminRegistationValue, setadminRegistrationValue] = useRecoilState(adminRegistration);
    const sessionUser = useRecoilValue(session);
    const { refreshAllUser } = useAllUser();

    const createAdmin = useCallback(async (admin: IAdminRegistratoinState) => {
        try {
            const response = await api.createAdmin({
                // token : sessionUser,
                admin: admin,
            });
            if (response) {
                console.log(`response from api`);
                console.log(response);
                refreshAllUser();
            }
        } catch (err) {

        }
    }, [refreshAllUser])


    return {
        adminRegistration,
        createAdmin,
    }

}