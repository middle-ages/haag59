#!/usr/bin/env bash

set -Eeuo pipefail

. config/color.sh

export msg indent

declare -A msg
declare -A indent

msg[done]=$(color ok '✅ Done')
msg[noarg]=$(color ko '❌ ❓ Missing argument'):
msg[nodir]=$(color ko '❌ 📂 Missing directory'):
msg[unexpectedfile]=$(color ko '❌ 📑 Found file instead of directory'):
msg[unexpecteddir]=$(color ko '❌ 📂 Found directory instead of file'):

function indent_n {
  # shellcheck disable=SC2051,SC2086
  eval "$(echo printf '" %0.s"' {1..$1})"
}

indent[inner]=$(indent_n 2)
indent[note]=${indent[inner]}$(indent_n 5)

function ok {
  echo -en "$(color ok "$1")"
}

function ko {
  echo -en "$(color ko "$1")"
}

function quote {
  echo -en "$(color dim "‘")$1$(color dim "’")"
}

function idx {
  echo -en "$(color dim "$(printf "%3s" "$1").") "
}

function imp {
  echo -en "$(quote "$(color imp "$1")")"
}

function emp {
  echo -en "$(color emp "$1")"
}

function num {
  echo -en "$(color num "$1")"
}

function path {
  echo -en "$(quote "$(color path "$1")")"
}

function msg {
  echo -e "${indent[inner]}$1"
}

function note {
  echo -e "${indent[note]}$1"
}

function stdout {
  sed -urz 's/\n+/\n/g;s/^\n+//' | sed -u 's/^.*$/\t&/'
}

function bye {
  echo -e "${msg[done]} $1."
}

function demo_msg {
  echo 'Colors:'
  echo -en "$(color ok 'ok') "
  echo -en "$(color ko 'ok') "
  echo -en "$(color dim 'dim') "
  echo -en "$(color imp 'imp') "
  echo -en "$(color emp 'emp') "
  echo -e "$(color path 'path')"
  
  echo 'Messages:'
  echo -e "$(idx "1")$(ok ok)"
  echo -e "$(idx "2")$(ko ko)"
  echo -e "$(idx "3")$(quote quote)"
  echo -e "$(idx "4")$(imp imp)"
  echo -e "$(idx "5")$(emp emp)"
  echo -e "$(idx "6")$(path path)"
  echo -e "$(idx "7")${msg[done]} done"
  echo -e "$(idx "8")${msg[noarg]} noarg"
  echo -e "$(idx "9")${msg[nodir]} nodir"
  
  echo 'Indentations:'
  echo -e "${indent[inner]}inner indent"
  echo -e "${indent[note]}note indent"
  echo -e "$(date | stdout)"
}

#demo_msg
