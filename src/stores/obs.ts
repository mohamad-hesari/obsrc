// import { create, StoreApi } from "zustand";
// import {
//   OBSHelper,
//   OBSScene,
//   OBSSceneItem,
//   OBSController,
//   Server,
// } from "../obs";
// import { uuid } from "../utils";

// interface Query<T> {
//   loading: boolean;
//   data?: T;
//   error?: string;
//   setLoading(loading: boolean): void;
//   setData(data: T): void;
//   setError(error: string): void;
// }

// type QueryStore<T> = ReturnType<typeof createQueryStore<T>>;
// type QueryWithParam<T> = Record<string | number, QueryStore<T>>;

// interface OBSStateWithParams {
//   audioMutesStatus: QueryWithParam<boolean>;
//   enabledSceneItem: QueryWithParam<boolean>;
// }

// interface OBSState extends OBSStateWithParams {
//   scenes: QueryStore<OBSScene[]>;
//   currentScene: QueryStore<OBSScene>;
//   items: QueryStore<OBSSceneItem[]>;
//   audios: QueryStore<OBSSceneItem[]>;
// }

// interface OBSServer extends OBSState {
//   id: string;
//   helper: OBSHelper;
//   loadScenes(): Promise<void>;
//   loadCurrentScene(): Promise<void>;
//   loadItems(): Promise<void>;
//   loadAudios(): Promise<void>;
//   loadAudioMutesStatus(item: OBSSceneItem): Promise<void>;
//   loadEnabledSceneItem(item: OBSSceneItem): Promise<void>;
// }

// interface OBSStore {
//   servers: OBSServer[];
//   addServer(server: Server): Promise<void>;
//   removeServer(id: string): void;
// }

// function createQueryStore<T>() {
//   return create<Query<T>>((set) => ({
//     loading: false,
//     setLoading(loading) {
//       set({ loading });
//     },
//     setData(data) {
//       set({ data });
//     },
//     setError(error) {
//       set({ error });
//     },
//   }));
// }

// function createQueryLoader<T>(
//   store: StoreApi<Query<T>>,
//   loader: () => Promise<T>,
// ) {
//   return async () => {
//     store.getState().setLoading(true);
//     try {
//       store.getState().setData(await loader());
//     } catch (error) {
//       store.getState().setError(error as string);
//     } finally {
//       store.getState().setLoading(false);
//     }
//   };
// }

// function createQueryLoaderWithParams<T, P, K extends keyof P>(
//   itemStore: QueryWithParam<T>,
//   key: K,
//   loader: (params: P) => Promise<T>,
//   set: (store: QueryWithParam<T>) => void,
// ) {
//   return async (params: P) => {
//     let store = itemStore[params[key] as string | number];
//     if (!store) {
//       store = createQueryStore<T>();
//       set({ ...itemStore, [params[key] as string | number]: store });
//     }
//     store.getState().setLoading(true);
//     try {
//       store.getState().setData(await loader(params));
//     } catch (error) {
//       store.getState().setError(error as string);
//     } finally {
//       store.getState().setLoading(false);
//     }
//   };
// }

// async function createServer(
//   server: Server,
//   set: (
//     partial:
//       | OBSStore
//       | Partial<OBSStore>
//       | ((state: OBSStore) => OBSStore | Partial<OBSStore>),
//     replace?: boolean | undefined,
//   ) => void,
// ) {
//   const controller = new OBSController(server);
//   await controller.connect();
//   const helper = new OBSHelper(controller);
//   const scenes = createQueryStore<OBSScene[]>(),
//     currentScene = createQueryStore<OBSScene>(),
//     items = createQueryStore<OBSSceneItem[]>(),
//     audios = createQueryStore<OBSSceneItem[]>(),
//     audioMutesStatus: Record<string | number, QueryStore<boolean>> = {},
//     enabledSceneItem: Record<string | number, QueryStore<boolean>> = {};
//   function setStore(name: keyof OBSStateWithParams) {
//     return (store: QueryWithParam<boolean>) =>
//       set((state) => {
//         return {
//           servers: state.servers.map((s) =>
//             s.id === server.id ? { ...s, [name]: store } : s,
//           ),
//         };
//       });
//   }
//   const loadScenes = createQueryLoader(scenes, helper.getScenes),
//     loadCurrentScene = createQueryLoader(currentScene, helper.getCurrentScene),
//     loadItems = createQueryLoader(items, helper.getAllItems),
//     loadAudios = createQueryLoader(items, helper.getAudioItems),
//     loadAudioMutesStatus = createQueryLoaderWithParams(
//       audioMutesStatus,
//       "id",
//       helper.getAudioMute,
//       setStore("audioMutesStatus"),
//     ),
//     loadEnabledSceneItem = createQueryLoaderWithParams(
//       enabledSceneItem,
//       "id",
//       helper.getSceneItemEnabled,
//       setStore("enabledSceneItem"),
//     );
//   return {
//     id: uuid(),
//     helper,
//     scenes,
//     currentScene,
//     items,
//     audios,
//     audioMutesStatus,
//     enabledSceneItem,
//     loadScenes,
//     loadCurrentScene,
//     loadItems,
//     loadAudios,
//     loadAudioMutesStatus,
//     loadEnabledSceneItem,
//   };
// }

// export const useOBSStore = create<OBSStore>((set) => ({
//   servers: [],
//   async addServer(server) {
//     const obsServer = await createServer(server, set);
//     set((state) => ({
//       servers: [...state.servers, obsServer],
//     }));
//     // set((state) => ({ servers: [...state.servers, server] }));
//   },
//   removeServer(id) {
//     set((state) => ({
//       servers: state.servers.filter((server) => server.id !== id),
//     }));
//   },
// }));
export {};
