import { useEffect, useRef, useState } from 'react'
import { MONO, BODY } from '../utils/fonts'

export default function CoreDirective() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [metrics, setMetrics] = useState({
    anchor: 4738291,
    target: 10000000,
    penetration: 47.3,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        anchor: prev.anchor + Math.floor(Math.random() * 50),
        target: prev.target,
        penetration: Number((prev.anchor / prev.target * 100).toFixed(1)),
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
      if (video.duration) {
        video.currentTime = progress * video.duration
      }
    }

    section.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      section.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section
      id="core-directive"
      ref={sectionRef}
      className="relative py-32 overflow-hidden min-h-[100dvh] flex items-center"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.35)' }}
      >
        <source src="/assets/core-directive.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#0a0a0a]/40" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        {/* Floating metrics - left */}
        <div className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2">
          <div
            className="text-[#d4a373] font-mono text-xs"
            style={{ fontFamily: MONO }}
          >
            <div className="text-[#888888] mb-1">锚点稳定度</div>
            <div className="text-lg tracking-tighter">
              {metrics.anchor.toLocaleString()} / {metrics.target.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Floating metrics - right */}
        <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2">
          <div
            className="text-[#d4a373] font-mono text-xs text-right"
            style={{ fontFamily: MONO }}
          >
            <div className="text-[#888888] mb-1">渗透概率</div>
            <div className="text-lg tracking-tighter">{metrics.penetration}%</div>
          </div>
        </div>

        {/* Main content */}
        <div className="text-center max-w-3xl mx-auto">
          <div
            className="inline-block px-3 py-1 mb-6 border border-[#d4a373]/30 text-[#d4a373] text-xs tracking-widest uppercase"
            style={{ fontFamily: MONO }}
          >
            CORE DIRECTIVE / 核心使命
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-[#f0f0f0] font-bold mb-8 leading-tight"
            style={{ fontFamily: BODY }}
          >
            现实并非坚固稳定
          </h2>

          <div className="space-y-6 text-[#888888] text-sm md:text-base leading-relaxed">
            <p>
              在人类集体意识、物理定律和未知维度相互作用的边缘地带，存在着被称为"阈界"的渗透层或断层空间。这些阈界并非传统意义上的另一个世界，而是现实结构中的"bug"、"褶皱"或"溢出地带"。
            </p>
            <p>
              边际结构致力于管理这些阈界及其带来的现象。我们更多是"勘探者、记录者、隔离者"，而非绝对的"收容者"。我们深知自己无法完全控制或理解所有阈界，目标更侧重于：防止阈界现象对大众现实造成灾难性影响，并艰难地从中获取知识和资源。
            </p>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="text-center">
              <div
                className="text-2xl text-[#f0f0f0] font-bold tracking-tighter"
                style={{ fontFamily: MONO }}
              >
                8,104,231
              </div>
              <div className="text-xs text-[#888888] mt-1">当前观测人数</div>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center">
              <div
                className="text-2xl text-[#e60012] font-bold tracking-tighter"
                style={{ fontFamily: MONO }}
              >
                1,247
              </div>
              <div className="text-xs text-[#888888] mt-1">已归档异常</div>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center">
              <div
                className="text-2xl text-[#d4a373] font-bold tracking-tighter"
                style={{ fontFamily: MONO }}
              >
                89
              </div>
              <div className="text-xs text-[#888888] mt-1">活跃前哨站</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
