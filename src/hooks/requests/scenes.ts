import React from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import { useForceOBSContext } from "../../obs/context";
import { OBSScene, OBSSceneItem } from "../../obs/helper";

export function useScenes() {
  const helper = useForceOBSContext();
  return useQuery("GetSceneList", helper.getScenes());
}

export function useSetCurrentScene() {
  const helper = useForceOBSContext();
  return useMutation(helper.setCurrentScene());
}

export function useGetCurrentScene() {
  const helper = useForceOBSContext();
  return useQuery("GetCurrentProgramScene", helper.getCurrentScene(), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}

export function useSetCurrentSceneData() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (data: OBSScene) => setCurrentSceneData(queryClient, data),
    [queryClient],
  );
}

export function setCurrentSceneData(queryClient: QueryClient, data: OBSScene) {
  queryClient.setQueryData("GetCurrentProgramScene", data);
}

export function useGetSceneItemList() {
  const helper = useForceOBSContext();
  return useMutation(helper.getSceneItems());
}

export function useGetSceneItemEnabled(item: OBSSceneItem) {
  const helper = useForceOBSContext();
  return useQuery(["GetSceneItemEnabled", item.id, item.scene.id], () =>
    helper.getSceneItemEnabled()(item),
  );
}

export function useSetSceneItemEnabled() {
  const helper = useForceOBSContext();
  return useMutation(helper.setSceneItemEnabled());
}

export function useSetSceneItemEnabledData() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (item: OBSSceneItem, data: boolean) =>
      setSceneItemEnabledData(queryClient, item.id, item.scene.id, data),
    [queryClient],
  );
}
export function setSceneItemEnabledData(
  queryClient: QueryClient,
  itemId: number,
  sceneId: string,
  data: boolean,
) {
  queryClient.setQueryData(["GetSceneItemEnabled", itemId, sceneId], data);
}

export function useGetAllItems() {
  const helper = useForceOBSContext();
  return useQuery(["GetAllItems"], helper.getAllItems());
}
