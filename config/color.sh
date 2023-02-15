#!/usr/bin/env bash

set -Eeuo pipefail

declare -A rgb

rgb[ok]='0;255;0'      # somethind good
rgb[ko]='255;0;0'      # something not good
rgb[dim]='100;100;100' # something not so important
rgb[imp]='255;0;255'   # something important
rgb[emp]='255;255;0'   # something very important
rgb[path]='0;200;255'  # something in the filesystem
rgb[num]='255;140;0'   # something numeric

function color {
  echo -en "\e[38;2;${rgb[$1]}m$2\e[0m"
}

export FORCE_COLOR=1