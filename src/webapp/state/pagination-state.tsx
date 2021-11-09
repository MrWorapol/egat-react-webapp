import { atom } from "recoil";

export interface PaginationProps {
    page: number,
    rowsPerPage: number,
}

export const paginationState = atom<PaginationProps>({
    key: 'paginationState',
    default: {
        page: 0,
        rowsPerPage: 0,
    }
}
)