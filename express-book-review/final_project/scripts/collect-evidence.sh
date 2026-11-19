#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p evidence
BASE="${BOOK_API_URL:-http://localhost:5000}"
COOKIE="$(mktemp)"
trap 'rm -f "$COOKIE"' EXIT
USER_NAME="book_demo_$(date +%s)_$RANDOM"
PASSWORD="demopass1234"

capture() {
  local file="$1"; shift
  printf '$ ' > "evidence/$file"
  printf '%q ' "$@" >> "evidence/$file"
  printf '\n' >> "evidence/$file"
  "$@" >> "evidence/$file"
  printf '\n' >> "evidence/$file"
}

capture getallbooks curl -sS "$BASE/"
capture getbooksbyISBN curl -sS "$BASE/isbn/1"
capture getbooksbyauthor curl -sS "$BASE/author/Jane%20Austen"
capture getbooksbytitle curl -sS "$BASE/title/Pride%20and%20Prejudice"
capture getbookreview curl -sS "$BASE/review/1"
capture register curl -sS -X POST -H 'Content-Type: application/json' -d "{\"username\":\"$USER_NAME\",\"password\":\"$PASSWORD\"}" "$BASE/register"
capture login curl -sS -c "$COOKIE" -X POST -H 'Content-Type: application/json' -d "{\"username\":\"$USER_NAME\",\"password\":\"$PASSWORD\"}" "$BASE/customer/login"
capture reviewadded curl -sS -b "$COOKIE" -X PUT --get --data-urlencode 'review=Great book! Enjoyed reading it.' "$BASE/customer/auth/review/1"
capture deletereview curl -sS -b "$COOKIE" -X DELETE "$BASE/customer/auth/review/1"
node scripts/async-client.js > evidence/async-axios-output.txt
printf '\nWrote the nine cURL output files and Axios output to %s/evidence\n' "$PWD"
