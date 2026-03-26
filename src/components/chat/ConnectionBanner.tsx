export default function ConnectionBanner({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="border-b border-zinc-200 bg-zinc-100 px-4 py-2 text-xs text-zinc-700">
      服务器连接失败，请稍后重试（当前只读）
    </div>
  )
}

