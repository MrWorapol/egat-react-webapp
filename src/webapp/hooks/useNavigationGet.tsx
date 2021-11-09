import { useRecoilState } from "recoil"
import { navigationCurrentState } from "../state/navigation-current-state";

export function useNavigationGet() {
  const [currentState] = useRecoilState(navigationCurrentState);

  return {
    currentState,
  };
}