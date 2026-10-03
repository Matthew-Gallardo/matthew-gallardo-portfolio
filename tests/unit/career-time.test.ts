import { test } from "node:test";
import assert from "node:assert/strict";
import { careerDuration } from "../../src/lib/career-time.ts";

const start = Date.parse("2024-09-02T00:00:00+08:00");
test("career anniversaries and seconds use the Manila calendar", () => {
  assert.deepEqual(
    careerDuration(start, Date.parse("2026-10-03T12:34:56+08:00")),
    { years: 2, months: 1, days: 1, hours: 12, minutes: 34, seconds: 56 },
  );
  assert.deepEqual(
    careerDuration(start, Date.parse("2025-09-01T23:59:59+08:00")),
    { years: 0, months: 11, days: 30, hours: 23, minutes: 59, seconds: 59 },
  );
  assert.equal(
    careerDuration(start, Date.parse("2025-09-02T00:00:00+08:00")).years,
    1,
  );
});
test("dates before the career start clamp at zero", () => {
  assert.deepEqual(careerDuration(start, start - 86400000), {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});
test("month end and leap-year boundaries do not overflow", () => {
  const january = Date.parse("2024-01-31T00:00:00+08:00");
  assert.deepEqual(
    careerDuration(january, Date.parse("2024-02-29T00:00:00+08:00")),
    { years: 0, months: 1, days: 0, hours: 0, minutes: 0, seconds: 0 },
  );
  assert.equal(
    careerDuration(january, Date.parse("2024-03-30T00:00:00+08:00")).months,
    1,
  );
});
