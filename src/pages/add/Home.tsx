import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCamera,
  FaClapperboard,
  FaEye,
  FaKeybase,
  FaKeyboard,
  FaVideo,
  FaWifi,
} from "react-icons/fa6";

import { withLayout } from "../../hocs";
import { Button } from "../../components";
import { FaVolumeMute } from "react-icons/fa";
import { actions, useTilesStore } from "../../stores";
import { uuid } from "../../utils";
import { useForceOBSContext, useOBSContextStore } from "../../obs";

function Header() {
  return (
    <div className="flex items-center space-x-2">
      <Button as={Link} to="/" icon={FaArrowLeft} rounded color="glasses" />
      <span>Add Control</span>
    </div>
  );
}

const buttons = [
  {
    to: "/add/scenes",
    title: "Switch Scenes",
    description: "Toggle automatically in landscape",
  },
  {
    to: "/add/hot-keys",
    title: "Trigger Hotkey",
    description: "Can perform any action under the settings > hotkeys",
    icon: FaKeybase,
  },
  {
    to: "/add/custom-hot-key",
    title: "Trigger Keys",
    description: "Toggle automatically in landscape",
    icon: FaKeyboard,
  },
  {
    to: "/add/sources",
    title: "Show Source",
    description: "Visibility of a source",
    icon: FaEye,
  },
  {
    to: "/add/inputs",
    title: "Mute Audio",
    description: "Control which audio input are playing",
    icon: FaVolumeMute,
  },
  {
    action: actions.stopStartStream,
    title: "Start/Stop Stream",
    description: "if obs is broadcasting",
    icon: FaWifi,
  },
  {
    action: actions.stopStartStreamRecording,
    title: "Start/Stop Recording",
    description: "if obs is recording",
    icon: FaVideo,
  },
  {
    action: actions.stopStartStreamReplayBuffer,
    title: "Start/Stop Replay Buffer",
    description: "if obs is recording",
    icon: FaClapperboard,
  },
  {
    action: actions.stopStartStreamVirtualCamera,
    title: "Start/Stop Virtual Camera",
    description: "if obs is recording",
    icon: FaCamera,
  },
];

const AddHome = withLayout(
  function AddHome() {
    const navigate = useNavigate();
    const store = useTilesStore();
    const helperStore = useOBSContextStore();
    const helper = useForceOBSContext();
    const serverId = helper.controller.server.id;

    function handleClick(action: string, title: string) {
      return function () {
        store.addTile({
          id: uuid(),
          name: title,
          data: { action },
          type: "general",
          serverId: serverId ?? "",
        });
        navigate("/");
        helperStore.setSelected("");
      };
    }
    return (
      <div className="divide-y divide-gray-400 [&>*]:rounded-none [&>*]:px-0 [&>*]:py-2">
        {buttons.map((button) => (
          <Button
            key={button.to || button.action}
            color="glasses"
            as={button.to ? Link : "button"}
            to={button.to}
            onClick={
              button.to || !button.action
                ? undefined
                : handleClick(button.action, button.title)
            }
            className="flex w-full items-center justify-between !text-gray-800">
            <div className="text-start">
              <div className="font-semibold">{button.title}</div>
              <div className="text-xs">{button.description}</div>
            </div>
            {button.icon && <button.icon className="h-4 w-4" />}
          </Button>
        ))}
        {/* <Button
        color="glasses"
        as={Link}
        to="/add/scenes"
        className="flex w-full items-center justify-between !text-black">
        <div className="text-start">
          <div className="font-semibold">Switch Scenes</div>
          <div className="text-xs">Toggle automatically in landscape</div>
        </div>
      </Button>
      <Button
        color="glasses"
        as={Link}
        to="/add/hot-keys"
        className="flex w-full items-center justify-between !text-black">
        <div className="text-start">
          <div className="font-semibold">Trigger Hotkey</div>
          <div className="text-xs">
            Can perform any action under the settings &gt; hotkeys
          </div>
        </div>
        <FaKeybase className="h-4 w-4" />
      </Button>
      <Button
        color="glasses"
        as={Link}
        to="/add/custom-hot-key"
        className="flex w-full items-center justify-between !text-black">
        <div className="text-start">
          <div className="font-semibold">Trigger Keys</div>
          <div className="text-xs">Toggle automatically in landscape</div>
        </div>
        <FaKeyboard className="h-4 w-4" />
      </Button>
      <Button
        color="glasses"
        as={Link}
        to="/add/sources"
        className="flex w-full items-center justify-between !text-black">
        <div className="text-start">
          <div className="font-semibold">Show Source</div>
          <div className="text-xs">Visibility of a source</div>
        </div>
        <FaEye className="h-4 w-4" />
      </Button>
      <Button
        color="glasses"
        as={Link}
        to="/add/inputs"
        className="flex w-full items-center justify-between !text-black">
        <div className="text-start">
          <div className="font-semibold">Mute Audio</div>
          <div className="text-xs">Control which audio input are playing</div>
        </div>
        <FaVolumeMute className="h-4 w-4" />
      </Button> */}
      </div>
    );
  },
  Header,
  true,
);

export default AddHome;
