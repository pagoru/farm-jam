import React, { useEffect } from "react";
import { Point, SpriteComponent } from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { useBlockEntity } from "shared/hooks";
import { useMap } from "modules/game";
import {
  getIsometricPositionFromPosition,
  getPositionFromBlockIsometricPosition,
} from "shared/utils";

type Props = {
  type?: 0 | 1 | 2 | 3;
  position?: Partial<Point>;
};

export const HedgeComponent: React.FC<Props> = ({
  type = 0,
  position = { x: 0, y: 0 },
}) => {
  const { setBlockedPositions } = useMap();
  const blockEntityProps = useBlockEntity({ position });

  useEffect(() => {
    const absolutePosition = getPositionFromBlockIsometricPosition({
      x: 0,
      y: 0,
      ...position,
    });
    const isometricPosition =
      getIsometricPositionFromPosition(absolutePosition);
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        setBlockedPositions({
          x: isometricPosition.x + x,
          y: isometricPosition.y + y,
        });
      }
    }
  }, [position, setBlockedPositions]);

  useEffect(() => {}, []);

  return (
    <SpriteComponent
      texture={`hedge_${type}`}
      spriteSheet={SpriteSheetEnum.WORLD}
      pivot={{
        x: 8,
        y: 8,
      }}
      {...blockEntityProps}
    />
  );
};
