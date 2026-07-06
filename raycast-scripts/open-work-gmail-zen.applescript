#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Open Work Google Mail in Zen
# @raycast.mode compact

# Optional parameters:
# @raycast.icon images/google-mail-logo.svg
# @raycast.packageName Keyboard Shortcut Utils

# Documentation:
# @raycast.description Opens the work Google Mail tab
# @raycast.author LBBO
# @raycast.authorURL https://raycast.com/LBBO

tell application "zen" to activate
tell application "System Events"
	tell process "zen"
		keystroke "2" using control down
		keystroke "1" using command down
	end tell
end tell
