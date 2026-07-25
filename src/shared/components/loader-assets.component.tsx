import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { LoaderItem } from "shared/types";
import { LoaderScreenComponent } from "shared/components";

type Props = {
  loaderItems: LoaderItem[];
  onDone?: () => void;
} & PropsWithChildren;

export const LoaderAssetsComponent: React.FC<Props> = ({
  loaderItems,
  onDone,
  children,
}) => {
  const currentPercentageRef = useRef<number>(0);

  const [currentText, setCurrentText] = useState<string | null>(`Loading...	`);
  useEffect(() => {
    if (loaderItems.length === 0) {
      setCurrentText(null);
      return;
    }
    (async () => {
      const totalItems = loaderItems.reduce(
        (total, { items }) => total + items.length,
        0,
      );
      let currentItem = 0;
      for (const { items, func, label } of loaderItems) {
        setCurrentText(`Loading ${label}...`);
        for (const item of items) {
          setCurrentText(`Loading ${item.split(".")[0]}...`);
          await func(item);
          currentItem++;
          currentPercentageRef.current = currentItem / totalItems;
        }
        setCurrentText(`Loading ${label}...`);
      }
      setCurrentText(null);
      onDone?.();
    })();
  }, [loaderItems, setCurrentText, onDone]);

  return currentText ? <LoaderScreenComponent text={currentText} /> : children;
};
