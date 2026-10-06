#!/usr/bin/env bash
# check.sh — runs every static check in tools/ and prints a one-line
# PASS/FAIL summary per script. Exits non-zero if any check fails.

set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

overall=0

run_check() {
  local name="$1"
  local script="$2"
  if node "$script" > /tmp/check-output.$$ 2>&1; then
    echo "PASS  $name"
  else
    echo "FAIL  $name"
    overall=1
  fi
  sed 's/^/      /' /tmp/check-output.$$
  rm -f /tmp/check-output.$$
  echo
}

run_check "compliance-audit.js" "$DIR/compliance-audit.js"
run_check "pack-sync.js"        "$DIR/pack-sync.js"
run_check "i18n-audit.js"       "$DIR/i18n-audit.js"
run_check "route-test.js"       "$DIR/route-test.js"

echo "----------------------------------------------------------------------"
if [ "$overall" -eq 0 ]; then
  echo "check.sh: ALL CHECKS PASSED"
else
  echo "check.sh: ONE OR MORE CHECKS FAILED"
fi
echo "Reminder (CLAUDE.md): static checks do not replace opening the page —"
echo "click through every screen after any change."

exit "$overall"
