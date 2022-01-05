import { atom } from "recoil";

export interface NewsCreationState {
    title : string,
    content : string,
    
}
export const newscreation = atom<NewsCreationState | null> ({
    key: 'newscreation',
    default: null
})