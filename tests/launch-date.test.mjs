import assert from "node:assert/strict";
import { test } from "node:test";
import { isLaunchDate, formatLaunchDate, sortProjectsByLaunchDate } from "../lib/launch-date.ts";

test("launch dates require real date-only calendar values", () => {
  for (const date of ["2024-02-29", "2026-09-30", "2027-01-01"]) {
    assert.equal(isLaunchDate(date), true);
  }
  for (const date of ["2026-02-29", "2026-04-31", "2026-13-01", "2026-00-10", "0000-01-01", "2026-9-30", "2026-09-30T00:00:00Z", "garbage", ""]) {
    assert.equal(isLaunchDate(date), false, date);
  }
});

test("launched projects come first, newest first, including month-only dates", () => {
  const projects = [
    { id: 1 },
    { id: 2, launchDate: "2025-12-01" },
    { id: 13, launchDate: "2026-09" },
    { id: 4, launchDate: "2026-09-20" },
    { id: 5, launchDate: "2026-08" },
  ];
  const now = new Date("2026-09-30T12:00:00Z");
  assert.deepEqual(sortProjectsByLaunchDate(projects, now).map(p => p.id), [4, 13, 5, 2, 1]);
  assert.deepEqual(projects.map(p => p.id), [1, 2, 13, 4, 5]);
});

test("future launches stay below launched projects, before missing or invalid dates", () => {
  const projects = [
    { id: 1, launchDate: "2026-10" },
    { id: 2, launchDate: "2026-10-15" },
    { id: 3, launchDate: "2026-09-30" },
    { id: 4, launchDate: "2026-02-30" },
    { id: 5, launchDate: "" },
    { id: 6 },
  ];
  assert.deepEqual(sortProjectsByLaunchDate(projects, new Date("2026-09-30T23:59:59Z")).map(p => p.id), [3, 1, 2, 4, 5, 6]);
});

test("equal and absent launch dates use stable build-ID order", () => {
  const projects = [{ id: 3 }, { id: 2, launchDate: "2026-09" }, { id: 1, launchDate: "2026-09" }, { id: 4 }];
  assert.deepEqual(sortProjectsByLaunchDate(projects, new Date("2026-09-30T00:00:00Z")).map(p => p.id), [1, 2, 3, 4]);
  assert.deepEqual(sortProjectsByLaunchDate([], new Date("2026-09-30")), []);
});

test("unknown dates use localized TBA without inferring a launch", () => {
  assert.equal(formatLaunchDate(), "TBA");
  assert.equal(formatLaunchDate(""), "TBA");
  assert.equal(formatLaunchDate("2026-02-29", "ar"), "يُحدد لاحقاً");
});

test("month-only launches preserve their precision", () => {
  assert.equal(isLaunchDate("2026-09"), true);
  for (const value of ["2026-00", "2026-13", "0000-09", "2026-9"]) {
    assert.equal(isLaunchDate(value), false);
  }
  assert.equal(formatLaunchDate("2026-09"), "September 2026");
  assert.equal(formatLaunchDate("2026-09", "ar"), "سبتمبر 2026");
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
