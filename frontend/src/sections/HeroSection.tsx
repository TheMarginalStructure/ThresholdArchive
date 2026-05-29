import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import Lightbox from '../components/Lightbox'
import { MONO, BODY } from '../utils/fonts'
import { api, type ApiSystemAnnouncement } from '../lib/api'

const TYPE_LEVEL_MAP: Record<string, { level: string; color: string }> = {
  info: { level: 'INFO', color: '#888888' },
  warn: { level: 'WARN', color: '#e60012' },
  alert: { level: 'NEW', color: '#e60012' },
  maintenance: { level: 'WARN', color: '#e60012' },
}

export default function HeroSection() {
  const [logoOpen, setLogoOpen] = useState(false)
  const [announcements, setAnnouncements] = useState<ApiSystemAnnouncement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.announcements.list()
      .then((data) => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section id="hero" className="relative min-h-[calc(100dvh-96px)] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.35)' }}
      >
        <source src="/assets/hero-abyss.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-[#0a0a0a]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/80" />

      {/* Main content: intro + log as a single centered block */}
      <div className="relative z-10 min-h-[calc(100dvh-96px)] flex items-center justify-center px-6 py-24 lg:py-0">
        <div className="w-full max-w-[1400px] flex flex-col lg:flex-row items-start gap-8 lg:gap-16">

          {/* Top info bar */}
          <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-full max-w-[1400px] z-10 px-6">
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3 border-b border-white/10"
              style={{ fontFamily: MONO }}
            >
              <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-[#888888]">
                <span className="w-8 h-[1px] bg-[#d4a373]/50" />
                <span className="text-[#d4a373]">THE MARGINAL STRUCTURE</span>
                <span className="text-[#666666]">/</span>
                <span>秘密国际组织 · 阈界管理机构</span>
                <span className="text-[#d4a373] ml-2">■</span>
                <span>EST. [DATA REDACTED]</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-[#888888]">
                <span>TICK · v2026.5.25</span>
              </div>
            </div>
          </div>

          {/* Left side - Intro content */}
          <div className="w-full lg:max-w-[760px] text-left flex flex-col lg:justify-between">
            <div>
              {/* Status badge */}
              <div className="mb-6">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#e60012]/40 text-[#e60012] text-[10px] tracking-widest"
                  style={{ fontFamily: MONO }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e60012] animate-pulse" />
                  SIGNAL ACTIVE / 当前阈界信号在线
                </div>
              </div>

              {/* Main Title with Logo */}
              <div className="flex items-center gap-3 mb-5">
                <button
                  onClick={() => setLogoOpen(true)}
                  className="w-[100px] h-auto flex-shrink-0 p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity"
                  data-cursor-hover
                  type="button"
                >
                  <img
                    src="/assets/TheMarginalStructure-Logo.png"
                    alt="The Marginal Structure Logo"
                    className="w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </button>
                <h1
                  className="text-6xl md:text-7xl lg:text-8xl text-[#f0f0f0] font-bold leading-[1.05] tracking-tight text-left"
                  style={{ fontFamily: BODY }}
                >
                  边际结构
                </h1>
              </div>
              <div
                className="text-lg text-[#888888] tracking-[0.3em] uppercase mb-10 text-left"
                style={{ fontFamily: MONO }}
              >
                THE MARGINAL STRUCTURE
              </div>

              {/* Subtitle - two lines */}
              <p className="text-base text-[#888888] leading-relaxed mb-1 text-left">
                一个致力于管理<span className="text-[#d4a373] font-medium">阈界异常现象</span>的国际秘密组织。
              </p>
              <p className="text-base text-[#888888] leading-relaxed mb-4 text-left">
                「 测绘黑暗，设立路标，而非征服 」
              </p>
              <p className="text-xs text-[#888888]/60 tracking-wider mb-12 text-left">
                MAP THE DARKNESS · SET THE GUIDEPOSTS · NEVER CONQUER
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/archives"
                className="inline-flex items-center gap-2 bg-[#e60012] text-white px-6 py-3 text-sm font-medium hover:bg-[#c40010] transition-colors duration-300"
                data-cursor-hover
              >
                访问档案库
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/operations"
                className="inline-flex items-center gap-2 border border-white/20 text-[#f0f0f0] px-6 py-3 text-sm hover:border-[#d4a373] hover:text-[#d4a373] transition-colors duration-300"
                data-cursor-hover
              >
                查看行动计划
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right side - Server Log Panel */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div
              className="border border-white/10 overflow-hidden"
              style={{ background: 'rgba(10, 10, 10, 0.75)', backdropFilter: 'blur(16px)' }}
            >
              {/* Panel Header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-white/10"
                style={{ fontFamily: MONO }}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e60012] animate-pulse" />
                  <span className="text-[10px] text-[#d4a373] tracking-wider">SERVER LOG / 系统公告</span>
                </div>
                <span className="text-[10px] text-[#888888]">v2026.5.6</span>
              </div>

              {/* Log Entries */}
              <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {loading ? (
                  <div className="px-4 py-8 text-center"><div className="text-xs text-[#666] animate-pulse">加载公告中...</div></div>
                ) : announcements.length === 0 ? (
                  <div className="px-4 py-8 text-center"><div className="text-xs text-[#666]">暂无公告</div></div>
                ) : (
                  announcements.map((announcement) => {
                    const typeInfo = TYPE_LEVEL_MAP[announcement.type] || TYPE_LEVEL_MAP.info
                    const dateStr = new Date(announcement.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
                    return (
                      <div key={announcement.id} className="flex items-start gap-3 px-4 py-2.5 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                        <span
                          className="text-[9px] px-1.5 py-0.5 mt-0.5 flex-shrink-0 leading-none"
                          style={{ color: typeInfo.color, border: `1px solid ${typeInfo.color}60`, fontFamily: MONO }}
                        >
                          {typeInfo.level}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-[#888888]/60 block mb-0.5" style={{ fontFamily: MONO }}>
                            {dateStr}
                          </span>
                          <span className="text-xs text-[#888888] leading-relaxed block">
                            {announcement.title}
                          </span>
                          {announcement.content && (
                            <span className="text-[10px] text-[#666] leading-relaxed block mt-0.5 line-clamp-2">
                              {announcement.content}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Panel Footer */}
              <div className="px-4 py-3 border-t border-white/10">
                <Link
                  to="/news"
                  className="text-xs text-[#d4a373] hover:text-[#e60012] transition-colors flex items-center gap-1"
                  style={{ fontFamily: MONO }}
                  data-cursor-hover
                >
                  查看全部公告 ↗
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    <Lightbox
      isOpen={logoOpen}
      src="/assets/TheMarginalStructure-Logo.png"
      alt="边际结构 · THE MARGINAL STRUCTURE"
      onClose={() => setLogoOpen(false)}
    />
    </>
  )
}
