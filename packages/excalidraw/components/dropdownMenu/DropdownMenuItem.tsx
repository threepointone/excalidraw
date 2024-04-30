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

export const DropDownMenuItemBadge = ({
  type = "pink",
  children,
}: {
  type?: "green" | "pink";
  children: React.ReactNode;
}) => {
  const { theme } = useExcalidrawAppState();
  const customStyle =
    type === "pink"
      ? {
          backgroundColor: "pink",
          color: "darkred",
        }
      : {
          backgroundColor: "var(--background-color-badge)",
          color: "var(--color-badge)",
        };

  return (
    <div
      className="DropDownMenuItemBadge"
      style={{
        display: "inline-flex",
        marginLeft: "auto",
        padding: "2px 4px",
        background: "var(--color-promo)",
        // color: "var(--color-surface-lowest)",
        borderRadius: 6,
        fontSize: 9,
        fontFamily: "Cascadia, monospace",
        // fontSize: "0.625rem",
        // borderRadius: "8px",
        ...customStyle,
        border: theme === THEME.LIGHT ? "1.5px solid white" : "none",
      }}
    >
      {children}
    </div>
  );
};
DropDownMenuItemBadge.displayName = "DropdownMenuItemBadge";

DropdownMenuItem.Badge = DropDownMenuItemBadge;

export default DropdownMenuItem;
