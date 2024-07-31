import OBSWebSocket, { EventSubscription } from "obs-websocket-js";

export type Server = {
  id: string;
  ip: string;
  port: number;
  password?: string;
};

export class OBSController {
  private _obs: OBSWebSocket | null = null;
  private _connected = false;
  private _loading = false;

  public get loading() {
    return this._loading;
  }

  public get connected() {
    return this._connected;
  }

  public get server() {
    return this._server;
  }

  public constructor(private _server: Server) {}

  public async connect() {
    this._loading = true;
    if (this._obs) {
      await this.disconnect();
    }
    const newObs = new OBSWebSocket();
    try {
      await newObs.connect(
        `ws://${this._server.ip}:${this._server.port}`,
        this._server.password,
        {
          eventSubscriptions: EventSubscription.All,
          rpcVersion: 1,
        },
      );
      this._obs = newObs;
      this._obs.on("ConnectionClosed", () => {
        this._obs?.removeAllListeners();
        this._obs = null;
        this._connected = false;
      });
      // this._obs.on("CurrentProgramSceneChanged", (_data) => {
      //   // setCurrentSceneData({
      //   //   sceneName: data.sceneName,
      //   //   sceneUuid: data.sceneUuid,
      //   //   currentProgramSceneName: data.sceneName,
      //   //   currentProgramSceneUuid: data.sceneUuid,
      //   // });
      // });
      // this._obs.on("InputMuteStateChanged", (_data) => {
      //   // setGetInputMuteData(
      //   //   {
      //   //     inputUuid: data.inputUuid,
      //   //   },
      //   //   {
      //   //     inputMuted: data.inputMuted,
      //   //   },
      //   // );
      // });
      // this._obs.on("SceneItemEnableStateChanged", (_data) => {
      //   // setGetSceneItemEnabledData(
      //   //   {
      //   //     sceneItemId: data.sceneItemId,
      //   //     sceneUuid: data.sceneUuid,
      //   //   },
      //   //   {
      //   //     sceneItemEnabled: data.sceneItemEnabled,
      //   //   },
      //   // );
      // });
      // this._obs.on("RecordStateChanged", (_data) => {
      //   // setRecordStatusData({
      //   //   outputActive: data.outputActive,
      //   //   outputBytes: 0,
      //   //   outputDuration: 0,
      //   //   outputPaused: false,
      //   //   outputTimecode: "",
      //   // });
      // });
      // this._obs.on("StreamStateChanged", (_data) => {
      //   // setStreamStatusData({
      //   //   outputActive: data.outputActive,
      //   //   outputBytes: 0,
      //   //   outputCongestion: 0,
      //   //   outputTotalFrames: 0,
      //   //   outputDuration: 0,
      //   //   outputReconnecting: false,
      //   //   outputSkippedFrames: 0,
      //   //   outputTimecode: "",
      //   // });
      // });
      // this._obs.on("ReplayBufferStateChanged", (_data) => {
      //   // setReplyBufferStatusData({
      //   //   outputActive: data.outputActive,
      //   // });
      // });
      // this._obs.on("VirtualcamStateChanged", (_data) => {
      //   // setToggleVirtualCam({
      //   //   outputActive: data.outputActive,
      //   // });
      // });
      this._connected = true;
      return true;
    } catch {
      this._connected = false;
    }
    this._loading = false;
    return false;
  }

  public async reconnect() {
    await this.disconnect();
    return await this.connect();
  }

  public async disconnect() {
    if (this._obs) {
      this._obs.removeAllListeners();
      await this._obs.disconnect();
      this._obs = null;
      this._connected = false;
    }
  }

  public call: OBSWebSocket["call"] = (type, args) => {
    if (!this._obs) {
      throw new Error("Not connected to OBS");
    }
    return this._obs.call(type, args);
  };

  public addListener: OBSWebSocket["addListener"] = (event, listener) => {
    if (!this._obs) {
      throw new Error("Not connected to OBS");
    }
    return this._obs.addListener(event, listener);
  };

  public removeListener: OBSWebSocket["removeListener"] = (event, listener) => {
    if (!this._obs) {
      throw new Error("Not connected to OBS");
    }
    return this._obs.removeListener(event, listener);
  };

  public removeAllListeners: OBSWebSocket["removeAllListeners"] = (event) => {
    if (!this._obs) {
      throw new Error("Not connected to OBS");
    }
    return this._obs.removeAllListeners(event);
  };
}
