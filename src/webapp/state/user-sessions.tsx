import { atom } from "recoil";

export interface IUserSession {

  accessToken: string;
  refreshToken: string;
  lasttimeLogIn: Date;
}
console.log(`hello session`);
export const session = atom<IUserSession | null>({
  key: "userSession",
  default: null,
});
