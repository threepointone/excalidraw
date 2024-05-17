import * as Popover from "@radix-ui/react-popover";
import { useState, useMemo, useEffect } from "react";
import { ButtonIcon } from "../ButtonIcon";
import { FontFamilyNormalIcon } from "../icons";
import type { FontFamilyValues } from "../../element/types";
import { t } from "../../i18n";
import { isCustomFont } from "./FontPicker";
import { getFontByValue } from "./FontPickerContent";

interface FontPickerTriggerProps {
  selectedFontFamily: FontFamilyValues;
}

export const FontPickerTrigger = ({
  selectedFontFamily,
}: FontPickerTriggerProps) => {
  const [selectedFont, setSelectedFont] = useState(
    getFontByValue(selectedFontFamily),
  );

  const isTriggerActive = useMemo(
    () => isCustomFont(selectedFontFamily),
    [selectedFontFamily],
  );

  useEffect(() => {
    if (selectedFont?.value !== selectedFontFamily) {
      setSelectedFont(getFontByValue(selectedFontFamily));
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
          active={isTriggerActive}
          // no-op
          onClick={() => {}}
        />
      </div>
    </Popover.Trigger>
  );
};
