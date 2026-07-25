import React, { useMemo } from "react";
import { Point } from "@openhotel/pixi-components";
import { Direction, WallType } from "shared/enums";
import { WallComponent } from "./";

type Wall = {
  direction: Direction;
  type?: WallType;
};

type Props = {
  position?: Partial<Point>;
  walls: Wall[];
};

export const WallsComponent: React.FC<Props> = ({
  position = { x: 0, y: 0 },
  walls,
}) =>
  useMemo(() => {
    const list = [];

    let index = 0;
    let nextPosition = { x: 0, y: 0, ...position };
    for (const wall of walls) {
      if (wall.type !== WallType.NONE)
        list.push(
          <WallComponent
            key={`wall_${index}`}
            type={wall.type}
            position={{ ...nextPosition }}
            direction={wall.direction}
          />,
        );
      switch (wall.direction) {
        case Direction.NORTH:
          nextPosition.y -= 4;
          break;
        case Direction.SOUTH:
          nextPosition.y += 4;
          break;
        case Direction.EAST:
          nextPosition.x -= 4;
          break;
        case Direction.WEST:
          nextPosition.x += 4;
          break;
      }
      index++;
    }
    return list;
  }, [walls, position]);
