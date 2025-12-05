import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('Auth')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('signUpSuccessTitle')}</CardTitle>
        <CardDescription>{t('signUpSuccessDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{t('signUpSuccessMessage')}</p>
      </CardContent>
    </Card>
  )
}
