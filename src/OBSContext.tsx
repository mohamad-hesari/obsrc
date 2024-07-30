// import React from "react";
// import OBSWebSocket, { EventSubscription } from "obs-websocket-js";

// import { createGenericContext } from "./utils";
// import { Server, useServersStore } from "./stores";
// import {
//   useSetCurrentSceneData,
//   useSetGetSceneItemEnabledData,
//   useSetRecordStatusData,
//   useSetReplayBufferStatusData,
//   useSetStreamStatusData,
//   useSetToggleVirtualCamData,
// } from "./hooks";
// import { useSetGetInputMuteData } from "./hooks/requests/inputs";

// export type OBSContextType = {
//   connected: boolean;
//   isFirstTry: boolean;
//   connect: (server: Server) => Promise<void>;
//   call: OBSWebSocket["call"];
//   addListener: OBSWebSocket["addListener"];
//   removeListener: OBSWebSocket["removeListener"];
//   removeAllListeners: OBSWebSocket["removeAllListeners"];
// };

// const [useOBSContext, OBSContextProvider] =
//   createGenericContext<OBSContextType>("OBSContext");

// let obs: OBSWebSocket | null = null;

// export function OBSProvider(props: React.PropsWithChildren) {
//   // const [_obs, setObs] = React.useState<OBSWebSocket | null>(null);
//   // const obsRef = React.useRef<OBSWebSocket | null>(null);
//   const [connected, setConnected] = React.useState(false);
//   const [isFirstTry, setIsFirstTry] = React.useState(true);
//   const store = useServersStore();
//   const setCurrentSceneData = useSetCurrentSceneData();
//   const setGetInputMuteData = useSetGetInputMuteData();
//   const setGetSceneItemEnabledData = useSetGetSceneItemEnabledData();
//   const setRecordStatusData = useSetRecordStatusData();
//   const setStreamStatusData = useSetStreamStatusData();
//   const setReplyBufferStatusData = useSetReplayBufferStatusData();
//   const setToggleVirtualCam = useSetToggleVirtualCamData();

//   async function connect(server: Server) {
//     if (obs) {
//       obs.removeAllListeners();
//       await obs.disconnect();
//     }
//     const newObs = new OBSWebSocket();
//     try {
//       const { obsWebSocketVersion, negotiatedRpcVersion } =
//         await newObs.connect(
//           `ws://${server.ip}:${server.port}`,
//           server.password,
//           {
//             eventSubscriptions: EventSubscription.All,
//             rpcVersion: 1,
//           },
//         );
//       setConnected(true);
//       setIsFirstTry(false);
//       obs = newObs;
//       store.setLastServer(server.id);
//       obs.on("ConnectionClosed", () => {
//         obs?.removeAllListeners();
//         obs = null;
//         setConnected(false);
//       });
//       obs.on("CurrentProgramSceneChanged", (data) => {
//         setCurrentSceneData({
//           sceneName: data.sceneName,
//           sceneUuid: data.sceneUuid,
//           currentProgramSceneName: data.sceneName,
//           currentProgramSceneUuid: data.sceneUuid,
//         });
//       });
//       obs.on("InputMuteStateChanged", (data) => {
//         setGetInputMuteData(
//           {
//             inputUuid: data.inputUuid,
//           },
//           {
//             inputMuted: data.inputMuted,
//           },
//         );
//       });
//       obs.on("SceneItemEnableStateChanged", (data) => {
//         setGetSceneItemEnabledData(
//           {
//             sceneItemId: data.sceneItemId,
//             sceneUuid: data.sceneUuid,
//           },
//           {
//             sceneItemEnabled: data.sceneItemEnabled,
//           },
//         );
//       });
//       obs.on("RecordStateChanged", (data) => {
//         setRecordStatusData({
//           outputActive: data.outputActive,
//           outputBytes: 0,
//           outputDuration: 0,
//           outputPaused: false,
//           outputTimecode: "",
//         });
//       });
//       obs.on("StreamStateChanged", (data) => {
//         setStreamStatusData({
//           outputActive: data.outputActive,
//           outputBytes: 0,
//           outputCongestion: 0,
//           outputTotalFrames: 0,
//           outputDuration: 0,
//           outputReconnecting: false,
//           outputSkippedFrames: 0,
//           outputTimecode: "",
//         });
//       });
//       obs.on("ReplayBufferStateChanged", (data) => {
//         setReplyBufferStatusData({
//           outputActive: data.outputActive,
//         });
//       });
//       obs.on("VirtualcamStateChanged", (data) => {
//         setToggleVirtualCam({
//           outputActive: data.outputActive,
//         });
//       });
//       console.log(
//         `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`,
//       );
//     } catch (err) {
//       const error = err as { code: number; message: string };
//       console.error("Failed to connect", error.code, error.message);
//       throw err;
//     }
//   }

//   const call: OBSWebSocket["call"] = async (type, args) => {
//     if (!obs) {
//       throw new Error("Not connected to OBS");
//     }
//     return obs.call(type, args);
//   };

//   const addListener: OBSWebSocket["addListener"] = (event, listener) => {
//     if (!obs) {
//       throw new Error("Not connected to OBS");
//     }
//     return obs.addListener(event, listener);
//   };

//   const removeListener: OBSWebSocket["removeListener"] = (event, listener) => {
//     if (!obs) {
//       throw new Error("Not connected to OBS");
//     }
//     return obs.removeListener(event, listener);
//   };

//   const removeAllListeners: OBSWebSocket["removeAllListeners"] = (event) => {
//     if (!obs) {
//       throw new Error("Not connected to OBS");
//     }
//     return obs.removeAllListeners(event);
//   };

//   return (
//     <OBSContextProvider
//       value={{
//         connected,
//         connect,
//         isFirstTry,
//         call,
//         addListener,
//         removeAllListeners,
//         removeListener,
//       }}>
//       {props.children}
//     </OBSContextProvider>
//   );
// }

// OBSProvider.useContext = useOBSContext;
export {};
