// Serializes structured data for an inline <script>. JSON.stringify leaves "<"
// intact, so database text containing "</script>" would otherwise end the tag.
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
