import { Point } from "@openhotel/pixi-components";
import { BLOCK_SIZE, MAX_INDEX_POSITION_CONSTANT } from "shared/consts";

export const getPositionFromIsometricPosition = (position: Point): Point => ({
  x: (position.x - position.y) * 2,
  y: position.x + position.y,
});

export const getIsometricPositionFromPosition = (position: Point): Point => ({
  x: (position.y + position.x / 2) / 2,
  y: (position.y - position.x / 2) / 2,
});

export const getPositionFromBlockIsometricPosition = (
  position: Point,
): Point => ({
  x: position.x * BLOCK_SIZE.width - position.y * BLOCK_SIZE.width,
  y: position.x * BLOCK_SIZE.height + position.y * BLOCK_SIZE.height,
});

export const getBlockIsometricPositionFromPosition = (
  position: Point,
): Point => {
  const nx = position.x / BLOCK_SIZE.width;
  const ny = position.y / BLOCK_SIZE.height;

  return {
    x: Math.round((ny + nx) / 2),
    y: Math.round((ny - nx) / 2),
  };
};

export const getBlockPositionFromIsometricPosition = (position: Point): Point =>
  getBlockIsometricPositionFromPosition(
    getPositionFromIsometricPosition(position),
  );

export const getZIndexFromIsometricPosition = (
  position?: Partial<Point>,
): number => (position?.x ?? 0) + (position?.y ?? 0);

export const getUniqueIndexFromPosition = (position: Point) =>
  position.y * MAX_INDEX_POSITION_CONSTANT + position.x;

export const getPositionFromUniqueIndex = (index: number): Point => {
  const y = Math.round(index / MAX_INDEX_POSITION_CONSTANT);
  const x = index - y * MAX_INDEX_POSITION_CONSTANT;
  return { x, y };
};
