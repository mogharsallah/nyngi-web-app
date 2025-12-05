import { getTranslations } from 'next-intl/server'

export default async function OrdersPage() {
  const t = await getTranslations('Orders')
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <p className="text-muted-foreground">{t('empty')}</p>
    </div>
  )
}
