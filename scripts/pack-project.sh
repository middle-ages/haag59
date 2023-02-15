#!/usr/bin/env bash

# pack a project and move the tar gz to top-level dist

set -Eeuo pipefail

. scripts/project-tasks.sh
. scripts/msg.sh

echo -e "⌛ Packing $project using $(emp "$runner")..."

version=$(project_version)
archive="$project_name-$version.tgz"
packed="$project_path/$archive"
final="dist/$archive"

run_local 1 pack

if [[ ! -e "$packed" ]]; then
  error "No archive found after pack at $(path "$packed")"
fi

msg "$(idx 2)$(emp "Moving $(path "$packed") to $(path "$final")")"
mv "$packed" "$final"

bye "packing $project."