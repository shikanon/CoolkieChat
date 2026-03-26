import { type ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type JoinInfo = {
  selfName: string
  peerName: string
  passphrase: string
}

function loadLastJoin(): JoinInfo {
  try {
    const raw = sessionStorage.getItem('im:lastJoin')
    if (!raw) return { selfName: '', peerName: '', passphrase: '' }
    const parsed = JSON.parse(raw) as JoinInfo
    return {
      selfName: typeof parsed?.selfName === 'string' ? parsed.selfName : '',
      peerName: typeof parsed?.peerName === 'string' ? parsed.peerName : '',
      passphrase: typeof parsed?.passphrase === 'string' ? parsed.passphrase : '',
    }
  } catch {
    return { selfName: '', peerName: '', passphrase: '' }
  }
}

export default function Home() {
  const nav = useNavigate()
  const last = useMemo(() => loadLastJoin(), [])
  const [selfName, setSelfName] = useState(last.selfName)
  const [peerName, setPeerName] = useState(last.peerName)
  const [passphrase, setPassphrase] = useState(last.passphrase)
  const [showPass, setShowPass] = useState(true)
  const [error, setError] = useState('')

  const passOk = passphrase.length >= 2 && passphrase.length <= 20
  const canJoin = Boolean(selfName) && Boolean(peerName) && passOk

  const join = () => {
    if (!canJoin) return
    const info: JoinInfo = { selfName, peerName, passphrase }
    try {
      sessionStorage.setItem('im:lastJoin', JSON.stringify(info))
    } catch {
      return
    }
    setError('')
    nav('/chat')
  }

  const clearLocal = () => {
    const ok = window.confirm('确认清空本地缓存？这不会影响服务器端数据。')
    if (!ok) return
    try {
      sessionStorage.removeItem('im:lastJoin')
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith('im:cache:')) localStorage.removeItem(k)
      }
    } catch {
      return
    }
    setSelfName('')
    setPeerName('')
    setPassphrase('')
    setError('')
  }

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="text-base font-semibold">专属通道</div>
            <div className="mt-1 text-xs text-zinc-500">名字 + 对方名字 + 暗号，建立唯一双人聊天</div>
          </div>

          <div className="mt-6 space-y-3">
            <Field
              icon={<User className="h-4 w-4" />}
              label="自身名字"
              placeholder="输入你想让对方看到的名字"
              value={selfName}
              onChange={setSelfName}
              autoFocus
            />
            <Field
              icon={<Users className="h-4 w-4" />}
              label="对方名字"
              placeholder="输入对方的名字（需与对方一致）"
              value={peerName}
              onChange={setPeerName}
            />
            <div>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-xs font-medium text-zinc-700">专属暗号</div>
                <button
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPass ? '隐藏' : '显示'}
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-zinc-400">
                <div className="text-zinc-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  type={showPass ? 'text' : 'password'}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="设置2-20位暗号，与对方保持一致"
                />
              </div>
              <div className={cn('mt-1 text-xs', passOk ? 'text-zinc-500' : 'text-rose-600')}>
                {passOk ? '暗号区分大小写与空格' : '暗号长度需为2-20位'}
              </div>
            </div>
          </div>

          {error ? <div className="mt-4 text-center text-xs text-rose-600">{error}</div> : null}

          <button
            className={cn(
              'mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800',
              !canJoin && 'cursor-not-allowed opacity-40',
            )}
            disabled={!canJoin}
            onClick={join}
          >
            建立通道
          </button>

          <button className="mt-3 w-full rounded-xl px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-100" onClick={clearLocal}>
            清空本地缓存
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-zinc-500">
          不提供好友列表、搜索与推送，尽量减少操作痕迹
        </div>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  autoFocus,
}: {
  icon: ReactNode
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  autoFocus?: boolean
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-zinc-700">{label}</div>
      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-zinc-400">
        <div className="text-zinc-500">{icon}</div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      </div>
    </div>
  )
}
