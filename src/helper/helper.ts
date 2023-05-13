import { DateTime } from "luxon";

export function datetime() {
  return DateTime.now().setZone("Asia/Tbilisi").toFormat("yyyy-MM-dd HH:mm:ss");
}
