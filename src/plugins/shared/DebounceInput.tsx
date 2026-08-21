import React, { FC, useState, useEffect, useRef } from "react";
import { useDebounce } from "../../hooks";

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange: (value: string) => void;
  value?: string;
  wait?: number;
}

export const DebounceInput: FC<Props> = ({
  wait = 1000,
  onChange,
  value = "",
  ...props
}) => {
  const [newValue, setNewValue] = useState(value);
  const debouncedValue = useDebounce(newValue, wait);

  // Track whether the latest debouncedValue originated from a local edit.
  // Cleared during external synchronization so onChange is not invoked
  // for value changes that came from the parent prop.
  const fromLocalEdit = useRef(false);
  // Keep the latest onChange in a ref so callback identity changes do not
  // retrigger the propagation effect or send stale debounced data.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Sync internal state when the parent value changes externally,
  // so the input reflects the latest prop without invoking onChange.
  useEffect(() => {
    fromLocalEdit.current = false;
    setNewValue(value);
  }, [value]);

  // Fire onChange only for debounced local edits, not external syncs.
  useEffect(() => {
    if (!fromLocalEdit.current) return;
    onChangeRef.current(debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      {...props}
      value={newValue}
      onChange={(event) => {
        fromLocalEdit.current = true;
        setNewValue(event.target.value);
      }}
    />
  );
};
