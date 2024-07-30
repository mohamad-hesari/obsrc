import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { withLayout } from "../hocs";
import { Button, Toggle } from "../components";
import { useSettingsStore } from "../stores";

function Header() {
  return (
    <div className="flex items-center justify-start space-x-2">
      <Button as={Link} to="/" icon={FaArrowLeft} rounded color="glasses" />
      <span>Settings</span>
    </div>
  );
}

const Settings = withLayout(function Settings() {
  const store = useSettingsStore();
  return (
    <div className="divide-y divide-gray-400 [&>*]:rounded-none [&>*]:px-0 [&>*]:py-2">
      <Button
        color="glasses"
        as={Link}
        to="/settings/grid-size"
        className="flex w-full items-center justify-between !text-black">
        <div className="text-start">
          <div className="font-semibold">Grid Size</div>
          <div className="text-xs">How many tiles tha fit in row</div>
        </div>
        <div>{store.gridSize}</div>
      </Button>
      <Button
        color="glasses"
        type="button"
        onClick={() => store.setFullscreen(!store.fullscreen)}
        className="flex w-full items-center justify-between !text-black">
        <div className="text-start">
          <div className="font-semibold">Fullscreen</div>
          <div className="text-xs">Toggle automatically in landscape</div>
        </div>
        <Toggle active={store.fullscreen} />
      </Button>
      <Button
        color="glasses"
        type="button"
        className="flex w-full items-center justify-start !text-black">
        <div className="text-start">
          <div className="font-semibold">Disconnect</div>
        </div>
      </Button>
    </div>
  );
}, Header);

export default Settings;
