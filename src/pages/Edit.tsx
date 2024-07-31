import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa6";

import { withLayout } from "../hocs";
import { Button } from "../components";
import { Tile, useTilesStore } from "../stores";

function Header() {
  const toggleEditable = useTilesStore((state) => state.toggleEditable);
  const tile = useTilesStore((state) => state.tile);
  const removeTile = useTilesStore((state) => state.removeTile);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          as={Link}
          to="/"
          icon={FaArrowLeft}
          onClick={toggleEditable}
          rounded
          color="glasses"
        />
        <span>Edit Tile</span>
      </div>
      <Button
        as={Link}
        to="/"
        icon={FaTrash}
        onClick={() => tile && removeTile(tile)}
        rounded
        color="glasses"
      />
    </div>
  );
}

function EditForm(props: { tile: Tile }) {
  const [tile, setTile] = React.useState(props.tile);
  const saveTile = useTilesStore((state) => state.saveTile);
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-xs">
          Name
        </label>
        <input
          className="block w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm outline-none transition-all ease-out focus:border-gray-400"
          type="text"
          value={tile.name}
          placeholder="Name"
          onChange={(e) =>
            setTile((tile) => ({ ...tile, name: e.target.value }))
          }
        />
      </div>
      <Button
        as={Link}
        to="/"
        className="w-full"
        color="primary"
        onClick={() => saveTile(tile)}>
        Save
      </Button>
    </div>
  );
}

const Edit = withLayout(function Edit() {
  const tile = useTilesStore((state) => state.tile);

  if (!tile) return <></>;
  return (
    <div>
      <EditForm tile={tile} />
    </div>
  );
}, Header);

export default Edit;
