import React, { useEffect, useState } from "react";
import {
  AnimatedSpriteComponent,
  ContainerComponent,
  Event,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  PlayStatus,
  Size,
  useEvents,
  useWindow,
} from "@openhotel/pixi-components";
import { Color, SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components";

type Props = {
  text?: string;
};

export const LoaderScreenComponent: React.FC<Props> = ({ text }) => {
  const { on } = useEvents();
  const { getSize } = useWindow();

  const [windowSize, setWindowSize] = useState<Size>(getSize());

  useEffect(() => {
    const onRemoveResize = on<Size>(Event.RESIZE, (size) => {
      if (!size) return;
      setWindowSize(size);
    });

    return () => {
      onRemoveResize();
    };
  }, [on]);

  return (
    <ContainerComponent>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={windowSize.width}
        height={windowSize.height}
        tint={Color.BACKGROUND_PURPLE}
      />
      <AnimatedSpriteComponent
        spriteSheet={SpriteSheetEnum.LOADING_0}
        animation="loading"
        playStatus={PlayStatus.PLAY}
        animationSpeed={0.15}
        pivot={{
          x: 8,
          y: 8,
        }}
        position={{
          x: windowSize.width / 2,
          y: windowSize.height / 2,
        }}
      />
      {text ? (
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.CENTER}
          align={FLEX_ALIGN.CENTER}
          position={{
            y: 24,
          }}
        >
          <TextComponent text={text} tint={Color.SHADOW_TEXT} />
        </FlexContainerComponent>
      ) : null}
    </ContainerComponent>
  );
};
