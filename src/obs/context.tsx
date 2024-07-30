import React from "react";
import { create } from "zustand";

import { OBSHelper } from "./helper";
import { createGenericContext, uuid } from "../utils";
import { OBSController, Server } from "./controller";
import {
  setCurrentSceneData,
  setSceneItemEnabledData,
} from "../hooks/requests/scenes";
import { queryClient } from "../queryClient";
import { setGetInputMuteData } from "../hooks/requests/inputs";
import {
  setRecordStatusData,
  setReplayBufferStatusData,
  setStreamStatusData,
  setVirtualCamStatusData,
} from "../hooks/requests/outputs";

type OBSContext = {
  helpers: { id: string; helper: OBSHelper; selected: boolean }[];
  setSelected: (id: string) => void;
  addHelper: (server: Server) => Promise<OBSHelper | undefined>;
  removeHelper: (id: string) => void;
};

export const useOBSContextStore = create<OBSContext>((set) => ({
  helpers: [],
  setSelected: (id) =>
    set((state) => ({
      helpers: state.helpers.map((h) => ({
        ...h,
        selected: h.id === id,
      })),
    })),
  addHelper: async (server) => {
    const controller = new OBSController(server);
    if (await controller.connect()) {
      controller.addListener("CurrentProgramSceneChanged", (data) => {
        setCurrentSceneData(queryClient, {
          id: data.sceneUuid,
          name: data.sceneName,
          key: uuid(),
        });
      });
      controller.addListener("InputMuteStateChanged", (data) => {
        setGetInputMuteData(queryClient, data.inputUuid, data.inputMuted);
      });
      controller.addListener("SceneItemEnableStateChanged", (data) => {
        setSceneItemEnabledData(
          queryClient,
          data.sceneItemId,
          data.sceneUuid,
          data.sceneItemEnabled,
        );
      });
      controller.addListener("RecordStateChanged", (data) => {
        setRecordStatusData(queryClient, server.id, {
          outputActive: data.outputActive,
        });
      });
      controller.addListener("StreamStateChanged", (data) => {
        setStreamStatusData(queryClient, server.id, {
          outputActive: data.outputActive,
        });
      });
      controller.addListener("ReplayBufferStateChanged", (data) => {
        setReplayBufferStatusData(queryClient, server.id, {
          outputActive: data.outputActive,
        });
      });
      controller.addListener("VirtualcamStateChanged", (data) => {
        setVirtualCamStatusData(queryClient, server.id, {
          outputActive: data.outputActive,
        });
      });
      const helper = new OBSHelper(controller);
      set((state) => ({
        helpers: [...state.helpers, { id: uuid(), helper, selected: false }],
      }));
      return helper;
    }
  },
  removeHelper: (id) =>
    set((state) => ({
      helpers: state.helpers.filter((h) => h.id !== id),
    })),
}));

export function useSelectedHelper() {
  const helpers = useOBSContextStore((state) => state.helpers);
  return helpers.find((h) => h.selected)?.helper;
}

export function useHelper(serverId: string) {
  const helpers = useOBSContextStore((state) => state.helpers);
  return helpers.find((h) => h.helper.controller.server?.id === serverId)
    ?.helper;
}

const [useContext, OBSProvider] = createGenericContext<{ helper?: OBSHelper }>(
  "OBSContext",
);

export function OBSSelectedProvider(props: React.PropsWithChildren) {
  const helper = useSelectedHelper();
  console.log("OBSSelectedProvider", helper);
  return <OBSProvider value={{ helper }}>{props.children}</OBSProvider>;
}

export function OBSHelperProvider(
  props: React.PropsWithChildren<{ serverId: string }>,
) {
  const helper = useHelper(props.serverId);
  if (!helper) return <></>;
  return <OBSProvider value={{ helper }}>{props.children}</OBSProvider>;
}

export function useForceOBSContext() {
  const context = useContext();
  if (!context.helper) throw new Error("No OBSHelper found in context");
  return context.helper;
}

export { useContext as useOBSContext };
