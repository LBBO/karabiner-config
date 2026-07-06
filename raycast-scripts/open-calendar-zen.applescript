#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Open Google Calendar in Zen
# @raycast.mode compact

# Optional parameters:
# @raycast.icon images/google-calendar-logo.svg
# @raycast.packageName Keyboard Shortcut Utils

# Documentation:
# @raycast.description Opens Google Calendar in Zen browser
# @raycast.author LBBO
# @raycast.authorURL https://raycast.com/LBBO

tell application "zen" to activate
tell application "System Events"
	tell process "zen"
		keystroke "2" using control down
		keystroke "2" using command down
	end tell
end tell
