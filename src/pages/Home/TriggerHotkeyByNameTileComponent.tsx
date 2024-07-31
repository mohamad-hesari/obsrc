import React from "react";

import type { HotkeyTile } from "../../stores";

import hooks from "../../hooks";
import { BaseTileComponent, BaseTileProps } from "./BaseTileComponent";

export function TriggerHotkeyByNameTileComponent(
  props: BaseTileProps<HotkeyTile>,
) {
  const query = hooks.requests.general.useTriggerHotkeyByName();
  const handleClick = async () => {
    const { data } = props.tile;
    await query.mutateAsync(data);
  };
  return <BaseTileComponent {...props} onClick={handleClick} type="Trigger" />;
}
