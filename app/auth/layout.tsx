import { getTranslations } from 'next-intl/server'
import { Card, CardContent } from '@/components/ui/card'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations('Common')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      {/* Minimal branding header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('appName')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('tagline')}</p>
      </div>

      {/* Centered card layout - full-width mobile, max-w-md desktop */}
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">{children}</CardContent>
      </Card>
    </div>
  )
}
