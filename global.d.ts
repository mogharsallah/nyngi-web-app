import type messages from './messages/en.json'
import type { routing } from './i18n/routing'

type Messages = typeof messages
type Locale = (typeof routing.locales)[number]

declare module 'use-intl' {
  interface AppConfig {
    Locale: Locale
    Messages: Messages
  }
}
