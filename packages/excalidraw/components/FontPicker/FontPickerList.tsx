import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEventHandler,
} from "react";
import { FONT_FAMILY } from "../../constants";
import { useExcalidrawContainer } from "../App";
import { PropertiesPopover } from "../PropertiesPopover";
import { QuickSearch } from "../QuickSearch";
import { ScrollableList } from "../ScrollableList";
import DropdownMenuItem, {
  DropDownMenuItemBadgeType,
  DropDownMenuItemBadge,
} from "../dropdownMenu/DropdownMenuItem";
import { type FontFamilyValues } from "../../element/types";
import { type Node, arrayToList } from "../../utils";
import {
  FreedrawIcon,
  FontFamilyNormalIcon,
  FontFamilyCodeIcon,
} from "../icons";
import { t } from "../../i18n";
import { fontPickerKeyHandler } from "./keyboardNavHandlers";

export interface FontDescriptor {
  value?: number;
  icon?: JSX.Element;
  text?: string;
  badge?: {
    type: string;
    placeholder: string;
  };
}

// FIXME_FONTS: this cannot be static as the prev / next references change on each input
export const ALL_FONTS: Map<number, Node<FontDescriptor>> = arrayToList([
  {
    value: FONT_FAMILY.Virgil,
    icon: FreedrawIcon,
    text: "Virgil 1",
    badge: {
      type: DropDownMenuItemBadgeType.RED,
      placeholder: t("fontList.badge.old"),
    },
  },
  {
    value: FONT_FAMILY.Virgil2,
    icon: FreedrawIcon,
    text: "Virgil 2",
    badge: {
      type: DropDownMenuItemBadgeType.GREEN,
      placeholder: t("fontList.badge.new"),
    },
  },
  {
    value: FONT_FAMILY.Helvetica,
    icon: FontFamilyNormalIcon,
    text: "Helvetica",
  },
  {
    value: FONT_FAMILY.Cascadia,
    icon: FontFamilyCodeIcon,
    text: "Cascadia",
  },
]).reduce((acc, curr) => {
  acc.set(curr.value, curr);
  return acc;
}, new Map());

export const getFontByValue = (fontFamilyValue: number) => {
  return ALL_FONTS.get(fontFamilyValue);
};

export const getUnfocusedFont = (filteredFonts: FontDescriptor[]) =>
  ({
    value: -1,
    prev: filteredFonts[filteredFonts.length - 1],
    next: filteredFonts[0],
  } as Node<FontDescriptor>);

interface FontPickerListProps {
  selectedFontFamily: FontFamilyValues;
  onPick: (value: number) => void;
  onClose: () => void;
}

export const FontPickerList = React.memo(
  ({ selectedFontFamily, onPick, onClose }: FontPickerListProps) => {
    const { container } = useExcalidrawContainer();
    const allFonts = useMemo(() => [...ALL_FONTS.values()], []);
    const [searchTerm, setSearchTerm] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredFonts = useMemo(
      () =>
        allFonts.filter((font) =>
          font.text?.toLowerCase().includes(searchTerm),
        ),
      [allFonts, searchTerm],
    );

    const [focusedFont, setFocusedFont] = useState(
      getUnfocusedFont(filteredFonts),
    );

    useEffect(
      () => setFocusedFont(getUnfocusedFont(filteredFonts)),
      [filteredFonts],
    );

    const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
      (event) => {
        const handled = fontPickerKeyHandler({
          event,
          inputRef,
          focusedFont,
          filteredFonts,
          setFocusedFont,
          onClose,
          onPick,
        });

        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      [focusedFont, filteredFonts, onClose, onPick],
    );

    return (
      <PropertiesPopover
        className="properties-content"
        container={container}
        style={{ width: "15rem" }}
        onClose={onClose}
        onKeyDown={handleKeyDown}
      >
        <QuickSearch
          ref={inputRef}
          placeholder={t("quickSearch.placeholder")}
          onChange={setSearchTerm}
        />
        <ScrollableList
          className="FontPicker__list dropdown-menu"
          placeholder={t("fontList.empty")}
        >
          {filteredFonts.map((font, index) => (
            <DropdownMenuItem
              key={index}
              icon={font.icon}
              value={font.value}
              selected={font.value === selectedFontFamily}
              focus={font.value === focusedFont?.value}
              onClick={(e) => onPick(Number(e.currentTarget.value))}
              // onFocus is interrupted by something & we read the currentTarget anyway, so we could detect already in a capture phase
              onFocusCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFocusedFont(font);
              }}
            >
              {font.text}
              {font.badge && (
                <DropDownMenuItemBadge type={font.badge.type}>
                  {font.badge.placeholder}
                </DropDownMenuItemBadge>
              )}
            </DropdownMenuItem>
          ))}
        </ScrollableList>
      </PropertiesPopover>
    );
  },
  (prev, next) => prev.selectedFontFamily === next.selectedFontFamily,
);
