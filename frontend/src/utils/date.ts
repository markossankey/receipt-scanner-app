import dayjs from "dayjs";

export function formatDate(isoString?: string | null) {
  if (!isoString) return "";
  return dayjs(isoString).format("dddd | M/D/YY");
}
