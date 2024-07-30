import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDBStorage } from "./indexedDBStorage";

export type Server = {
  id: string;
  ip: string;
  port: number;
  password?: string;
};
type ServersStore = {
  servers: Server[];
  lastServer?: string;
  setLastServer: (serverId: string) => void;
  addServer: (server: Server) => void;
  removeServer: (server: Server) => void;
};

export const useServersStore = create<ServersStore>()(
  persist(
    (set) => ({
      servers: [],
      setLastServer(serverId) {
        set({ lastServer: serverId });
      },
      addServer: (server) =>
        set((state) => ({ servers: [...state.servers, server] })),
      removeServer: (server) =>
        set((state) => ({
          servers: state.servers.filter((s) => s.id !== server.id),
        })),
    }),
    {
      name: "servers",
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);
