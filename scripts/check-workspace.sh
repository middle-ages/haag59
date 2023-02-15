#!/usr/bin/env bash

# Check all workspace projects

set -Eeuo pipefail

. scripts/msg.sh
. config/workspace-model.sh

echo -e "⌛ Packing workspace projects $project_names..."

for project in $projects; do
  scripts/check-project.sh "$project"
done

bye "checking workspace projects $project_names."
