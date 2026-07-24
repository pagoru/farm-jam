import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ContainerComponent,
  Point,
  SpriteComponent,
  SpriteRef,
  useEvents,
} from "@openhotel/pixi-components";
import { CustomEvent, SpriteSheetEnum, TreeType } from "shared/enums";
import { getRandomNumber, getSwayAnimation } from "shared/utils";
import {
  TREE_MASK_MAP,
  TREE_SPRITE_MAP,
  TREE_SPRITE_PIVOT_MAP,
} from "shared/consts";
import { useEntity } from "shared/hooks";
import { useMap } from "modules/game";

type Props = {
  position?: Partial<Point>;
  type?: TreeType;
};

export const TreeComponent: React.FC<Props> = ({
  position = { x: 0, y: 0 },
  type = TreeType.BIG,
}) => {
  const { setBlockedPositions } = useMap();
  const { on } = useEvents();
  const entityProps = useEntity({ position });

  const spritesRef = useRef<SpriteRef[]>([]);
  const seedRef = useRef<number>(getRandomNumber(0, 10_000_000));

  const texture = useMemo(() => TREE_SPRITE_MAP[type], [type]);
  const pivot = useMemo(() => TREE_SPRITE_PIVOT_MAP[type], [type]);
  const maskData = useMemo(() => TREE_MASK_MAP[type], [type]);

  useEffect(() => {
    for (let x = -2; x < 2; x++) {
      for (let y = -2; y < 2; y++) {
        setBlockedPositions({ x: 0, y: 0, ...position });
      }
    }
  }, [setBlockedPositions, position]);

  useEffect(() => {
    const onRemoveSwayAnimationEvent = on<{ time: number }>(
      CustomEvent.SWAY_ANIMATION,
      ({ time } = { time: 0 }) => {
        spritesRef.current.forEach((sprite, index) => {
          const sway = getSwayAnimation(time, 3, seedRef.current);
          sprite.component.position.x = Math.round(sway * maskData.sway[index]);
        });
      },
    );

    return () => {
      onRemoveSwayAnimationEvent();
    };
  }, [on, maskData]);

  const setSpriteRef = useCallback(
    (index: number) => (ref: SpriteRef) => {
      spritesRef.current[index] = ref;
    },
    [],
  );

  const renderSprites = useMemo(() => {
    const spriteList = [];

    let accumulatedYPosition = 0;
    maskData.divisions.forEach((yPosition, index) => {
      spriteList.push(
        <SpriteComponent
          key={`sprite_${index}`}
          ref={setSpriteRef(index)}
          texture={texture}
          spriteSheet={SpriteSheetEnum.WORLD}
          maskPosition={{
            y: accumulatedYPosition,
          }}
          maskPolygon={[
            //
            0,
            0,
            //
            0,
            yPosition,
            //
            maskData.size.width,
            yPosition,
            //
            maskData.size.width,
            0,
          ]}
        />,
      );
      accumulatedYPosition += yPosition;
    });

    const lastHeight = maskData.size.height - accumulatedYPosition;
    if (lastHeight > 0)
      spriteList.push(
        <SpriteComponent
          key={`sprite_${spriteList.length}`}
          texture={texture}
          spriteSheet={SpriteSheetEnum.WORLD}
          maskPosition={{
            y: accumulatedYPosition,
          }}
          maskPolygon={[
            //
            0,
            0,
            //
            0,
            lastHeight,
            //
            maskData.size.width,
            lastHeight,
            //
            maskData.size.width,
            0,
          ]}
        />,
      );

    return spriteList;
  }, [maskData]);

  return (
    <ContainerComponent {...entityProps} pivot={pivot}>
      {renderSprites}
    </ContainerComponent>
  );
};
