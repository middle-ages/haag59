#!/usr/bin/env bash

# Given a project name will clean, install, lint, build, test, and demo it

set -Eeuo pipefail

. scripts/msg.sh
. scripts/project-tasks.sh

echo -e "⌛ Checking $project using $(emp "$runner")..."

workspace_install 1

run 2 clean
run 3 lint
run 4 run
run 5 test
run 6 build
run 7 run:node

bye "checking project $project."