import { KarabinerRules } from './types'

export const vimModeVariableName = 'vim_mode'
const bundlesWithNativeVim = [
  'com.jetbrains.webstorm',
  'com.jetbrains.pycharm',
  'com.jetbrains.idea',
  'com.microsoft.VSCode',
]

export const vimModeRules: KarabinerRules[] = [
  {
    description: 'Vim Mode',
    manipulators: [
      {
        type: 'basic',
        description: 'Caps Lock + Right Shift -> Vim Mode',
        from: {
          key_code: 'caps_lock',
          modifiers: {
            mandatory: ['right_shift'],
          }
        },
        conditions: [
          {
            type: 'frontmost_application_unless',
            bundle_identifiers: bundlesWithNativeVim,
          },
          {
            type: 'variable_unless',
            name: vimModeVariableName,
            value: 1,
          },
        ],
        to: [
          {
            set_variable: {
              name: vimModeVariableName,
              value: 1,
            },
          },
          {
            halt: true,
            shell_command:
              'osascript -e \'display notification "Press [i] to leave" with title "-- NORMAL --"\'',
          },
        ],
      },
      {
        description: 'Escape -> Exit Vim Mode',
        type: 'basic',
        conditions: [
          {
            name: vimModeVariableName,
            type: 'variable_if',
            value: 1,
          },
        ],
        from: { key_code: 'escape' },
        to: [
          {
            set_variable: {
              name: vimModeVariableName,
              value: 0,
            },
          },
          {
            shell_command:
              'osascript -e \'display notification with title "-- INSERT --"\'',
          },
        ],
      },
      {
        description: 'Caps lock -> Exit Vim Mode',
        type: 'basic',
        conditions: [
          {
            name: vimModeVariableName,
            type: 'variable_if',
            value: 1,
          },
        ],
        from: { key_code: 'caps_lock' },
        to: [
          {
            set_variable: {
              name: vimModeVariableName,
              value: 0,
            },
          },
          {
            shell_command:
              'osascript -e \'display notification with title "-- INSERT --"\'',
          },
        ],
      },
      {
        description: 'Exit Vim Mode in Native Vim Apps',
        type: 'basic',
        conditions: [
          {
            type: 'frontmost_application_if',
            bundle_identifiers: bundlesWithNativeVim,
          },
          {
            name: vimModeVariableName,
            type: 'variable_if',
            value: 1,
          },
        ],
        from: { any: 'key_code' },
        to: [
          {
            set_variable: {
              name: vimModeVariableName,
              value: 0,
            },
          },
          {
            shell_command:
              'osascript -e \'display notification with title "-- INSERT --"\'',
          },
        ],
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
    ]
  }
]
