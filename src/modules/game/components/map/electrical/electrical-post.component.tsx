import React, { useEffect } from "react";
import { Point, SpriteComponent } from "@openhotel/pixi-components";
import { CrossDirection, SpriteSheetEnum } from "shared/enums";
import { useEntity } from "shared/hooks";
import { useMap } from "modules/game";

type Props = {
  direction?: CrossDirection;
  position?: Partial<Point>;
};

export const ElectricalPostComponent: React.FC<Props> = ({
  direction = CrossDirection.NORTH_SOUTH,
  position,
}) => {
  const { setBlockedPositions } = useMap();
  const entityProps = useEntity({ position });

  useEffect(() => {
    for (let x = -2; x < 2; x++) {
      for (let y = -2; y < 2; y++) {
        setBlockedPositions({ x: 0, y: 0, ...position });
      }
    }
  }, [setBlockedPositions, position]);

  return (
    <SpriteComponent
      texture="electrical_post"
      spriteSheet={SpriteSheetEnum.WORLD}
      pivot={{
        x: 6 + (direction === CrossDirection.NORTH_SOUTH ? 0 : 1),
        y: 43,
      }}
      scale={{
        x: direction === CrossDirection.NORTH_SOUTH ? 1 : -1,
      }}
      {...entityProps}
    />
  );
};
