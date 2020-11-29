#!/bin/bash

set -ve

rm -rf ./docs/api
npx typedoc --out ./docs/api
mv docs/api/README.md docs/api/index.md
npx ts-node build/api-docs-process.ts
