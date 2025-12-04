import { routing } from '@/i18n/routing'
import { createClient } from '@/server/lib/supabase/server'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  let locale = routing.defaultLocale

  if (hasLocale(routing.locales, requested)) {
    locale = requested
  } else {
    // Get signed user preferred locale from user metadata
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const preferredLocale = user?.user_metadata?.locale

      if (hasLocale(routing.locales, preferredLocale)) {
        locale = preferredLocale
      }
    } catch {
      // Fall back to default locale if user is not authenticated or error occurs
    }
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})
