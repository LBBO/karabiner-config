import {
  Condition,
  KarabinerRules,
  KeyCode,
  Manipulator,
  Modifiers,
  To,
} from './types'
import {
  activate,
  deactivate,
  isActive,
  isNotActive,
  VariableName,
  VariableNames,
} from './variables'
import {
  notifyAboutInsertMode,
  notifyAboutNormalMode,
  notifyAboutVisualMode,
} from './notifications'

export const vimModeVariableName = VariableNames.Vim.NormalMode
const bundlesWithNativeVim = [
  'com.jetbrains.webstorm',
  'com.jetbrains.pycharm',
  'com.jetbrains.idea',
  'com.microsoft.VSCode',
  'com.todesktop.230313mzl4w4u92', // Cursor
  'com.mitchellh.ghostty',
  'md.obsidian',
]

const isInAppWithNativeVim: Condition = {
  type: 'frontmost_application_if',
  bundle_identifiers: bundlesWithNativeVim,
}

const notInAppWithNativeVim: Condition = {
  type: 'frontmost_application_unless',
  bundle_identifiers: bundlesWithNativeVim,
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

const normalModeActions: VimModeLayerRules = {
  x: [
    {
      to: [{ key_code: 'delete_forward' }],
      description: 'Delete character after the cursor',
    },
    {
      modifiers: {
        mandatory: ['shift'],
      },
      to: [{ key_code: 'delete_or_backspace' }],
      description: 'Delete character before the cursor',
    },
  ],
  p: [
    {
      description: 'Paste',
      to: [{ key_code: 'v', modifiers: ['left_command'] }],
    },
    {
      description: 'Paste',
      modifiers: {
        mandatory: ['shift'],
      },
      to: [{ key_code: 'v', modifiers: ['left_command'] }],
    },
  ],
  u: {
    description: 'Undo',
    to: [{ key_code: 'z', modifiers: ['left_command'] }],
  },
  r: {
    description: 'Redo',
    modifiers: {
      mandatory: ['control'],
    },
    to: [{ key_code: 'z', modifiers: ['left_command', 'left_shift'] }],
  },
}

const enterInsertFromNormalRules: VimModeLayerRules = {
  i: [
    {
      to: [deactivate(VariableNames.Vim.NormalMode), notifyAboutInsertMode],
      description: 'Enter Insert Mode',
    },
    {
      modifiers: {
        mandatory: ['shift'],
      },
      to: [
        { key_code: 'left_arrow', modifiers: ['command'] },
        deactivate(VariableNames.Vim.NormalMode),
        notifyAboutInsertMode,
      ],
    },
  ],

  a: [
    {
      to: [deactivate(VariableNames.Vim.NormalMode), notifyAboutInsertMode],
      description: 'Enter Insert Mode after the cursor',
    },
    {
      modifiers: {
        mandatory: ['shift'],
      },
      to: [
        { key_code: 'right_arrow', modifiers: ['command'] },
        deactivate(VariableNames.Vim.NormalMode),
        notifyAboutInsertMode,
      ],
    },
  ],

  o: [
    {
      to: [
        { key_code: 'right_arrow', modifiers: ['command'] },
        { key_code: 'return_or_enter' },
        deactivate(VariableNames.Vim.NormalMode),
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
        deactivate(VariableNames.Vim.NormalMode),
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
  ...(['v', 'escape', 'caps_lock'] as const).map(
    (key_code): Manipulator => ({
      type: 'basic',
      description: `Visual Mode -> Normal Mode (${key_code})`,
      from: { key_code },
      conditions: [
        isActive(VariableNames.Vim.VisualMode),
        isNotActive(VariableNames.Vim.NormalMode),
        notInAppWithNativeVim,
      ],
      to: [
        activate(VariableNames.Vim.NormalMode),
        deactivate(VariableNames.Vim.VisualMode),
        deactivate(VariableNames.Vim.InnerSelection),
        deactivate(VariableNames.Vim.OuterSelection),
        notifyAboutNormalMode,
      ],
    }),
  ),
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

const enteringAndLeavingDeleteModeRules: Manipulator[] = [
  {
    type: 'basic',
    description: 'Start deleting',
    from: { key_code: 'd' },
    conditions: [
      isActive(VariableNames.Vim.NormalMode),
      isNotActive(VariableNames.Vim.DeleteMode),
      notInAppWithNativeVim,
    ],
    to: [
      activate(VariableNames.Vim.DeleteMode),
      deactivate(VariableNames.Vim.NormalMode),
    ],
  },
  {
    type: 'basic',
    description: 'Delete selected text in Delete Mode',
    from: { key_code: 'd' },
    conditions: [isActive(VariableNames.Vim.DeleteMode), notInAppWithNativeVim],
    to: [
      { key_code: 'left_arrow', modifiers: ['left_command'] },
      {
        key_code: 'right_arrow',
        modifiers: ['left_command', 'left_shift'],
      },
      { key_code: 'x', modifiers: ['left_command'] },
      deactivate(VariableNames.Vim.DeleteMode),
      activate(VariableNames.Vim.NormalMode),
    ],
  },
  ...(['escape', 'caps_lock'] as const).map(
    (key_code): Manipulator => ({
      type: 'basic',
      description: `Stop deleting (${key_code})`,
      from: { key_code },
      conditions: [
        isActive(VariableNames.Vim.DeleteMode),
        isNotActive(VariableNames.Vim.NormalMode),
        notInAppWithNativeVim,
      ],
      to: [
        activate(VariableNames.Vim.NormalMode),
        deactivate(VariableNames.Vim.DeleteMode),
        deactivate(VariableNames.Vim.InnerSelection),
        deactivate(VariableNames.Vim.OuterSelection),
        notifyAboutNormalMode,
      ],
    }),
  ),
  // Use the abstracted selection API for delete mode
  ...createSelectionModeRules(
    'Delete',
    VariableNames.Vim.DeleteMode,
    [{ key_code: 'x', modifiers: ['left_command'] }], // Delete action
    [activate(VariableNames.Vim.NormalMode), notifyAboutNormalMode], // Cleanup actions
  ),
]

const enteringAndLeavingYankModeRules: Manipulator[] = [
  {
    type: 'basic',
    description: 'Start yanking',
    from: { key_code: 'y' },
    conditions: [
      isActive(VariableNames.Vim.NormalMode),
      isNotActive(VariableNames.Vim.YankMode),
      notInAppWithNativeVim,
    ],
    to: [
      activate(VariableNames.Vim.YankMode),
      deactivate(VariableNames.Vim.NormalMode),
    ],
  },
  {
    type: 'basic',
    description: 'Yank entire line',
    from: { key_code: 'y' },
    conditions: [isActive(VariableNames.Vim.YankMode), notInAppWithNativeVim],
    to: [
      { key_code: 'left_arrow', modifiers: ['left_command'] },
      {
        key_code: 'right_arrow',
        modifiers: ['left_command', 'left_shift'],
      },
      { key_code: 'c', modifiers: ['left_command'] },
      { key_code: 'left_arrow', modifiers: ['left_command'] },
      deactivate(VariableNames.Vim.YankMode),
      activate(VariableNames.Vim.NormalMode),
    ],
  },
  ...(['escape', 'caps_lock'] as const).map(
    (key_code): Manipulator => ({
      type: 'basic',
      description: `Stop yanking (${key_code})`,
      from: { key_code },
      conditions: [isActive(VariableNames.Vim.YankMode), notInAppWithNativeVim],
      to: [
        activate(VariableNames.Vim.NormalMode),
        deactivate(VariableNames.Vim.YankMode),
        deactivate(VariableNames.Vim.InnerSelection),
        deactivate(VariableNames.Vim.OuterSelection),
      ],
    }),
  ),
  ...createSelectionModeRules(
    'Yank',
    VariableNames.Vim.YankMode,
    [
      { key_code: 'c', modifiers: ['left_command'] },
      { key_code: 'left_arrow' },
    ], // Copy action
    [activate(VariableNames.Vim.NormalMode)], // Cleanup actions
  ),
]

const enteringAndLeavingChangeModeRules: Manipulator[] = [
  {
    type: 'basic',
    description: 'Start changing',
    from: { key_code: 'c' },
    conditions: [
      isActive(VariableNames.Vim.NormalMode),
      isNotActive(VariableNames.Vim.ChangeMode),
      notInAppWithNativeVim,
    ],
    to: [
      activate(VariableNames.Vim.ChangeMode),
      deactivate(VariableNames.Vim.NormalMode),
    ],
  },
  {
    type: 'basic',
    description: 'Change entire line',
    from: { key_code: 'c' },
    conditions: [isActive(VariableNames.Vim.ChangeMode), notInAppWithNativeVim],
    to: [
      { key_code: 'left_arrow', modifiers: ['left_command'] },
      {
        key_code: 'right_arrow',
        modifiers: ['left_command', 'left_shift'],
      },
      { key_code: 'x', modifiers: ['left_command'] },
      deactivate(VariableNames.Vim.ChangeMode),
      activate(VariableNames.Vim.NormalMode),
    ],
  },
  ...(['escape', 'caps_lock'] as const).map(
    (key_code): Manipulator => ({
      type: 'basic',
      description: `Stop changing (${key_code})`,
      from: { key_code },
      conditions: [
        isActive(VariableNames.Vim.ChangeMode),
        isNotActive(VariableNames.Vim.NormalMode),
        notInAppWithNativeVim,
      ],
      to: [
        activate(VariableNames.Vim.NormalMode),
        deactivate(VariableNames.Vim.ChangeMode),
        notifyAboutNormalMode,
      ],
    }),
  ),
  // Use the abstracted selection API for change mode
  ...createSelectionModeRules(
    'Change',
    VariableNames.Vim.ChangeMode,
    [{ key_code: 'x', modifiers: ['left_command'] }], // Cut action
    [deactivate(VariableNames.Vim.NormalMode), notifyAboutInsertMode], // Cleanup actions - change mode enters insert mode
  ),
]

const notDisabledModifiers: KeyCode[] = [
  'left_shift',
  'right_shift',
  'left_control',
  'right_control',
  'left_option',
  'right_option',
  'left_command',
  'right_command',
  'left_arrow',
  'right_arrow',
  'up_arrow',
  'down_arrow',
]
const disableUnusedKeysRules = [
  VariableNames.Vim.NormalMode,
  VariableNames.Vim.VisualMode,
  VariableNames.Vim.DeleteMode,
  VariableNames.Vim.YankMode,
  VariableNames.Vim.ChangeMode,
].flatMap((mode) => [
  ...notDisabledModifiers.map(
    (key_code): Manipulator => ({
      type: 'basic',
      description: `Disable ${key_code} in ${mode}`,
      from: { key_code, modifiers: { optional: ['any'] } },
      conditions: [isActive(mode), notInAppWithNativeVim],
      to: [{ key_code }],
    }),
  ),
  {
    type: 'basic',
    from: {
      any: 'key_code',
      modifiers: {
        optional: ['any'],
      },
    },
    conditions: [isActive(mode), notInAppWithNativeVim],
    to: [{ key_code: 'vk_none' }],
  } satisfies Manipulator,
])

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
        conditions: [
          notInAppWithNativeVim,
          isNotActive(VariableNames.Vim.NormalMode),
        ],
        to: [activate(VariableNames.Vim.NormalMode), notifyAboutNormalMode],
      },
      {
        description: 'Escape -> Exit Vim Mode',
        type: 'basic',
        conditions: [isActive(VariableNames.Vim.NormalMode)],
        from: { key_code: 'escape' },
        to: [
          deactivate(VariableNames.Vim.NormalMode),
          notifyAboutInsertMode,
          // Just in case this is still active
          deactivate(VariableNames.Vim.GPressed),
        ],
      },
      {
        description: 'Caps lock -> Exit Vim Mode',
        type: 'basic',
        conditions: [
          notInAppWithNativeVim,
          isActive(VariableNames.Vim.NormalMode),
        ],
        from: { key_code: 'caps_lock' },
        to: [
          deactivate(VariableNames.Vim.NormalMode),
          notifyAboutInsertMode,
          // Just in case this is still active
          deactivate(VariableNames.Vim.GPressed),
        ],
      },
      {
        description: 'Exit Vim Mode in Native Vim Apps',
        type: 'basic',
        conditions: [
          isInAppWithNativeVim,
          isActive(VariableNames.Vim.NormalMode),
        ],
        from: { any: 'key_code' },
        to: [
          deactivate(VariableNames.Vim.NormalMode),
          notifyAboutInsertMode,
          // Just in case this is still active
          deactivate(VariableNames.Vim.GPressed),
        ],
      },
      {
        description: 'Exit Vim Mode in Native Vim Apps',
        type: 'basic',
        conditions: [
          isInAppWithNativeVim,
          isActive(VariableNames.Vim.VisualMode),
        ],
        from: { any: 'key_code' },
        to: [
          deactivate(VariableNames.Vim.VisualMode),
          notifyAboutInsertMode,
          deactivate(VariableNames.Vim.GPressed),
          deactivate(VariableNames.Vim.InnerSelection),
          deactivate(VariableNames.Vim.OuterSelection),
        ],
      },
    ],
  },
  {
    description: 'Vim - Visual Mode - Activation, Motions, and Exiting (3/11)',
    manipulators: [
      ...enteringAndLeavingVisualModeRules,
      ...makeVimVisualModeRules(vimMotions),
      ...makeVimVisualModeRules(visualModeActions, false),
      // Add viw and vaw rules using the abstracted selection API
      ...createSelectionModeRules(
        'Visual',
        VariableNames.Vim.VisualMode,
        [], // No action after selection in visual mode - just select
        [activate(VariableNames.Vim.VisualMode)], // Cleanup actions
      ),
    ],
  },
  {
    description: 'Vim - Visual Mode - Deleting in Normal Mode (4/11)',
    manipulators: [
      ...enteringAndLeavingDeleteModeRules,
      ...makeVimDeleteModeRules(
        {
          // Don't delete after the first g press
          g: (vimMotions.g as KeyRuleDefinition[])[0],
        },
        false,
      ),
      ...makeVimDeleteModeRules({
        ...vimMotions,
        // Skip the first g press
        g: (vimMotions.g as KeyRuleDefinition[]).slice(1),
      }),
    ],
  },
  {
    description: 'Vim - Visual Mode - Yanking in Normal Mode (5/11)',
    manipulators: [
      ...enteringAndLeavingYankModeRules,
      ...makeVimYankModeRules(
        {
          // Don't delete after the first g press
          g: (vimMotions.g as KeyRuleDefinition[])[0],
        },
        false,
      ),
      ...makeVimYankModeRules({
        ...vimMotions,
        // Skip the first g press
        g: (vimMotions.g as KeyRuleDefinition[]).slice(1),
      }),
    ],
  },
  {
    description: 'Vim - Visual Mode - Changing in Normal Mode (6/11)',
    manipulators: [
      ...enteringAndLeavingChangeModeRules,
      ...makeVimChangeModeRules(
        {
          // Don't delete after the first g press
          g: (vimMotions.g as KeyRuleDefinition[])[0],
        },
        false,
      ),
      ...makeVimChangeModeRules({
        ...vimMotions,
        // Skip the first g press
        g: (vimMotions.g as KeyRuleDefinition[]).slice(1),
      }),
    ],
  },
  {
    description: 'Vim - Normal Mode - Actions (7/11)',
    manipulators: makeVimNormalModeRules(normalModeActions),
  },
  {
    description: 'Vim - Normal Mode - Motions (8/11)',
    manipulators: makeVimNormalModeRules(vimMotions),
  },
  {
    description: 'Vim - Normal Mode - Entering Insert Mode (9/11)',
    manipulators: makeVimNormalModeRules(enterInsertFromNormalRules),
  },
  {
    description: 'Vim - Disable unused keys (11/11)',
    manipulators: disableUnusedKeysRules,
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
    conditions: [
      isActive(VariableNames.Vim.NormalMode),
      ...(manipulator.conditions ?? []),
    ],
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
      isNotActive(VariableNames.Vim.InnerSelection),
      isNotActive(VariableNames.Vim.OuterSelection),
      ...(manipulator.conditions ?? []),
    ],
  }))
}

