import { create } from "zustand";

type LoadingStore = {
  state: string;
  setState: (state: string) => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  state: "",
  setState: (state) => set({ state }),
}));
