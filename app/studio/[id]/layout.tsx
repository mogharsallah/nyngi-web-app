import { StudioStoreProvider } from '@/components/providers'
import { StudioLayout } from '@/components/shared'

export default async function StudioRouteLayout({ chat, canvas, params }: { chat: React.ReactNode; canvas: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <StudioStoreProvider initialState={{ currentSessionId: id }}>
      <StudioLayout chatPanel={chat} canvasPanel={canvas} />
    </StudioStoreProvider>
  )
}
