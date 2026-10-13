import assert from "node:assert/strict"
import { test } from "node:test"
import { filterStackByProject, stackProjectOptions } from "../lib/stack-filter.ts"

const one = { id: 1, title: "Bannaa" }
const two = { id: 2, title: "10 Signals" }
const items = [
  { id: "stripe", name: "Stripe Projects", grade: "S", projects: [one, two], usageCount: 2 },
  { id: "codex", name: "Codex", projects: [one], usageCount: 1 },
]

test("project filter includes shared tools once and preserves their real ratings and usage", () => {
  assert.deepEqual(filterStackByProject(items, "2"), [items[0]])
  assert.deepEqual(filterStackByProject(items, "1"), items)
  assert.equal(filterStackByProject(items, ""), items)
  assert.deepEqual(filterStackByProject(items, "999"), [])
})

test("project choices are deduplicated by ID and sorted by title", () => {
  assert.deepEqual(stackProjectOptions(items), [two, one])
  assert.deepEqual(stackProjectOptions([]), [])
})
