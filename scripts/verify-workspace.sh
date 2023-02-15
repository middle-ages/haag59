#!/usr/bin/env bash

# Verify all workspace project config

set -Eeuo pipefail

. scripts/msg.sh
. config/workspace-model.sh

echo -e "⌛ Verifying workspace projects $project_names..."

for project in $projects; do
  scripts/verify-project.sh "$project" | stdout
done

bye "verifying workspace projects $project_names."