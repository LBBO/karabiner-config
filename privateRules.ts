import { privateChatDeepLinks, telegramUsernames } from './secrets'
import { app, deeplink, HyperKeyLayers } from './utils'

export const privateRules: HyperKeyLayers = {
  // o = "Open" applications
  o: {
    // Used to be *A*rc
    a: app('Zen Browser'),
    c: app('Cursor'),
    // *m*arkdown
    n: app('Notion'),
    p: app('PyCharm Professional Edition'),
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

    // Individual people
    o: deeplink(`tg://resolve?domain=@${telegramUsernames.o}`),
    y: deeplink(`tg://resolve?domain=@${telegramUsernames.y}`),

    ...privateChatDeepLinks,
  },

  // b = "Browser"
  b: {
    a: app('Arc'),
  },
}
