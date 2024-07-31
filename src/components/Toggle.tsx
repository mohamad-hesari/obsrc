import clsx from "clsx";
import React from "react";

export function Toggle(props: { active: boolean; onToggle?: () => void }) {
  return (
    <div className="px-2">
      <div
        className={clsx("relative h-3 w-6 rounded-lg transition-all ease-out", {
          "bg-gray-400": !props.active,
          "bg-blue-400": props.active,
        })}
        onClick={() => props.onToggle?.()}>
        <div
          className={clsx(
            "absolute -top-0.5 h-4 w-4 transform rounded-full shadow-md transition-all ease-out",
            {
              "-translate-x-2 bg-white": !props.active,
              "translate-x-full bg-blue-500": props.active,
            },
          )}></div>
      </div>
    </div>
  );
}
