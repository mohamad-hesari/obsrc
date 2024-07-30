import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { indexedDBStorage } from "./indexedDBStorage";
import { OBSHotkeySequence, OBSScene, OBSSceneItem } from "../obs/helper";

export type TileType =
  | "switch-scene"
  | "hotkey"
  | "custom-hotkey"
  | "source"
  | "input"
  | "general";

export interface BaseTile {
  id: string;
  name: string;
  serverId: string;
  order?: number;
}

export interface SwitchSceneTile extends BaseTile {
  type: "switch-scene";
  data: OBSScene;
}

export interface HotkeyTile extends BaseTile {
  type: "hotkey";
  data: string;
}

export interface CustomHotkeyTile extends BaseTile {
  type: "custom-hotkey";
  data: OBSHotkeySequence;
}

export interface SourceTile extends BaseTile {
  type: "source";
  data: OBSSceneItem;
}

export interface InputTile extends BaseTile {
  type: "input";
  data: OBSSceneItem;
}

export interface GeneralTile extends BaseTile {
  type: "general";
  data: GeneralAction;
}

export type Tile =
  | SwitchSceneTile
  | HotkeyTile
  | CustomHotkeyTile
  | SourceTile
  | InputTile
  | GeneralTile;

export type GeneralAction = {
  action: string;
};

export const actions = {
  stopStartStream: "stop/start-stream",
  stopStartStreamRecording: "stop/start-recording",
  stopStartStreamReplayBuffer: "start/stop-replay-buffer",
  stopStartStreamVirtualCamera: "start/stop-virtual-camera",
};

type TilesStore = {
  tiles: Tile[];
  tile?: Tile;
  editable: boolean;
  draggable: boolean;
  toggleEditable: () => void;
  toggleDraggable: () => void;
  editTile: (tile: Tile) => void;
  addTile: (tile: Tile) => void;
  saveTile: (tile: Tile) => void;
  removeTile: (tile: Tile) => void;
};

export const useTilesStore = create<TilesStore>()(
  persist(
    (set) => ({
      tiles: [],
      editable: false,
      draggable: false,
      toggleEditable: () => set((state) => ({ editable: !state.editable })),
      toggleDraggable: () => set((state) => ({ draggable: !state.draggable })),
      editTile: (tile) => set({ tile }),
      addTile: (tile) => set((state) => ({ tiles: [...state.tiles, tile] })),
      saveTile: (tile) => {
        set((state) => ({
          tiles: state.tiles.map((s) => (s.id === tile.id ? tile : s)),
        }));
      },
      removeTile: (tile) =>
        set((state) => ({
          tiles: state.tiles.filter((s) => s.id !== tile.id),
        })),
    }),
    {
      name: "tiles",
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);
