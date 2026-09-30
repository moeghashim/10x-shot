import assert from "node:assert/strict";
import { test } from "node:test";
import { isLaunchDate, formatLaunchDate } from "../lib/launch-date.ts";

test("launch dates require real date-only calendar values", () => {
  for (const date of ["2024-02-29", "2026-09-30", "2027-01-01"]) {
    assert.equal(isLaunchDate(date), true);
  }
  for (const date of ["2026-02-29", "2026-04-31", "2026-13-01", "2026-00-10", "0000-01-01", "2026-9-30", "2026-09-30T00:00:00Z", "garbage", ""]) {
    assert.equal(isLaunchDate(date), false, date);
  }
});

test("unknown dates use localized TBA without inferring a launch", () => {
  assert.equal(formatLaunchDate(), "TBA");
  assert.equal(formatLaunchDate(""), "TBA");
  assert.equal(formatLaunchDate("2026-02-29", "ar"), "يُحدد لاحقاً");
});

test("launch dates retain the calendar day in every viewer timezone", () => {
  const previous = process.env.TZ;
  try {
    for (const zone of ["Pacific/Honolulu", "Pacific/Kiritimati", "Europe/London"]) {
      process.env.TZ = zone;
      assert.equal(formatLaunchDate("2026-01-01"), "1 Jan 2026");
      assert.equal(formatLaunchDate("2026-01-01", "ar"), "1 يناير 2026");
    }
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});
