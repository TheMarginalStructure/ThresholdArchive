import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { MONO, BODY } from '../utils/fonts'

interface CMSLayoutProps {
  children: ReactNode
}

const NAV_ITEMS = [
  { path: '/admin', label: '控制台' },
  { path: '/admin/archives', label: '档案管理' },
  { path: '/admin/news', label: '新闻管理' },
  { path: '/admin/equipment', label: '装备管理' },
  { path: '/admin/reviews', label: '评价管理' },
  { path: '/admin/announcements', label: '系统公告' },
]

export default function CMSLayout({ children }: CMSLayoutProps) {
  const location = useLocation()

  return (
    <div className="fixed inset-0 flex bg-[#0a0a0a] text-[#f0f0f0]" style={{ fontFamily: BODY }}>
      <aside className="w-56 flex-shrink-0 border-r border-white/[0.06] bg-[#0c0c0c] flex flex-col">
        <Link to="/admin" className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
          <img src="/assets/favicon.png" alt="ThresholdArchive" className="w-7 h-7 rounded-sm" />
          <div>
            <div className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: MONO, color: '#f0f0f0' }}>
              CMS
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: '#555555' }}>
              管理后台
            </div>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded text-xs transition-all duration-150"
                style={{
                  fontFamily: MONO,
                  color: isActive ? '#f0f0f0' : '#666666',
                  background: isActive ? 'rgba(230,0,18,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #e60012' : '2px solid transparent',
                  marginLeft: isActive ? '0' : '2px',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#aaaaaa'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#666666'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span className="text-xs opacity-60">{item.label.slice(0, 1)}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-5 py-4 border-t border-white/[0.06]">
          <Link
            to="/"
            target="_blank"
            className="text-[10px] tracking-widest uppercase hover:text-[#d4a373] transition-colors"
            style={{ fontFamily: MONO, color: '#555555' }}
          >
            返回前台
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 overflow-y-auto custom-scrollbar" style={{ fontFamily: BODY }}>
        {children}
      </main>
    </div>
  )
}