function makeVimDeleteModeRules(
  rules: VimModeLayerRules,
  deleteAfterward = true,
): Manipulator[] {
  return makeVimModeManipulators(rules).map((manipulator) => ({
    ...manipulator,
    to: [
      ...(manipulator.to?.map((to) => ({
        ...to,
        modifiers: ['left_shift', ...(to.modifiers ?? [])],
      })) ?? []),
      ...(deleteAfterward
        ? [
            { key_code: 'x', modifiers: ['left_command'] } as To,
            deactivate(VariableNames.Vim.DeleteMode),
            activate(VariableNames.Vim.NormalMode),
          ]
        : []),
    ],
    conditions: [
      isActive(VariableNames.Vim.DeleteMode),
      ...(manipulator.conditions ?? []),
    ],
  }))
}

function makeVimYankModeRules(
  rules: VimModeLayerRules,
  yankAfterward = true,
): Manipulator[] {
  return makeVimModeManipulators(rules).map((manipulator) => ({
    ...manipulator,
    to: [
      ...(manipulator.to?.map((to) => ({
        ...to,
        modifiers: ['left_shift', ...(to.modifiers ?? [])],
      })) ?? []),
      ...(yankAfterward
        ? [
            { key_code: 'c', modifiers: ['left_command'] } as To,
            { key_code: 'left_arrow' } as To,
            deactivate(VariableNames.Vim.YankMode),
            activate(VariableNames.Vim.NormalMode),
          ]
        : []),
    ],
    conditions: [
      isActive(VariableNames.Vim.YankMode),
      ...(manipulator.conditions ?? []),
    ],
  }))
}

