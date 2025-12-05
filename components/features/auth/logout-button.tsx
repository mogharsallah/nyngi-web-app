'use client'

import { createClient } from '@/components/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const t = useTranslations('Auth')

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return <Button onClick={logout}>{t('logout')}</Button>
}
