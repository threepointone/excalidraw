import type { Node } from "../../utils";
import { KEYS } from "../../keys";
import {
  type FontDescriptor,
  getUnfocusedFont,
  getFontByValue,
} from "./FontPickerContent";

interface FontPickerKeyNavHandlerProps {
  event: React.KeyboardEvent<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  focusedFont: Node<FontDescriptor>;
  filteredFonts: Node<FontDescriptor>[];
  setFocusedFont: React.Dispatch<React.SetStateAction<Node<FontDescriptor>>>;
  onClose: () => void;
  onPick: (value: number) => void;
}

export const fontPickerKeyHandler = ({
  event,
  inputRef,
  focusedFont,
  filteredFonts,
  setFocusedFont,
  onClose,
  onPick,
}: FontPickerKeyNavHandlerProps) => {
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
    if (focusedFont?.value && getFontByValue(focusedFont.value)) {
      onPick(focusedFont.value);
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
