import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { WheelingChargeAPI } from "../../api/referenceData/WheelingChargeAPI";
import { IWheelingCharge, wheelingChargeState } from "../../state/reference-data/wheeling-chart/wheeling-charge-state";
import { userSessionState } from "../../state/user-sessions";

export function useWheelingCharge() {
    const [wheelingCharge, setWheelingCharge] = useRecoilState(wheelingChargeState);
    const api = new WheelingChargeAPI();
    const userSession = useRecoilValue(userSessionState);

    const refreshWheelingCharge = useCallback(async () => {
        if (userSession) {
            const response = await api.getWheelingCharge({ session: userSession });
            console.log('call wheeling chart api');
            if (response !== null) {
                console.info(response);
                setWheelingCharge(response.context);
            }
        }
    }, [])

    const updatedWheelingCharge = useCallback(async (wheelingCharge: IWheelingCharge) => {
        if (userSession) {
            const response = await api.updatedWheelingCharge({ session: userSession, wheelingCharge: wheelingCharge });
            console.info(wheelingCharge);
            if (response !== null) {
                console.info(`updated is : ${response}`);

            }
        } else {

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