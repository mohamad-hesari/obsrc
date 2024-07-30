import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FaGear, FaPlus, FaUpDownLeftRight } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import update from "immutability-helper";

import { withLayout } from "../../hocs";
import { Button } from "../../components";
import { TileType, useSettingsStore, useTilesStore } from "../../stores";

import { OBSHelperProvider, useOBSContextStore } from "../../obs";

import { ActionTileComponent } from "./ActionTileComponent";
import { InputTileComponent } from "./InputTileComponent";
import { SourceTileComponent } from "./SourceTileComponent";
import { TriggerCustomHotKeyTileComponent } from "./TriggerCustomHotKeyTileComponent";
import { TriggerHotkeyByNameTileComponent } from "./TriggerHotkeyByNameTileComponent";
import { SwitchSceneTileComponent } from "./SwitchSceneTileComponent";
import { BaseTileComponent, BaseTileFC } from "./BaseTileComponent";
import { isMobile } from "react-device-detect";

const buttons = [
  { Icon: FaUpDownLeftRight, drag: true },
  { Icon: FaEdit, edit: true },
  { Icon: FaPlus, to: "/add" },
  { Icon: FaGear, to: "/settings" },
];

function Header() {
  const toggleEditable = useTilesStore((state) => state.toggleEditable);
  const toggleDraggable = useTilesStore((state) => state.toggleDraggable);
  return (
    <div className="flex items-center justify-between">
      <span>OBSRC</span>
      <div className="flex items-center space-x-1">
        {buttons.map(({ Icon, to, edit, drag }) => (
          <Button
            as={to ? Link : "button"}
            to={to}
            onClick={() => {
              edit && toggleEditable();
              drag && toggleDraggable();
            }}
            key={Icon.name}
            icon={Icon}
            rounded
            color="glasses"
          />
        ))}
      </div>
    </div>
  );
}

const tilesMap: Record<TileType, BaseTileFC> = {
  "switch-scene": SwitchSceneTileComponent as BaseTileFC,
  hotkey: TriggerHotkeyByNameTileComponent as BaseTileFC,
  "custom-hotkey": TriggerCustomHotKeyTileComponent as BaseTileFC,
  source: SourceTileComponent as BaseTileFC,
  input: InputTileComponent as BaseTileFC,
  general: ActionTileComponent as BaseTileFC,
};

const Home = withLayout(function Home() {
  const tiles = useTilesStore((state) => state.tiles);
  const saveTile = useTilesStore((state) => state.saveTile);
  const draggable = useTilesStore((state) => state.draggable);
  const helpers = useOBSContextStore((state) => state.helpers);
  const gridSize = useSettingsStore((state) => state.gridSize);

  const items = React.useMemo(() => {
    const connectedServers = helpers
      .filter(
        ({
          helper: {
            controller: { connected },
          },
        }) => connected,
      )
      .map(({ helper }) => helper.controller.server.id);
    return tiles
      .filter((tile) => connectedServers.includes(tile.serverId))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [tiles, helpers]);

  const moveCard = React.useCallback(
    function moveCard(dragIndex: number, hoverIndex: number) {
      const reorderItems = update(items, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, items[dragIndex]],
        ],
      });
      reorderItems.forEach((tile, index) => {
        tile.order = index + 1;
        saveTile(tile);
      });
    },
    [items, saveTile],
  );

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div
        className={clsx({
          "grid gap-1": !draggable,
          "space-y-2": draggable,
          "grid-cols-1": gridSize === 1,
          "grid-cols-2": gridSize === 2,
          "grid-cols-3": gridSize === 3,
          "grid-cols-4": gridSize === 4,
          "grid-cols-5": gridSize === 5,
        })}>
        {items.map((tile, index) => {
          const Tile = tilesMap[tile.type] ?? BaseTileComponent;
          return (
            <OBSHelperProvider key={tile.id} serverId={tile.serverId}>
              <Tile tile={tile} index={index} moveCard={moveCard} />
            </OBSHelperProvider>
          );
        })}
      </div>
    </DndProvider>
  );
}, Header);

export default Home;
