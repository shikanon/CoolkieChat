import { type ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, Users, Shield, Sparkles, Fingerprint, Heart } from 'lucide-react'
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
    const ok = window.confirm('确认销毁本地痕迹？这不会影响服务器端数据。')
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
    <div className="min-h-dvh bg-gradient-to-br from-sky-50 via-white to-rose-50 text-slate-800 selection:bg-rose-100 selection:text-rose-900">
      {/* Soft background glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-sky-200/40 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-rose-200/40 blur-[120px]" />
      </div>

      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src="/logo.jpg" 
              alt="CoolkieChat" 
              className="h-20 w-20 rounded-2xl shadow-lg shadow-rose-200/50 object-cover"
            />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-slate-800 mb-2">
            Coolkie<span className="font-bold bg-gradient-to-r from-sky-500 to-rose-500 bg-clip-text text-transparent">Chat</span>
          </h1>
          <p className="text-slate-500 text-sm font-light">
            嘘... 这是我们专属的小世界。
          </p>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-200" />
            <span className="text-[11px] text-slate-400 font-medium">
              In memory of Coolkie
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <Field
              icon={<User className="h-4 w-4" />}
              label="你的称呼"
              placeholder="你想让对方看到的称谓"
              value={selfName}
              onChange={setSelfName}
              autoFocus
            />
            <Field
              icon={<Users className="h-4 w-4" />}
              label="对方称呼"
              placeholder="对方在频道中使用的称谓"
              value={peerName}
              onChange={setPeerName}
            />
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] uppercase tracking-wider font-medium text-slate-500">
                  专属暗号
                </label>
                <button
                  type="button"
                  className="text-[10px] uppercase tracking-wider text-slate-400 hover:text-rose-500 transition-colors"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? '隐藏' : '显示'}
                </button>
              </div>
              <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 py-3.5 transition-all focus-within:border-rose-300 focus-within:shadow-[0_0_0_4px_rgba(251,207,232,0.3)] focus-within:bg-white">
                <div className="text-slate-400 group-focus-within:text-rose-400 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  type={showPass ? 'text' : 'password'}
                  className="w-full bg-transparent text-sm font-light outline-none placeholder:text-slate-300"
                  placeholder="设置 2-20 位唯一暗号"
                />
              </div>
              <p className={cn('px-1 text-[10px] font-light transition-colors', passOk ? 'text-slate-400' : 'text-rose-500')}>
                {passOk ? '需与对方保持完全一致方可连通' : '暗号长度需为 2-20 位'}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              className={cn(
                'group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-rose-500 text-[16px] font-semibold text-white shadow-lg shadow-rose-200/50 transition-all hover:shadow-xl hover:shadow-rose-300/50 hover:scale-[1.01] active:scale-[0.98]',
                !canJoin && 'cursor-not-allowed grayscale opacity-40'
              )}
              disabled={!canJoin}
              onClick={join}
            >
              <span className="relative z-10 flex items-center gap-2">
                建立连接
                <Fingerprint className="h-5 w-5 opacity-90 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>

            {error ? <p className="text-center text-xs text-rose-500 font-light">{error}</p> : null}

            <button 
              className="w-full py-2 text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors font-medium" 
              onClick={clearLocal}
            >
              销毁本地痕迹
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4">
          <Feature 
            icon={<Shield className="h-3.5 w-3.5" />}
            title="阅后即焚"
            desc="所有消息仅存储在浏览器，刷新即逝"
          />
          <Feature 
            icon={<Lock className="h-3.5 w-3.5" />}
            title="端到端"
            desc="暗号作为唯一密钥，加密所有通信"
          />
        </div>

        <footer className="mt-12 text-center space-y-4">
          <button 
            onClick={() => nav('/birthday')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-500 text-[10px] font-bold uppercase tracking-widest hover:bg-pink-100 transition-all border border-pink-100"
          >
            <Sparkles size={12} />
            进入生日专属空间
            <Sparkles size={12} />
          </button>
          <p className="text-[10px] text-slate-400 font-light leading-relaxed">
            不被定义，不留痕迹。专为温柔的秘密而生。<br />
            CoolkieChat &copy; 2026
          </p>
        </footer>
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
    <div className="space-y-1.5">
      <label className="px-1 text-[11px] uppercase tracking-wider font-medium text-slate-500">
        {label}
      </label>
      <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 py-3.5 transition-all focus-within:border-sky-300 focus-within:shadow-[0_0_0_4px_rgba(186,230,253,0.4)] focus-within:bg-white">
        <div className="text-slate-400 group-focus-within:text-sky-500 transition-colors">
          {icon}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-light outline-none placeholder:text-slate-300"
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      </div>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="text-rose-400">{icon}</div>
        <h3 className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">{title}</h3>
      </div>
      <p className="text-[10px] text-slate-500 font-light leading-snug">{desc}</p>
    </div>
  )
}
