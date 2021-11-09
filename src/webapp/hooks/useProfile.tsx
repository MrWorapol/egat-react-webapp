import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { userProfile } from "../state/user-profile";


export function useProfile() {
    const [profile] = useRecoilState(userProfile);

    const logout = useCallback(
        () => {

        },[])

    return {
        profile: profile,
        displayName: profile?.getDisplayName() ?? "",
        logout,
    }
}