import { atom } from "recoil";

export const isLoadingPriority = atom<number>({
  key: 'isLoadingPriority',
  default: 10,
})