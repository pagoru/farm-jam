import React, { useCallback, useEffect, useRef, useState } from "react";
import { CharacterComponent } from "shared/components";
import {
  ContainerRef,
  Event,
  Point,
  useEvents,
} from "@openhotel/pixi-components";
import { useTicker } from "shared/hooks";
import { TickerQueue } from "@oh/queue";
import { CharacterAnimation, CustomEvent } from "shared/enums";
import { useMap, usePlayer } from "modules/game";
import { AXES_DEAD_ZONE } from "shared/consts";
import {
  getPositionFromIsometricPosition,
  getZIndexFromIsometricPosition,
} from "shared/utils";

type Props = {};

export const PlayerComponent: React.FC<Props> = ({}) => {
  const { on } = useEvents();
  const { add } = useTicker();
  const { canWalk } = useMap();
  const { setPosition, getPosition } = usePlayer();

  const characterRef = useRef<ContainerRef | null>(null);

  const currentMoveKeyCode = useRef<string[]>([]);
  const currentGamepad = useRef<Gamepad>(null);
  const currentActionKeyCodeActive = useRef<boolean>(false);

  const [movement, setMovement] = useState<boolean>(false);
  const [direction, setDirection] = useState<"right" | "left">("right");
  const [action, setAction] = useState<CharacterAnimation | null>(null);

  const $setPosition = useCallback(
    (
      onPosition: (pos: Point) => Partial<Point>,
      direction: "right" | "left",
    ) => {
      setDirection(direction);
      const $position = getPosition();

      const $point = { ...$position, ...onPosition($position) };
      if (!canWalk($point)) return;

      const playerComponent = characterRef.current?.component;
      if (!playerComponent) return;

      const absolutePosition = getPositionFromIsometricPosition($point);

      playerComponent!.position.copyFrom(absolutePosition);
      playerComponent!.zIndex = getZIndexFromIsometricPosition($point);
      setPosition($point);
    },
    [setPosition, setDirection, canWalk, getPosition],
  );

  useEffect(() => {
    const removeOnGamepadConnected = on<Gamepad>(
      CustomEvent.GAMEPAD_CONNECTED,
      (gamepad) => {
        if (currentGamepad.current) return;
        currentGamepad.current = gamepad!;
      },
    );
    const removeOnGamepadDisconnected = on<Gamepad>(
      CustomEvent.GAMEPAD_DISCONNECTED,
      (gamepad) => {
        if (currentGamepad.current?.id !== gamepad!.id) return;
        currentGamepad.current = null;
      },
    );

    const removeOnKeyDown = on<KeyboardEvent>(Event.KEY_DOWN, (event) => {
      const { code } = event!;
      if (["KeyW", "KeyD", "KeyA", "KeyS"].includes(code)) {
        if (currentMoveKeyCode.current.includes(code)) return;
        currentMoveKeyCode.current.push(code);
      }
      if (code === "KeyJ") {
        currentActionKeyCodeActive.current = true;
      }
    });
    const removeOnKeyUp = on<KeyboardEvent>(Event.KEY_UP, (event) => {
      const { code } = event!;
      if (currentMoveKeyCode.current.includes(code)) {
        currentMoveKeyCode.current = currentMoveKeyCode.current.filter(
          (keyCode) => code !== keyCode,
        );
        setPosition(getPosition());
      }
      if (code === "KeyJ") {
        currentActionKeyCodeActive.current = false;
      }
    });

    const consumedDelta = 40;
    let accDelta = 0;

    const onRemoveCustomTicker = add({
      type: TickerQueue.CUSTOM,
      onFunc: (delta: number) => {
        if (accDelta > consumedDelta) {
          let action;
          //action
          {
            action =
              currentActionKeyCodeActive.current ||
              (currentGamepad.current &&
                currentGamepad.current?.buttons?.[0]?.pressed);
            if (action) {
              setAction(CharacterAnimation.MINE);
            } else {
              setAction(null);
            }
          }
          //direction
          {
            let direction = null;

            if (currentGamepad.current) {
              // Axis 0 = Left/Right, Axis 1 = Up/Down
              const x = currentGamepad.current.axes[0];
              const y = currentGamepad.current.axes[1];
              // Both axes must exceed the deadzone to qualify as a diagonal
              const distance = Math.sqrt(x * x + y * y);

              if (distance >= AXES_DEAD_ZONE) {
                if (Math.abs(x) >= Math.abs(y)) {
                  if (x > 0) {
                    direction = y < 0 ? "top-right" : "bottom-right";
                  } else {
                    direction = y < 0 ? "top-left" : "bottom-left";
                  }
                } else {
                  if (y > 0) {
                    direction = x < 0 ? "bottom-left" : "bottom-right";
                  } else {
                    direction = x < 0 ? "top-left" : "top-right";
                  }
                }
              }
            }
            if (direction === null)
              direction = {
                KeyD: "bottom-right",
                KeyW: "top-right",
                KeyS: "bottom-left",
                KeyA: "top-left",
              }[
                currentMoveKeyCode.current[
                  currentMoveKeyCode.current.length - 1
                ]
              ];

            if (!action) {
              switch (direction) {
                case "bottom-right":
                  $setPosition((position) => ({ x: position.x + 1 }), "right");
                  break;
                case "top-right":
                  $setPosition((position) => ({ y: position.y - 1 }), "right");
                  break;
                case "bottom-left":
                  $setPosition((position) => ({ y: position.y + 1 }), "left");
                  break;
                case "top-left":
                  $setPosition((position) => ({ x: position.x - 1 }), "left");
                  break;
              }
              setMovement(Boolean(direction));
            }
          }
          accDelta -= consumedDelta;
        }
        accDelta += delta;
      },
    });

    return () => {
      removeOnKeyDown();
      removeOnKeyUp();
      removeOnGamepadConnected();
      removeOnGamepadDisconnected();
      onRemoveCustomTicker();
    };
  }, [
    on,
    add,
    $setPosition,
    setPosition,
    getPosition,
    setDirection,
    setMovement,
    setAction,
  ]);

  return (
    <CharacterComponent
      ref={characterRef}
      direction={direction}
      animation={
        action || (movement ? CharacterAnimation.WALK : CharacterAnimation.IDLE)
      }
    />
  );
};
