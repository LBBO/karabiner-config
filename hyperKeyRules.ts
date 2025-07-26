import { KarabinerRules, Manipulator, modifiersKeys } from './types'
import { vimModeVariableName } from './vimModeRules'

const capsLockToHyperKey: Manipulator = {
  description: 'Caps Lock without right shift -> Hyper Key',
  from: {
    key_code: 'caps_lock',
    modifiers: {
      optional: modifiersKeys.filter(
        (key) => key !== 'any' && key !== 'right_shift' && key !== 'shift',
      ),
    },
  },
  conditions: [
    {
      type: 'variable_unless',
      name: vimModeVariableName,
      value: 1,
    },
  ],
  to: [
    {
      set_variable: {
        name: 'hyper',
        value: 1,
      },
    },
  ],
  to_after_key_up: [
    {
      set_variable: {
        name: 'hyper',
        value: 0,
      },
    },
  ],
  to_if_alone: [
    {
      key_code: 'escape',
    },
  ],
  type: 'basic',
}

export const hyperKeyRules: KarabinerRules[] = [
  {
    description: 'Hyper Key (⌃⌥⇧⌘)',
    manipulators: [
      capsLockToHyperKey,
      // {
      //   type: 'basic',
      //   description: 'Disable CMD + Tab to force Hyper Key usage',
      //   from: {
      //     key_code: 'tab',
      //     modifiers: {
      //       mandatory: ['left_command'],
      //     },
      //   },
      //   to: [
      //     {
      //       key_code: 'tab',
      //     },
      //   ],
      // },
    ],
  },
]
