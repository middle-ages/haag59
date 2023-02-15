#!/usr/bin/env bash

set -Eeuo pipefail

. scripts/msg.sh

function error {
  echo
  msg "$(ko "$1")"
  if [[ "${2:- }" != " " ]]
  then
    msg "$2"
  fi
  echo
  exit 1
}

function run_with {
  local idx=$1
  local runner=$2
  local task=$3
  shift 3
  msg "$(idx "$idx")$(emp "$task $*")"
  $runner "$task" "$@" | stdout
}

function copy {
  msg "$(idx "$1")Copying $(path "$2")"
  note "$(indent_n 5) ⇒ $(path "$3")"
  cp "$2" "$3"
}

function copy_uncommented {
  msg "$(idx "$1")Copying uncommented $(path "$2")"
  note "$(indent_n 5) ⇒ $(path "$3")"
  # remove surrounding comments added to file so it need not be ignored
  tail +2 "$2" | head -n -1 > "$3"
}

function replace_in_file {
  local idx=$1
  local file=$2
  local find=$3
  local replace=$4
  local name
  name=$(path "$(basename "$file")")
  msg "$(idx "$idx")Replacing $(emp "$find") ⇒ $(emp "$replace") in $name..."
  sed -i "$file" -e "s/$find/$replace/g"
}

function check_dir {
  if [[ ! -d "$1" ]]
  then
    error "${msg[nodir]} failed opening $(emp "$2") at $(path "$1")"
  fi
}

function check_arg {
  if [[ "$2" = " " ]]
  then
    error "${msg[noarg]} got no $(emp "$1")"
  fi
}

function ensure_file {
  if [[ ! -f "$1" ]]
  then
    touch "$1"
  fi
}

function fix_trailing_comma_for {
  sed -i "$2" -rze "s/,\n( *)$1/\n\1$1/g"
}

function fix_trailing_comma {
  fix_trailing_comma_for '}' "$1"
  fix_trailing_comma_for ']' "$1"
}

# Return 1st line where 1st character is a capital letter
# This should be line where a README.md file has its description
function first_cap_line {
  local file=$1
  grep '^[A-Z]' "$file" | head -1
}

function comma_join {
  local IFS=','
  echo "$*"
}