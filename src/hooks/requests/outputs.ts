import React from "react";
import { OBSRequestTypes, OBSResponseTypes } from "obs-websocket-js";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import { OBSOutputHelper, OutputHelperProps } from "../../obs/helper";
import { useForceOBSContext } from "../../obs/context";

function createGeneralAction<
  ToggleType extends keyof OBSRequestTypes,
  StatusType extends keyof OBSRequestTypes,
  Key extends keyof OutputHelperProps,
  TStatusResponse extends OBSResponseTypes[StatusType],
  OutputHelper extends OBSOutputHelper<StatusType, ToggleType, TStatusResponse>,
>(key: Key, _statusType: StatusType, _toggleType: ToggleType) {
  const setFunc = (
    queryClient: QueryClient,
    serverId: string,
    data: TStatusResponse,
  ) => queryClient.setQueryData(["general-action", serverId, key], data);
  return {
    toggle: function useToggle() {
      const helper = useForceOBSContext();
      return useMutation((helper[key] as unknown as OutputHelper).toggle());
    },
    status: function useStatus(options?: { enabled?: boolean }) {
      const helper = useForceOBSContext();
      return useQuery(
        ["general-action", helper.controller.server.id, key],
        (helper[key] as unknown as OutputHelper).getStatus(),
        options,
      );
    },
    set: function useSetCurrentSceneData() {
      const queryClient = useQueryClient();
      const helper = useForceOBSContext();
      return React.useCallback(
        (data: TStatusResponse) =>
          setFunc(queryClient, helper.controller.server.id, data),
        [queryClient, helper],
      );
    },
    setFunc,
  };
}

export const {
  toggle: useToggleVirtualCam,
  status: useGetVirtualCamStatus,
  set: useSetToggleVirtualCamData,
  setFunc: setVirtualCamStatusData,
} = createGeneralAction(
  "virtualCamera",
  "GetVirtualCamStatus",
  "ToggleVirtualCam",
);

export const {
  toggle: useToggleReplayBuffer,
  status: useGetReplayBufferStatus,
  set: useSetReplayBufferStatusData,
  setFunc: setReplayBufferStatusData,
} = createGeneralAction(
  "replyBuffer",
  "ToggleReplayBuffer",
  "GetReplayBufferStatus",
);

export const {
  toggle: useToggleStream,
  status: useGetStreamStatus,
  set: useSetStreamStatusData,
  setFunc: setStreamStatusData,
} = createGeneralAction("stream", "ToggleStream", "GetStreamStatus");

export const {
  toggle: useToggleRecord,
  status: useGetRecordStatus,
  set: useSetRecordStatusData,
  setFunc: setRecordStatusData,
} = createGeneralAction("record", "ToggleRecord", "GetRecordStatus");
