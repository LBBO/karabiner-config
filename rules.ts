import fs from 'fs'
import { KarabinerRules } from './types'
import {
  app,
  createHyperSubLayers,
  deeplink,
  HyperKeyLayers,
  shell,
  switchToLanguage,
} from './utils'
import { workRules } from './workRules'
import { privateRules } from './privateRules'
import { vimModeRules } from './vimModeRules'
import { hyperKeyRules } from './hyperKeyRules'
import { VariableNames } from './variables'
import { activate } from './variables'
import { notifyAboutNormalMode } from './notifications'

const commonLayers: HyperKeyLayers = {
  // spacebar: deeplink(
  //   "raycast://extensions/stellate/mxstbr-commands/create-notion-todo"
  // ),
  // b = "B"rowse
  b: {},

  // o = "Open" applications
  o: {
    b: app('Bruno'),
    f: app('Finder'),
    i: app('IntelliJ IDEA Ultimate'),
    // *l*iterature
    l: app('Zotero'),
    // *m*arkdown
    m: app('Obsidian'),
    // *s*hell
    s: app('Ghostty'),
    t: app('TickTick'),
    // M*u*sic
    u: app('Spotify'),
    v: app('Visual Studio Code'),
    w: app('Webstorm'),
    x: app('XCode'),
    z: app('Zed'),
  },

  // n = "New"
  n: {
    c: deeplink('raycast://extensions/degouville/cursor-recent-projects/index'),
    t: {
      to: [
        // This shortcut is set in TickTick because the default
        // doesn't seem to work anymore.
        {
          key_code: 'a',
          modifiers: ['shift', 'control', 'command', 'option'],
        },
      ],
    },
    v: deeplink('raycast://extensions/thomas/visual-studio-code/index'),
    z: deeplink('raycast://extensions/ewgenius/zed-recent-projects/search'),
  },

  // u = "University"
  u: {},

  // l = "Language"
  l: {
    c: switchToLanguage('zh'),
    d: switchToLanguage('de'),
    e: switchToLanguage('en'),
    g: switchToLanguage('de'),
    z: switchToLanguage('zh'),
  },

  // f = "Focus"
  f: {
    a: shell`shortcuts run "Activate Apple Intelligence Focus"`,
    // *C*lear
    c: shell`shortcuts run "Turn off Focus"`,
    d: shell`shortcuts run "Activate Do Not Disturb Focus"`,
    // *O*ff
    o: shell`shortcuts run "Turn off Focus"`,
    p: shell`shortcuts run "Activate Personal Focus"`,
    s: shell`shortcuts run "Activate Sleep Focus"`,
    t: shell`shortcuts run "Activate Tutorial Focus"`,
    u: shell`shortcuts run "Activate Uni Focus"`,
    w: shell`shortcuts run "Activate Work Focus"`,
  },

  // s = "System"
  s: {
    c: deeplink('raycast://extensions/raycast/system/open-camera'),
    m: deeplink(
      'raycast://extensions/Quentin23Soleil/mute-microphone/toggle-mute',
    ),
    // *A*ll *A*pps
    a: app('Mission Control'),
    u: {
      to: [
        {
          key_code: 'volume_increment',
        },
      ],
    },
    j: {
      to: [
        {
          key_code: 'volume_decrement',
        },
      ],
    },
    i: {
      to: [
        {
          key_code: 'display_brightness_increment',
        },
      ],
    },
    k: {
      to: [
        {
          key_code: 'display_brightness_decrement',
        },
      ],
    },
    // l = "Lock"
    l: {
      to: [
        {
          key_code: 'q',
          modifiers: ['right_control', 'right_command'],
        },
      ],
    },
    semicolon: {
      to: [
        {
          key_code: 'fastforward',
        },
      ],
    },
  },

  // v = "moVe" which isn't "m" because we want it to be on the left hand
  // so that hjkl work like they do in vim
  v: {
    to: [activate(VariableNames.Vim.NormalMode), notifyAboutNormalMode],
  },

  // m = "Music" or "Mouse"
  m: {
    // *M*ouse *C*lick
    c: {
      to: [
        {
          pointing_button: 'button1',
        },
      ],
    },
    b: {
      to: [{ key_code: 'rewind' }],
    },
    n: {
      to: [{ key_code: 'fastforward' }],
    },
    p: {
      to: [{ key_code: 'play_or_pause' }],
    },
  },

  // r = "Raycast"
  r: {
    a: deeplink('raycast://extensions/raycast/raycast-ai/ai-chat'),
    e: deeplink(
      'raycast://extensions/raycast/emoji-symbols/search-emoji-symbols',
    ),
    f: deeplink('raycast://extensions/raycast/file-search/search-files'),
    g: deeplink('raycast://extensions/josephschmitt/gif-search/search'),
    h: deeplink(
      'raycast://extensions/raycast/clipboard-history/clipboard-history',
    ),
    m: deeplink('raycast://extensions/raycast/navigation/search-menu-items'),
    n: deeplink('raycast://extensions/raycast/raycast-notes/raycast-notes'),
    p: deeplink('raycast://extensions/raycast/raycast/confetti'),
    t: deeplink('raycast://extensions/raycast/translator/translate'),
    // 1: deeplink(
    //   "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1"
    // ),
    // 2: deeplink(
    //   "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2"
    // ),
  },

  // w = "Window management"
  w: {
    // these mimic vim motions
    h: deeplink('raycast://extensions/raycast/window-management/left-half'),
    j: deeplink('raycast://extensions/raycast/window-management/bottom-half'),
    k: deeplink('raycast://extensions/raycast/window-management/top-half'),
    l: deeplink('raycast://extensions/raycast/window-management/right-half'),

    m: deeplink('raycast://extensions/raycast/window-management/maximize'),
    r: deeplink('raycast://extensions/raycast/window-management/restore'),
    f: deeplink(
      'raycast://extensions/raycast/window-management/toggle-fullscreen',
    ),
    p: deeplink(
      'raycast://extensions/raycast/window-management/previous-display',
    ),
    n: deeplink('raycast://extensions/raycast/window-management/next-display'),
  },
}

const mergeSublayers = (
  base: HyperKeyLayers,
  newLayers: HyperKeyLayers,
): HyperKeyLayers =>
  Object.entries(newLayers).reduce((acc, [key, subLayer]): HyperKeyLayers => {
    return { ...acc, [key]: { ...(base[key] ?? {}), ...subLayer } }
  }, {})

const rules: KarabinerRules[] = [
  ...hyperKeyRules,
  ...vimModeRules,
  ...createHyperSubLayers({
    ...commonLayers,
    ...mergeSublayers(commonLayers, privateRules),
    // ...mergeSublayers(commonLayers, workRules),
  }),
]

fs.writeFileSync(
  'karabiner.json',
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: 'Default',
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2,
  ),
)
