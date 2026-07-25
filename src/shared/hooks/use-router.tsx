import React, { useCallback, useContext, useState } from "react";
import { DEFAULT_ROUTE, ROUTE_MAP } from "shared/consts";

type State = {
  navigate: (route: string) => void;
};

const RouterContext = React.createContext<State>({
  navigate: () => {},
});

type ProviderProps = {} & React.PropsWithChildren;

export const RouterProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const [RouteComponent, setRouteComponent] = useState<React.FC>(
    () => DEFAULT_ROUTE,
  );

  const navigate = useCallback(
    (route: string) => {
      const routeComponent = () => ROUTE_MAP[route];

      if (!routeComponent) return;
      setRouteComponent(routeComponent);
    },
    [setRouteComponent],
  );

  return (
    <RouterContext.Provider
      value={{
        navigate,
      }}
      children={
        <>
          <RouteComponent />
          {children}
        </>
      }
    />
  );
};

export const useRouter = (): State => useContext(RouterContext);
