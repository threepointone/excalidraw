import React, {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Popover from "@radix-ui/react-popover";

import DropdownMenuItem, {
  DropDownMenuItemBadge,
} from "../dropdownMenu/DropdownMenuItem";
import { ButtonIconSelect } from "../ButtonIconSelect";
import {
  FontFamilyCodeIcon,
  FontFamilyNormalIcon,
  FreedrawIcon,
} from "../icons";
import { ButtonIcon } from "../ButtonIcon";
import { ButtonSeparator } from "../ButtonSeparator";
import { QuickSearch } from "../QuickSearch";
import { ScrollableList } from "../ScrollableList";
import { PropertiesPopover } from "../PropertiesPopover";
import { FontFamilyValues } from "../../element/types";
import { FONT_FAMILY } from "../../constants";
import { t } from "../../i18n";
import { useFilter } from "../../hooks/useFilter";
import { useExcalidrawContainer } from "../App";

import "./FontPicker.scss";
import { KEYS } from "../../keys";
import { Node, arrayToList } from "../../utils";

interface FontPickerProps {
  isOpened: boolean;
  selectedFontFamily: FontFamilyValues;
  onChange: (fontFamily: FontFamilyValues) => void;
  onPopupChange: (isOpened: boolean) => void;
}

interface FontDescriptor {
  value: number;
  text?: string;
  icon?: JSX.Element;
  testId?: string | undefined;
  active?: boolean | undefined;
  badge?: string;
}

const BADGE = {
  NEW: "new",
  OLD: "old",
};

// FIXME_FONTS: add Map by ID, so we could also find the fonts easily
const DEFAULT_FONTS = [
  {
    value: FONT_FAMILY.Virgil2,
    text: "Virgil 2",
    icon: FreedrawIcon,
    testId: "font-family-virgil-new",
    badge: BADGE.NEW,
  },
  {
    value: FONT_FAMILY.Helvetica,
    text: t("labels.normal"),
    icon: FontFamilyNormalIcon,
    testId: "font-family-normal",
  },
  {
    value: FONT_FAMILY.Cascadia,
    text: t("labels.code"),
    icon: FontFamilyCodeIcon,
    testId: "font-family-code",
  },
];

const getAllFonts = () =>
  arrayToList([
    {
      value: FONT_FAMILY.Virgil,
      text: "Virgil 1",
      icon: FreedrawIcon,
      testId: "font-family-virgil",
      badge: BADGE.OLD,
    },
    ...DEFAULT_FONTS,
  ]);

const getFontById = (fontFamily: number) => {
  return getAllFonts().find(({ value }) => value === fontFamily);
};

const isCustomFontFamily = (fontFamily: number) => {
  return !DEFAULT_FONTS.find((x) => x.value === fontFamily);
};

interface FontPickerTriggerProps {
  selectedFontFamily: FontFamilyValues;
}

const FontPickerTrigger = ({ selectedFontFamily }: FontPickerTriggerProps) => {
  const [selectedFont, setSelectedFont] = useState(
    getFontById(FONT_FAMILY.Virgil),
  );

  useEffect(() => {
    if (selectedFont?.value !== selectedFontFamily) {
      setSelectedFont(getFontById(selectedFontFamily));
    }
  }, [selectedFont?.value, selectedFontFamily]);

  return (
    <Popover.Trigger asChild>
      {/* Empty div as trigger so it's stretched 100% due to different button sizes */}
      <div>
        <ButtonIcon
          standalone
          icon={selectedFont?.icon || FontFamilyNormalIcon}
          title={t("labels.showFonts")}
          className="properties-trigger"
          testId={"font-family-show-fonts"}
          active={isCustomFontFamily(selectedFontFamily)}
          // no-op
          onClick={() => {}}
        />
      </div>
    </Popover.Trigger>
  );
};

const getUnfocusedFont = (filteredFonts: FontDescriptor[]) =>
  ({
    value: -1,
    prev: filteredFonts[filteredFonts.length - 1],
    next: filteredFonts[0],
  } as Node<FontDescriptor>);

interface FontPickerKeyNavHandlerProps {
  event: React.KeyboardEvent<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  focusedFont: Node<FontDescriptor>;
  filteredFonts: Node<FontDescriptor>[];
  setFocusedFont: React.Dispatch<React.SetStateAction<Node<FontDescriptor>>>;
  onClose: () => void;
  onPick: (value: number) => void;
}

const fontPickerKeyHandler = ({
  event,
  inputRef,
  focusedFont,
  filteredFonts,
  setFocusedFont,
  onClose,
  onPick,
}: FontPickerKeyNavHandlerProps) => {
  // FIXME_FONTS: try to get rid of the return true everywhere, looks stupid
  if (
    !event[KEYS.CTRL_OR_CMD] &&
    event.shiftKey &&
    event.key.toLowerCase() === KEYS.F
  ) {
    // refocus input on the popup trigger shortcut
    inputRef.current?.focus();
    // reset the focused font, similar to what browser does by default
    setFocusedFont(getUnfocusedFont(filteredFonts));
    return true;
  }

  if (event.key === KEYS.ESCAPE) {
    onClose();
    return true;
  }

  if (event.key === KEYS.ENTER) {
    // FIXME_FONTS: better to check if the font exists
    if (focusedFont.value > 0) {
      onPick(Number(focusedFont.value));
    }

    return true;
  }

  if (event.key === KEYS.ARROW_DOWN) {
    if (focusedFont?.next) {
      setFocusedFont(focusedFont.next);
    }
    return true;
  }

  if (event.key === KEYS.ARROW_UP) {
    if (focusedFont?.prev) {
      setFocusedFont(focusedFont.prev);
    }
    return true;
  }
};

interface FontPickerContentProps {
  selectedFontFamily: FontFamilyValues;
  onPick: (value: number) => void;
  onClose: () => void;
}

const FontPickerContent = React.memo(
  ({ selectedFontFamily, onPick, onClose }: FontPickerContentProps) => {
    const { container } = useExcalidrawContainer();
    const inputRef = useRef<HTMLInputElement>(null);

    const [filteredFonts, filterByCallback] = useFilter(getAllFonts(), "text");
    const [focusedFont, setFocusedFont] = useState(
      getUnfocusedFont(filteredFonts),
    );

    useEffect(() => {
      // blindly always reset the focus on filter (causes additional re-render, which is acceptable)
      setFocusedFont(getUnfocusedFont(filteredFonts));
    }, [filteredFonts]);

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
          onChange={filterByCallback}
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
              <span>{font.text}</span>
              {font.badge && (
                // FIXME_FONTS: get rid of the pink badge
                <DropDownMenuItemBadge
                  type={font.badge === BADGE.OLD ? "pink" : "green"}
                >
                  {font.badge}
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

export const FontPicker = React.memo(
  ({
    isOpened,
    selectedFontFamily,
    onChange,
    onPopupChange,
  }: FontPickerProps) => {
    const getDefaultFonts = useCallback(() => DEFAULT_FONTS, []);
    const onClosePopup = useCallback(
      () => onPopupChange(false),
      [onPopupChange],
    );
    const onClick = useCallback(
      (value: number | false) => {
        if (value) {
          onChange(value);
        }
      },
      [onChange],
    );

    return (
      <div role="dialog" aria-modal="true" className="FontPicker__container">
        <ButtonIconSelect<FontFamilyValues | false>
          type="button"
          options={getDefaultFonts()}
          value={selectedFontFamily}
          onClick={onClick}
        />
        <ButtonSeparator />
        <Popover.Root open={isOpened} onOpenChange={onPopupChange}>
          <FontPickerTrigger selectedFontFamily={selectedFontFamily} />
          {isOpened && (
            <FontPickerContent
              selectedFontFamily={selectedFontFamily}
              onPick={onClick}
              onClose={onClosePopup}
            />
          )}
        </Popover.Root>
      </div>
    );
  },
  (prev, next) =>
    prev.isOpened === next.isOpened &&
    prev.selectedFontFamily === next.selectedFontFamily,
);
