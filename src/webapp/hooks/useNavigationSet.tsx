import { useEffect } from "react";
import { useRecoilState } from "recoil"
import { navigationCurrentState, NavigationCurrentType } from "../state/navigation-current-state";

export function useNavigationSet(navigationState?: NavigationCurrentType) {
  const [currentState, setCurrentState] = useRecoilState(navigationCurrentState);

  useEffect(() => {
    console.log(`Call navigationSet from ${currentState} to ${navigationState}`)
    if (navigationState !== undefined) {
      if (navigationState !== currentState) {
        setCurrentState(navigationState);
      }
    }

  }, [currentState, navigationState, setCurrentState]);

  return {
    currentState: currentState,
  }
}