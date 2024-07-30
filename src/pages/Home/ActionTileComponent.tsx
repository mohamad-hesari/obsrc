import React from "react";
import { FaCamera, FaClapperboard, FaVideo, FaWifi } from "react-icons/fa6";
import { IconType } from "react-icons";

import { actions } from "../../stores";

import type { GeneralTile } from "../../stores";

import hooks from "../../hooks";
import { BaseTileComponent, BaseTileProps } from "./BaseTileComponent";

export function ActionTileComponent(props: BaseTileProps<GeneralTile>) {
  const { data } = props.tile;

  const toggleVirtualCam = hooks.requests.outputs.useToggleVirtualCam();
  const queryGetVirtualCamStatus =
    hooks.requests.outputs.useGetVirtualCamStatus({
      enabled: data.action === actions.stopStartStreamVirtualCamera,
    });

  const toggleReplayBuffer = hooks.requests.outputs.useToggleReplayBuffer();
  const queryGetReplayBufferStatus =
    hooks.requests.outputs.useGetReplayBufferStatus({
      enabled: data.action === actions.stopStartStreamReplayBuffer,
    });

  const toggleStream = hooks.requests.outputs.useToggleStream();
  const queryGetStreamStatus = hooks.requests.outputs.useGetStreamStatus({
    enabled: data.action === actions.stopStartStream,
  });

  const toggleRecord = hooks.requests.outputs.useToggleRecord();
  const queryGetRecordStatus = hooks.requests.outputs.useGetRecordStatus({
    enabled: data.action === actions.stopStartStreamRecording,
  });

  const handleClick = async () => {
    switch (data.action) {
      case actions.stopStartStreamVirtualCamera:
        await toggleVirtualCam.mutateAsync();
        await queryGetVirtualCamStatus.refetch();
        break;
      case actions.stopStartStreamReplayBuffer:
        await toggleReplayBuffer.mutateAsync();
        await queryGetReplayBufferStatus.refetch();
        break;
      case actions.stopStartStream:
        await toggleStream.mutateAsync();
        await queryGetStreamStatus.refetch();
        break;
      case actions.stopStartStreamRecording:
        await toggleRecord.mutateAsync();
        await queryGetRecordStatus.refetch();
        break;
    }
  };
  let status: boolean = false;
  const paused: boolean = false;
  let icon: IconType | undefined = undefined;
  switch (data.action) {
    case actions.stopStartStreamVirtualCamera:
      status = queryGetVirtualCamStatus.data?.outputActive ?? false;
      icon = FaCamera;
      break;
    case actions.stopStartStreamReplayBuffer:
      status = queryGetReplayBufferStatus.data?.outputActive ?? false;
      icon = FaClapperboard;
      break;
    case actions.stopStartStream:
      status = queryGetStreamStatus.data?.outputActive ?? false;
      // paused = queryGetStreamStatus.data?.outputReconnecting ?? false;
      icon = FaWifi;
      break;
    case actions.stopStartStreamRecording:
      status = queryGetRecordStatus.data?.outputActive ?? false;
      // paused = queryGetRecordStatus.data?.outputPaused ?? false;
      icon = FaVideo;
      break;
  }
  return (
    <BaseTileComponent
      {...props}
      onClick={handleClick}
      type="Toggle"
      color={status ? "secondary" : paused ? "error" : "primary"}
      icon={icon}
    />
  );
}
