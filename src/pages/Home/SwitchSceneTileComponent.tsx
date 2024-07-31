import React from "react";

import type { SwitchSceneTile } from "../../stores";

import hooks from "../../hooks";
import { BaseTileComponent, BaseTileProps } from "./BaseTileComponent";

export function SwitchSceneTileComponent(
  props: BaseTileProps<SwitchSceneTile>,
) {
  const changeSceneQuery = hooks.requests.scenes.useSetCurrentScene();
  const currentScene = hooks.requests.scenes.useGetCurrentScene();
  const { data } = props.tile;
  const active = currentScene.data?.id === data.id;
  const handleClick = async () => {
    if (active) return;
    await changeSceneQuery.mutateAsync(data.id);
  };
  return (
    <BaseTileComponent
      {...props}
      onClick={handleClick}
      active={active}
      type="Switch"
    />
  );
}
