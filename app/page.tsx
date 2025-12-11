import { getTranslations } from 'next-intl/server'
export default async function Home() {
  const t = await getTranslations('HomePage')
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>{t('title')}</h1>
    </div>
  )
}
