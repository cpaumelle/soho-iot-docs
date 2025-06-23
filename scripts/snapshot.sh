#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="\$HOME/iot"
SNAP_DIR="\$HOME/iot-archives"
TIMESTAMP="\$(date +%Y%m%d_%H%M%S)"
DEST="\$SNAP_DIR/iot-\$TIMESTAMP"

mkdir -p "\$SNAP_DIR"
rsync -a --delete "\$BASE_DIR/" "\$DEST/"

echo "Snapshot saved to \$DEST"
