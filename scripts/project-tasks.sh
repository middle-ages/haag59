#!/usr/bin/env bash

set -Eeuo pipefail

. config/project-model.sh

function found_npm {
  local deps
  deps=$(num "$(npm_deps | wc -l )")
  note "Found $(emp 'NPM dependencies') ($(num "$(npm_deps | wc -l )"))"
}

function found_local {
  local deps
  deps=$(num "$(local_deps | wc -l )")
  note "Found $(emp 'workspace dependencies') ($deps)"
}

# add project depends.txt to project package.json
function add_dependencies {
  local idx=$1
  msg "$(idx "$idx")Adding $(path package.json) dependencies"
  prepare_deps_tmp
  
  if has_npm_deps; then found_npm
    { npm_deps |
      sed -r -e 's/^/    "/' -e 's/:/": "/' -e 's/$/",/'
    } >> "$deps_tmp"
  fi
  
  if has_local_deps; then found_local
    local_deps | sed -r 's#^.+$#    "&": "workspace:../&",#' >> "$deps_tmp"
  fi
  
  if [[ -s "$deps_local" ]]; then
    note 'Injecting dependencies'
    sed -i '/"dependencies": {/ {
      r '"$deps_tmp"'
    }' "$package_config_local"
  fi
  clean_deps_tmp
}

function tsconfig_inject {
  local file=$1
  echo '  ],' >> "$deps_tmp"
  sed -i '/^  },*$/ {
    r '"$deps_tmp"'
    d
  }' "$file"
  fix_trailing_comma "$file"
}

project_prefix='  },
'"  "'"references": ['

testing_prefix="$project_prefix"'
'"    "'{ "path": "../tsconfig.json" },'

# add tsconfig.json project references from depends.txt
function add_references {
  local idx=$1
  msg "$(idx "$idx")Adding $(path "tsconfig.json") references"
  prepare_deps_tmp
  
  if has_local_deps; then
    found_local
    echo "$project_prefix" > "$deps_tmp"
    { local_deps |
      sed -r 's#^.+$#    { "path": "../&/tsconfig.json" },#'
    } >> "$deps_tmp"
    tsconfig_inject "$tsconfig_local"
  fi
  clean_deps_tmp
}

# add tsconfig.json project references from depends.txt
function add_testing_references {
  local idx=$1
  msg "$(idx "$idx")Adding $(path "tsconfig.json") references for tests"
  prepare_deps_tmp
  
  found_local
  echo "$testing_prefix" > "$deps_tmp"
  if has_local_deps; then
    { local_deps |
      sed -r 's#^.+$#    { "path": "../../&/tsconfig.json" },#'
    } >> "$deps_tmp"
  fi
  tsconfig_inject "$tsconfig_tests_local"
  clean_deps_tmp
}

function fix_project_name {
  replace_in_file "$1" "$package_config_local" %NAME% "$project_name"
}

function fix_project_description {
  local desc
  desc="$(first_cap_line "$project_readme")"
  replace_in_file "$1" "$package_config_local" %DESCRIPTION% "$desc"
}

function project_version {
  grep '"version": "' "$package_config_local" | sed 's/.*\s"//;s/",$//'
}
