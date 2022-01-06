import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { WheelingChargeAPI } from "../../api/referenceData/WheelingChargeAPI";
import { NavigationCurrentType } from "../../state/navigation-current-state";
import { IWheelingCharge, wheelingChargeState } from "../../state/reference-data/wheeling-chart/wheeling-charge-state";
import { userSessionState } from "../../state/user-sessions";
import { useNavigationGet } from "../useNavigationGet";

export function useWheelingCharge() {
    const session = useRecoilValue(userSessionState);
    const { currentState } = useNavigationGet();
    const [wheelingCharge, setWheelingCharge] = useRecoilState(wheelingChargeState);

    const api = new WheelingChargeAPI();

    const refreshWheelingCharge = useCallback(async () => {
        if (session) {
            const response = await api.getWheelingCharge({ session: session });
            console.log('call wheeling chart api');
            if (response !== null) {
                console.info(response);
                setWheelingCharge(response.context);
            }
        }
    }, [])

    const updatedWheelingCharge = useCallback(async (wheelingCharge: IWheelingCharge) => {
        if (session) {
            const response = await api.updatedWheelingCharge({ session: session, wheelingCharge: wheelingCharge });
            console.info(wheelingCharge);
            if (response !== null) {
                console.info(`updated is : ${response}`);

            }
        } else {

        }
    }, [])

    useEffect(() => {
        if (session && currentState === NavigationCurrentType.IMBALANCE) {
            if (!wheelingCharge) {
                refreshWheelingCharge();
                console.debug('call ge wheelingChart');
                console.info(wheelingCharge);
            }
        }

    }, [wheelingCharge, refreshWheelingCharge])
    return {
        wheelingCharge,
        refreshWheelingCharge,
        updatedWheelingCharge
    }

}