#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Switch Zen Tab
# @raycast.mode compact

# Optional parameters:
# @raycast.icon images/zen-logo.svg
# @raycast.packageName Keyboard Shortcut Utils
# @raycast.argument1 { "type": "text", "placeholder": "Workspace (Ctrl)", "optional": false }
# @raycast.argument2 { "type": "text", "placeholder": "Tab (Cmd)", "optional": false }

# Documentation:
# @raycast.description Opens a specific workspace and tab in Zen Browser
# @raycast.author LBBO

on run argv
    -- Raycast passes argument1 as item 1, and argument2 as item 2
    set spaceNum to item 1 of argv
    set tabNum to item 2 of argv
    
    tell application "zen" to activate
    tell application "System Events"
        tell process "zen"
            keystroke spaceNum using control down
            keystroke tabNum using command down
        end tell
    end tell
end run