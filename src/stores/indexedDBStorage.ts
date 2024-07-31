import { StateStorage } from "zustand/middleware";
import { get, set, del, createStore } from "idb-keyval";

const customStore = createStore("zustand-storage-db", "zustand-storage-store");

export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name, customStore)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value, customStore);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name, customStore);
  },
};
