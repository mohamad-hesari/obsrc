import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

import type { InputTile } from "../../stores";

import hooks from "../../hooks";
import { BaseTileComponent, BaseTileProps } from "./BaseTileComponent";

export function InputTileComponent(props: BaseTileProps<InputTile>) {
  const { data } = props.tile;
  const query = hooks.requests.inputs.useGetInputMute(data);
  const toggleQuery = hooks.requests.inputs.useToggleInputMute();
  const handleClick = async () => {
    await toggleQuery.mutateAsync(data);
    await query.refetch();
  };
  return (
    <BaseTileComponent
      {...props}
      onClick={handleClick}
      type="Toggle"
      color={query.data ? "error" : "primary"}
      icon={query.data ? FaVolumeMute : FaVolumeUp}
    />
  );
}
