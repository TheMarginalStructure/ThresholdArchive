import { useState, useEffect, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import Footer from '../sections/Footer'
import { MONO } from '../utils/fonts'

interface PageLayoutProps {
  children: ReactNode
  breadcrumbs: { label: string; to?: string }[]
  title: string
  subtitle: string
  showBackButton?: boolean
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 查找实际的滚动容器
    const container = document.querySelector('.custom-scrollbar') || document.documentElement

    const handleScroll = () => {
      const scrollTop = container instanceof HTMLElement ? container.scrollTop : window.scrollY
      setVisible(scrollTop > 400)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    // 初始检查
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    const container = document.querySelector('.custom-scrollbar')
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-[#d4a373]/40 bg-[#0a0a0a]/90 backdrop-blur text-[#d4a373] hover:bg-[#d4a373]/10 transition-all duration-200"
      data-cursor-hover
      title="返回顶部"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}

interface PageLayoutProps {
  children: ReactNode
  breadcrumbs: { label: string; to?: string }[]
  title: string
  subtitle: string
  showBackButton?: boolean
}

export default function PageLayout({ children, breadcrumbs, showBackButton }: PageLayoutProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    const referrer = document.referrer
    if (referrer && referrer.includes(window.location.hostname)) {
      window.history.back()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a]">
      <div className="pt-16 pb-24">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-8">
          <div
            className="flex items-center gap-3 text-xs tracking-widest uppercase"
            style={{ fontFamily: MONO }}
          >
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-[#888888] hover:text-[#f0f0f0] transition-colors border border-white/10 px-2 py-1 hover:border-[#d4a373]/40"
                data-cursor-hover
              >
                <span className="text-[10px]">←</span>
                <span className="text-[10px]">BACK</span>
              </button>
            )}
            <Link to="/" className="text-[#888888] hover:text-[#f0f0f0] transition-colors">TMS</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-[#666666]">/</span>
                {crumb.to ? (
                  <Link to={crumb.to} className="text-[#888888] hover:text-[#f0f0f0] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#d4a373]">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        {children}
      </div>

      <Footer />

      <ScrollToTopButton />
    </div>
  )
}
