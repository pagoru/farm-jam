import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { PixelateFilter } from "pixi-filters";
import { Point, useEvents } from "@openhotel/pixi-components";
import {
  getPositionFromIsometricPosition,
  getRandomNumber,
  getSwayAnimation,
  getZIndexFromIsometricPosition,
} from "shared/utils";
import { CustomEvent } from "shared/enums";

extend({
  Graphics,
});

type Props = {
  firstPoint?: Point & { z: number };
  secondPoint?: Point & { z: number };
  zIndexPosition?: Partial<Point>;
  sag?: number;
  width?: number;
  tint?: number;
  alpha?: number;
};

export const CatenaryCable: React.FC<Props> = ({
  firstPoint = { x: 0, y: 0, z: 0 },
  secondPoint = { x: 0, y: 0, z: 0 },
  zIndexPosition = { x: 0, y: 0 },
  sag = 5,
  width = 1,
  tint = 0xff00ff,
  alpha = 1,
}) => {
  const { on } = useEvents();

  const [$sag, $setSag] = useState(0);
  const seedRef = useRef<number>(getRandomNumber(0, 10_000_000));

  useEffect(() => {
    const onRemoveSwayAnimationEvent = on<{ time: number }>(
      CustomEvent.SWAY_ANIMATION,
      ({ time } = { time: 0 }) => {
        const sway = getSwayAnimation(time, 1, seedRef.current);
        $setSag(sway);
      },
    );

    return () => {
      onRemoveSwayAnimationEvent();
    };
  }, [on, $setSag]);

  const filters = useMemo(() => [new PixelateFilter(1)], []);

  const $firstPoint = useMemo(
    () => getPositionFromIsometricPosition(firstPoint),
    [firstPoint],
  );

  const $secondPoint = useMemo(
    () => getPositionFromIsometricPosition(secondPoint),
    [secondPoint],
  );

  const draw = useCallback(
    (graphics: Graphics) => {
      graphics.clear();

      const cx = ($firstPoint.x + $secondPoint.x) / 2;
      const cy = ($firstPoint.y + $secondPoint.y) / 2 + (sag + $sag) * 2;

      graphics.moveTo($firstPoint.x, $firstPoint.y - firstPoint.z);
      graphics.quadraticCurveTo(
        cx,
        cy - secondPoint.z,
        $secondPoint.x,
        $secondPoint.y - secondPoint.z,
      );
      graphics.stroke({ width, color: tint });
    },
    [
      $firstPoint,
      firstPoint,
      $secondPoint,
      secondPoint,
      sag,
      width,
      tint,
      $sag,
    ],
  );

  const zIndex = useMemo(
    () => getZIndexFromIsometricPosition(zIndexPosition),
    [zIndexPosition],
  );

  return (
    <pixiGraphics draw={draw} filters={filters} alpha={alpha} zIndex={zIndex} />
  );
};
