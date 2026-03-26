export default function Toast({ text }: { text: string }) {
  if (!text) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center">
      <div className="rounded-full bg-zinc-900 px-4 py-2 text-xs text-white shadow">{text}</div>
    </div>
  )
}

