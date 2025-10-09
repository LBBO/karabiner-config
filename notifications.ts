import { To } from './types'

export const notify = (title: string, description?: string): To => ({
  shell_command: `osascript -e 'display notification${
    description ? ` "${description}"` : ''
  } with title "${title}"'`,
})

export const notifyAboutNormalMode: To = notify(
  '-- NORMAL --',
  'Press [i] to enter Insert Mode',
)

export const notifyAboutInsertMode: To = notify('-- INSERT --')

export const notifyAboutVisualMode: To = notify(
  '-- VISUAL --',
  'Press [v] again to go back to Vim Mode',
)
