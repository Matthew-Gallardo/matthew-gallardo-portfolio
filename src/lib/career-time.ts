const MANILA_OFFSET = 8 * 60 * 60 * 1000;

export function careerDuration(startTime: number, endTime: number) {
  const start = new Date(startTime + MANILA_OFFSET);
  const end = new Date(Math.max(startTime, endTime) + MANILA_OFFSET);
  let months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    end.getUTCMonth() -
    start.getUTCMonth();
  function anchor(count: number) {
    const lastDay = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + count + 1, 0),
    ).getUTCDate();
    return Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth() + count,
      Math.min(start.getUTCDate(), lastDay),
      start.getUTCHours(),
      start.getUTCMinutes(),
      start.getUTCSeconds(),
      start.getUTCMilliseconds(),
    );
  }
  if (anchor(months) > end.getTime()) months -= 1;
  const remainder = Math.floor((end.getTime() - anchor(months)) / 1000);
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: Math.floor(remainder / 86400),
    hours: Math.floor(remainder / 3600) % 24,
    minutes: Math.floor(remainder / 60) % 60,
    seconds: remainder % 60,
  };
}
