import { DateTime } from "luxon";

export function datetime() {
  return DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
}
