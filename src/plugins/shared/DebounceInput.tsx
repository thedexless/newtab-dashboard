import React, { FC, useState, useEffect } from "react";
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

  // Sync internal state when the parent value changes externally,
  // so the input reflects the latest prop without invoking onChange.
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // Fire onChange only for debounced local edits, not external syncs.
  useEffect(() => {
    if (debouncedValue === value) return;
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <input
      {...props}
      value={newValue}
      onChange={(event) => setNewValue(event.target.value)}
    />
  );
};
