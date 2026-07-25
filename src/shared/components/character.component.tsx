import React, {
  Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  AnimatedSpriteComponent,
  ContainerComponent,
  ContainerRef,
  PlayStatus,
  SpriteComponent,
} from "@openhotel/pixi-components";
import { CharacterAnimation, SpriteSheetEnum } from "shared/enums";
import { CHARACTER_ANIMATIONS_SPEED, CHARACTER_MID_SIZE } from "shared/consts";

type Props = {
  ref?: Ref<ContainerRef>;
  animation?: CharacterAnimation;
  direction?: "right" | "left";
};

export const CharacterComponent: React.FC<Props> = ({
  ref,
  direction = "right",
  animation = CharacterAnimation.IDLE,
}) => {
  const $ref = useRef<ContainerRef | null>(null);

  const getRefProps = useCallback(
    (): ContainerRef => $ref.current!,
    [$ref.current],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  return useMemo(() => {
    return (
      <ContainerComponent
        ref={$ref}
        pivot={{
          x: CHARACTER_MID_SIZE.x,
          y: CHARACTER_MID_SIZE.y,
        }}
        // position={getPositionFromIsometricPosition(position)}
      >
        <AnimatedSpriteComponent
          spriteSheet={SpriteSheetEnum.PLAYER}
          animation={animation}
          playStatus={PlayStatus.PLAY}
          animationSpeed={CHARACTER_ANIMATIONS_SPEED[animation]}
          scale={{ x: direction === "right" ? 1 : -1 }}
          pivot={{
            x: direction === "right" ? 0 : 1,
          }}
        />
        <SpriteComponent
          texture="shadow"
          spriteSheet={SpriteSheetEnum.PLAYER}
        />
      </ContainerComponent>
    );
  }, [animation, direction]);
};
