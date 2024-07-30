import clsx from "clsx";
import React from "react";

import {
  OBSSelectedProvider,
  useOBSContextStore,
  useSelectedHelper,
} from "../obs";
import { Button } from "../components";

function SelectServerComponent() {
  const store = useOBSContextStore();
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <span className="text-lg font-semibold">Select Server</span>
      {store.helpers.map((h) => (
        <Button
          key={h.id}
          onClick={() => store.setSelected(h.id)}
          color="primary">
          {h.helper.controller.server?.ip}
        </Button>
      ))}
    </div>
  );
}

function Wrapper(
  props: React.PropsWithChildren<{ with: boolean; header?: React.FC }>,
) {
  const selected = useSelectedHelper();
  const showChildren = !props.with || (props.with && selected);
  return (
    <>
      {props.header && (
        <div className="sticky inset-0 bottom-auto w-full bg-blue-500 px-4 py-2 text-white shadow-md">
          <OBSSelectedProvider>
            <props.header />
          </OBSSelectedProvider>
        </div>
      )}
      <div className={clsx("px-4 py-2")}>
        {showChildren && (
          <OBSSelectedProvider>{props.children}</OBSSelectedProvider>
        )}
        {!showChildren && <SelectServerComponent />}
      </div>
    </>
  );
}

export function withLayout<T extends Record<string, unknown>>(
  Component: React.FC<T>,
  Header?: React.FC,
  withSelectedContext = false,
) {
  function WithLayout(props: T) {
    return (
      <Wrapper with={withSelectedContext} header={Header}>
        <Component {...props} />
      </Wrapper>
    );
  }

  WithLayout.displayName = `withLayout(${Component.displayName || Component.name})`;

  return WithLayout;
}
