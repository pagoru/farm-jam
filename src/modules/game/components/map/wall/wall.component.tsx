import React, { useMemo } from "react";
import { Point, SpriteComponent } from "@openhotel/pixi-components";
import { useEntity } from "shared/hooks";
import { Direction, SpriteSheetEnum, WallType } from "shared/enums";

type Props = {
  position?: Partial<Point>;
  direction?: Direction;
  type?: WallType;
};

export const WallComponent: React.FC<Props> = ({
  position = { x: 0, y: 0 },
  direction = Direction.NORTH,
  type = WallType.SHORT,
}) => {
  const entityProps = useEntity({ position, extraZIndex: 2 });

  const xScale = useMemo(() => {
    switch (direction) {
      case Direction.NORTH:
      case Direction.SOUTH:
        return 1;
      case Direction.EAST:
      case Direction.WEST:
        return -1;
    }
  }, [direction]);

  const pivot = useMemo(() => {
    switch (direction) {
      case Direction.NORTH:
        return { x: 4, y: 9 };
      case Direction.SOUTH:
        return { x: 12, y: 5 };
      case Direction.EAST:
        return { x: 12, y: 9 };
      case Direction.WEST:
        return { x: 4, y: 5 };
    }
  }, [direction]);

  return (
    <SpriteComponent
      texture={`wall_${type}`}
      spriteSheet={SpriteSheetEnum.WORLD}
      pivot={{
        x: pivot.x,
        y: pivot.y + (type === WallType.SHORT ? 0 : 1),
      }}
      scale={{
        x: xScale,
      }}
      {...entityProps}
    />
  );
};
