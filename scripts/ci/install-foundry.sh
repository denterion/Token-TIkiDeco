#!/usr/bin/env bash
set -euo pipefail
archive="$RUNNER_TEMP/foundry.tar.gz"
destination="$RUNNER_TEMP/foundry-bin"
curl --fail --location --retry 3 --output "$archive" "https://github.com/foundry-rs/foundry/releases/download/$FOUNDRY_VERSION/foundry_${FOUNDRY_VERSION}_linux_amd64.tar.gz"
echo "7e54ec62cc9d176703649e01d7eb1fa22e86116fdedff1992cd014923f53ca5f  $archive" | sha256sum --check
mkdir -p "$destination"
tar -xzf "$archive" -C "$destination"
"$destination/forge" --version
echo "$destination" >> "$GITHUB_PATH"
