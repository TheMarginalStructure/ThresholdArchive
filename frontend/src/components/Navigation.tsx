import { useState, useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router'
import Logo from './Logo'
import { ARCHIVE_CATEGORIES } from '../data'
import { MONO, BODY } from '../utils/fonts'

const NAV_ITEMS = [
  { label: '首页', to: '/' },
  { label: '档案库', to: '/archives', hasDropdown: true },
  { label: '事件通报', to: '/incidents' },
  { label: '任务中心', to: '/operations' },
  { label: '物资管理', to: '/equipment' },
  { label: '人员评价', to: '/personnel' },
  { label: '最新通报', to: '/news' },
  { label: '关于组织', to: '/about' },
  { label: '联络终端', to: '/contact' },
]

export default function Navigation() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setDropdownOpen(true)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-cursor-hover onClick={() => setMobileOpen(false)}>
            <Logo />
            <span
              className="text-[#f0f0f0] text-sm font-medium tracking-wide"
              style={{ fontFamily: BODY }}
            >
              边际结构
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => {
                  setHovered(i)
                  if (item.hasDropdown) handleDropdownEnter()
                }}
                onMouseLeave={() => {
                  setHovered(null)
                  if (item.hasDropdown) handleDropdownLeave()
                }}
              >
                <Link
                  to={item.to}
                  className={`relative text-sm transition-colors duration-300 ${
                    isActive(item.to)
                      ? 'text-[#d4a373]'
                      : 'text-[#888888] hover:text-[#f0f0f0]'
                  }`}
                  data-cursor-hover
                >
                  {item.label}
                  <span
                    className="absolute -bottom-1 left-0 h-[1px] bg-[#e60012] transition-all duration-300"
                    style={{
                      width: hovered === i || isActive(item.to) ? '100%' : '0%',
                    }}
                  />
                </Link>

                {/* Archive Type Dropdown */}
                {item.hasDropdown && dropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 py-2 min-w-[220px]"
                    style={{
                      background: 'rgba(10, 10, 10, 0.98)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(12px)',
                      animation: 'dropdownIn 0.15s ease-out',
                    }}
                  >
                    <div className="px-3 py-1.5 text-[10px] text-[#666666] uppercase tracking-widest border-b border-white/5 mb-1">
                      档案类型
                    </div>
                    {ARCHIVE_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.code}
                        to={`/archives/${cat.code.toLowerCase()}`}
                        className="flex items-center justify-between px-3 py-2 text-xs text-[#888888] hover:text-[#d4a373] hover:bg-[#d4a373]/5 transition-colors"
                        data-cursor-hover
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>{cat.category}</span>
                        <span
                          className="text-[10px] text-[#666666]"
                          style={{ fontFamily: MONO }}
                        >
                          {cat.code}
                        </span>
                      </Link>
                    ))}
                    <div className="mt-1 pt-1 border-t border-white/5">
                      <Link
                        to="/archives"
                        className="flex items-center px-3 py-2 text-xs text-[#d4a373] hover:bg-[#d4a373]/5 transition-colors"
                        data-cursor-hover
                        onClick={() => setDropdownOpen(false)}
                      >
                        查看全部档案 →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-[#f0f0f0] p-2 z-[60]"
            data-cursor-hover
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-[55] bg-[#0a0a0a]/95 backdrop-blur-lg transition-all duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 pt-14">
          {NAV_ITEMS.map((item) => (
            <div key={item.to} className="flex flex-col items-center gap-2">
              <Link
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`text-2xl transition-colors duration-300 ${
                  isActive(item.to)
                    ? 'text-[#d4a373]'
                    : 'text-[#f0f0f0]'
                }`}
                style={{ fontFamily: BODY }}
              >
                {item.label}
              </Link>
              {item.hasDropdown && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {ARCHIVE_CATEGORIES.slice(0, 5).map((cat) => (
                    <Link
                      key={cat.code}
                      to={`/archives/${cat.code.toLowerCase()}`}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs text-[#888888] hover:text-[#d4a373] transition-colors px-2 py-1 border border-white/10"
                      data-cursor-hover
                    >
                      {cat.category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div
            className="absolute bottom-8 text-[10px] text-[#888888] tracking-widest uppercase"
            style={{ fontFamily: MONO }}
          >
            THE MARGINAL STRUCTURE / v2026.5.6
          </div>
        </div>
      </div>
    </>
  )
}
