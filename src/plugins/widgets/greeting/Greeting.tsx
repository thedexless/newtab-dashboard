import React, { FC, useMemo } from "react";
import { useIntl } from "react-intl";

import { useTime } from "../../../hooks";
import { messages } from "./messages";
import { Props, defaultData } from "./types";

const Greeting: FC<Props> = ({ data = defaultData }) => {
  const hour = useTime().getHours();
  const intl = useIntl();

  const greeting = useMemo(
    () =>
      data.name
        ? intl.formatMessage(messages.greetingWithName, {
            hour,
            name: data.name,
          })
        : intl.formatMessage(messages.greeting, { hour }),
    [data.name, hour, intl],
  );

  return (
    <div className="Greeting">
      <h2>{greeting}</h2>
    </div>
  );
};

export default Greeting;
