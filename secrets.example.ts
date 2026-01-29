import {
  LayerCommand,
  slackChat,
  slackChannel,
  telegramChat,
  whatsappChat,
  signalChat,
  messagesChat,
} from './utils'

// Store deeplinks to various chats in this file.
// Since these contain personal information, the
// actual secrets.ts is gitignored and must be created by you.

export const workChatDeepLinks: Record<string, LayerCommand> = {
  // Slack chat with Alice
  a: slackChat('TABCD1234', 'U1234567890'),
  // Slack chat with the team
  t: slackChannel('TABCD1234', 'C0987654321'),
}

export const privateChatDeepLinks: Record<string, LayerCommand> = {
  // Telegram chat with Bob
  b: telegramChat('bob_telegram_username'),
  // Whatsapp chat with Charlie
  c: whatsappChat('+1234567890'),
  // Signal chat with David
  d: signalChat('+0987654321'),
  // iMessage chat with Eve
  e: messagesChat('eve@example.com'),
}
