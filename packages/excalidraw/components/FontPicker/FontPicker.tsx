import React, { useCallback, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";

import { FontPickerContent } from "./FontPickerContent";
import { FontPickerTrigger } from "./FontPickerTrigger";
import { ButtonIconSelect } from "../ButtonIconSelect";
import {
  FontFamilyCodeIcon,
  FontFamilyNormalIcon,
  FreedrawIcon,
} from "../icons";
import { ButtonSeparator } from "../ButtonSeparator";
import type { FontFamilyValues } from "../../element/types";
import { FONT_FAMILY } from "../../constants";
import { t } from "../../i18n";

import "./FontPicker.scss";

export const DEFAULT_FONTS = [
  {
    value: FONT_FAMILY.Virgil2,
    icon: FreedrawIcon,
    text: t("labels.handDrawn"),
    testId: "font-family-virgil-new",
  },
  {
    value: FONT_FAMILY.Helvetica,
    icon: FontFamilyNormalIcon,
    text: t("labels.normal"),
    testId: "font-family-normal",
  },
  {
    value: FONT_FAMILY.Cascadia,
    icon: FontFamilyCodeIcon,
    text: t("labels.code"),
    testId: "font-family-code",
  },
];

export const isCustomFont = (fontFamily: number) => {
  return !DEFAULT_FONTS.find((x) => x.value === fontFamily);
};

interface FontPickerProps {
  isOpened: boolean;
  selectedFontFamily: FontFamilyValues;
  onChange: (fontFamily: FontFamilyValues) => void;
  onPopupChange: (isOpened: boolean) => void;
}

export const FontPicker = React.memo(
  ({
    isOpened,
    selectedFontFamily,
    onChange,
    onPopupChange,
  }: FontPickerProps) => {
    const defaultFonts = useMemo(() => DEFAULT_FONTS, []);

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
          options={defaultFonts}
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
