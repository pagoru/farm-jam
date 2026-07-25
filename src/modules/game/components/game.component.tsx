import React, { useMemo } from "react";
import {
  CameraProvider,
  MapProvider,
  GuiComponent,
  PlayerProvider,
  PlayerComponent,
  MapComponent,
  BackgroundAnimationProvider,
} from "modules/game";
import { ContainerComponent } from "@openhotel/pixi-components";
import { NesterComponent } from "shared/components";

export const GameComponent: React.FC = () => {
  const providers = useMemo(
    () => [
      (props: React.PropsWithChildren) => (
        <CameraProvider guiChildren={<GuiComponent />} {...props} />
      ),
      MapProvider,
      PlayerProvider,
      BackgroundAnimationProvider,
    ],
    [],
  );

  return (
    <NesterComponent components={providers}>
      <ContainerComponent>
        <MapComponent />
        <PlayerComponent />
      </ContainerComponent>
    </NesterComponent>
  );
};
