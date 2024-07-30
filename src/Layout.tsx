import clsx from "clsx";
import React from "react";

type Props = {
  header?: React.ReactNode;
};

function Layout(props: React.PropsWithChildren<Props>) {
  return (
    <>
      {props.header && (
        <div className="sticky inset-0 bottom-auto h-16 w-full bg-blue-500 shadow-md">
          {props.header}
        </div>
      )}
      <div className={clsx({ "pt-16": !!props.header })}>{props.children}</div>
    </>
  );
}

export default Layout;
