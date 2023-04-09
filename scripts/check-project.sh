#!/usr/bin/env bash

# Given a project name will clean, install, lint, build, test, and demo it

set -Eeuo pipefail

. scripts/msg.sh
. scripts/project-tasks.sh

echo -e "⌚ Checking $project using $(emp "$runner")..."

workspace_install ①

run ② clean
run ③ lint
run ④ run
run ⑤ test
run ⑥ build
run ⑦ run:node

bye "checking project $project."