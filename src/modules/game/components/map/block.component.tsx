import React, { useEffect } from "react";
import { SpriteSheetEnum } from "shared/enums";
import { Point, SpriteComponent } from "@openhotel/pixi-components";
import { useBlockEntity } from "shared/hooks";
import { useMap } from "modules/game";

type Props = {
  position?: Point;
  type?: string;
};

export const BlockComponent: React.FC<Props> = ({
  position = { x: 0, y: 0 },
  type = "grass_0",
}) => {
  const { setWalkablePosition } = useMap();
  const blockEntityProps = useBlockEntity({ position, extraZIndex: -4 });

  useEffect(() => {
    setWalkablePosition(position);
  }, [position]);

  return (
    <SpriteComponent
      texture={type}
      spriteSheet={SpriteSheetEnum.WORLD}
      pivot={{
        x: 8,
        y: 5,
      }}
      {...blockEntityProps}
    />
  );
};
