import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useForceOBSContext } from "../../obs/context";
import { OBSSceneItem } from "../../obs/helper";
import React from "react";

export function useToggleInputMute() {
  const helper = useForceOBSContext();
  return useMutation("ToggleInputMute", helper.toggleAudioMute());
}

export function useGetInputMute(item: OBSSceneItem) {
  const helper = useForceOBSContext();
  return useQuery(["GetInputMute", item.uuid], () =>
    helper.getAudioMute()(item),
  );
}

export function useSetGetInputMuteData() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (item: OBSSceneItem, data: boolean) =>
      setGetInputMuteData(queryClient, item.uuid, data),
    [queryClient],
  );
}

export function setGetInputMuteData(
  queryClient: QueryClient,
  itemId: string,
  data: boolean,
): boolean {
  return queryClient.setQueryData(["GetInputMute", itemId], data);
}

export function useGetAudioItems() {
  const helper = useForceOBSContext();
  return useQuery("GetAudioItems", helper.getAudioItems());
}
