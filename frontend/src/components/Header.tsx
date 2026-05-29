import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router'
import { MONO } from '../utils/fonts'

const DEPARTMENTS = [
  { id: 'field', name: '外勤行动部', code: 'DEPT-20', color: '#e60012' },
  { id: 'research', name: '档案与研究部', code: 'DEPT-10', color: '#60a5fa' },
  { id: 'medical', name: '医疗与心理部', code: 'DEPT-30', color: '#4ade80' },
  { id: 'security', name: '安全与防护部', code: 'DEPT-40', color: '#facc15' },
  { id: 'logistics', name: '后勤与架构部', code: 'DEPT-50', color: '#d4a373' },
]

export default function Header() {
  const [onlineCount, setOnlineCount] = useState(8104231)
  const [latency, setLatency] = useState(0.042)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 10 - 3))
      setLatency(Number((0.035 + Math.random() * 0.02).toFixed(3)))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-[#0a0a0a] border-b border-white/5 h-10 flex items-center px-4">
      <div
        className="flex items-center gap-6 text-xs text-[#888888] whitespace-nowrap flex-1 min-w-0"
        style={{ fontFamily: MONO, letterSpacing: '-0.02em' }}
      >
        <span className="text-[#f0f0f0] font-medium flex-shrink-0">THE MARGINAL STRUCTURE</span>
        <span className="text-[#666666] flex-shrink-0">/</span>
        <span className="flex-shrink-0">v2026.05.6</span>
        <span className="text-[#666666] flex-shrink-0">|</span>
        <span className="flex-shrink-0">当前活跃 {onlineCount.toLocaleString()} 人</span>
        <span className="text-[#666666] flex-shrink-0">|</span>
        <span className="flex-shrink-0">系统响应 {latency} 秒</span>
        <span className="text-[#666666] flex-shrink-0">|</span>
        <span className="flex-shrink-0">
          系统状态{' '}
          <span className="text-[#e60012] animate-pulse">UNSTABLE</span>
        </span>
      </div>

      {/* Department Dropdown */}
      <div className="relative flex-shrink-0 ml-4" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 text-xs text-[#888888] hover:text-[#f0f0f0] transition-colors px-2 py-1"
          style={{ fontFamily: MONO }}
        >
          <span>部门入口</span>
          <svg
            className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-[#0a0a0a] border border-white/10 shadow-xl z-[100] min-w-[220px]">
            <div className="py-1">
              <div className="px-3 py-2 text-[10px] text-[#666666] uppercase tracking-widest border-b border-white/5" style={{ fontFamily: MONO }}>
                选择部门
              </div>
              {DEPARTMENTS.map((dept) => (
                <Link
                  key={dept.id}
                  to={`/dept/${dept.id}`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dept.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-[#f0f0f0]">{dept.name}</span>
                    <span className="text-[10px] text-[#666666]" style={{ fontFamily: MONO }}>
                      {dept.code}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
