import { workChatDeepLinks } from './secrets'
import { app, deeplink, HyperKeyLayers } from './utils'

export const workRules: HyperKeyLayers = {
  // o = "Open" applications
  o: {
    a: app('Zen'),
    c: deeplink('raycast://extensions/raycast/script-commands/open-google-calendar-in-zen'),
    e: app('Microsoft Excel'),
    l: app('Logseq'),
    // *P*laywright is the only Chromium I run at work
    p: app('Chromium'),
    w: app('IntelliJ IDEA'),
  },

  // c = "Chat"
  c: {
    s: app('Slack'),
    m: deeplink('raycast://extensions/raycast/script-commands/open-work-gmail-zen'),
    // *V*ideo chat
    v: deeplink('raycast://extensions/vitoorgomes/google-meet/default-profile'),

    ...workChatDeepLinks,
  },

  // j = "Jira"
  j: {
    // *F*ind
    f: deeplink('raycast://extensions/raycast/jira/search-issues'),
  },
}
