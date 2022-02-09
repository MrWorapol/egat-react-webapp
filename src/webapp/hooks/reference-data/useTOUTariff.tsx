import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil"
import TOUTariffAPI from "../../api/referenceData/TOUtariffAPI";
import { navigationCurrentState, NavigationCurrentType } from "../../state/navigation-current-state";
import { gridUsedPackageState, IGridPackage, IPackage } from "../../state/reference-data/tou-traff/grid-package-state";
import { IServiceCharge, serviceChargeType1State, serviceChargeType2State } from "../../state/reference-data/tou-traff/tou-service-charge-state";
import { ITouTariff, touTariffState } from "../../state/reference-data/tou-traff/tou-tariff-state"
import { userSessionState } from "../../state/user-sessions";
import { useDialog } from "../useDialog";
import { useLoadingScreen } from "../useLoadingScreen";
import { useNavigationGet } from "../useNavigationGet";
import { useSnackBarNotification } from "../useSnackBarNotification";



export function useTOUTariff() {
    let session = useRecoilValue(userSessionState);
    let { currentState } = useNavigationGet();
    const [touTariff, setTOUTariffState] = useRecoilState(touTariffState);
    const [onLoad, setOnLoad] = useState(true);
    const [serviceChargeType1, setServiceChargeType1] = useRecoilState(serviceChargeType1State);
    const [serviceChargeType2, setServiceChargeType2] = useRecoilState(serviceChargeType2State);
    const [gridUsedPackage, setGridUsedPackage] = useRecoilState(gridUsedPackageState);
    const api = new TOUTariffAPI();
    const { showSnackBar } = useSnackBarNotification();
    const { showLoading, hideLoading } = useLoadingScreen();
    const { dialogContent, closeDialog } = useDialog();
    const refreshTOUTariff = async () => {
        if (session) {
            showLoading(10);
            try {
                const result = await api.getTOUtariff({ session: session });
                if (result !== null) {
                    console.info(result.context);
                    setTOUTariffState(result.context);
                }

                const getChargeType1 = await api.getServiceCharge({ session, touType: 'tou-1' });
                const getChargeType2 = await api.getServiceCharge({ session, touType: 'tou-2' });
                const getGridPackage = await api.getGridPackage({ session });
                if (getChargeType1 !== null) {
                    setServiceChargeType1(getChargeType1.context);
                }
                if (getChargeType2 !== null) {
                    setServiceChargeType2(getChargeType2.context);
                }

                if (getGridPackage) {
             
                    setGridUsedPackage(getGridPackage.context);
                }
                hideLoading(10);
                setOnLoad(false);
            } catch (err) {
                hideLoading(10);
                showSnackBar({ serverity: "error", message: `${err}` });
            }
        }
    };

    const editTOUTariff = async (data: ITouTariff) => {
        if (session) {
            showLoading(10);
            try {
                const result = await api.putTOUTariff({ session, tariff: data });
                if (result === true) {
                    showSnackBar({ serverity: "success", message: `Updated TOU ${data.title} successful` });
                    if (dialogContent) {
                        closeDialog();
                    }
                    hideLoading(10);
                    refreshTOUTariff();
                    return true;
                } else {
                    hideLoading(10);
                    showSnackBar({ serverity: "error", message: `Updated TOU${data.title} unsuccessful` });
                    return false;
                }
            } catch (err) {
                hideLoading(10);
                showSnackBar({ serverity: "error", message: `Updated TOU${data.title} unsuccessful\n ${err}` });
            }
        }
    };

    const editServiceCharge = useCallback(async (data: IServiceCharge) => {
        if (session) {
            showLoading(10);
            try {
                const result = await api.putServiceCharge({ session, serviceCharge: data });
                hideLoading(10);

                if (result) {
                    showSnackBar({ serverity: "success", message: `Updated service charge successful` });

                    refreshTOUTariff();
                    return true;
                } else {

                    return false;
                }
            } catch (err) {
                hideLoading(10);
                showSnackBar({ serverity: "error", message: `Updated service charge unsuccessful\n ${err}` });
            }
        }
    }, [])

    const editGridUsedPackage = useCallback(async (id: string) => {
        if (session) {
            showLoading(10);
            try {
                const result = await api.putGridUsedPackage({ session, package: id });
                if (result) {
                    showSnackBar({ serverity: "success", message: `Updated gridUsed Packgae successful` });
                    hideLoading(10);

                    refreshTOUTariff();
                    return true;
                } else {
                    hideLoading(10);

                    showSnackBar({ serverity: "error", message: `Updated gridUsed Packgae unsuccessful` });
                    return false;
                }
            } catch (err) {
                hideLoading(10);
                showSnackBar({ serverity: "error", message: `Updated gridUsed Packgae unsuccessful\n ${err}` });
            }
        }
    }, [])
    useEffect(() => {
        if (session && currentState === NavigationCurrentType.TOU_TARIFF) {
            if (!touTariff && onLoad===true) {
                refreshTOUTariff();
                // console.info(wheelingCharge);
            }
        }return ()=>{
            setOnLoad(false);
        }
    }, [touTariff, refreshTOUTariff, onLoad])
    return { onLoad, touTariff, refreshTOUTariff, editTOUTariff, gridUsedPackage, editGridUsedPackage, serviceChargeType1, serviceChargeType2, editServiceCharge }
}