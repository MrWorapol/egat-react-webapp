import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { OtherSettingAPI } from "../../api/referenceData/OhterSettingAPI";
import { IOtherSetting, otherSettingState } from "../../state/reference-data/other-setting/othersetting-state";
import { userSessionState } from "../../state/user-sessions";


export function useOtherSetting() {
    const [otherSetting, setOtherSetting] = useRecoilState(otherSettingState);
    const userSession = useRecoilValue(userSessionState);

    const api = new OtherSettingAPI();
    const refreshOtherSetting = useCallback(async () => {
        if (userSession) {
            console.warn('Call refresh Other Setting');
            const result = await api.getOtherSetting({ session: userSession });
            if (result !== null) {
                console.info(result.context);
                setOtherSetting(result.context);
            }
        }
    }, [])

    const putOtherSetting = useCallback(async (data: IOtherSetting) => {
        if (userSession) {
            const result = await api.putOtherSetting({ session: userSession, setting: data });
            if (result) {
                refreshOtherSetting();
                return true;
            } else {
                console.error(`cannot update setting`);
                return false;
            }
        }
    }, [])

    useEffect(() => {
        console.warn(userSession);
        if (!otherSetting) {
            refreshOtherSetting();
            console.debug('call get other setting');
            // console.info(wheelingCharge);
        }

    }, [otherSetting, refreshOtherSetting])
    return {
        otherSetting,
        refreshOtherSetting,
        putOtherSetting
    }

}