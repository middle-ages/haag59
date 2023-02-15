#!/usr/bin/env bash

# Given a project name will verify that project's configuration.
#
# The verification consists of copying some files from the shared config dir
# (/config) to the local project dir, then customizing these files according to
# the depends.txt file found at the project root, and according to the project
# README.md.
#
# If no depends.txt file is found, an empty one will be created.
#
# Files Copied
#
#  1. Unit test  config      ⇒ project tests/ dir
#  2. Package    config      ⇒ project package.json
#  3. Typescript config      ⇒ project tsconfig.json
#  4. Typescript test config ⇒ project tests/ dir
#  5. API-extactor config    ⇒ project dir
#
# Project Customizations Applied
#
#  6. Replace %NAME% with project name in project package.json
#  7. Replace %DESCRIPTION% with project description in project package.json
#     The description is taken from the 1st line in the project README that
#     begins at 1st character with a capital letter. This should be the
#     project descrioption
#  8. Sync project local package.json from project local depends.txt
#     a. lines matching: “[^:]+:[^:]+” are assumed to be external dependencies
#     b: lines with no “:” are assumed to be workspace dependencies
#  9. Sync project local tsconfig.json from project local depends.txt
# 10. Sync project local testing tsconfig.json from project local depends.txt

set -Eeuo pipefail

. scripts/project-tasks.sh

echo -e "⌛ Verifying project $project config using $(emp "$runner")..."

copy_uncommented 1 "$test_unit_config_shared" "$test_unit_config_local"

copy 2 "$package_config_shared" "$package_config_local"
copy 3 "$tsconfig_shared"       "$tsconfig_local"
copy 4 "$tsconfig_tests_shared" "$tsconfig_tests_local"
copy 5 "$api_extractor_shared"  "$api_extractor_local"

fix_project_name 6
fix_project_description 7

add_dependencies 8

add_references 9
add_testing_references 10

bye "configuring project $project."
