import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { OtherSettingAPI } from "../api/referenceData/OhterSettingAPI";
import { IOtherSetting, otherSettingState } from "../state/reference-data/other-setting/othersetting-state";
import { userSessionState } from "../state/user-sessions";

export function useOtherSetting() {
    const [otherSetting, setOtherSetting] = useRecoilState(otherSettingState);
    const sessionValue = useRecoilValue(userSessionState);

    const api = new OtherSettingAPI();
    const refreshOtherSetting = useCallback(async () => {
        const result = await api.getOtherSetting({});
        console.log('call wheeling chart api');
        if (result !== null) {
            console.info(result.context);
            setOtherSetting(result.context);
        }
    }, [])

    const putOtherSetting = useCallback(async (data: IOtherSetting) => {
        const result = await api.putOtherSetting({ setting: data });
        if (result) {
            refreshOtherSetting();
            return true;
        } else {
            console.error(`cannot update setting`);
            return false;
        }
    }, [])

    useEffect(() => {
        if (!otherSetting) {
            refreshOtherSetting();
            console.debug('call ge wheelingChart');
            // console.info(wheelingCharge);
        }

    }, [otherSetting, refreshOtherSetting])
    return {
        otherSetting,
        refreshOtherSetting,
        putOtherSetting
    }

}