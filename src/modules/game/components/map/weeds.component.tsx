import React from "react";
import { getRandomNumber } from "shared/utils";
import { Point, SpriteComponent } from "@openhotel/pixi-components";
import { useEntity } from "shared/hooks";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  type?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  position?: Partial<Point>;
};

export const WeedsComponent: React.FC<Props> = ({
  type = getRandomNumber(0, 9),
  position = { x: 0, y: 0 },
}) => {
  const entityProps = useEntity({ position });

  return (
    <SpriteComponent
      texture={`weeds_${type}`}
      spriteSheet={SpriteSheetEnum.WORLD}
      {...entityProps}
    />
  );
};
