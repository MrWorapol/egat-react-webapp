import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil"
import TOUTariffAPI from "../../api/referenceData/TOUtariffAPI";
import { gridUsedPackageState, IGridPackage, IPackage } from "../../state/reference-data/tou-traff/grid-package-state";
import { IServiceCharge, serviceChargeType1State, serviceChargeType2State } from "../../state/reference-data/tou-traff/tou-service-charge-state";
import { ITouTariff, touTariffState } from "../../state/reference-data/tou-traff/tou-tariff-state"
import { userSessionState } from "../../state/user-sessions";



export function useTOUTariff() {
    const [touTariff, setTOUTariffState] = useRecoilState(touTariffState);
    const [onLoad, setOnLoad] = useState(true);
    const [serviceChargeType1, setServiceChargeType1] = useRecoilState(serviceChargeType1State);
    const [serviceChargeType2, setServiceChargeType2] = useRecoilState(serviceChargeType2State);
    const [gridUsedPackage, setGridUsedPackage] = useRecoilState(gridUsedPackageState);
    const api = new TOUTariffAPI();
    const userSession = useRecoilValue(userSessionState);

    const refreshTOUTariff = useCallback(async () => {
        if (userSession) {
            const result = await api.getTOUtariff({ session: userSession });
            if (result !== null) {
                console.info(result.context);
                setTOUTariffState(result.context);
            }

            const getChargeType1 = await api.getServiceCharge({ session: userSession, touType: 'tou-1' });
            const getChargeType2 = await api.getServiceCharge({ session: userSession, touType: 'tou-2' });
            const getGridPackage = await api.getGridPackage({ session: userSession });
            if (getChargeType1 !== null) {
                setServiceChargeType1(getChargeType1.context[0]);
            }
            if (getChargeType2 !== null) {
                setServiceChargeType2(getChargeType2.context[0]);
            }

            if (getGridPackage) {
                console.log(`get Grid Package result: `);
                console.info(getGridPackage)
                setGridUsedPackage(getGridPackage.context);
            }
        }
    }, [])

    const editTOUTariff = useCallback(async (data: ITouTariff) => {
        if (userSession) {
            const result = await api.putTOUTariff({ session: userSession, tariff: data });
            if (!result) {
                console.error(`cannot update setting`);
                return false;
            } else {
                refreshTOUTariff();
                return true;
            }
        }
    }, [])

    const editServiceCharge = useCallback(async (data: IServiceCharge) => {
        if (userSession) {
            const result = await api.putServiceCharge({ session: userSession, serviceCharge: data });
            if (result) {
                refreshTOUTariff();
                return true;
            } else {
                return false;
            }
        }
    }, [])

    const editGridUsedPackage = useCallback(async (id: string) => {
        if (userSession) {
            const result = await api.putGridUsedPackage({ session: userSession, package: id });
            if (result) {
                refreshTOUTariff();
                return true;
            } else {
                return false;
            }
        }
    }, [])
    useEffect(() => {
        if (onLoad) {
            refreshTOUTariff();
            setOnLoad(false)
            console.debug('call ge wheelingChart');
            // console.info(wheelingCharge);
        }

    }, [touTariff, refreshTOUTariff, onLoad])
    return { onLoad, touTariff, refreshTOUTariff, editTOUTariff, gridUsedPackage, editGridUsedPackage, serviceChargeType1, serviceChargeType2, editServiceCharge }
}