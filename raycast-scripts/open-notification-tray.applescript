#!/bin/bash

# @raycast.schemaVersion 1
# @raycast.title Toggle Notification Center
# @raycast.mode silent
# @raycast.packageName Navigation
# @raycast.icon 🔔

osascript -e '
tell application "System Events"
    tell process "ControlCenter"
        -- Tries to find the clock/date text element which acts as the toggle
        set clockItem to (first menu bar item of menu bar 1 whose description contains "clock" or description contains "time" or description contains "Control Center")
        click clockItem
    end tell
end tell'
