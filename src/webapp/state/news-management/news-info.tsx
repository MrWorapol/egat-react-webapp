import { atom } from "recoil";

export interface NewsInfo {
    id?: string,
    title?: string,
    date?: string,
    content?: string,
    status?: string,
}


export const newsInfo = atom<NewsInfo[] | null>({
    key: 'newsInfo',
    default: null,
})
