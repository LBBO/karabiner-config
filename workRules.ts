import { workSlackDeepLinks } from './secrets'
import { app, deeplink, HyperKeyLayers } from './utils'

export const workRules: HyperKeyLayers = {
  // o = "Open" applications
  o: {
    a: app('Arc'),
    e: app('Microsoft Excel'),
    l: app('Logseq'),
    // *P*laywright is the only Chromium I run at work
    p: app('Chromium'),
    w: app('IntelliJ IDEA Ultimate'),
  },

  // c = "Chat"
  c: {
    s: app('Slack'),
    m: deeplink('raycast://script-commands/open-work-gmail'),
    // *V*ideo chat
    v: deeplink('raycast://extensions/vitoorgomes/google-meet/default-profile'),

    ...workSlackDeepLinks,
  },

  // j = "Jira"
  j: {
    // *F*ind
    f: deeplink('raycast://extensions/raycast/jira/search-issues'),
  },
}
