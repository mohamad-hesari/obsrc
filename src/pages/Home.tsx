import React from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  FaCamera,
  FaClapperboard,
  FaEye,
  FaEyeSlash,
  FaGear,
  FaPlus,
  FaVideo,
  FaWifi,
} from "react-icons/fa6";
import { FaEdit, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { IconType } from "react-icons";

import { withLayout } from "../hocs";
import { Button } from "../components";
import {
  actions,
  Tile,
  TileType,
  useServersStore,
  useSettingsStore,
  useTilesStore,
} from "../stores";

import type {
  BaseTile,
  CustomHotkeyTile,
  GeneralTile,
  HotkeyTile,
  InputTile,
  SourceTile,
  SwitchSceneTile,
} from "../stores";

import hooks from "../hooks";
import { OBSHelperProvider } from "../obs";

const buttons = [
  { Icon: FaEdit, edit: true },
  { Icon: FaPlus, to: "/add" },
  { Icon: FaGear, to: "/settings" },
];

function Header() {
  const toggleEditable = useTilesStore((state) => state.toggleEditable);
  return (
    <div className="flex items-center justify-between">
      <span>OBS Remote Controller</span>
      <div className="flex items-center space-x-2">
        {buttons.map(({ Icon, to, edit }) => (
          <Button
            as={to ? Link : "button"}
            to={to}
            onClick={() => {
              edit && toggleEditable();
            }}
            key={Icon.name}
            icon={Icon}
            rounded
            color="glasses"
          />
        ))}
      </div>
    </div>
  );
}

function SVGText(props: { text: string }) {
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      const bbox = ref.current.getBBox();
      ref.current.setAttribute(
        "viewBox",
        `0 -${bbox.height / 2} ${bbox.width} ${bbox.height}`,
      );
      ref.current.setAttribute("height", `${bbox.height}`);
    }
  }, [props.text]);
  return (
    <svg ref={ref} className="w-full">
      <text fill="currentColor" {...props}>
        {props.text}
      </text>
    </svg>
  );
}

function BaseTile(
  props: React.PropsWithChildren<{
    tile: Tile;
    type?: "Switch" | "Toggle" | "Trigger";
    onClick?: () => void;
    active?: boolean;
    color?: "primary" | "secondary" | "error";
    icon?: IconType;
  }>,
) {
  const store = useTilesStore();
  const navigate = useNavigate();
  const gridSize = useSettingsStore((state) => state.gridSize);
  const { editable, editTile } = store;
  function handleClick(tile: Tile) {
    return async () => {
      if (editable) {
        editTile(tile);
        store.toggleEditable();
        navigate("/edit");
        return;
      }
      props.onClick?.();
    };
  }
  const { color = "primary" } = props;
  return (
    <button
      type="button"
      onClick={handleClick(props.tile)}
      className={clsx(
        "relative flex aspect-square flex-col items-center justify-center rounded-md border px-1 text-gray-900 transition-all ease-out active:bg-blue-500",
        {
          "border-transparent": !props.active,
          "pointer-events-none": !editable && props.active,
          "bg-blue-200 active:bg-blue-500": color === "primary",
          "bg-green-200 active:bg-green-500": color === "secondary",
          "bg-red-200 active:bg-red-500": color === "error",
          "border-blue-500": color === "primary" && props.active,
          "border-green-500": color === "secondary" && props.active,
          "border-red-500": color === "error" && props.active,
        },
      )}>
      {/* {!props.children && <SVGText text={props.tile.name} />} */}
      {/* {props.children} */}
      {props.icon && <TileIcon icon={props.icon} />}
      {!props.icon && (
        <span className="inline-block aspect-square w-1/6"></span>
      )}
      <SVGText text={props.tile.name} />
      {props.type && (
        <span
          className={clsx("absolute italic text-gray-600", {
            "left-1 top-1 w-1/4": gridSize === 5,
            "left-1 top-2 w-1/4": gridSize === 4,
            "left-1 top-3 w-1/3": gridSize === 3,
            "left-1 top-4 w-1/3": gridSize === 2,
            "left-1 top-5 w-1/2": gridSize === 1,
          })}>
          <SVGText text={props.type} />
        </span>
      )}
      {editable && <FaEdit className="absolute right-2 top-2 h-4 w-4" />}
    </button>
  );
}

