import { atom } from "recoil";

// export class UserProfile {
//     // readonly displayName: string;
//     readonly lasttimeLogIn: string;
//     constructor(displayName: string) {
//         // this.displayName = displayName;
//         this.lasttimeLogIn = new Date().toISOString();
//     }

//     // getDisplayName(): string {
//     //     return this.displayName;
//     // }

//     getLastTimeLogIn(): string {
//         return this.lasttimeLogIn;
//     }
// }

export interface UserProfile {
    lasttimeLogin : string,
}
export const userProfile = atom<UserProfile | null>({
    key: 'userProfile',
    default: null,
})