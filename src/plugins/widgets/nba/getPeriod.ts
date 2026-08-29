import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { Game } from "./types";

export function getPeriod(game: Game, timeZone: string | null) {
  const { period } = game;
  const periodDate = timeZone
    ? utcToZonedTime(new Date(game.startTimeUTC), timeZone)
    : new Date(game.startTimeUTC);

  if (!game.isGameActivated && period.current === 0) {
    return format(periodDate, "hh:mm a");
  }

  if (period.isHalftime) return "Halftime";
  if (period.current === period.maxRegular && !game.clock) return "Final";
  if (period.isEndOfPeriod) return `End of ${period.current}Q`;
  if (period.current <= 4) return `${period.current}Q ${game.clock} `;
  return `OT ${game.clock}`;
}