function makeVimChangeModeRules(
  rules: VimModeLayerRules,
  changeAfterward = true,
): Manipulator[] {
  return makeVimModeManipulators(rules).map((manipulator) => ({
    ...manipulator,
    to: [
      ...(manipulator.to?.map((to) => ({
        ...to,
        modifiers: ['left_shift', ...(to.modifiers ?? [])],
      })) ?? []),
      ...(changeAfterward
        ? [
            { key_code: 'x', modifiers: ['left_command'] } as To,
            deactivate(VariableNames.Vim.ChangeMode),
            deactivate(VariableNames.Vim.NormalMode),
            notifyAboutInsertMode,
          ]
        : []),
    ],
    conditions: [
      isActive(VariableNames.Vim.ChangeMode),
      ...(manipulator.conditions ?? []),
    ],
  }))
}

// Abstracted selection API for inner/outer word operations
function createSelectionModeRules(
  baseMode: string,
  baseModeVariable: VariableName,
  actionAfterSelection: To[],
  cleanupActions: To[] = [],
): Manipulator[] {
  return [
    // Activate inner selection mode
    {
      type: 'basic',
      description: `Activate inner selection in ${baseMode}`,
      from: { key_code: 'i' },
      conditions: [
        isActive(baseModeVariable),
        isNotActive(VariableNames.Vim.InnerSelection),
        isNotActive(VariableNames.Vim.OuterSelection),
        notInAppWithNativeVim,
      ],
      to: [activate(VariableNames.Vim.InnerSelection)],
    },
    // Activate outer selection mode
    {
      type: 'basic',
      description: `Activate outer selection in ${baseMode}`,
      from: { key_code: 'a' },
      conditions: [
        isActive(baseModeVariable),
        isNotActive(VariableNames.Vim.InnerSelection),
        isNotActive(VariableNames.Vim.OuterSelection),
        notInAppWithNativeVim,
      ],
      to: [activate(VariableNames.Vim.OuterSelection)],
    },
    // Inner word selection (e.g., yiw, diw, ciw)
    {
      type: 'basic',
      description: `${baseMode} inner word`,
      from: { key_code: 'w' },
      conditions: [
        isActive(baseModeVariable),
        isActive(VariableNames.Vim.InnerSelection),
        notInAppWithNativeVim,
      ],
      to: [
        // Select the current word (inner word)
        { key_code: 'left_arrow', modifiers: ['option'] },
        { key_code: 'right_arrow', modifiers: ['option', 'left_shift'] },
        ...actionAfterSelection,
        deactivate(baseModeVariable),
        deactivate(VariableNames.Vim.InnerSelection),
        ...cleanupActions,
      ],
    },
    // Outer word selection (e.g., yaw, daw, caw)
    {
      type: 'basic',
      description: `${baseMode} a word`,
      from: { key_code: 'w' },
      conditions: [
        isActive(baseModeVariable),
        isActive(VariableNames.Vim.OuterSelection),
        notInAppWithNativeVim,
      ],
      to: [
        // Select the current word including trailing whitespace
        { key_code: 'left_arrow', modifiers: ['option'] },
        { key_code: 'right_arrow', modifiers: ['option', 'left_shift'] },
        { key_code: 'right_arrow', modifiers: ['left_shift'] }, // Include trailing space
        ...actionAfterSelection,
        deactivate(baseModeVariable),
        deactivate(VariableNames.Vim.OuterSelection),
        ...cleanupActions,
      ],
    },
  ]
}
