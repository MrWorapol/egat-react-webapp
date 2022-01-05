import { atom } from "recoil";

export interface INewsDetail {
    id: string,
    title: string,
    date: string,
    content: string,
    status: string,
}


export const newsDetail = atom<INewsDetail[] | null>({
    key: 'newsDetail',
    default: null,
})
