import { useCallback, useEffect } from "react";
import { selectorFamily, useRecoilState, useRecoilValue } from "recoil";
import UserManagementAPI from "../api/user/userManagementApi";
import { meterDetail } from "../state/user-management/meter-detail";
import { userDetail } from "../state/user-management/user-detail";
import { userSessionState } from "../state/user-sessions";
import { useLoadingScreen } from "./useLoadingScreen";
import { useSnackBarNotification } from "./useSnackBarNotification";

export function useUserDetail(id: string) {
    const api = new UserManagementAPI();
    const [userDetailValue, setUserDetailValue] = useRecoilState(userDetail);
    const [meterDetailValue, setMeterDetailValue] = useRecoilState(meterDetail);
    const session = useRecoilValue(userSessionState);
    const { showLoading, hideLoading } = useLoadingScreen();
    const {showSnackBar} = useSnackBarNotification();
    const refreshUserDetail = useCallback(async () => {
        if (session) {
            showLoading(10);
            console.log(`refresh USer Detail`)
            try {
                const response = await api.getUserByMeterID({ meterId: id, session });
                if (response) {
                    setUserDetailValue(response.userDetail);
                    setMeterDetailValue(response.meterDetail);
                    hideLoading(10);
                }
            }catch(e){
                showSnackBar({serverity:'error',message: `${e}`})
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