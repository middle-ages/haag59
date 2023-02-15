#!/usr/bin/env bash

# pack a project and move the tar gz to top-level dist

set -Eeuo pipefail

. config/workspace-model.sh
. scripts/msg.sh

echo -e "⌛ Packing workspace projects $project_names using $(emp "$runner_exe")..."

for project in $projects; do
  scripts/pack-project.sh "$project" | stdout
done

bye "packing $project_names."
