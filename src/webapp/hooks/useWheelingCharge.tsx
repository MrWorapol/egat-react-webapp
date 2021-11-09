import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { WheelingChargeAPI } from "../api/referenceData/WheelingChargeAPI";
import { wheelingChargeState } from "../state/wheeling-charge-state";

export function useWheelingCharge() {
    const [wheelingCharge, setWheelingCharge] = useRecoilState(wheelingChargeState);
    const api = new WheelingChargeAPI();
    const refreshWheelingCharge = useCallback(async () => {
        const response = await api.getWheelingCharge({});
        if(response !== null) {
            setWheelingCharge(response.context);
        }
    }, [])

    useEffect(() => {
        if (!wheelingCharge) {
            refreshWheelingCharge()
        }

    }, [wheelingCharge, refreshWheelingCharge])
    return {
        wheelingCharge,
        refreshWheelingCharge
    }

}