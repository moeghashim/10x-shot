#!/usr/bin/env bash
# Read-only verification harness for the 10x app. Only sends GET requests.
# Usage: verify.sh launch | doctor | drive | cleanup | all
set -u

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
PORT="${VERIFY_PORT:-3210}"
BASE="http://localhost:${PORT}"
STATE="${TMPDIR:-/tmp}/verify-10x"
EVIDENCE="${VERIFY_EVIDENCE:-$STATE/evidence}"
PIDFILE="$STATE/dev.pid"
LOG="$STATE/dev.log"
mkdir -p "$STATE" "$EVIDENCE"

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; fail=1; }

launch() {
  if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port $PORT is already in use. Refusing to double-drive it. Set VERIFY_PORT."; exit 1
  fi
  (cd "$ROOT" && exec pnpm exec next dev --port "$PORT") >"$LOG" 2>&1 &
  echo $! >"$PIDFILE"
  for _ in $(seq 1 60); do
    curl -s -o /dev/null "$BASE/robots.txt" && { echo "Ready on $BASE (pid $(cat "$PIDFILE"))"; return 0; }
    sleep 1
  done
  echo "Server did not become ready. See $LOG"; exit 1
}

doctor() {
  [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null || { echo "Not running: no live process from this harness."; exit 1; }
  owner="$(lsof -t -iTCP:"$PORT" -sTCP:LISTEN | head -1)"
  [ -n "$owner" ] || { echo "Nothing is listening on $PORT."; exit 1; }
  code="$(curl -s -o /dev/null -w '%{http_code}' "$BASE/robots.txt")"
  [ "$code" = 200 ] || { echo "robots.txt returned $code"; exit 1; }
  echo "OK: pid $(cat "$PIDFILE"), port $PORT, robots.txt 200"
}

# page <path> <evidence-name> <expected-substring>...
page() {
  path="$1"; name="$2"; shift 2
  out="$EVIDENCE/$name.html"
  code="$(curl -s -L -o "$out" -w '%{http_code}' "$BASE$path")"
  [ "$code" = 200 ] || { bad "GET $path returned $code"; return; }
  for want in "$@"; do
    grep -q -- "$want" "$out" || { bad "GET $path is missing: $want"; return; }
  done
  pass "GET $path ($(wc -c <"$out" | tr -d ' ') bytes)"
}

# status <path> <expected-code>
status() {
  code="$(curl -s -o /dev/null -w '%{http_code}' "$BASE$1")"
  [ "$code" = "$2" ] && pass "GET $1 returned $code" || bad "GET $1 returned $code, expected $2"
}

drive() {
  for locale in en ar; do
    [ "$locale" = ar ] && dir=rtl || dir=ltr
    for route in "" /stack /progress /future /track /magic-follow; do
      name="${locale}${route//\//-}"
      page "/$locale$route" "$name" "lang=\"$locale\"" "dir=\"$dir\""
    done
  done
  page /en home-jsonld 'application/ld+json'
  page /sitemap.xml sitemap '<urlset'
  page /robots.txt robots 'User-Agent'
  page /api/public/stats stats '"projectsLaunched"'
  # Admin APIs must reject a request that carries no session.
  # global-metrics is left out: its GET serves a public query.
  for api in projects project-metrics planning-cards stack users activity; do
    status "/api/admin/$api" 401
  done
  echo "Evidence: $EVIDENCE"
  return $fail
}

cleanup() {
  if [ -f "$PIDFILE" ]; then
    pid="$(cat "$PIDFILE")"
    pkill -P "$pid" 2>/dev/null
    kill "$pid" 2>/dev/null
    rm -f "$PIDFILE"
    echo "Stopped pid $pid. Evidence kept in $EVIDENCE"
  else
    echo "Nothing to stop."
  fi
}

case "${1:-all}" in
  launch) launch ;;
  doctor) doctor ;;
  drive) drive ;;
  cleanup) cleanup ;;
  all) launch && doctor && drive; rc=$?; cleanup; exit $rc ;;
  *) echo "Usage: $0 launch|doctor|drive|cleanup|all"; exit 2 ;;
esac
