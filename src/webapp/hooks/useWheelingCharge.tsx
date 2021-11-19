import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { WheelingChargeAPI } from "../api/referenceData/WheelingChargeAPI";
import { IWheelingCharge, wheelingChargeState } from "../state/reference-data/wheeling-chart/wheeling-charge-state";

export function useWheelingCharge() {
    const [wheelingCharge, setWheelingCharge] = useRecoilState(wheelingChargeState);
    const api = new WheelingChargeAPI();
    const refreshWheelingCharge = useCallback(async () => {
        const response = await api.getWheelingCharge({});
        console.log('call wheeling chart api');
        if (response !== null) {
            console.info(response);
            setWheelingCharge(response.context);
        }
    }, [])

    const updatedWheelingCharge = useCallback(async (wheelingCharge: IWheelingCharge) => {
        const response = await api.updatedWheelingCharge({ wheelingCharge: wheelingCharge });
        console.info(wheelingCharge);
        if (response !== null) {
            console.info(`updated is : ${response}`);

        }
    }, [])

    useEffect(() => {
        if (!wheelingCharge) {
            refreshWheelingCharge();
            console.debug('call ge wheelingChart');
            console.info(wheelingCharge);
        }

    }, [wheelingCharge, refreshWheelingCharge])
    return {
        wheelingCharge,
        refreshWheelingCharge,
        updatedWheelingCharge
    }

}