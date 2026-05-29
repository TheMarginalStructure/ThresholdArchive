import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { MONO, BODY } from '../utils/fonts'
import { api, type ApiArchive } from '../lib/api'

function getThreatLevelColor(colorName: string | null): string {
  const colors: Record<string, string> = {
    '白色': '#e0e0e0',
    '蓝色': '#4a9eff',
    '绿色': '#4ade80',
    '黄色': '#facc15',
    '琥珀色': '#f59e0b',
    '橙色': '#f97316',
    '红色': '#e60012',
    '黑色': '#666666',
  }
  return colors[colorName || ''] || '#888888'
}

export default function AnomalyArchives() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }[]>([])
  const [archives, setArchives] = useState<ApiArchive[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.archives.list({ limit: '6', page: '1', status: '活跃' })
      .then((res) => {
        setArchives(res.data)
        setTotal(res.meta.total)
      })
      .catch(() => setArchives([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }))

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 163, 115, ${p.opacity})`
        ctx.fill()
      })

      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(212, 163, 115, ${0.1 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section id="archives" className="relative py-32 bg-[#0a0a0a]" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-30"
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16">
          <div
            className="text-xs text-[#d4a373] tracking-widest uppercase mb-2"
            style={{ fontFamily: MONO }}
          >
            ARCHIVE DATABASE / {total} ACTIVE ENTRIES
          </div>
          <h2
            className="text-3xl md:text-4xl text-[#f0f0f0] font-bold"
            style={{ fontFamily: BODY }}
          >
            档案库
          </h2>
        </div>

        {/* Featured archives horizontal scroll */}
        {loading ? (
          <div className="text-center py-24 text-[#888888]">
            <div className="text-xs text-[#d4a373] tracking-widest uppercase mb-4 animate-pulse" style={{ fontFamily: MONO }}>
              LOADING ARCHIVE DATA...
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {archives.map((archive) => (
                <Link
                  key={archive.id}
                  to={`/archive/${archive.id}`}
                  className="flex-shrink-0 w-[calc(33.333%-16px)] min-w-[280px] snap-start group/card relative overflow-hidden border p-6 transition-colors duration-300 flex flex-col"
                  style={{
                    background: 'rgba(17, 17, 17, 0.6)',
                    borderColor: `${getThreatLevelColor(archive.threatLevelColor)}30`,
                  }}
                  data-cursor-hover
                >
                  <div
                    className="inline-block px-2 py-1 mb-4 text-xs"
                    style={{
                      background: `${getThreatLevelColor(archive.threatLevelColor)}20`,
                      color: getThreatLevelColor(archive.threatLevelColor),
                      fontFamily: MONO,
                    }}
                  >
                    {archive.status.toUpperCase()}
                  </div>

                  <div className="aspect-video mb-4 overflow-hidden bg-[#111]">
                    {archive.imagePath ? (
                      <img
                        src={archive.imagePath}
                        alt={archive.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-[#333]">∅</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-[#888888] mb-1" style={{ fontFamily: MONO }}>
                    {archive.code}
                  </div>
                  <h3 className="text-lg text-[#f0f0f0] font-bold mb-1" style={{ fontFamily: BODY }}>
                    {archive.title}
                  </h3>
                  <div className="text-xs text-[#d4a373] mb-3">{archive.category}</div>
                  <p className="text-sm text-[#a0a0a0] leading-relaxed line-clamp-3">
                    {archive.description || '暂无描述'}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                      威胁等级
                    </div>
                    <div
                      className="text-xs px-2 py-0.5"
                      style={{
                        background: `${getThreatLevelColor(archive.threatLevelColor)}20`,
                        color: getThreatLevelColor(archive.threatLevelColor),
                        fontFamily: MONO,
                      }}
                    >
                      {archive.threatLevel || '不适用'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={() => scrollRef.current?.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' })}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0a0a0a]/90 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              data-cursor-hover
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0a0a0a]/90 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              data-cursor-hover
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        )}

        {/* View all button */}
        <div className="mt-10 text-center">
          <Link
            to="/archives"
            className="inline-flex items-center gap-2 border border-white/20 text-[#f0f0f0] px-6 py-3 text-sm hover:border-[#e60012] hover:text-[#e60012] transition-colors duration-300"
            data-cursor-hover
          >
            查看全部档案
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
