import { atom } from "recoil";

export interface IUserSession {

  accessToken: string;
  refreshToken: string;
  lasttimeLogIn: Date;
}
// console.log(`hello session`);
export const userSessionState = atom<IUserSession | null>({
  key: "userSession",
  default: null,
});

