import React from "react";
import clsx from "clsx";
import { IconType } from "react-icons";

import { Spinner } from "./Spinner";
import { ThemeColor } from "./types";

import classes from "./Button.module.css";

type ButtonBaseProps = {
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: IconType;
  color?: ThemeColor;
  outlined?: boolean;
  rounded?: boolean;
};

export type ButtonProps<C extends React.ElementType = "button"> = Omit<
  React.ComponentPropsWithoutRef<C>,
  "color"
> & {
  as?: C;
} & ButtonBaseProps;

function ButtonComponent<C extends React.ElementType>(
  {
    as,
    children,
    className,
    loading,
    color,
    icon: Icon,
    leftIcon,
    rightIcon,
    outlined,
    rounded,
    ...props
  }: ButtonProps<C>,
  ref?: React.ComponentPropsWithRef<C>["ref"],
) {
  const Component = as || "button";
  const defaultAttributes: Record<string, unknown> = {};
  if (Component === "button") {
    defaultAttributes["type"] = "button";
  }
  return (
    <Component
      ref={ref}
      {...defaultAttributes}
      {...props}
      className={clsx(
        classes.btn,
        {
          [classes.primary]: !color || color === "primary",
          [classes.secondary]: color === "secondary",
          [classes.white]: color === "white",
          [classes.black]: color === "black",
          [classes.error]: color === "error",
          [classes.glasses]: color === "glasses",
          [classes.disabled]: !!props.disabled,
          [classes.outline]: outlined,
          [classes.fill]: !outlined,
          [classes.rounded]: rounded,
          [classes.withIcon]: !!Icon,
        },
        className,
      )}>
      {loading && <Spinner color={color} className={classes.loading} />}
      {Icon && <Icon className={classes.icon} />}
      {!Icon && (
        <>
          {leftIcon && leftIcon}
          {children && children}
          {rightIcon && rightIcon}
        </>
      )}
    </Component>
  );
}

export const Button = React.forwardRef(ButtonComponent);
