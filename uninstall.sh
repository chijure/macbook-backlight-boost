#!/bin/bash
# Removes the backlight-boost LaunchAgent and its files.
LABEL="local.backlight-boost"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
rm -f "$HOME/Library/LaunchAgents/$LABEL.plist"
rm -rf "$HOME/Library/Application Support/backlight-boost"
echo "backlight-boost removed. Press a brightness key to restore macOS's own value."
