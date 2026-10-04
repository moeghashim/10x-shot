import assert from "node:assert/strict";
import { test } from "node:test";
import { serializeJsonLd } from "../lib/json-ld.ts";

test("project text cannot close the JSON-LD script tag", () => {
  const data = { name: "Demo", description: "</script><script>alert(1)</script><!--" };
  const html = serializeJsonLd(data);
  assert.equal(html.includes("<"), false);
  assert.deepEqual(JSON.parse(html), data);
});
