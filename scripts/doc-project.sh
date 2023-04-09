#!/usr/bin/env bash

# run api-extractor to create project docs

set -Eeuo pipefail

. scripts/project-tasks.sh
. scripts/msg.sh

echo -e "⌚ Extracting API from $project using $(emp "$runner")..."

run_local ① api

bye "extracting API of $project."