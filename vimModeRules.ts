import {
  Condition,
  KarabinerRules,
  KeyCode,
  Manipulator,
  Modifiers,
  To,
} from './types'
import { VariableNames } from './variableNames'

export const vimModeVariableName = VariableNames.Vim.NormalMode
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

const activateVimMode = activate(VariableNames.Vim.NormalMode)

const deactivateVimMode = deactivate(VariableNames.Vim.NormalMode)

const notifyAboutNormalMode: To = {
  shell_command:
    'osascript -e \'display notification "Press [i] to leave" with title "-- NORMAL --"\'',
}

const notifyAboutInsertMode: To = {
  shell_command:
    'osascript -e \'display notification with title "-- INSERT --"\'',
}

const notifyAboutVisualMode: To = {
  shell_command:
    'osascript -e \'display notification "Press [v] again to go back to Vim Mode" with title "-- VISUAL --"\'',
}

type KeyRuleDefinition = Omit<Manipulator, 'from' | 'type'> & {
  modifiers?: Modifiers
}

type VimModeLayerRules = Partial<
  Record<KeyCode, KeyRuleDefinition | KeyRuleDefinition[]>
>

const vimMotions: VimModeLayerRules = {
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
    // Shift isn't properly implementable, but allowing it is better than nothing
    modifiers: {
      optional: ['shift'],
    },
    to: [
      { key_code: 'right_arrow', modifiers: ['option'] },
      { key_code: 'right_arrow', modifiers: ['option'] },
      { key_code: 'left_arrow', modifiers: ['option'] },
    ],
    description: 'Move to the next word',
  },
  b: {
    // Shift isn't properly implementable, but allowing it is better than nothing
    modifiers: {
      optional: ['shift'],
    },
    to: [{ key_code: 'left_arrow', modifiers: ['option'] }],
    description: 'Move to the previous word',
  },
  e: {
    // Shift isn't properly implementable, but allowing it is better than nothing
    modifiers: {
      optional: ['shift'],
    },
    to: [{ key_code: 'right_arrow', modifiers: ['option'] }],
  },
  '0': {
    to: [{ key_code: 'left_arrow', modifiers: ['command'] }],
  },
  // Shift + 6 = ^
  '6': {
    modifiers: {
      mandatory: ['shift'],
    },
    to: [{ key_code: 'left_arrow', modifiers: ['command'] }],
  },
  // Shift + 4 = $
  '4': {
    modifiers: {
      mandatory: ['shift'],
    },
    to: [{ key_code: 'right_arrow', modifiers: ['command'] }],
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
      description: 'G -> go to bottom',
      modifiers: {
        mandatory: ['shift'],
      },
      to: [{ key_code: 'down_arrow', modifiers: ['command'] }],
    },
  ],
}

