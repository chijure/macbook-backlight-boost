#!/bin/bash
# Installs backlight-boost as a LaunchAgent that starts at login.
# Usage: ./install.sh [MAX_BKLT]   (default 10000)
set -euo pipefail

MAX="${1:-10000}"
LABEL="local.backlight-boost"
DEST="$HOME/Library/Application Support/backlight-boost"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"

if ! [[ "$MAX" =~ ^[0-9]+$ ]] || (( MAX < 1 || MAX > 65535 )); then
  echo "MAX_BKLT must be a number between 1 and 65535" >&2
  exit 1
fi

mkdir -p "$DEST" "$HOME/Library/LaunchAgents"
cp "$(dirname "$0")/backlight-boost.js" "$DEST/"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/osascript</string><string>-l</string><string>JavaScript</string>
    <string>$DEST/backlight-boost.js</string>
    <string>$MAX</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>ProcessType</key><string>Background</string>
</dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "backlight-boost installed with MAX_BKLT=$MAX"
