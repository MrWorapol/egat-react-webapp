import { useCallback, useEffect } from "react";
import { selectorFamily, useRecoilState, useRecoilValue } from "recoil";
import UserManagementAPI from "../api/user/userManagementApi";
import { meterDetail } from "../state/user-management/meter-detail";
import { userDetail } from "../state/user-management/user-detail";
import { userSessionState } from "../state/user-sessions";

export function useUserDetail(id: string) {
    const api = new UserManagementAPI();
    const [userDetailValue, setUserDetailValue] = useRecoilState(userDetail);
    const [meterDetailValue, setMeterDetailValue] = useRecoilState(meterDetail);
    const sessionUser = useRecoilValue(userSessionState);

    const refreshUserDetail = useCallback(async () => {
        if (sessionUser) {
            console.log(`refresh USer Detail`)
            const response = await api.getUserByMeterID({ session: sessionUser, meterId: id });
            if (response) {
                setUserDetailValue(response.userDetail);
                setMeterDetailValue(response.meterDetail);
            }
        }
    },
        [setUserDetailValue, setMeterDetailValue]
    )

    useEffect(() => {
        if (!userDetailValue || !meterDetailValue) {
            refreshUserDetail();
        }
    }, [userDetailValue, meterDetailValue, refreshUserDetail, id]);

    return {
        userDetail: userDetailValue,
        meterDetail: meterDetailValue,
        refreshUserDetailData: refreshUserDetail
    }
}

// export const getUserDetail = selectorFamily({
//     key: 'userDetailValue',
//     get: (queryParams) => async ({get}) => {
//         const api = new UserManagementAPI();
//         const response = await api.getUserDetail(); 
//         return response.userDetail
//     }
// })