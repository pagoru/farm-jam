import React, { useCallback, useContext, useRef } from "react";
import { Point } from "@openhotel/pixi-components";
import {
  getBlockPositionFromIsometricPosition,
  getUniqueIndexFromPosition,
} from "shared/utils";

type State = {
  setWalkablePosition: (position: Point) => void;
  setBlockedPositions: (...position: Point[]) => void;
  canWalk: (position: Point) => boolean;
};

const MapContext = React.createContext<State>({
  setWalkablePosition: () => {},
  setBlockedPositions: () => {},
  canWalk: () => false,
});

type MapProps = {} & React.PropsWithChildren;

export const MapProvider: React.FunctionComponent<MapProps> = ({
  children,
}) => {
  const walkablePositionsRef = useRef<number[]>([]);
  const blockedPositionsRef = useRef<number[]>([]);

  const setWalkablePosition = useCallback((position: Point) => {
    const index = getUniqueIndexFromPosition(position);

    if (!walkablePositionsRef.current.includes(index))
      walkablePositionsRef.current.push(index);
  }, []);

  const setBlockedPositions = useCallback((...positions: Point[]) => {
    for (const position of positions) {
      const index = getUniqueIndexFromPosition(position);

      if (!blockedPositionsRef.current.includes(index))
        blockedPositionsRef.current.push(index);
    }
  }, []);

  const canWalk = useCallback((position: Point) => {
    const positionIndex = getUniqueIndexFromPosition(position);

    if (blockedPositionsRef.current.includes(positionIndex)) return false;

    const blockPosition = getBlockPositionFromIsometricPosition(position);
    const blockPositionIndex = getUniqueIndexFromPosition(blockPosition);

    return walkablePositionsRef.current.includes(blockPositionIndex);
  }, []);
  return (
    <MapContext.Provider
      value={{
        setWalkablePosition,
        setBlockedPositions,
        canWalk,
      }}
      children={children}
    />
  );
};

export const useMap = (): State => useContext(MapContext);
