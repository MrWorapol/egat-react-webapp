import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { paginationState } from "../state/pagination-state";

export default function usePaginationState() {
    const [paginationValue, setPaginationState] = useRecoilState(paginationState);

    return {
        paginationState: paginationValue,
        setPaginationState
    }
}