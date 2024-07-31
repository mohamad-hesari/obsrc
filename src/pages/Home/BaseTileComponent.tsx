import React from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FaEdit } from "react-icons/fa";
import { IconType } from "react-icons";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";

import { BaseTile, Tile, useSettingsStore, useTilesStore } from "../../stores";
import { isMobile } from "react-device-detect";

function TileIcon(props: { icon: IconType }) {
  const Icon = props.icon;
  return <Icon className="aspect-square w-1/6" />;
}

function SVGText(props: { text: string }) {
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      const bbox = ref.current.getBBox();
      ref.current.setAttribute(
        "viewBox",
        `0 -${bbox.height / 2} ${bbox.width} ${bbox.height}`,
      );
      ref.current.setAttribute("height", `${bbox.height}`);
    }
  }, [props.text]);
  return (
    <svg ref={ref} className="w-full">
      <text fill="currentColor" {...props}>
        {props.text}
      </text>
    </svg>
  );
}

export type BaseTileProps<T> = {
  tile: T;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
};
export type BaseTileFC<T extends BaseTile = BaseTile> = React.FC<
  BaseTileProps<T>
>;

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ItemTypes = {
  CARD: "card",
};

type Props = BaseTileProps<Tile> & {
  type?: "Switch" | "Toggle" | "Trigger";
  onClick?: () => void;
  active?: boolean;
  color?: "primary" | "secondary" | "error";
  icon?: IconType;
};

function DraggableComponent(props: React.PropsWithChildren<Props>) {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        console.log("same index");
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        console.log("downwards");
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        console.log("upwards");
        return;
      }

      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex);
      console.log("moveCard", dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id: props.tile.id, index: props.index };
    },
    collect: (monitor: { isDragging: () => boolean }) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  const opacity = isDragging ? (!isMobile ? 0 : 0.5) : 1;
  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      style={{ opacity }}
      className={clsx(
        "relative flex flex-col items-center justify-center rounded-md border bg-white px-1 py-1 text-gray-900 transition-all ease-out",
      )}>
      <span>{props.tile.name}</span>
    </div>
  );
}

function NormalComponent(props: React.PropsWithChildren<Props>) {
  const store = useTilesStore();
  const navigate = useNavigate();
  const gridSize = useSettingsStore((state) => state.gridSize);
  const { editable, editTile } = store;

  function handleClick(tile: Tile) {
    return async () => {
      if (editable) {
        editTile(tile);
        store.toggleEditable();
        navigate("/edit");
        return;
      }
      props.onClick?.();
    };
  }
  const { color = "primary" } = props;
  return (
    <div
      onClick={handleClick(props.tile)}
      className={clsx(
        "relative flex aspect-square flex-col items-center justify-center rounded-md border px-1 text-gray-900 transition-all ease-out active:bg-blue-500",
        {
          "border-transparent": !props.active,
          "pointer-events-none": !editable && props.active,
          "bg-blue-200 active:bg-blue-500": color === "primary",
          "bg-green-200 active:bg-green-500": color === "secondary",
          "bg-red-200 active:bg-red-500": color === "error",
          "border-blue-500": color === "primary" && props.active,
          "border-green-500": color === "secondary" && props.active,
          "border-red-500": color === "error" && props.active,
        },
      )}>
      {/* {!props.children && <SVGText text={props.tile.name} />} */}
      {/* {props.children} */}
      {props.icon && <TileIcon icon={props.icon} />}
      {!props.icon && (
        <span className="inline-block aspect-square w-1/6"></span>
      )}
      <SVGText text={props.tile.name} />
      {props.type && (
        <span
          className={clsx("absolute italic text-gray-600", {
            "left-1 top-1 w-1/4": gridSize === 5,
            "left-1 top-2 w-1/4": gridSize === 4,
            "left-1 top-3 w-1/3": gridSize === 3,
            "left-1 top-4 w-1/3": gridSize === 2,
            "left-1 top-5 w-1/2": gridSize === 1,
          })}>
          <SVGText text={props.type} />
        </span>
      )}
      {editable && <FaEdit className="absolute right-2 top-2 h-4 w-4" />}
    </div>
  );
}

export function BaseTileComponent(props: React.PropsWithChildren<Props>) {
  const draggable = useTilesStore((state) => state.draggable);
  if (draggable) {
    return <DraggableComponent {...props} />;
  }
  return <NormalComponent {...props} />;
}
