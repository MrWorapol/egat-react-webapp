import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { WheelingChargeAPI } from "../../api/referenceData/WheelingChargeAPI";
import { NavigationCurrentType } from "../../state/navigation-current-state";
import { IWheelingCharge, wheelingChargeState } from "../../state/reference-data/wheeling-chart/wheeling-charge-state";
import { userSessionState } from "../../state/user-sessions";
import { useLoadingScreen } from "../useLoadingScreen";
import { useNavigationGet } from "../useNavigationGet";
import { useSnackBarNotification } from "../useSnackBarNotification";

export function useWheelingCharge() {
    const session = useRecoilValue(userSessionState);
    const { currentState } = useNavigationGet();
    const [wheelingCharge, setWheelingCharge] = useRecoilState(wheelingChargeState);
    let [lastestUpdated, setLastestUpdated] = useState(dayjs().toDate().toString());
    const api = new WheelingChargeAPI();
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();
    const refreshWheelingCharge = async () => {
        if (session) {
            showLoading(10);
            try {
                const response = await api.getWheelingCharge({ session: session });
                console.log('call wheeling chart api');
                if (response !== null) {
                    console.info(response);
                    setWheelingCharge(response.context);
                    setLastestUpdated(dayjs().toDate().toString());
                    hideLoading(10);
                }
            } catch (e) {
                hideLoading(10);
                showSnackBar({ serverity: "error", message: `${e}` })
            }
        }
    };

    const updatedWheelingCharge = async (wheelingCharge: IWheelingCharge) => {
        if (session) {
            try {
                showLoading(10);
                const response = await api.updatedWheelingCharge({
                    session: session,
                    wheelingCharge: {
                        id: wheelingCharge.id,
                        wheelingType: wheelingCharge.wheelingType,
                        title: wheelingCharge.title,
                        bahtPerKWh: wheelingCharge.bahtPerKWh,
                        mea: wheelingCharge.mea,
                        meaEgat: wheelingCharge.meaEgat,
                        meaPeaEgat: wheelingCharge.meaPeaEgat,
                        pea: wheelingCharge.pea,
                        peaEgat: wheelingCharge.peaEgat,
                        note: wheelingCharge.note,
                        effectiveDate: dayjs(wheelingCharge.effectiveDate).toISOString(),
                        effectiveTime: wheelingCharge.effectiveTime
                    }
                });
                hideLoading(10);
                if (response === true) {
                    showSnackBar({ serverity: "success", message: `Edit Successful.` });
                }
            } catch (err) {
                hideLoading(10);
                showSnackBar({ serverity: "error", message: `${err}` })

            }
        } else {

        }
    };

    useEffect(() => {
        if (session && session.accessToken && currentState === NavigationCurrentType.WHEELING_CHARGE) {
            if (!wheelingCharge) {
                refreshWheelingCharge();
                console.debug('call ge wheelingChart');
                console.info(wheelingCharge);
            }
        }

    }, [wheelingCharge, refreshWheelingCharge])
    return {
        lastestUpdated,
        wheelingCharge,
        refreshWheelingCharge,
        updatedWheelingCharge
    }

}