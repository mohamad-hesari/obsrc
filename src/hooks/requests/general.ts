import { useMutation, useQuery } from "react-query";

import { useForceOBSContext } from "../../obs/context";

export function useGetHotkeyList() {
  const helper = useForceOBSContext();
  return useQuery(["GetHotkeyList"], helper.getHotkeyList());
}

export function useTriggerHotkeyByName() {
  const helper = useForceOBSContext();
  return useMutation(helper.triggerHotkeyByName());
}

export function useTriggerHotkeyByKeySequence() {
  const helper = useForceOBSContext();
  return useMutation(helper.triggerHotkeyByKeySequence());
}
