import React, { PropsWithChildren, useEffect, useState } from "react";
import { SpriteSheetEnum } from "shared/enums";
import { useTextures } from "@openhotel/pixi-components";

type Props = {} & PropsWithChildren;

export const InitialLoaderComponent: React.FC<Props> = ({ children }) => {
  const { loadSpriteSheet } = useTextures();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      loadSpriteSheet(SpriteSheetEnum.FONT),
      loadSpriteSheet(SpriteSheetEnum.LOADING_0),
    ]).then(() => {
      setIsLoaded(true);
    });
  }, [loadSpriteSheet, setIsLoaded]);

  return isLoaded ? children : null;
};
