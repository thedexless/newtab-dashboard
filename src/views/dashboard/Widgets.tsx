import React from "react";
import { selectWidgets } from "../../db/select";
import { db, WidgetPosition, WidgetState } from "../../db/state";
import { useSelector, useValue } from "../../lib/db/react";
import Slot from "./Slot";
import "./Widgets.sass";

const Widgets: React.FC = () => {
  const focus = useValue(db, "focus");
  const widgets = useSelector(db, selectWidgets);

  const slots = groupByPosition(widgets);

  return (
    <div className="Widgets fullscreen">
      <div className="container">
        {!focus &&
          Object.entries(slots).map(([position, widgets]) => (
            <Slot
              key={position}
              position={position as WidgetPosition}
              widgets={widgets}
            />
          ))}
      </div>
    </div>
  );
};

/** Group widgets by their display position. */
function groupByPosition(
  widgets: WidgetState[],
): Partial<Record<WidgetPosition, WidgetState[]>> {
  const grouped: Partial<Record<WidgetPosition, WidgetState[]>> = {};
  for (const widget of widgets) {
    const { position } = widget.display;
    (grouped[position] ??= []).push(widget);
  }
  return grouped;
}

export default Widgets;
