import React, { useEffect, useRef } from "react";
import {
  getDropdownMenuItemClassName,
  useHandleDropdownMenuItemClick,
} from "./common";
import MenuItemContent from "./DropdownMenuItemContent";
import { useExcalidrawAppState } from "../App";
import { THEME } from "../../constants";

const DropdownMenuItem = ({
  icon,
  value,
  children,
  shortcut,
  className,
  selected,
  focus,
  onSelect,
  onClick,
  ...rest
}: {
  icon?: JSX.Element;
  value?: string | number | undefined;
  onSelect?: (event: Event) => void;
  children: React.ReactNode;
  shortcut?: string;
  selected?: boolean;
  focus?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect">) => {
  const handleClick = useHandleDropdownMenuItemClick(onClick, onSelect);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focus) {
      ref.current?.focus();
    }
  }, [focus]);

  return (
    <button
      {...rest}
      ref={ref}
      value={value}
      onClick={handleClick}
      className={getDropdownMenuItemClassName(className, selected)}
      title={rest.title ?? rest["aria-label"]}
    >
      <MenuItemContent icon={icon} shortcut={shortcut}>
        {children}
      </MenuItemContent>
    </button>
  );
};
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropDownMenuItemBadgeType = {
  GREEN: "green",
  BLUE: "blue",
};

export const DropDownMenuItemBadge = ({
  type = DropDownMenuItemBadgeType.BLUE,
  children,
}: {
  type?: typeof DropDownMenuItemBadgeType[keyof typeof DropDownMenuItemBadgeType];
  children: React.ReactNode;
}) => {
  const { theme } = useExcalidrawAppState();
  const style = {
    display: "inline-flex",
    marginLeft: "auto",
    padding: "2px 4px",
    borderRadius: 6,
    fontSize: 9,
    fontFamily: "Cascadia, monospace",
    border: theme === THEME.LIGHT ? "1.5px solid white" : "none",
  };

  if (type === "green") {
    Object.assign(style, {
      backgroundColor: "var(--background-color-badge)",
      color: "var(--color-badge)",
    });
  } else {
    Object.assign(style, {
      background: "var(--color-promo)",
      color: "var(--color-surface-lowest)",
    });
  }

  return (
    <div className="DropDownMenuItemBadge" style={style}>
      {children}
    </div>
  );
};
DropDownMenuItemBadge.displayName = "DropdownMenuItemBadge";

DropdownMenuItem.Badge = DropDownMenuItemBadge;

export default DropdownMenuItem;
