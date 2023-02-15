#!/usr/bin/env bash

# Rename workspace images to work around GitHub repository image caching
#
# Run to prepare a commit that changed workspace, so that when it is commited,
# all images have been renamed to a previously unused name. This is needed
# because GitHub image caches do not refresh correctly. The new version will
# feature new URLs for every workspace image thus avoid GitHub caching.
#
set -Eeuo pipefail

. config/workspace-model.sh
. scripts/msg.sh

echo -e "⌛ Syncing workspace images..."

old_version=$(image_version)
new_version=$(( old_version + 1 ))
old_docs=doc/imagesV$old_version
new_docs=doc/imagesV$new_version

git mv "$old_docs" "$new_docs"
git mv "packages/reunions-data/$old_docs" "packages/reunions-data/$new_docs"

perl -pi -E "s|$old_docs|$new_docs|g" packages/reunions-data/README.md CONTRIBUTING.md

git commit -m 'Updated image versions'

bye "syncing workspace images."
