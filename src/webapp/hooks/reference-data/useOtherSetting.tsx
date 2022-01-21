import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { OtherSettingAPI } from "../../api/referenceData/OhterSettingAPI";
import { NavigationCurrentType } from "../../state/navigation-current-state";
import { IOtherSetting, otherSettingState } from "../../state/reference-data/other-setting/othersetting-state";
import { userSessionState } from "../../state/user-sessions";
import { useLoadingScreen } from "../useLoadingScreen";
import { useNavigationGet } from "../useNavigationGet";
import { useSnackBarNotification } from "../useSnackBarNotification";


export function useOtherSetting() {
    const [otherSetting, setOtherSetting] = useRecoilState(otherSettingState);
    let session = useRecoilValue(userSessionState);
    const api = new OtherSettingAPI();
    const { currentState } = useNavigationGet();
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();

    const refreshOtherSetting = async () => {
        if (session) {
            try {
                showLoading(10);
                const result = await api.getOtherSetting({ session: session });
                if (result !== null) {
                    console.info(result.context);
                    setOtherSetting(result.context);
                }
                hideLoading(10);

            } catch (e) {
                hideLoading(10)
                showSnackBar({ serverity: 'error', message: `${e}` })

            }
        }
    };

    const putOtherSetting = async (data: IOtherSetting) => {
        if (session) {
            try {
                showLoading(10);
                const result = await api.putOtherSetting({ session: session, setting: data });
                if (result) {
                    refreshOtherSetting();
                    showSnackBar({
                        serverity: "success",
                        message: "update Successful"
                    })
                    hideLoading(10)
                    return true;
                } else {
                    console.error(`cannot update setting`);
                    hideLoading(10)
                    return false;
                }
            } catch (e) {
                hideLoading(10)
                showSnackBar({ serverity: 'error', message: `${e}` })

            }
        }
    };

    useEffect(() => {

        if (session && currentState === NavigationCurrentType.OTHER_SETTING) {
            if (!otherSetting) {
                refreshOtherSetting();
            }
        }
    }, [session, currentState]);


    return {
        otherSetting,
        refreshOtherSetting,
        putOtherSetting
    }

}