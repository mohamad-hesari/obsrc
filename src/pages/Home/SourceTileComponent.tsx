import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import type { SourceTile } from "../../stores";

import hooks from "../../hooks";
import { BaseTileComponent, BaseTileProps } from "./BaseTileComponent";

export function SourceTileComponent(props: BaseTileProps<SourceTile>) {
  const { data } = props.tile;
  const query = hooks.requests.scenes.useGetSceneItemEnabled(data);
  const toggleQuery = hooks.requests.scenes.useSetSceneItemEnabled();
  const handleClick = async () => {
    await toggleQuery.mutateAsync({
      item: data,
      enabled: !query.data,
    });
    await query.refetch();
  };
  return (
    <BaseTileComponent
      {...props}
      onClick={handleClick}
      type="Toggle"
      color={!query.data ? "error" : "primary"}
      icon={query.data ? FaEye : FaEyeSlash}
    />
  );
}
