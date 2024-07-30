import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDBStorage } from "./indexedDBStorage";

type SettingsStore = {
  gridSize: number;
  setGridSize: (size: number) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      gridSize: 3,
      setGridSize: (size) => set({ gridSize: size }),
      fullscreen: false,
      setFullscreen: (fullscreen) => set({ fullscreen }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);
