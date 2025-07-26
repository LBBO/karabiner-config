import {
  Condition,
  KarabinerRules,
  KeyCode,
  Manipulator,
  Modifiers,
  To,
} from './types'
import { VariableNames } from './variableNames'

export const vimModeVariableName = VariableNames.Vim.Mode
const bundlesWithNativeVim = [
  'com.jetbrains.webstorm',
  'com.jetbrains.pycharm',
  'com.jetbrains.idea',
  'com.microsoft.VSCode',
  'com.mitchellh.ghostty',
  'md.obsidian',
]

const deactivate = (name): To => ({
  set_variable: {
    name,
    value: 0,
  },
})

const activate = (name): To => ({
  set_variable: {
    name,
    value: 1,
  },
})

const isActive = (name: string): Condition => ({
  type: 'variable_if',
  name,
  value: 1,
})

const isNotActive = (name: string): Condition => ({
  type: 'variable_unless',
  name,
  value: 1,
})

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

const activateVimMode = activate(VariableNames.Vim.Mode)

const deactivateVimMode = deactivate(VariableNames.Vim.Mode)

const notifyAboutNormalMode: To = {
  shell_command:
    'osascript -e \'display notification "Press [i] to leave" with title "-- NORMAL --"\'',
}

const notifyAboutInsertMode: To = {
  shell_command:
    'osascript -e \'display notification with title "-- INSERT --"\'',
}

type KeyRuleDefinition = Omit<Manipulator, 'from' | 'type'> & {
  modifiers?: Modifiers
}

type VimModeLayerRules = Partial<
  Record<KeyCode, KeyRuleDefinition | KeyRuleDefinition[]>
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
    to: [
      { key_code: 'right_arrow', modifiers: ['option'] },
      { key_code: 'right_arrow', modifiers: ['option'] },
      { key_code: 'left_arrow', modifiers: ['option'] },
    ],
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

  g: [
    {
      description: 'Remember first g press',
      conditions: [isNotActive(VariableNames.Vim.GPressed)],
      to: [activate(VariableNames.Vim.GPressed)],
      to_delayed_action: {
        to_if_invoked: [deactivate(VariableNames.Vim.GPressed)],
      },
      parameters: {
        'basic.to_delayed_action_delay_milliseconds': 500,
      },
    },
    {
      description: 'Go to top on second g press',
      conditions: [isActive(VariableNames.Vim.GPressed)],
      to: [
        { key_code: 'up_arrow', modifiers: ['command'] },
        deactivate(VariableNames.Vim.GPressed),
      ],
    },
    {
      // TODO why doesn't this work?
      description: 'G -> go to bottom',
      modifiers: {
        mandatory: ['shift'],
      },
      to: [{ key_code: 'down_arrow', modifiers: ['command'] }],
    },
  ],

  i: [
    {
      to: [deactivateVimMode, notifyAboutInsertMode],
      description: 'Enter Insert Mode',
    },
    {
      // TODO why doesn't this work?
      modifiers: {
        mandatory: ['shift'],
      },
      to: [
        { key_code: 'left_arrow', modifiers: ['command'] },
        deactivateVimMode,
        notifyAboutInsertMode,
      ],
    },
  ],

  a: [
    {
      to: [deactivateVimMode, notifyAboutInsertMode],
      description: 'Enter Insert Mode after the cursor',
    },
    {
      // TODO why doesn't this work?
      modifiers: {
        mandatory: ['shift'],
      },
      to: [
        { key_code: 'right_arrow', modifiers: ['command'] },
        deactivateVimMode,
        notifyAboutInsertMode,
      ],
    },
  ],

  o: [
    {
      to: [
        { key_code: 'right_arrow', modifiers: ['command'] },
        { key_code: 'return_or_enter' },
        deactivateVimMode,
        notifyAboutInsertMode,
      ],
      description: 'Open a new line below and enter Insert Mode',
    },
    {
      // TODO why doesn't this work?
      modifiers: {
        mandatory: ['shift'],
      },
      to: [
        { key_code: 'left_arrow', modifiers: ['command'] },
        { key_code: 'return_or_enter' },
        { key_code: 'up_arrow' },
        deactivateVimMode,
        notifyAboutInsertMode,
      ],
    },
  ],
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
    manipulators: Object.entries(normalModeRules)
      .flatMap(([key, value]): Array<[KeyCode, KeyRuleDefinition]> => {
        const keyCode = key as KeyCode
        return Array.isArray(value)
          ? value.map((currValue) => [keyCode, currValue])
          : [[keyCode, value]]
      })
      .map(([key, value]) => ({
        ...value,
        type: 'basic',
        description: value.description ?? `Vim Normal Mode - ${key}`,
        from: {
          key_code: key,
          modifiers: value.modifiers,
        },
        conditions: [
          isVimModeActive,
          notInAppWithNativeVim,
          ...(value.conditions ?? []),
        ],
      })),
  },
]
