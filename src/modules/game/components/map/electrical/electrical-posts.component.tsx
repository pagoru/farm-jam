import React, { useMemo } from "react";
import { CatenaryCable, ElectricalPostComponent } from "./";
import { Point } from "@openhotel/pixi-components";
import { CrossDirection } from "shared/enums";

type Post = {
  position: Point;
  direction?: CrossDirection;
};

type Props = {
  posts: Post[];
};

export const ElectricalPostsComponent: React.FC<Props> = ({ posts }) => {
  const renderPosts = useMemo(() => {
    const list = [];

    let lastPost: Post | null = null;

    let index = 0;
    for (const { direction, position } of posts) {
      list.push(
        <ElectricalPostComponent
          key={`post_${index}`}
          position={position}
          direction={direction}
        />,
      );
      if (lastPost) {
        const zIndexPosition = {
          x: Math.max(lastPost.position.x, position.x) - 1,
          y: Math.max(lastPost.position.y, position.y) - 1,
        };
        const dx = position.x - lastPost.position.x;
        const dy = position.y - lastPost.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const dynamicSag = Math.max(2, distance * 0.1);

        const eastWestCorrection =
          lastPost.direction === CrossDirection.EAST_WEST ? { z: 4 } : { z: 0 };

        list.push(
          <React.Fragment key={`catenary_${index}`}>
            <CatenaryCable
              firstPoint={{
                x: lastPost.position.x - 2,
                y: lastPost.position.y,
                z: 22 - eastWestCorrection.z,
              }}
              secondPoint={{
                x: position.x - 2,
                y: position.y,
                z: 20 - eastWestCorrection.z,
              }}
              sag={dynamicSag}
              zIndexPosition={zIndexPosition}
              alpha={0.25}
              tint={0}
            />
            <CatenaryCable
              firstPoint={{
                x: lastPost.position.x + 2,
                y: lastPost.position.y,
                z: 22 + eastWestCorrection.z,
              }}
              secondPoint={{
                x: position.x + 2,
                y: position.y,
                z: 20 + eastWestCorrection.z,
              }}
              sag={dynamicSag}
              zIndexPosition={{
                x: zIndexPosition.x - 0.25,
                y: zIndexPosition.y - 0.25,
              }}
              alpha={0.25}
              tint={0}
            />
          </React.Fragment>,
        );
      }
      lastPost = { position, direction };
      index++;
    }

    return list;
  }, [posts]);

  return <>{renderPosts}</>;
};
