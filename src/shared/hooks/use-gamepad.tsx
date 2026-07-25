import React, { useCallback, useContext, useEffect, useRef } from "react";
import { useEvents } from "@openhotel/pixi-components";
import { CustomEvent } from "shared/enums";

type State = {
  getGamepad: (id: string) => Gamepad | null | undefined;
};

const GamepadContext = React.createContext<State>({
  getGamepad: () => null,
});

type GamepadProps = {} & React.PropsWithChildren;

export const GamepadProvider: React.FunctionComponent<GamepadProps> = ({
  children,
}) => {
  const { emit } = useEvents();

  const gamepadsRef = useRef<(Gamepad | null)[]>([]);

  const onGamepadConnected = useCallback((event: GamepadEvent) => {
    console.log(`Gamepad connected!`);
    emit(CustomEvent.GAMEPAD_CONNECTED, event.gamepad);

    // injects new gamepad to an empty slot if some gamepad is disconnected
    if (
      gamepadsRef.current.filter(($gamepad) => $gamepad === null).length === 0
    )
      gamepadsRef.current.push(event.gamepad);
    else
      gamepadsRef.current = gamepadsRef.current.map(($gamepad) =>
        $gamepad === null ? event.gamepad : $gamepad,
      );
  }, []);

  const onGamepadDisconnected = useCallback((event: GamepadEvent) => {
    console.log(`Gamepad disconnected!`);
    emit(CustomEvent.GAMEPAD_DISCONNECTED, event.gamepad);

    gamepadsRef.current = gamepadsRef.current.map(($gamepad) =>
      event.gamepad.id === $gamepad?.id ? null : $gamepad,
    );
    if (
      gamepadsRef.current.filter(($gamepad) => $gamepad !== null).length === 0
    )
      gamepadsRef.current = [];
  }, []);

  useEffect(() => {
    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    return () => {
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
    };
  }, [onGamepadConnected, onGamepadDisconnected]);

  const getGamepad = useCallback(
    (id: string) => gamepadsRef.current.find((gamepad) => gamepad?.id === id),
    [],
  );

  return (
    <GamepadContext.Provider
      value={{
        getGamepad,
      }}
      children={children}
    />
  );
};

export const useGamepad = (): State => useContext(GamepadContext);
