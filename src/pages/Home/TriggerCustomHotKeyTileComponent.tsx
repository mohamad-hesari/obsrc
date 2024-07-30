import React from "react";

import type { CustomHotkeyTile } from "../../stores";

import hooks from "../../hooks";
import { BaseTileComponent, BaseTileProps } from "./BaseTileComponent";

export function TriggerCustomHotKeyTileComponent(
  props: BaseTileProps<CustomHotkeyTile>,
) {
  const query = hooks.requests.general.useTriggerHotkeyByKeySequence();
  const handleClick = async () => {
    const { data } = props.tile;
    await query.mutateAsync(data);
  };
  return <BaseTileComponent {...props} onClick={handleClick} type="Trigger" />;
}
