import React from "react";
import { db } from "../../../db/state";
import { useValue } from "../../../lib/db/react";

type Props = {
  hour12: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  showDayPeriod?: boolean;
  time: Date;
};

/**
 * A react wrapper around `Intl.DateTimeFromat().format()`
 *
 * Todo: Remove this component when react-intl adds the hourCycle option to their component
 *
 *
 * Intl Issue information: https://github.com/formatjs/react-intl/issues/1577
 * Code based on: https://github.com/mattermost/mattermost-webapp/pull/5138
 * Tabliss issue: https://github.com/joelshepherd/tabliss/issues/231
 */
const IntlTime: React.FC<Props> = ({
  hour12,
  showMinutes,
  showSeconds,
  showDayPeriod = true,
  time,
}) => {
  const locale = useValue(db, "locale");

  const formater = React.useMemo(
    () =>
      Intl.DateTimeFormat(locale, {
        hour: "numeric",
        hourCycle: hour12 ? "h12" : "h23",
        minute: showMinutes ? "numeric" : undefined,
        second: showSeconds ? "numeric" : undefined,
      }),
    [locale, hour12, showMinutes, showSeconds],
  );

  if (showDayPeriod) {
    return <>{formater.format(time)}</>;
  }

  // Remove dayPeriod from the formatted parts
  return (
    <>
      {formater
        .formatToParts(time)
        .filter((part) => part.type !== "dayPeriod")
        .map((part) => part.value)
        .join("")}
    </>
  );
};

export default IntlTime;
