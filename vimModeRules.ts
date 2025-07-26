import {
  Condition,
  KarabinerRules,
  KeyCode,
  Manipulator,
  Modifiers,
  To,
} from './types'

export const vimModeVariableName = 'vim_mode'
const bundlesWithNativeVim = [
  'com.jetbrains.webstorm',
  'com.jetbrains.pycharm',
  'com.jetbrains.idea',
  'com.microsoft.VSCode',
]

const isInAppWithNativeVim: Condition = {
  type: 'frontmost_application_if',
  bundle_identifiers: bundlesWithNativeVim,
}

const notInAppWithNativeVim: Condition = {
  type: 'frontmost_application_unless',
  bundle_identifiers: bundlesWithNativeVim,
}

const isVimModeActive: Condition = {
  type: 'variable_if',
  name: vimModeVariableName,
  value: 1,
}

const isVimModeNotActive: Condition = {
  ...isVimModeActive,
  type: 'variable_unless',
}

const activateVimMode: To = {
  set_variable: {
    name: vimModeVariableName,
    value: 1,
  },
}

const deactivateVimMode: To = {
  set_variable: {
    name: vimModeVariableName,
    value: 0,
  },
}

const notifyAboutNormalMode: To = {
  shell_command:
    'osascript -e \'display notification "Press [i] to leave" with title "-- NORMAL --"\'',
}

const notifyAboutInsertMode: To = {
  shell_command:
    'osascript -e \'display notification with title "-- INSERT --"\'',
}

type VimModeLayerRules = Partial<
  Record<KeyCode, { to: To[]; description?: string; modifiers?: Modifiers }>
>

const normalModeRules: VimModeLayerRules = {
  h: {
    to: [{ key_code: 'left_arrow' }],
  },
  j: {
    to: [{ key_code: 'down_arrow' }],
  },
  k: {
    to: [{ key_code: 'up_arrow' }],
  },
  l: {
    to: [{ key_code: 'right_arrow' }],
  },
  w: {
    to: [{ key_code: 'right_arrow', modifiers: ['option'] }],
    description: 'Move to the next word',
  },
  b: {
    to: [{ key_code: 'left_arrow', modifiers: ['option'] }],
    description: 'Move to the previous word',
  },
  e: {
    to: [{ key_code: 'right_arrow', modifiers: ['option'] }],
    description: 'Move to the end of the word',
  },
  '0': {
    to: [{ key_code: 'left_arrow', modifiers: ['command'] }],
    description: 'Move to the beginning of the line',
  },
  // Shift + 6 = ^
  '6': {
    modifiers: {
      mandatory: ['shift'],
    },
    to: [{ key_code: 'left_arrow', modifiers: ['command'] }],
    description: 'Move to the beginning of the line',
  },
  // Shift + 4 = $
  '4': {
    modifiers: {
      mandatory: ['shift'],
    },
    to: [{ key_code: 'right_arrow', modifiers: ['command'] }],
    description: 'Move to the end of the line',
  },
}

export const vimModeRules: KarabinerRules[] = [
  {
    description: 'Vim Mode Toggling',
    manipulators: [
      {
        type: 'basic',
        description: 'Caps Lock + Right Shift -> Vim Mode',
        from: {
          key_code: 'caps_lock',
          modifiers: {
            mandatory: ['right_shift'],
          },
        },
        conditions: [notInAppWithNativeVim, isVimModeNotActive],
        to: [activateVimMode, notifyAboutNormalMode],
      },
      {
        description: 'Escape -> Exit Vim Mode',
        type: 'basic',
        conditions: [isVimModeActive],
        from: { key_code: 'escape' },
        to: [deactivateVimMode, notifyAboutInsertMode],
      },
      {
        description: 'Caps lock -> Exit Vim Mode',
        type: 'basic',
        conditions: [notInAppWithNativeVim, isVimModeActive],
        from: { key_code: 'caps_lock' },
        to: [deactivateVimMode, notifyAboutInsertMode],
      },
      {
        description: 'Exit Vim Mode in Native Vim Apps',
        type: 'basic',
        conditions: [isInAppWithNativeVim, isVimModeActive],
        from: { any: 'key_code' },
        to: [deactivateVimMode, notifyAboutInsertMode],
      },
      // TODO check this and then maybe add it
      // {
      //   description: 'Exit Vim Mode on Pointing Button Click',
      //   type: 'basic',
      //   conditions: [
      //     {
      //       name: vimModeVariableName,
      //       type: 'variable_if',
      //       value: 1,
      //     },
      //   ],
      //   from: { any: 'pointing_button' },
      //   to: [
      //     {
      //       set_variable: {
      //         name: vimModeVariableName,
      //         value: 0,
      //       },
      //     },
      //     {
      //       shell_command:
      //         'osascript -e \'display notification with title "-- INSERT --"\'',
      //     },
      //   ],
      // },
    ],
  },
  {
    description: 'Vim Mode - Normal Mode',
    manipulators: Object.entries(normalModeRules).map(([key, value]) => ({
      type: 'basic',
      description: value.description ?? `Vim Normal Mode - ${key}`,
      from: {
        key_code: key as KeyCode,
        modifiers: value.modifiers,
      },
      conditions: [isVimModeActive, notInAppWithNativeVim],
      to: value.to,
    })),
  },
]
