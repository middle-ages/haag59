#!/usr/bin/env bash

set -Eeuo pipefail

# Workspace model
#
# Shared config for scripts that do not work with a specific project.

. scripts/util.sh

export runner_exe
runner_exe="pnpm" # project pnpm workspace runner

config_shared=config; # shared config dir

export test_unit_config_shared package_config_shared
export tsconfig_shared tsconfig_tests_shared

# 1. Unit test config
test_unit_config_shared="$config_shared/vitest.config.shared.ts"

# 2. Node.js config
package_config_shared="$config_shared/package.shared.json"

# 3. Typescript config
tsconfig_shared="$config_shared/tsconfig.shared.json"

# 4. Typescript testing config
tsconfig_tests_shared="$config_shared/tsconfig.tests.shared.json"

function list_projects {
  for project in packages/*; do
    basename "$project"
  done
}

export projects
if (( $# ))
then
  projects="${*}"
else
  projects=$(list_projects)
fi

export project_list project_names
project_list=()
project_names=""
for project in $projects; do
  project_list+=("$(imp "$project")")
done
project_names="$(comma_join "${project_list[@]}")"

function workspace_run {
  local idx=$1
  local task=$2
  shift 2
  run_with "$idx" "$runner_exe" "$task" "$@"
}

function workspace_install {
  local idx=$1
  workspace_run "$idx" install -r
}

# computes the next image version for working around GitHub stale image caches
function image_version {
  find doc | grep imagesV | sed -r  's|.*doc/imagesV([0-9])+/.*|\1|' | tail -1
}

export workspace_git packages_git
workspace_git='github.com/middle-ages/haag59'
packages_git="$workspace_git/tree/main/packages"
