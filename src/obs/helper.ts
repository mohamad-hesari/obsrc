import { OBSRequestTypes, OBSResponseTypes } from "obs-websocket-js";
import { uuid } from "../utils";
import { OBSController } from "./controller";

export interface OBSScene {
  key: string;
  id: string;
  name: string;
}

export interface OBSSceneItem {
  key: string;
  id: number;
  kind: string;
  uuid: string;
  name: string;
  scene: OBSScene;
  get fullSourceName(): string;
}

export interface OBSHotkeySequence {
  keyId: string;
  keyModifiers: {
    shift: boolean;
    control: boolean;
    alt: boolean;
    command: boolean;
  };
}

const validKinds = [
  "browser_source",
  "ffmpeg_source",
  "teleport-source",
  "game_capture",
  "dshow_input",
  "wasapi_input_capture",
  "wasapi_output_capture",
  "wasapi_process_output_capture",
];

export class OBSOutputHelper<
  TStatus extends keyof OBSRequestTypes,
  TToggle extends keyof OBSRequestTypes,
  TStatusResponse extends OBSResponseTypes[TStatus] = OBSResponseTypes[TStatus],
> {
  public constructor(
    private _statusType: TStatus,
    private _toggleType: TToggle,
    private _controller: OBSController,
  ) {}

  public toggle() {
    const controller = this._controller;
    const toggleType = this._toggleType;
    return function () {
      return controller.call(toggleType);
    };
  }

  public getStatus() {
    const controller = this._controller;
    const _statusType = this._statusType;
    return async function () {
      const data = await controller.call(_statusType);
      return data as TStatusResponse;
    };
  }
}

export interface OutputHelperProps {
  get virtualCamera(): OBSOutputHelper<
    "GetVirtualCamStatus",
    "ToggleVirtualCam"
  >;
  get replyBuffer(): OBSOutputHelper<
    "GetReplayBufferStatus",
    "ToggleReplayBuffer"
  >;
  get stream(): OBSOutputHelper<"GetStreamStatus", "ToggleStream">;
  get record(): OBSOutputHelper<"GetRecordStatus", "ToggleRecord">;
}

export class OBSHelper implements OutputHelperProps {
  private _virtualCamera: OBSOutputHelper<
    "GetVirtualCamStatus",
    "ToggleVirtualCam"
  >;
  private _replyBuffer: OBSOutputHelper<
    "GetReplayBufferStatus",
    "ToggleReplayBuffer"
  >;
  private _stream: OBSOutputHelper<"GetStreamStatus", "ToggleStream">;
  private _record: OBSOutputHelper<"GetRecordStatus", "ToggleRecord">;

  public constructor(private _controller: OBSController) {
    this._virtualCamera = new OBSOutputHelper<
      "GetVirtualCamStatus",
      "ToggleVirtualCam"
    >("GetVirtualCamStatus", "ToggleVirtualCam", this._controller);
    this._replyBuffer = new OBSOutputHelper<
      "GetReplayBufferStatus",
      "ToggleReplayBuffer"
    >("GetReplayBufferStatus", "ToggleReplayBuffer", this._controller);
    this._stream = new OBSOutputHelper<"GetStreamStatus", "ToggleStream">(
      "GetStreamStatus",
      "ToggleStream",
      this._controller,
    );
    this._record = new OBSOutputHelper<"GetRecordStatus", "ToggleRecord">(
      "GetRecordStatus",
      "ToggleRecord",
      this._controller,
    );
  }

  public get controller() {
    return this._controller;
  }

  public get virtualCamera() {
    return this._virtualCamera;
  }

  public get replyBuffer() {
    return this._replyBuffer;
  }

  public get stream() {
    return this._stream;
  }

  public get record() {
    return this._record;
  }

  public getScenes() {
    const controller = this._controller;
    return async function (): Promise<OBSScene[]> {
      const data = await controller.call("GetSceneList");
      return data.scenes
        .map((scene) => ({
          key: uuid(),
          id: scene.sceneUuid as string,
          name: scene.sceneName as string,
        }))
        .unique("id");
    };
  }

  public getCurrentScene() {
    const controller = this._controller;
    return async function (): Promise<OBSScene> {
      const data = await controller.call("GetCurrentProgramScene");
      return {
        key: uuid(),
        id: data.sceneUuid as string,
        name: data.sceneName as string,
      };
    };
  }

  public setCurrentScene() {
    const controller = this._controller;

    return async function (id: string) {
      await controller.call("SetCurrentProgramScene", {
        sceneUuid: id,
      });
    };
  }

  public getSceneItems() {
    const controller = this._controller;

    return async function (scene: OBSScene) {
      const data = await controller.call("GetSceneItemList", {
        sceneUuid: scene.id,
      });
      return data.sceneItems
        .map((item) => ({
          key: uuid(),
          id: item.sceneItemId as number,
          kind: item.inputKind as string,
          uuid: item.sourceUuid as string,
          name: item.sourceName as string,
          scene,
          get fullSourceName() {
            return `${scene.name} - ${item.sourceName}`;
          },
        }))
        .unique("uuid");
    };
  }

  public getAllItems() {
    const getScenes = this.getScenes();
    const getSceneItems = this.getSceneItems();

    return async function () {
      const scenes = await getScenes();
      const items = await Promise.all(
        scenes.map((scene) => getSceneItems(scene)),
      );
      return items.flat(2).unique("uuid");
    };
  }

  public getSceneItemEnabled() {
    const controller = this._controller;

    return async function (item: OBSSceneItem) {
      const data = await controller.call("GetSceneItemEnabled", {
        sceneItemId: item.id,
        sceneUuid: item.scene.id,
      });
      return data.sceneItemEnabled as boolean;
    };
  }

  public setSceneItemEnabled() {
    const controller = this._controller;

    return async function ({
      item,
      enabled,
    }: {
      item: OBSSceneItem;
      enabled: boolean;
    }) {
      await controller.call("SetSceneItemEnabled", {
        sceneItemId: item.id,
        sceneUuid: item.scene.id,
        sceneItemEnabled: enabled,
      });
    };
  }

  public getHotkeyList() {
    const controller = this._controller;

    return async function () {
      const data = await controller.call("GetHotkeyList");
      return data.hotkeys.unique();
    };
  }

  public triggerHotkeyByName() {
    const controller = this._controller;

    return async function (name: string) {
      controller.call("TriggerHotkeyByName", {
        hotkeyName: name,
      });
    };
  }

  public triggerHotkeyByKeySequence() {
    const controller = this._controller;

    return async function (data: OBSHotkeySequence) {
      await controller.call("TriggerHotkeyByKeySequence", data);
    };
  }

  public getInputKindList() {
    const controller = this._controller;

    return async function () {
      const data = await controller.call("GetInputKindList");
      return data.inputKinds.unique();
    };
  }

  public getAudioItems() {
    const getAllItems = this.getAllItems();

    return async function () {
      const items = await getAllItems();
      return items.filter((item) => validKinds.includes(item.kind));
    };
  }

  public toggleAudioMute() {
    const controller = this._controller;
    return function (item: OBSSceneItem) {
      return controller.call("ToggleInputMute", {
        inputUuid: item.uuid,
      });
    };
  }

  public getAudioMute() {
    const controller = this._controller;

    return async function (item: OBSSceneItem) {
      const data = await controller.call("GetInputMute", {
        inputUuid: item.uuid,
      });
      return data.inputMuted;
    };
  }
}
