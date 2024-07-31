import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

import { withLayout } from "../hocs";
import { Button } from "../components";
import { Link } from "react-router-dom";
import { useSettingsStore } from "../stores";
import clsx from "clsx";

function Header() {
  return (
    <div className="flex items-center justify-start space-x-2">
      <Button
        as={Link}
        to="/settings"
        icon={FaArrowLeft}
        rounded
        color="glasses"
      />
      <span>Grid Size</span>
    </div>
  );
}

const SettingGridSize = withLayout(function SettingGridSize() {
  const store = useSettingsStore();
  return (
    <div className="divide-y divide-gray-400">
      {new Array(5).fill(0).map((_, i) => (
        <div key={i} className="py-2">
          <Button
            color="glasses"
            type="button"
            onClick={() => store.setGridSize(i + 1)}
            className="flex w-full items-center justify-start space-x-4">
            <div
              className={clsx(
                "flex h-4 w-4 items-center justify-center rounded-full border-2",
                {
                  "border-black": store.gridSize !== i + 1,
                  "border-blue-500": store.gridSize === i + 1,
                },
              )}>
              {store.gridSize === i + 1 && (
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              )}
            </div>
            <span
              className={clsx("text-black", {
                "font-bold": store.gridSize === i + 1,
              })}>
              {i + 1}
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
}, Header);

export default SettingGridSize;
