import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams
  const t = await getTranslations('Auth')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('errorTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        {params?.error ? (
          <p className="text-sm text-muted-foreground">{t('errorCode', { error: params.error })}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{t('errorUnspecified')}</p>
        )}
      </CardContent>
    </Card>
  )
}
