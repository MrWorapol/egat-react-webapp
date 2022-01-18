import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ImbalanceAPI } from "../api/referenceData/ImbalanceAPI";
import { WheelingChargeAPI } from "../api/referenceData/WheelingChargeAPI";
import { Iimbalance, imbalanceState } from "../state/reference-data/imbalance/imbalance-state";
import { userSessionState } from "../state/user-sessions";

export function useImbalance() {
    const [imbalance, setImbalance] = useRecoilState(imbalanceState);
    const api = new ImbalanceAPI();
    const session = useRecoilValue(userSessionState);

    const refreshImbalance = useCallback(async () => {
        if (session) {
            const response = await api.getImbalance({ session });
            console.log('call wheeling chart api');
            if (response !== null) {
                console.info(response);
                setImbalance(response.context);
            }
        }
    }, [])


    const updateImbalance = useCallback(async (imbalance: Iimbalance) => {
        if (session) {
            const response = await api.updateImbalance({ imbalance: imbalance, session });
            // console.info();
            if (response !== null) {
                console.info(`updated is : ${response}`);

            }
        }
    }, [])
    useEffect(() => {
        if (!imbalance) {
            refreshImbalance();
            console.debug('call ge wheelingChart');
            console.info(imbalance);
        }

    }, [imbalance, refreshImbalance])
    return {
        imbalance,
        refreshImbalance,
        updateImbalance,
    }

}