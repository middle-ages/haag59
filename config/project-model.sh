#!/usr/bin/env bash

set -Eeuo pipefail

# Project model of a single project
#
# Shared config files are found in same dir as this script. They are named after
# their targets, but with a “.shared” segment before the extesion. “.shared”
# paths are defined in the config/workspace-model.sh script.
#
# 1. test_unit_config_(local|shared) - unit test library configuration
#
# 2. package_config_(local|shared) - NPM package.json
#
# 3. tsconfig_(local|shared) - typescript configuration file
#
# 4. tsconfig_tests_(local|shared) - typescript configuration file for unit tests
#
# Every project can add a depends.txt file, possibly empty, which will be added
# to the shared depnedencies from the shared package.json. The file can include
# two types of lines:
#
# 1. NPM package dependencies in the form "name:version:, for example:
#    tty-strings:^1.1.0
#
# 2. Workspace dependencies in the form "projectName", for example:
#    commons
#

. config/workspace-model.sh

export project project_name project_path runner project_git \
config_shared tests test_unit_config_local package_config_local \
tsconfig_local tsconfig_tests_local deps_local deps_tmp project_readme \

check_arg 'project name' "${1:- }"

project="$(imp "$1")"
project_name=$1
project_path=packages/$project_name

runner="${runner_exe} -F $project_name" # project pnpm workspace runner

project_git="$packages_git/$project_name"

check_dir "$project_path" 'project directory'

tests="$project_path/tests";  # project tests dir
ensure_dir "$tests"


# 1. Unit test config
test_unit_config_local="$tests/vitest.config.ts"

# 2. Node.js config
package_config_local="$project_path/package.json"

# 3. Typescript config
tsconfig_local="$project_path/tsconfig.json"

# 4. Typescript testing config
tsconfig_tests_local="$tests/tsconfig.json"

# 6. Local project overrides
deps_local="$project_path/depends.txt"
deps_tmp="${deps_local}.tmp"
project_readme="$project_path/README.md"

ensure_file "$deps_local"

function clean_deps_tmp {
  rm -f "$deps_tmp"
}

function prepare_deps_tmp {
  clean_deps_tmp
  ensure_file "$deps_tmp"
}

# run a project pnpm task using a workspace filter
function run {
  local idx=$1
  local task=$2
  shift 2
  run_with "$idx" "$runner" run "$task" "$@"
}

# run the pnpm task _inside_ the project directory and with no workspace fiter
function run_local {
  local idx=$1
  local task=$2
  shift 2
  pushd "$project_path" > /dev/null
  run_with "$idx" "$runner_exe" "$task" "$@"
  popd > /dev/null
}

function local_deps {
  grep -v : "$deps_local"
}

function npm_deps {
  grep : "$deps_local"
}

function has_local_deps {
  local_deps >& /dev/null
}

function has_npm_deps {
  npm_deps >& /dev/null
}

