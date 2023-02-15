#!/usr/bin/env bash

set -Eeuo pipefail

rm -rf esm
rm -f /*-*.*.*.tgz

# for benefit of avoiding having to build before install
mkdir -p esm/app
touch esm/app/index.js

