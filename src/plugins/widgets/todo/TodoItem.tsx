import React, { FC, useLayoutEffect, useRef } from "react";

import { useKeyPress } from "../../../hooks";
import { Icon, RemoveIcon } from "../../../views/shared";
import { State } from "./reducer";
import "./TodoItem.sass";

interface Props {
  item: State[number];
  onToggle(): void;
  onUpdate(contents: string): void;
  onDelete(): void;
}

const TodoItem: FC<Props> = ({ item, onDelete, onUpdate, onToggle }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.innerText = item.contents;

      if (item.contents === "") {
        ref.current.focus();
      }
    }
  }, [item.contents]);

  const handleKeyPress = (event: KeyboardEvent, action: () => void) => {
    if (event.target !== ref.current) return;
    event.preventDefault();
    if (ref.current) action();
  };

  useKeyPress(
    (event) => handleKeyPress(event, () => ref.current?.blur()),
    ["Enter"],
    false,
  );

  useKeyPress(
    (event) =>
      handleKeyPress(event, () => {
        if (ref.current) {
          ref.current.innerText = item.contents;
          ref.current.blur();
        }
      }),
    ["Escape"],
    false,
  );

  return (
    <div className="TodoItem">
      <span
        ref={ref}
        contentEditable={true}
        onBlur={(event) => onUpdate(event.currentTarget.innerText)}
      />

      <a onMouseDown={onToggle} className="complete">
        <Icon name={item.completed ? "check-circle" : "circle"} />
      </a>
      <a onMouseDown={onDelete} className="delete">
        <RemoveIcon />
      </a>
    </div>
  );
};

export default TodoItem;
