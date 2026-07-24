import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Event,
  Point,
  Size,
  useEvents,
  useWindow,
} from "@openhotel/pixi-components";
import { useCamera } from "modules/game";
import { getPositionFromIsometricPosition } from "shared/utils";

type State = {
  setPosition: (value: Point) => void;
  getPosition: () => Point;
};

const PlayerContext = React.createContext<State>({
  setPosition: () => {},
  getPosition: () => ({ x: 0, y: 0 }),
});

type PlayerProps = {} & React.PropsWithChildren;

export const PlayerProvider: React.FunctionComponent<PlayerProps> = ({
  children,
}) => {
  const { on } = useEvents();
  const { getSize } = useWindow();
  const { moveTo } = useCamera();

  const positionRef = useRef<Point>({ x: 0, y: 0 });

  const [windowSize, setWindowSize] = useState<Size>(getSize());
  const [cameraPivot, setCameraPivot] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const removeOnResize = on<Size>(Event.RESIZE, (size) => {
      setWindowSize(size as Size);
    });
    return () => {
      removeOnResize();
    };
  }, [on, setWindowSize, setCameraPivot]);

  useEffect(() => {
    moveTo({
      x: windowSize.width / 2 - cameraPivot.x,
      y: windowSize.height / 2 - cameraPivot.y,
    });
  }, [windowSize, cameraPivot, moveTo]);

  useEffect(() => {}, [setCameraPivot]);

  const setPosition = useCallback(
    (position: Point) => {
      positionRef.current = position;

      const playerRealPosition = getPositionFromIsometricPosition(position);
      setCameraPivot({
        x: playerRealPosition.x,
        y: playerRealPosition.y,
      });
    },
    [setCameraPivot],
  );

  const getPosition = useCallback(() => positionRef.current, []);

  return (
    <PlayerContext.Provider
      value={{
        setPosition,
        getPosition,
      }}
      children={children}
    />
  );
};

export const usePlayer = (): State => useContext(PlayerContext);
