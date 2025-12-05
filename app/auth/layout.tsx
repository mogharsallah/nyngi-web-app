import { getTranslations } from 'next-intl/server'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Common')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      {/* Minimal branding header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('appName')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('tagline')}</p>
      </div>

      {/* Centered card layout - full-width mobile, max-w-md desktop */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
