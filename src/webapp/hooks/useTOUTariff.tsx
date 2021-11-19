import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil"
import TOUTariffAPI from "../api/referenceData/TOUtariffAPI";
import { gridUsedPackageState, IGridPackage, IPackage } from "../state/reference-data/tou-traff/grid-package-state";
import { IServiceCharge, serviceChargeType1State, serviceChargeType2State } from "../state/reference-data/tou-traff/tou-service-charge-state";
import { ITouTariff, touTariffState } from "../state/reference-data/tou-traff/tou-tariff-state"



export function useTOUTariff() {
    const [touTariff, setTOUTariffState] = useRecoilState(touTariffState);
    const [onLoad, setOnLoad] = useState(true);
    const [serviceChargeType1, setServiceChargeType1] = useRecoilState(serviceChargeType1State);
    const [serviceChargeType2, setServiceChargeType2] = useRecoilState(serviceChargeType2State);
    const [gridUsedPackage, setGridUsedPackage] = useRecoilState(gridUsedPackageState);
    const api = new TOUTariffAPI();

    const refreshTOUTariff = useCallback(async () => {
        const result = await api.getTOUtariff({});
        console.log('call wheeling chart api');
        if (result !== null) {
            console.info(result.context);
            setTOUTariffState(result.context);
        }



        const getChargeType1 = await api.getServiceCharge({ touType: 'tou-1' });
        const getChargeType2 = await api.getServiceCharge({ touType: 'tou-2' });
        if (getChargeType1 !== null) {
            setServiceChargeType1(getChargeType1.context[0]);
        }
        if (getChargeType2 !== null) {
            setServiceChargeType2(getChargeType2.context[0]);
        }

        const getGridPackage = await api.getGridPackage({});
        if (getGridPackage) {
            console.log(`get Grid Package result: `);
            console.info(getGridPackage)
            setGridUsedPackage(getGridPackage.context);
        }
    }, [])

    const editTOUTariff = useCallback(async (data: ITouTariff) => {
        const result = await api.putTOUTariff({ tariff: data });
        if (!result) {
            console.error(`cannot update setting`);
            return false;
        } else {
            refreshTOUTariff();
            return true;
        }
    }, [])

    const editServiceCharge = useCallback(async (data: IServiceCharge) => {
        const result = await api.putServiceCharge({ serviceCharge: data });
        if (result) {
            refreshTOUTariff();
            return true;
        } else {
            return false;
        }
    }, [])

    const editGridUsedPackage = useCallback(async (id: string) => {

        const result = await api.putGridUsedPackage({ package: id });
        if (result) {
            refreshTOUTariff();
            return true;
        } else {
            return false;
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