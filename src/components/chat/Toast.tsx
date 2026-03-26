export default function Toast({ text }: { text: string }) {
  if (!text) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[70] flex justify-center animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 px-5 py-2.5 text-xs text-slate-700 shadow-xl shadow-slate-200/60 tracking-wide font-light">
        {text}
      </div>
    </div>
  )
}
