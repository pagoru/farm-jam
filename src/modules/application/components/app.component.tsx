import React, { useMemo } from "react";
import { ApplicationProvider } from "@openhotel/pixi-components";
import { Color } from "shared/enums";

export const AppComponent: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return useMemo(
    () => (
      <ApplicationProvider
        backgroundColor={Color.BACKGROUND_PURPLE}
        backgroundAlpha={1}
        scale={3}
        children={children}
      />
    ),
    [],
  );
};
