import React, { useContext, useEffect, useRef } from "react";
import {
  Event,
  EventMode,
  Point,
  SpriteComponent,
  SpriteRef,
  useEvents,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";

type State = {};

const CursorContext = React.createContext<State>({});

type CursorProps = {} & React.PropsWithChildren;

export const CursorProvider: React.FunctionComponent<CursorProps> = ({
  children,
}) => {
  const { on } = useEvents();

  const cursorSpriteRef = useRef<SpriteRef>(null);

  useEffect(() => {
    const removeOnCursorMove = on<Point>(Event.CURSOR_MOVE, (position) => {
      if (!position) return;
      cursorSpriteRef.current?.component.position.copyFrom(position);
    });

    return () => {
      removeOnCursorMove();
    };
  }, [on]);

  return (
    <CursorContext.Provider
      value={{}}
      children={
        <>
          {children}
          <SpriteComponent
            ref={cursorSpriteRef}
            pivot={{
              x: 3,
              y: 3,
            }}
            spriteSheet={SpriteSheetEnum.UI}
            texture="cursor"
            eventMode={EventMode.NONE}
          />
        </>
      }
    />
  );
};

export const useCursor = (): State => useContext(CursorContext);
