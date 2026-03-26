export default function ConnectionBanner({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="border-b border-rose-200/50 bg-rose-50/80 backdrop-blur-sm px-4 py-2 text-[11px] text-rose-600 font-light text-center">
      通信链路已断开，正在尝试重新连接...
    </div>
  )
}
