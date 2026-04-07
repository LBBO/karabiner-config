import { privateChatDeepLinks } from './secrets'
import { app, deeplink, HyperKeyLayers } from './utils'

export const privateRules: HyperKeyLayers = {
  // o = "Open" applications
  o: {
    // *3*D modeling
    3: app('FreeCAD'),
    // Used to be *A*rc
    a: app('Zen Browser'),
    c: app('Cursor'),
    // *m*arkdown
    n: app('Notion'),
    // p: app('PyCharm'),
    p: app('Preview'),
  },

  // c = "Chat"
  c: {
    d: app('Legcord'),
    f: app('FaceTime'),
    m: app('Mail'),
    s: app('Signal'),
    t: app('Telegram'),
    w: app('WhatsApp'),
    z: app('zoom.us'),

    ...privateChatDeepLinks,
  },
}