const enterInsertFromNormalRules: VimModeLayerRules = {
  i: [
    {
      to: [deactivateVimMode, notifyAboutInsertMode],
      description: 'Enter Insert Mode',
    },
    {
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

const enteringAndLeavingVisualModeRules: Manipulator[] = [
  {
    type: 'basic',
    description: 'Normal Mode -> Visual Mode',
    from: { key_code: 'v' },
    conditions: [
      isActive(VariableNames.Vim.NormalMode),
      isNotActive(VariableNames.Vim.VisualMode),
      notInAppWithNativeVim,
    ],
    to: [
      activate(VariableNames.Vim.VisualMode),
      deactivate(VariableNames.Vim.NormalMode),
      notifyAboutVisualMode,
    ],
  },
  {
    type: 'basic',
    description: 'Visual Mode -> Normal Mode',
    from: { key_code: 'v' },
    conditions: [
      isActive(VariableNames.Vim.VisualMode),
      isNotActive(VariableNames.Vim.NormalMode),
      notInAppWithNativeVim,
    ],
    to: [
      activate(VariableNames.Vim.NormalMode),
      deactivate(VariableNames.Vim.VisualMode),
      notifyAboutNormalMode,
    ],
  },
  {
    type: 'basic',
    description: 'Visual Mode -> Normal Mode',
    from: { key_code: 'escape' },
    conditions: [
      isActive(VariableNames.Vim.VisualMode),
      isNotActive(VariableNames.Vim.NormalMode),
      notInAppWithNativeVim,
    ],
    to: [
      activate(VariableNames.Vim.NormalMode),
      deactivate(VariableNames.Vim.VisualMode),
      notifyAboutNormalMode,
    ],
  },
  {
    type: 'basic',
    description: 'Visual Mode -> Normal Mode',
    from: { key_code: 'caps_lock' },
    conditions: [
      isActive(VariableNames.Vim.VisualMode),
      isNotActive(VariableNames.Vim.NormalMode),
      notInAppWithNativeVim,
    ],
    to: [
      activate(VariableNames.Vim.NormalMode),
      deactivate(VariableNames.Vim.VisualMode),
      notifyAboutNormalMode,
    ],
  },
]

const visualModeActions: VimModeLayerRules = {
  d: {
    description: 'Delete selected text',
    to: [
      { key_code: 'x', modifiers: ['left_command'] },
      deactivate(VariableNames.Vim.VisualMode),
      activate(VariableNames.Vim.NormalMode),
      notifyAboutNormalMode,
    ],
  },
  y: {
    description: 'Yank (copy) selected text',
    to: [
      { key_code: 'c', modifiers: ['left_command'] },
      { key_code: 'left_arrow' },
      deactivate(VariableNames.Vim.VisualMode),
      activate(VariableNames.Vim.NormalMode),
      notifyAboutNormalMode,
    ],
  },
  c: {
    description: 'Change (cut) selected text',
    to: [
      { key_code: 'x', modifiers: ['left_command'] },
      deactivate(VariableNames.Vim.VisualMode),
      deactivate(VariableNames.Vim.NormalMode),
      notifyAboutInsertMode,
    ],
  },
  x: {
    description: 'Cut selected text',
    to: [
      { key_code: 'x', modifiers: ['left_command'] },
      deactivate(VariableNames.Vim.VisualMode),
      activate(VariableNames.Vim.NormalMode),
      notifyAboutNormalMode,
    ],
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
    description: 'Vim - Visual Mode - Activation, Motions, and Exiting (3/11)',
    manipulators: [
      ...enteringAndLeavingVisualModeRules,
      ...makeVimVisualModeRules(vimMotions),
      ...makeVimVisualModeRules(visualModeActions, false),
      // TODO: disable remaining keys in Visual Mode
    ],
  },
  {
    description: 'Vim - Normal Mode - Motions (8/11)',
    manipulators: makeVimNormalModeRules(vimMotions),
  },
  {
    description: 'Vim - Normal Mode - Entering Insert Mode (9/11)',
    manipulators: makeVimNormalModeRules(enterInsertFromNormalRules),
  },
]

function makeVimModeManipulators(rules: VimModeLayerRules): Manipulator[] {
  return Object.entries(rules)
    .flatMap(([key, value]): Array<[KeyCode, KeyRuleDefinition]> => {
      const keyCode = key as KeyCode
      return Array.isArray(value)
        ? value.map((currValue) => [keyCode, currValue])
        : [[keyCode, value]]
    })
    .map(([key, { modifiers, ...value }]) => ({
      ...value,
      type: 'basic',
      description: value.description ?? `Vim Normal Mode - ${key}`,
      from: {
        key_code: key,
        modifiers: modifiers,
      },
      conditions: [notInAppWithNativeVim, ...(value.conditions ?? [])],
    }))
}

function makeVimNormalModeRules(rules: VimModeLayerRules): Manipulator[] {
  return makeVimModeManipulators(rules).map((manipulator) => ({
    ...manipulator,
    conditions: [isVimModeActive, ...(manipulator.conditions ?? [])],
  }))
}

function makeVimVisualModeRules(
  rules: VimModeLayerRules,
  addShift = true,
): Manipulator[] {
  return makeVimModeManipulators(rules).map((manipulator) => ({
    ...manipulator,
    to: manipulator.to?.map((to) => ({
      ...to,
      modifiers: [...(addShift ? ['left_shift'] : []), ...(to.modifiers ?? [])],
    })),
    conditions: [
      isActive(VariableNames.Vim.VisualMode),
      ...(manipulator.conditions ?? []),
    ],
  }))
}