function SwitchSceneTile(props: { tile: SwitchSceneTile }) {
  const changeSceneQuery = hooks.requests.scenes.useSetCurrentScene();
  const currentScene = hooks.requests.scenes.useGetCurrentScene();
  const { data } = props.tile;
  const active = currentScene.data?.id === data.id;
  const handleClick = async () => {
    if (active) return;
    await changeSceneQuery.mutateAsync(data.id);
  };
  return (
    <BaseTile
      tile={props.tile}
      onClick={handleClick}
      active={active}
      type="Switch"
    />
  );
}

function TriggerHotkeyByNameTile(props: { tile: HotkeyTile }) {
  const query = hooks.requests.general.useTriggerHotkeyByName();
  const handleClick = async () => {
    const { data } = props.tile;
    await query.mutateAsync(data);
  };
  return <BaseTile tile={props.tile} onClick={handleClick} type="Trigger" />;
}

function TriggerCustomHotKeyTile(props: { tile: CustomHotkeyTile }) {
  const query = hooks.requests.general.useTriggerHotkeyByKeySequence();
  const handleClick = async () => {
    const { data } = props.tile;
    await query.mutateAsync(data);
  };
  return <BaseTile tile={props.tile} onClick={handleClick} type="Trigger" />;
}

function TileIcon(props: { icon: IconType }) {
  const Icon = props.icon;
  return <Icon className="aspect-square w-1/6" />;
}

function InputTile(props: { tile: InputTile }) {
  const { data } = props.tile;
  const query = hooks.requests.inputs.useGetInputMute(data);
  const toggleQuery = hooks.requests.inputs.useToggleInputMute();
  const handleClick = async () => {
    await toggleQuery.mutateAsync(data);
    await query.refetch();
  };
  return (
    <BaseTile
      tile={props.tile}
      onClick={handleClick}
      type="Toggle"
      color={query.data ? "error" : "primary"}
      icon={query.data ? FaVolumeMute : FaVolumeUp}
    />
  );
}

function SourceTile(props: { tile: SourceTile }) {
  const { data } = props.tile;
  const query = hooks.requests.scenes.useGetSceneItemEnabled(data);
  const toggleQuery = hooks.requests.scenes.useSetSceneItemEnabled();
  const handleClick = async () => {
    await toggleQuery.mutateAsync({
      item: data,
      enabled: !query.data,
    });
    await query.refetch();
  };
  return (
    <BaseTile
      tile={props.tile}
      onClick={handleClick}
      type="Toggle"
      color={!query.data ? "error" : "primary"}
      icon={query.data ? FaEye : FaEyeSlash}
    />
  );
}

function ActionTile(props: { tile: GeneralTile }) {
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
    <BaseTile
      tile={props.tile}
      onClick={handleClick}
      type="Toggle"
      color={status ? "secondary" : paused ? "error" : "primary"}
      icon={icon}
    />
  );
}

const tilesMap: Record<TileType, React.FC<{ tile: BaseTile }>> = {
  "switch-scene": SwitchSceneTile as React.FC<{ tile: BaseTile }>,
  hotkey: TriggerHotkeyByNameTile as React.FC<{ tile: BaseTile }>,
  "custom-hotkey": TriggerCustomHotKeyTile as React.FC<{ tile: BaseTile }>,
  source: SourceTile as React.FC<{ tile: BaseTile }>,
  input: InputTile as React.FC<{ tile: BaseTile }>,
  general: ActionTile as React.FC<{ tile: BaseTile }>,
};

const Home = withLayout(function Home() {
  const tiles = useTilesStore((state) => state.tiles);
  const serverId = useServersStore((state) => state.lastServer);
  const gridSize = useSettingsStore((state) => state.gridSize);

  return (
    <div
      className={clsx("grid gap-1", {
        "grid-cols-1": gridSize === 1,
        "grid-cols-2": gridSize === 2,
        "grid-cols-3": gridSize === 3,
        "grid-cols-4": gridSize === 4,
        "grid-cols-5": gridSize === 5,
      })}>
      {tiles
        .filter((tile) => tile.serverId === serverId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((tile) => {
          const Tile = tilesMap[tile.type] ?? BaseTile;
          return (
            <OBSHelperProvider key={tile.id} serverId={tile.serverId}>
              <Tile tile={tile} />
            </OBSHelperProvider>
          );
        })}
    </div>
  );
}, Header);

export default Home;
