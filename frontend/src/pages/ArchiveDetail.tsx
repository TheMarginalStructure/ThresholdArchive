import { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import PageLayout from '../components/PageLayout'
import { api, type ApiArchiveDetail } from '../lib/api'
import { MONO, BODY } from '../utils/fonts'

const chartTheme = {
  bar: '#d4a373',
  barHover: '#e8b88a',
  text: '#aaaaaa',
  textBright: '#f0f0f0',
  grid: 'rgba(255,255,255,0.12)',
  tooltipBg: 'rgba(10,10,10,0.95)',
  tooltipBorder: 'rgba(212,163,115,0.3)',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(212,163,115,0.3)', borderRadius: '4px', padding: '8px 12px', fontSize: '12px' }}>
        <p style={{ color: '#d4a373', fontWeight: 500, marginBottom: '4px' }}>{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: '#888888' }}>{entry.name}: {entry.value}</p>
        ))}
      </div>
    )
  }
  return null
}

// 判断值是否有实际内容
function hasContent(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    '阈界档案': '#e60012',
    '勘探记录': '#d4a373',
    '勘探实验记录': '#d4a373',
    '事件报告': '#ff6b6b',
    '事件通信': '#ff6b6b',
    '人事档案': '#4ade80',
    '医疗报告': '#60a5fa',
    '实验记录': '#a78bfa',
    '理论文件': '#f472b6',
    '协议手册': '#888888',
  }
  return colors[category] || '#888888'
}

export default function ArchiveDetail() {
  const { id } = useParams<{ id: string }>()
  const [archive, setArchive] = useState<ApiArchiveDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSourceText, setShowSourceText] = useState(false)
  const [activeMedia, setActiveMedia] = useState(0)

  useEffect(() => {
    if (archive) {
      setActiveMedia(archive.imagePath ? 0 : archive.videoPath ? 1 : 0)
    }
  }, [archive])

  useEffect(() => {
    if (!id) return
    const numId = parseInt(id, 10)
    if (isNaN(numId)) {
      setError('无效的档案ID')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    api.archives.get(numId)
      .then((data) => setArchive(data))
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false))
  }, [id])

  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    scrollToTop()
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [id])

  if (loading) {
    return (
      <PageLayout
        breadcrumbs={[{ label: 'ARCHIVES', to: '/archives' }, { label: '加载中' }]}
        title="加载中..."
        subtitle="正在从数据库获取档案数据"
        showBackButton
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center py-24">
          <div className="text-xs text-[#d4a373] tracking-widest uppercase mb-4 animate-pulse" style={{ fontFamily: MONO }}>
            LOADING ARCHIVE DATA...
          </div>
          <div className="w-48 h-[1px] bg-white/10 mx-auto overflow-hidden">
            <div className="h-full bg-[#d4a373] animate-[loadingSlide_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error || !archive) {
    return (
      <PageLayout
        breadcrumbs={[{ label: 'ARCHIVES', to: '/archives' }, { label: '未找到' }]}
        title="档案不存在"
        subtitle="请求的档案编号在数据库中未找到。"
        showBackButton
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center py-24">
          <div
            className="text-6xl text-[#e60012] font-bold mb-4"
            style={{ fontFamily: MONO }}
          >
            404
          </div>
          <p className="text-[#888888] mb-8">{error || '该档案不存在或已被删除。'}</p>
          <Link
            to="/archives"
            className="inline-flex items-center gap-2 bg-[#e60012] text-white px-6 py-3 text-sm font-medium hover:bg-[#c40010] transition-colors"
            data-cursor-hover
          >
            返回档案列表
          </Link>
        </div>
      </PageLayout>
    )
  }

  const categoryColor = getCategoryColor(archive.category)
  const scrollToTop = () => window.scrollTo(0, 0)
  const sourceDept = archive.sourceDepartment?.name || (archive.details?.sourceDepartment as string) || '未知'
  const respDept = archive.responsibleDepartment?.name || (archive.details?.responsibleDepartment as string) || '未知'
  const sameDept = sourceDept !== '未知' && respDept !== '未知' && sourceDept === respDept

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'ARCHIVES', to: '/archives' },
        { label: archive.code },
      ]}
      title={archive.title}
      subtitle={`${archive.category} · ${archive.threatLevel || '不适用'} · ${archive.status} · 录入 ${archive.archiveDate ? new Date(archive.archiveDate).toLocaleDateString('zh-CN') : '-'}`}
      showBackButton
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Archive Header */}
        <div className="border border-white/10 mb-8 overflow-hidden" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
          {/* Archive Image Banner */}
          {archive.imagePath && (
            <div className="relative h-48 md:h-64 overflow-hidden">
              <img
                src={archive.imagePath}
                alt={archive.title}
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(40%) contrast(110%)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs px-2 py-0.5"
                    style={{
                      color: categoryColor,
                      border: `1px solid ${categoryColor}40`,
                      background: 'rgba(10, 10, 10, 0.8)',
                    }}
                  >
                    {archive.category}
                  </span>
                  <span
                    className="text-xs text-[#888888]"
                    style={{ fontFamily: MONO }}
                  >
                    {archive.code}
                  </span>
                </div>
                <h1
                  className="text-2xl md:text-3xl text-[#f0f0f0] font-bold"
                  style={{ fontFamily: BODY }}
                >
                  {archive.title}
                </h1>
              </div>
            </div>
          )}

          {/* Header Content */}
          <div className="p-6">
            {!archive.imagePath && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs px-2 py-0.5"
                    style={{
                      color: categoryColor,
                      border: `1px solid ${categoryColor}40`,
                    }}
                  >
                    {archive.category}
                  </span>
                  <span
                    className="text-xs text-[#888888]"
                    style={{ fontFamily: MONO }}
                  >
                    {archive.code}
                  </span>
                </div>
                <h1
                  className="text-2xl md:text-3xl text-[#f0f0f0] font-bold mb-4"
                  style={{ fontFamily: BODY }}
                >
                  {archive.title}
                </h1>
              </>
            )}

            <div className="flex flex-wrap items-center justify-between text-xs text-[#888888]">
              <div className="flex flex-wrap items-center gap-6">
                {sameDept ? (
                  <span>
                    <span className="text-[#666666]">来源/负责部门</span>{' '}
                    <span className="text-[#d4a373]">{sourceDept}</span>
                  </span>
                ) : (
                  <>
                    <span>
                      <span className="text-[#666666]">来源部门</span>{' '}
                      <span className="text-[#d4a373]">{sourceDept}</span>
                    </span>
                    <span>
                      <span className="text-[#666666]">负责部门</span>{' '}
                      <span className="text-[#d4a373]">{respDept}</span>
                    </span>
                  </>
                )}
                <span>
                  <span className="text-[#666666]">负责人</span>{' '}
                  <span className="text-[#f0f0f0]">{archive.leadPerson?.name || (archive.details?.leadPerson as string) || '未知'}</span>
                </span>
                <span>
                  <span className="text-[#666666]">访问权限</span>{' '}
                  <span className="text-[#f0f0f0]">{archive.accessLevel || '-'}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <span>
                  <span className="text-[#666666]">威胁等级</span>{' '}
                  <span className="text-[#d4a373]">{archive.threatLevel || '不适用'}</span>
                </span>
                <span>
                  <span className="text-[#666666]">归档状态</span>{' '}
                  <span className="text-[#f0f0f0]">{archive.status}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {archive.category !== '人事档案' && (
            <Section title="档案说明" code="DESC">
              <div className="space-y-3">
                {archive.mainDangers.length > 0 && (
                  <div>
                    <div className="text-xs text-[#e60012] mb-2">主要危险</div>
                    <div className="flex flex-wrap gap-2">
                      {archive.mainDangers.map((danger, i) => (
                        <span
                          key={i}
                          className="text-xs text-[#e60012] border border-[#e60012]/30 px-2 py-0.5"
                        >
                          {danger}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-sm text-[#888888] leading-relaxed">
                  {archive.description || '暂无描述'}
                </p>
              </div>
            </Section>
            )}

            {/* Typed details rendering */}
            {archive.useCustomTemplate && archive.customTemplate ? (
              <Section title="详细内容" code="DETL">
                <div className="prose prose-invert prose-sm max-w-none
                  prose-headings:text-[#d4a373] prose-headings:font-medium
                  prose-p:text-[#888888] prose-p:leading-relaxed
                  prose-strong:text-[#f0f0f0]
                  prose-a:text-[#d4a373] prose-a:no-underline hover:prose-a:underline
                  prose-code:text-[#d4a373] prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
                  prose-blockquote:border-l-[#d4a373] prose-blockquote:text-[#666666]
                  prose-ul:text-[#888888] prose-ol:text-[#888888]
                  prose-li:marker:text-[#d4a373]
                  prose-hr:border-white/10
                  [&_table]:border-collapse [&_table]:w-full [&_table]:text-xs
                  [&_th]:border [&_th]:border-white/10 [&_th]:px-3 [&_th]:py-2 [&_th]:text-[#d4a373] [&_th]:font-medium
                  [&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-2 [&_td]:text-[#888888]">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {archive.customTemplate}
                  </ReactMarkdown>
                </div>
              </Section>
            ) : archive.details && Object.keys(archive.details).length > 0 && (
              <TypedDetailsContent category={archive.category} details={archive.details} />
            )}

            {/* Related Archives */}
            {archive.relationsFrom.length > 0 && (
              <Section title="关联档案" code="REL">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {archive.relationsFrom.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/archive/${rel.relatedArchive.id}`}
                      className="group border border-white/10 p-4 hover:border-[#d4a373]/40 transition-all duration-300"
                      data-cursor-hover
                      onClick={scrollToTop}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-[10px] px-1.5 py-0.5"
                          style={{
                            color: getCategoryColor(rel.relatedArchive.category),
                            border: `1px solid ${getCategoryColor(rel.relatedArchive.category)}40`,
                          }}
                        >
                          {rel.relatedArchive.category}
                        </span>
                        <span
                          className="text-[10px] text-[#888888]"
                          style={{ fontFamily: MONO }}
                        >
                          {rel.relatedArchive.code}
                        </span>
                      </div>

                      <h4 className="text-sm text-[#f0f0f0] mb-2 group-hover:text-[#d4a373] transition-colors">
                        {rel.relatedArchive.title}
                      </h4>

                      <div className="flex items-start gap-1.5">
                        <span className="text-[#d4a373] text-xs mt-0.5">↳</span>
                        <p className="text-xs text-[#888888] leading-relaxed">
                          {rel.relationType}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Archive Media */}
            {(archive.imagePath || archive.videoPath) ? (
              <Section title="档案影像" code="MEDIA">
                <div
                  className="relative group overflow-hidden rounded border border-white/10 bg-[#1a1a1a]"
                  onMouseDown={(e) => {
                    const startX = e.clientX
                    const onMove = (ev: MouseEvent) => {
                      const diff = ev.clientX - startX
                      if (Math.abs(diff) > 60) {
                        if (diff > 0 && activeMedia === 1) setActiveMedia(0)
                        else if (diff < 0 && activeMedia === 0) setActiveMedia(1)
                        document.removeEventListener('mousemove', onMove)
                        document.removeEventListener('mouseup', onUp)
                      }
                    }
                    const onUp = () => {
                      document.removeEventListener('mousemove', onMove)
                      document.removeEventListener('mouseup', onUp)
                    }
                    document.addEventListener('mousemove', onMove)
                    document.addEventListener('mouseup', onUp)
                  }}
                  onTouchStart={(e) => {
                    const startX = e.touches[0].clientX
                    const el = e.currentTarget
                    const onMove = (ev: TouchEvent) => {
                      const diff = ev.touches[0].clientX - startX
                      if (Math.abs(diff) > 60) {
                        if (diff > 0 && activeMedia === 1) setActiveMedia(0)
                        else if (diff < 0 && activeMedia === 0) setActiveMedia(1)
                        el.removeEventListener('touchmove', onMove as any)
                        el.removeEventListener('touchend', onEnd as any)
                      }
                    }
                    const onEnd = () => {
                      el.removeEventListener('touchmove', onMove as any)
                      el.removeEventListener('touchend', onEnd as any)
                    }
                    el.addEventListener('touchmove', onMove as any, { passive: true })
                    el.addEventListener('touchend', onEnd as any)
                  }}
                >
                  {/* Fixed aspect media container */}
                  <div className="relative aspect-square">
                    {archive.imagePath && (!archive.videoPath || activeMedia === 0) && (
                      <img
                        src={archive.imagePath}
                        alt={archive.title}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        className="absolute inset-0 w-full h-full object-cover select-none"
                        style={{ filter: 'grayscale(40%) contrast(110%)', userSelect: 'none' }}
                      />
                    )}
                    {archive.videoPath && (!archive.imagePath || activeMedia === 1) && (
                      <video
                        src={archive.videoPath.startsWith('http') ? archive.videoPath : `http://localhost:3001${archive.videoPath}`}
                        controls
                        className="absolute inset-0 w-full h-full object-cover"
                        preload="metadata"
                      >
                        您的浏览器不支持视频播放
                      </video>
                    )}
                  </div>

                  {/* Hover arrows (only when both exist) */}
                  {archive.imagePath && archive.videoPath && (
                    <>
                      <button
                        onClick={() => setActiveMedia(0)}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 ${activeMedia === 0 ? 'hidden' : 'bg-black/60 hover:bg-black/80 text-[#d4a373]'}`}
                        aria-label="上一张"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button
                        onClick={() => setActiveMedia(1)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 ${activeMedia === 1 ? 'hidden' : 'bg-black/60 hover:bg-black/80 text-[#d4a373]'}`}
                        aria-label="下一张"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </>
                  )}

                  {/* Navigation dots */}
                  {archive.imagePath && archive.videoPath && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveMedia(0)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeMedia === 0 ? 'bg-[#d4a373] w-4' : 'bg-white/50 hover:bg-white/80'}`}
                        aria-label="显示图片"
                      />
                      <button
                        onClick={() => setActiveMedia(1)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeMedia === 1 ? 'bg-[#d4a373] w-4' : 'bg-white/50 hover:bg-white/80'}`}
                        aria-label="显示视频"
                      />
                      <span className="text-[10px] text-white/60 ml-1">
                        {activeMedia === 0 ? '影像' : '视频'}
                      </span>
                    </div>
                  )}
                </div>
              </Section>
            ) : (
              <Section title="档案影像" code="MEDIA">
                <div className="relative aspect-[4/3] bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl text-[#666666] mb-2">∅</div>
                    <div className="text-xs text-[#666666]">暂无影像资料</div>
                  </div>
                </div>
              </Section>
            )}

            {/* Meta Info */}
            <Section title="元数据" code="META">
              <div className="space-y-3 text-xs">
                <MetaItem label="归档编码" value={archive.code} />
                <MetaItem label="归档状态" value={archive.status} />
                <MetaItem label="威胁等级" value={archive.threatLevel || '不适用'} />
                <MetaItem label="归档日期" value={archive.archiveDate ? new Date(archive.archiveDate).toLocaleDateString('zh-CN') : '-'} />
                <MetaItem label="最后更新" value={archive.lastUpdate ? new Date(archive.lastUpdate).toLocaleDateString('zh-CN') : '-'} />
                {sameDept ? (
                  <MetaItem label="来源/负责部门" value={sourceDept} />
                ) : (
                  <>
                    <MetaItem label="来源部门" value={sourceDept} />
                    <MetaItem label="负责部门" value={respDept} />
                  </>
                )}
                <MetaItem label="负责人" value={archive.leadPerson?.name || (archive.details?.leadPerson as string) || '未知'} />
                <MetaItem label="访问权限" value={archive.accessLevel || '-'} />
              </div>
              {archive.attachmentText && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setShowSourceText(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-[#d4a373]/30 bg-[#d4a373]/5 text-[#d4a373] hover:bg-[#d4a373]/10 hover:border-[#d4a373]/50 transition-all text-xs"
                    data-cursor-hover
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    阅读源文件
                  </button>
                </div>
              )}
            </Section>

            {/* Signatures */}
            {archive.signatures.length > 0 && (
              <Section title="签名确认" code="SIG">
                <div className="space-y-3">
                  {archive.signatures.map((sig, i) => (
                    <div key={i} className="text-xs border-b border-white/5 pb-2 last:border-0">
                      <div className="text-[#888888]">
                        {sig.position} · {sig.name}
                      </div>
                      <div className="text-[#d4a373]" style={{ fontFamily: MONO }}>
                        {sig.esigCode || '[ESIG-??]'}
                      </div>
                      {sig.note && <div className="text-[#666666]">{sig.note}</div>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Navigation */}
            <Link
              to="/archives"
              className="block text-center text-xs text-[#d4a373] border border-[#d4a373]/40 py-3 hover:bg-[#d4a373]/10 transition-colors"
              data-cursor-hover
            >
              ← 返回档案列表
            </Link>
          </div>
        </div>

        {/* Footer Remarks */}
        {archive.remarks && (
          <div className="mt-12 pt-6 border-t border-white/5 text-xs text-[#888888]/60">
            <span className="text-[#d4a373]">备注：</span>
            {archive.remarks}
          </div>
        )}
      </div>

      {showSourceText && archive.attachmentText && (
        <SourceTextModal
          text={archive.attachmentText}
          onClose={() => setShowSourceText(false)}
        />
      )}
    </PageLayout>
  )
}

function Section({ title, code, children }: { title: string; code: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/10 p-6" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
      <h2
        className="text-xs text-[#d4a373] tracking-widest uppercase mb-4"
        style={{ fontFamily: MONO }}
      >
        {code} / {title}
      </h2>
      {children}
    </div>
  )
}

// 纸质文件风格弹窗
function SourceTextModal({ text, onClose }: { text: string; onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={contentRef}
        className="relative mx-4 max-h-[85vh] max-w-3xl w-full overflow-hidden rounded-sm shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #f5f0e6 0%, #ebe5d8 50%, #f0eadc 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute left-6 top-0 bottom-0 w-px opacity-20" style={{ background: '#8b7355' }} />
        <div className="absolute left-6 top-0 bottom-0 w-px opacity-10 ml-3" style={{ background: '#8b7355' }} />

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, #8b7355 28px, #8b7355 29px)',
        }} />

        <div className="relative px-10 pt-8 pb-4 border-b" style={{ borderColor: '#8b7355' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs tracking-widest uppercase font-medium" style={{ color: '#8b7355' }}>CONFIDENTIAL</div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/10"
              style={{ color: '#8b7355' }}
            >
              ✕
            </button>
          </div>
          <div className="text-xs mt-2" style={{ color: '#a09080' }}>边际结构档案系统 · 原始文档副本</div>
        </div>

        <div className="relative px-10 py-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          <div className="markdown-body prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
              {text}
            </ReactMarkdown>
          </div>
        </div>

        <div className="relative px-10 py-4 border-t text-center text-xs" style={{ borderColor: '#8b7355', color: '#a09080' }}>
          — 文档结束 —
        </div>
      </div>
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#888888]">{label}</span>
      <span className="text-[#f0f0f0]">{value}</span>
    </div>
  )
}

// ============================================
// 类型化详情内容渲染组件
// ============================================

function TypedDetailsContent({ category, details }: { category: string; details: Record<string, unknown> }) {
  if (!details || Object.keys(details).length === 0) return null

  // 根据档案类别选择渲染方式
  switch (category) {
    case '阈界档案':
      return <ThreatFileContent details={details} />
    case '勘探实验记录':
    case '勘探记录':
      return <ExplorationLogContent details={details} />
    case '事件报告':
      return <IncidentReportContent details={details} />
    case '事件通信':
      return <CommunicationTranscriptContent details={details} />
    case '人事档案':
      return <PersonnelFileContent details={details} />
    case '医疗报告':
      return <MedicalReportContent details={details} />
    case '实验记录':
      return <ExperimentLogContent details={details} />
    case '理论文件':
      return <TheoreticalDocumentContent details={details} />
    case '协议手册':
      return <ProtocolManualContent details={details} />
    default:
      return <DynamicDetailsContent category={category} details={details} />
  }
}

// 阈界档案内容渲染
function ThreatFileContent({ details }: { details: Record<string, unknown> }) {
  const hasBasicInfo = details.archiveNature || details.coreFeatures || details.discoveryLocation

  return (
    <>
      {hasBasicInfo && (
        <div className="border border-white/10 rounded p-3 mb-4">
          <div className="text-xs text-[#d4a373] mb-2 font-medium">档案概要</div>
          <div className="space-y-2 text-xs">
            {hasContent(details.archiveNature) && (
              <div><span className="text-[#666666]">档案性质：</span><span className="text-[#888888]">{String(details.archiveNature)}</span></div>
            )}
            {hasContent(details.coreFeatures) && (
              <div><span className="text-[#666666]">核心特征：</span><span className="text-[#888888]">{String(details.coreFeatures)}</span></div>
            )}
            {hasContent(details.discoveryLocation) && (
              <div><span className="text-[#666666]">发现地点：</span><span className="text-[#888888]">{String(details.discoveryLocation)}</span></div>
            )}
          </div>
        </div>
      )}

      {/* 特性分析 */}
      {details.properties && Array.isArray(details.properties) && details.properties.length > 0 && (
        <Section title="特性分析" code="PROP">
          <div className="space-y-4">
            {details.properties.map((prop: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#d4a373]">{String(prop.category || '')}</span>
                  <span className="text-xs text-[#f0f0f0] font-medium">{String(prop.name || '')}</span>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed">{String(prop.description || '')}</p>
                {!!prop.scope && <p className="text-xs text-[#666666] mt-1">范围: {String(prop.scope)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 进程阶段 */}
      {details.phases && Array.isArray(details.phases) && details.phases.length > 0 && (
        <Section title="进程阶段" code="PHASE">
          <div className="mb-4">
            <div className="flex gap-1.5 items-end h-16">
              {details.phases.map((phase: Record<string, unknown>, i: number) => {
                const dur = String(phase.duration || '')
                const num = dur.match(/(\d+)/)?.[1] || '1'
                const height = Math.min(Number(num) * 12, 64)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm transition-all hover:opacity-80"
                      style={{ height: `${height}px`, background: `hsl(${35 + i * 15}, 50%, ${35 + i * 5}%)` }}
                      title={String(phase.name || '')}
                    />
                    <div className="text-[9px] text-[#666] truncate w-full text-center">{String(phase.name || '').substring(0, 3)}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="space-y-4">
            {details.phases.map((phase: Record<string, unknown>, i: number) => (
              <div key={i} className="border-l-2 border-[#d4a373]/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#d4a373] font-medium">{String(phase.name || '')}</span>
                  <span className="text-xs text-[#666666]">{String(phase.duration || '')}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-[#888888]"><span className="text-[#666666]">机制：</span>{String(phase.mechanism || '')}</p>
                  <p className="text-[#888888]"><span className="text-[#666666]">表现：</span>{String(phase.manifestation || '')}</p>
                  <p className="text-[#888888]"><span className="text-[#666666]">目标：</span>{String(phase.target || '')}</p>
                  <p className="text-[#888888]"><span className="text-[#666666]">关键指标：</span>{String(phase.keyIndicator || '')}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 环境特征 */}
      {details.environmentFeatures && typeof details.environmentFeatures === 'object' && (
        <Section title="环境特征" code="ENV">
          <div className="space-y-3">
            {Object.entries(details.environmentFeatures as Record<string, unknown>).map(([key, value]) => (
              <div key={key}>
                <div className="text-xs text-[#d4a373] mb-1 capitalize">{key === 'physical' ? '物理环境' : key === 'cognitive' ? '认知环境' : key}</div>
                {Array.isArray(value) ? (
                  <ul className="space-y-1">
                    {value.map((item, i) => (
                      <li key={i} className="text-xs text-[#888888] leading-relaxed">• {String(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#888888]">{String(value)}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 已知实体 */}
      {details.knownEntities && Array.isArray(details.knownEntities) && details.knownEntities.length > 0 && (
        <Section title="已知实体" code="ENT">
          <div className="space-y-4">
            {details.knownEntities.map((entity: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                <div className="text-sm text-[#f0f0f0] font-medium mb-1">{String(entity.name || '')}</div>
                <div className="space-y-1 text-xs">
                  <p className="text-[#888888]"><span className="text-[#666666]">类型：</span>{String(entity.type || '')}</p>
                  <p className="text-[#888888]"><span className="text-[#666666]">行为：</span>{String(entity.behavior || '')}</p>
                  <p className="text-[#888888]"><span className="text-[#666666]">机制：</span>{String(entity.mechanism || '')}</p>
                  <p className="text-[#e60012]"><span className="text-[#666666]">危险等级：</span>{String(entity.dangerLevel || '')}</p>
                  <p className="text-[#888888]"><span className="text-[#666666]">接触记录：</span>{String(entity.contactRecord || '')}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 发现地点 */}
      {hasContent(details.discoveryLocation) && (
        <Section title="发现地点" code="LOC">
          <p className="text-sm text-[#888888] leading-relaxed">{String(details.discoveryLocation)}</p>
        </Section>
      )}

      {/* 异常报告 */}
      {hasContent(details.anomalyReport) && (
        <Section title="异常报告" code="ANOM">
          <p className="text-sm text-[#888888] leading-relaxed">{String(details.anomalyReport)}</p>
        </Section>
      )}

      {/* 响应队伍 */}
      {hasContent(details.responseTeam) && (
        <Section title="响应队伍" code="TEAM">
          <p className="text-sm text-[#888888] leading-relaxed">{String(details.responseTeam)}</p>
        </Section>
      )}

      {/* 威胁评估 */}
      {details.threatAssessments && Array.isArray(details.threatAssessments) && details.threatAssessments.length > 0 && (
        <Section title="威胁评估" code="THREAT">
          <div className="space-y-3">
            {details.threatAssessments.map((assessment: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#e60012] font-medium">{String(assessment.riskLevel || '')}</span>
                  <span className="text-xs text-[#f0f0f0]">{String(assessment.personnelType || '')}</span>
                </div>
                <p className="text-xs text-[#888888]"><span className="text-[#666666]">易感原因：</span>{String(assessment.susceptibilityReason || '')}</p>
                <p className="text-xs text-[#888888]"><span className="text-[#666666]">建议：</span>{String(assessment.recommendedAction || '')}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 对比威胁 */}
      {details.comparisonThreats && Array.isArray(details.comparisonThreats) && details.comparisonThreats.length > 0 && (
        <Section title="对比威胁" code="COMP">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-[#666666] py-2 pr-4">项目</th>
                  <th className="text-left text-[#d4a373] py-2 pr-4">本威胁</th>
                  <th className="text-left text-[#888888] py-2">其他威胁</th>
                </tr>
              </thead>
              <tbody>
                {details.comparisonThreats.map((item: Record<string, unknown>, i: number) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="text-[#f0f0f0] py-2 pr-4">{String(item.item || '')}</td>
                    <td className="text-[#d4a373] py-2 pr-4">{String(item.thisThreat || '')}</td>
                    <td className="text-[#888888] py-2">{String(item.otherThreat || '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* 应对协议 */}
      {details.protocols && Array.isArray(details.protocols) && details.protocols.length > 0 && (
        <Section title="应对协议" code="PROTO">
          <div className="space-y-3">
            {details.protocols.map((protocol: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#d4a373]">{String(protocol.phase || '')}</span>
                  <span className="text-xs text-[#f0f0f0] font-medium">{String(protocol.procedureName || '')}</span>
                </div>
                <p className="text-xs text-[#888888]">{String(protocol.measures || '')}</p>
                <p className="text-xs text-[#666666] mt-1">负责部门: {String(protocol.department || '')}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 访问要求 */}
      {details.accessRequirements && Array.isArray(details.accessRequirements) && details.accessRequirements.length > 0 && (
        <Section title="访问要求" code="ACCESS">
          <div className="space-y-2">
            {details.accessRequirements.map((req: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-xs mt-0.5 ${req.allowed ? 'text-[#4ade80]' : 'text-[#e60012]'}`}>
                  {req.allowed ? '✓' : '✗'}
                </span>
                <span className={`text-xs ${req.allowed ? 'text-[#888888]' : 'text-[#e60012]/70'}`}>
                  {String(req.text || '')}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 应急程序 */}
      {details.emergencyProcedures && Array.isArray(details.emergencyProcedures) && details.emergencyProcedures.length > 0 && (
        <Section title="应急程序" code="EMRG">
          <div className="space-y-2">
            {details.emergencyProcedures.map((proc: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-xs mt-0.5 ${proc.allowed ? 'text-[#4ade80]' : 'text-[#e60012]'}`}>
                  {proc.allowed ? '✓' : '✗'}
                </span>
                <span className={`text-xs ${proc.allowed ? 'text-[#888888]' : 'text-[#e60012]/70'}`}>
                  {String(proc.text || '')}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 行为准则 */}
      {details.behaviorGuidelines && Array.isArray(details.behaviorGuidelines) && details.behaviorGuidelines.length > 0 && (
        <Section title="行为准则" code="GUIDE">
          <div className="space-y-2">
            {details.behaviorGuidelines.map((guide: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-xs mt-0.5 ${guide.allowed ? 'text-[#4ade80]' : 'text-[#e60012]'}`}>
                  {guide.allowed ? '✓' : '✗'}
                </span>
                <span className={`text-xs ${guide.allowed ? 'text-[#888888]' : 'text-[#e60012]/70'}`}>
                  {String(guide.text || '')}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

// 勘探实验记录内容渲染
function ExplorationLogContent({ details }: { details: Record<string, unknown> }) {
  const hasBasicInfo = details.missionCode || details.targetThreshold || details.team || details.teamLeader || details.explorationDate || details.missionStatus

  return (
    <>
      {hasBasicInfo && (
        <div className="border border-white/10 rounded p-3 mb-4">
          <div className="text-xs text-[#d4a373] mb-2 font-medium">任务概要</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {details.missionCode != null && (
              <div><span className="text-[#666666]">任务代号：</span><span className="text-[#888888]">{String(details.missionCode)}</span></div>
            )}
            {details.targetThreshold != null && (
              <div><span className="text-[#666666]">目标阈界：</span><span className="text-[#888888]">{String(details.targetThreshold)}</span></div>
            )}
            {details.team != null && (
              <div><span className="text-[#666666]">勘探队伍：</span><span className="text-[#888888]">{String(details.team)}</span></div>
            )}
            {details.teamLeader != null && (
              <div><span className="text-[#666666]">队长：</span><span className="text-[#888888]">{String(details.teamLeader)}</span></div>
            )}
            {details.explorationDate != null && (
              <div><span className="text-[#666666]">勘探日期：</span><span className="text-[#888888]">{String(details.explorationDate)}</span></div>
            )}
            {details.missionStatus != null && (
              <div><span className="text-[#666666]">任务状态：</span><span className="text-[#888888]">{String(details.missionStatus)}</span></div>
            )}
          </div>
        </div>
      )}

      {details.missionOverview && (
        <Section title="任务概述" code="OVER">
          <p className="text-sm text-[#888888] leading-relaxed">{String(details.missionOverview)}</p>
        </Section>
      )}

      {details.teamMembers && Array.isArray(details.teamMembers) && details.teamMembers.length > 0 && (
        <Section title="队伍成员" code="MEMB">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,163,115,0.3) transparent' }}>
            {details.teamMembers.map((member: Record<string, unknown>, i: number) => (
              <div key={i} className="flex-shrink-0 w-20 flex flex-col items-center gap-1.5 group">
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-[#1a1a1a] group-hover:border-[#d4a373]/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#666666] group-hover:text-[#d4a373]/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[#f0f0f0] truncate max-w-[72px]">{String(member.name || '')}</div>
                  <div className="text-[10px] text-[#666] truncate max-w-[72px]">{String(member.role || '')}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.equipment && Array.isArray(details.equipment) && details.equipment.length > 0 && (
        <Section title="装备清单" code="EQUIP">
          <div className="space-y-2">
            {details.equipment.map((item: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-[#d4a373] mt-0.5">•</span>
                <div>
                  <span className="text-xs text-[#f0f0f0]">{String(item.name || '')}</span>
                  <span className="text-xs text-[#666666]"> ({String(item.quantity || '')})</span>
                  {!!item.notes && <p className="text-xs text-[#888888]">{String(item.notes)}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.timeline && Array.isArray(details.timeline) && details.timeline.length > 0 && (
        <Section title="时间线" code="TIME">
          <div className="space-y-3 mb-4">
            {details.timeline.map((entry: Record<string, unknown>, i: number) => (
              <div key={i} className="border-l-2 border-[#d4a373]/30 pl-4">
                <div className="text-xs text-[#d4a373] mb-1">{String(entry.time || '')}</div>
                <p className="text-xs text-[#888888] leading-relaxed">{String(entry.event || '')}</p>
                {!!entry.notes && <p className="text-xs text-[#666666] mt-1">{String(entry.notes)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.discoveries && Array.isArray(details.discoveries) && details.discoveries.length > 0 && (
        <Section title="关键发现" code="DISC">
          <div className="space-y-3">
            {details.discoveries.map((discovery: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                <div className="text-sm text-[#f0f0f0] font-medium mb-1">{String(discovery.title || '')}</div>
                <p className="text-xs text-[#888888] leading-relaxed">{String(discovery.description || '')}</p>
                {!!discovery.significance && <p className="text-xs text-[#d4a373] mt-1">重要性: {String(discovery.significance)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.analysis && typeof details.analysis === 'object' && (
        <Section title="分析结果" code="ANAL">
          <RenderValue value={details.analysis} />
        </Section>
      )}

      {details.lessons && Array.isArray(details.lessons) && details.lessons.length > 0 && (
        <Section title="经验教训" code="LESS">
          <ul className="space-y-2">
            {details.lessons.map((lesson: string, i: number) => (
              <li key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                <span className="text-[#d4a373] mt-0.5">•</span>
                {lesson}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {details.safetyRecommendations && Array.isArray(details.safetyRecommendations) && details.safetyRecommendations.length > 0 && (
        <Section title="安全建议" code="SAFE">
          <div className="space-y-3">
            {details.safetyRecommendations.map((rec: unknown, i: number) => {
              if (typeof rec === 'string') {
                return (
                  <div key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                    <span className="text-[#4ade80] mt-0.5">✓</span>
                    {rec}
                  </div>
                )
              }
              if (typeof rec === 'object' && rec !== null) {
                const r = rec as Record<string, unknown>
                return (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                    <div className="text-xs text-[#4ade80] font-medium mb-1">{String(r.type || '')}</div>
                    <p className="text-xs text-[#888888] leading-relaxed">{String(r.measures || '')}</p>
                  </div>
                )
              }
              return null
            })}
          </div>
        </Section>
      )}

      {details.followUpActions && Array.isArray(details.followUpActions) && details.followUpActions.length > 0 && (
        <Section title="后续行动" code="FOLL">
          <ul className="space-y-2">
            {details.followUpActions.map((action: string, i: number) => (
              <li key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                <span className="text-[#d4a373] mt-0.5">→</span>
                {action}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}

// 事件报告内容渲染
function IncidentReportContent({ details }: { details: Record<string, unknown> }) {
  const hasEventInfo = details.incidentNature || details.confirmedCause || details.transmissionMechanism || details.currentStatus

  const renderStatus = (status: unknown) => {
    if (!hasContent(status)) return null
    if (Array.isArray(status)) {
      return (
        <div className="space-y-2">
          {(status as unknown[]).map((item: unknown, i: number) => {
            if (typeof item === 'object' && item !== null) {
              return (
                <div key={i} className="border-l-2 border-[#e60012]/30 pl-3">
                  {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                    <div key={k} className="text-xs">
                      <span className="text-[#666666]">{formatKey(k)}：</span>
                      <span className="text-[#888888]">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )
            }
            return <p key={i} className="text-xs text-[#888888]">{String(item)}</p>
          })}
        </div>
      )
    }
    if (typeof status === 'object') {
      return (
        <div className="space-y-1">
          {Object.entries(status as Record<string, unknown>).map(([k, v]) => (
            <div key={k} className="text-xs">
              <span className="text-[#666666]">{formatKey(k)}：</span>
              <span className="text-[#888888]">{String(v)}</span>
            </div>
          ))}
        </div>
      )
    }
    return <p className="text-sm text-[#888888] leading-relaxed">{String(status)}</p>
  }

  const hasResponseMeasures = details.responseMeasures && Array.isArray(details.responseMeasures) &&
    details.responseMeasures.some(m => typeof m === 'object' && m !== null && Object.values(m as Record<string, unknown>).some(v => hasContent(v)))

  return (
    <>
      {hasEventInfo && (
        <div className="border border-white/10 rounded p-3 mb-4">
          <div className="text-xs text-[#d4a373] mb-2 font-medium">事件概要</div>
          <div className="space-y-2 text-xs">
            {hasContent(details.incidentNature) && (
              <div><span className="text-[#666666]">事件性质：</span><span className="text-[#888888]">{String(details.incidentNature)}</span></div>
            )}
            {hasContent(details.confirmedCause) && (
              <div><span className="text-[#666666]">确认原因：</span><span className="text-[#888888]">{String(details.confirmedCause)}</span></div>
            )}
            {hasContent(details.transmissionMechanism) && (
              <div><span className="text-[#666666]">传播机制：</span><span className="text-[#888888]">{String(details.transmissionMechanism)}</span></div>
            )}
            {hasContent(details.currentStatus) && (
              <div>
                <div className="text-[#666666] mb-1">当前状态：</div>
                {renderStatus(details.currentStatus)}
              </div>
            )}
          </div>
        </div>
      )}

      {hasContent(details.symptomCharacteristics) && (
        <Section title="症状特征" code="SYM">
          {Array.isArray(details.symptomCharacteristics) ? (
            <ul className="space-y-2">
              {(details.symptomCharacteristics as string[]).map((symptom: string, i: number) => (
                <li key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                  <span className="text-[#e60012] mt-0.5">•</span>
                  {symptom}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#888888] leading-relaxed">{String(details.symptomCharacteristics)}</p>
          )}
        </Section>
      )}

      {details.threatAssessment && typeof details.threatAssessment === 'object' && (
        <Section title="威胁评估" code="THREAT">
          <RenderValue value={details.threatAssessment} />
        </Section>
      )}

      {details.timeline && Array.isArray(details.timeline) && details.timeline.length > 0 && (
        <Section title="时间记录" code="TIME">
          <div className="space-y-0">
            {details.timeline.map((entry: Record<string, unknown>, i: number) => (
              <div key={i} className="relative pl-6 pb-4 last:pb-0">
                <div className="absolute left-[7px] top-1.5 w-1.5 h-1.5 rounded-full bg-[#e60012]" />
                {i < (details.timeline as unknown[]).length - 1 && (
                  <div className="absolute left-[9px] top-3 w-px h-full bg-[#e60012]/20" />
                )}
                <div className="text-xs text-[#e60012] mb-1">{String(entry.time || '')}</div>
                <p className="text-xs text-[#888888] leading-relaxed">{String(entry.event || '')}</p>
                {!!entry.location && <p className="text-xs text-[#666666] mt-0.5">地点: {String(entry.location)}</p>}
                {!!entry.personnel && <p className="text-xs text-[#666666]">人员: {String(entry.personnel)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.events && Array.isArray(details.events) && details.events.length > 0 && (
        <Section title="事件记录" code="EVTS">
          <div className="space-y-0">
            {details.events.map((event: Record<string, unknown>, i: number) => (
              <div key={i} className="relative pl-6 pb-4 last:pb-0">
                <div className="absolute left-[7px] top-1.5 w-1.5 h-1.5 rounded-full bg-[#e60012]" />
                {i < (details.events as unknown[]).length - 1 && (
                  <div className="absolute left-[9px] top-3 w-px h-full bg-[#e60012]/20" />
                )}
                <div className="text-xs text-[#e60012] mb-1">
                  {String(event.time || event.date || '')}
                  {!!event.threatLevel && <span className="text-[#d4a373] ml-2">{String(event.threatLevel)}</span>}
                </div>
                <p className="text-xs text-[#888888] leading-relaxed">{String(event.description || '')}</p>
                {!!event.response && <p className="text-xs text-[#666666] mt-1">响应: {String(event.response)}</p>}
                {!!event.location && <p className="text-xs text-[#666666] mt-0.5">地点: {String(event.location)}</p>}
                {!!event.casualties && <p className="text-xs text-[#e60012] mt-1">伤亡: {String(event.casualties)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasResponseMeasures && (
        <Section title="响应措施" code="RESP">
          <div className="space-y-3">
            {(details.responseMeasures as unknown[]).map((measure: unknown, i: number) => {
              const m = measure as Record<string, unknown>
              if (!Object.values(m).some(v => hasContent(v))) return null
              return (
                <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#d4a373] font-medium">{String(m.measureType || m.phase || '')}</span>
                    {!!m.status && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#d4a373]/10 text-[#d4a373]">{String(m.status)}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#888888] leading-relaxed">{String(m.action || m.description || '')}</p>
                  {!!m.department && <p className="text-xs text-[#666666] mt-1">负责部门: {String(m.department)}</p>}
                  {!!m.result && <p className="text-xs text-[#666666] mt-1">结果: {String(m.result)}</p>}
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {hasContent(details.currentStatus) && (
        <Section title="当前状态" code="CURR">
          {renderStatus(details.currentStatus)}
        </Section>
      )}

      {details.appendices && Array.isArray(details.appendices) && details.appendices.length > 0 && (
        <Section title="附录" code="APPX">
          <div className="space-y-2">
            {details.appendices.map((appendix: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-[#d4a373] mt-0.5">{String(appendix.code || '')}</span>
                <div>
                  {!!appendix.title && <p className="text-xs text-[#f0f0f0]">{String(appendix.title)}</p>}
                  {!!appendix.content && <p className="text-xs text-[#888888]">{String(appendix.content)}</p>}
                  {!!appendix.description && !appendix.title && <p className="text-xs text-[#888888]">{String(appendix.description)}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

// 通信记录内容渲染
function CommunicationTranscriptContent({ details }: { details: Record<string, unknown> }) {
  // 通信基本信息合并显示
  const hasCommInfo = details.communicationType || details.communicationTime || details.channel || details.mainParties || details.purpose

  return (
    <>
      {hasCommInfo && (
        <div className="border border-white/10 rounded p-3 mb-4">
          <div className="text-xs text-[#d4a373] mb-2 font-medium">通信概要</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {details.communicationType != null && (
              <div><span className="text-[#666666]">通信类型：</span><span className="text-[#888888]">{String(details.communicationType)}</span></div>
            )}
            {details.communicationTime != null && (
              <div><span className="text-[#666666]">通信时间：</span><span className="text-[#888888]">{String(details.communicationTime)}</span></div>
            )}
            {details.channel != null && (
              <div><span className="text-[#666666]">通信渠道：</span><span className="text-[#888888]">{String(details.channel)}</span></div>
            )}
            {details.mainParties != null && (
              <div><span className="text-[#666666]">主要参与方：</span><span className="text-[#888888]">{String(details.mainParties)}</span></div>
            )}
            {details.purpose != null && (
              <div className="md:col-span-2"><span className="text-[#666666]">通信目的：</span><span className="text-[#888888]">{String(details.purpose)}</span></div>
            )}
          </div>
        </div>
      )}

      {details.entries && Array.isArray(details.entries) && details.entries.length > 0 && (
        <Section title="通信记录" code="LOG">
          <div className="space-y-4">
            {details.entries.map((entry: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#d4a373]" style={{ fontFamily: MONO }}>{String(entry.timestamp || '')}</span>
                  <span className="text-xs text-[#f0f0f0] font-medium">{String(entry.party || '')}</span>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed">{String(entry.content || '')}</p>
                {!!entry.note && <p className="text-xs text-[#666666] mt-1">备注: {String(entry.note)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.keyEvents && Array.isArray(details.keyEvents) && details.keyEvents.length > 0 && (
        <Section title="关键事件" code="KEY">
          <div className="space-y-3">
            {details.keyEvents.map((event: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                <div className="text-xs text-[#d4a373] font-medium">{String(event.code || '')}</div>
                <p className="text-xs text-[#888888]">{String(event.description || '')}</p>
                <p className="text-xs text-[#666666]">影响: {String(event.impact || '')}</p>
                <p className="text-xs text-[#666666]">响应: {String(event.response || '')}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.analysis && Array.isArray(details.analysis) && details.analysis.length > 0 && (
        <Section title="分析" code="ANAL">
          <div className="space-y-2">
            {details.analysis.map((item: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-[#d4a373] mt-0.5">•</span>
                <div>
                  <span className="text-xs text-[#f0f0f0]">{String(item.item || '')}:</span>
                  <span className="text-xs text-[#888888]"> {String(item.conclusion || '')}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.suggestedMeasures && Array.isArray(details.suggestedMeasures) && details.suggestedMeasures.length > 0 && (
        <Section title="建议措施" code="MEAS">
          <div className="space-y-2">
            {details.suggestedMeasures.map((measure: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-[#4ade80] mt-0.5">✓</span>
                <div>
                  <span className="text-xs text-[#f0f0f0]">{String(measure.type || '')}:</span>
                  <span className="text-xs text-[#888888]"> {String(measure.measures || '')}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.appendices && Array.isArray(details.appendices) && details.appendices.length > 0 && (
        <Section title="附录" code="APPX">
          <div className="space-y-2">
            {details.appendices.map((appendix: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-[#d4a373] mt-0.5">{String(appendix.code || '')}</span>
                <span className="text-xs text-[#888888]">{String(appendix.content || '')}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

// 人事档案内容渲染（简历样式）
function PersonnelFileContent({ details: _details }: { details: Record<string, unknown> }) {
  const details = _details as any
  return (
    <div>
      {/* ===== Header ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {details.workExperience && Array.isArray(details.workExperience) && details.workExperience.length > 0 && (
            <div className="border border-white/10 p-5" style={{ background: 'rgba(17,17,17,0.6)' }}>
              <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-4" style={{ fontFamily: MONO }}>WORK / 工作经历</h2>
              <div className="relative pl-4 border-l border-[#d4a373]/30 space-y-5">
                {details.workExperience.map((work: Record<string, unknown>, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#d4a373]" />
                    <div className="text-xs text-[#666666] mb-0.5" style={{ fontFamily: MONO }}>{String(work.period || '')}</div>
                    <div className="text-sm text-[#f0f0f0] font-medium">{String(work.position || '')}</div>
                    <div className="text-xs text-[#d4a373] mb-1">{String(work.organization || '')}</div>
                    {!!work.responsibilities && <p className="text-xs text-[#888888] leading-relaxed">{String(work.responsibilities)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.education && Array.isArray(details.education) && details.education.length > 0 && (
            <div className="border border-white/10 p-5" style={{ background: 'rgba(17,17,17,0.6)' }}>
              <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-4" style={{ fontFamily: MONO }}>EDUCATION / 教育背景</h2>
              <div className="relative pl-4 border-l border-[#60a5fa]/30 space-y-4">
                {details.education.map((edu: Record<string, unknown>, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#60a5fa]" />
                    <div className="text-xs text-[#666666] mb-0.5" style={{ fontFamily: MONO }}>{String(edu.period || '')}</div>
                    <div className="text-sm text-[#f0f0f0] font-medium">{String(edu.institution || '')}</div>
                    <div className="text-xs text-[#888888]">{String(edu.degree || '')}{edu.field ? ' · ' + String(edu.field) : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.performanceRecords && Array.isArray(details.performanceRecords) && details.performanceRecords.length > 0 && (
            <div className="border border-white/10 p-5" style={{ background: 'rgba(17,17,17,0.6)' }}>
              <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-4" style={{ fontFamily: MONO }}>PERFORMANCE / 绩效记录</h2>
              <div className="space-y-3">
                {details.performanceRecords.map((record: Record<string, unknown>, i: number) => (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-[#d4a373]" style={{ fontFamily: MONO }}>{String(record.time || record.period || '')}</span>
                      <span className="text-xs text-[#f0f0f0]">{String(record.workItem || record.project || '')}</span>
                    </div>
                    <p className="text-xs text-[#888888]">{String(record.evaluation || '')}</p>
                    {!!record.recorder && <p className="text-xs text-[#666666] mt-1">记录人: {String(record.recorder)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {details.skills && Array.isArray(details.skills) && details.skills.length > 0 && (
            <div className="border border-white/10 p-4" style={{ background: 'rgba(17,17,17,0.6)' }}>
              <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-3" style={{ fontFamily: MONO }}>SKILLS / 专业技能</h2>
              <div className="flex flex-wrap gap-1.5">
                {details.skills.map((skill: string, i: number) => (
                  <span key={i} className="text-[10px] text-[#888888] border border-white/10 px-2 py-0.5">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {details.qualifications && Array.isArray(details.qualifications) && details.qualifications.length > 0 && (
            <div className="border border-white/10 p-4" style={{ background: 'rgba(17,17,17,0.6)' }}>
              <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-3" style={{ fontFamily: MONO }}>CERTIFICATIONS / 资质证书</h2>
              <ul className="space-y-1">
                {details.qualifications.map((qual: string, i: number) => (
                  <li key={i} className="text-xs text-[#888888]">• {qual}</li>
                ))}
              </ul>
            </div>
          )}

          {details.trainingRecords && Array.isArray(details.trainingRecords) && details.trainingRecords.length > 0 && (
            <div className="border border-white/10 p-4" style={{ background: 'rgba(17,17,17,0.6)' }}>
              <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-3" style={{ fontFamily: MONO }}>TRAINING / 培训记录</h2>
              <div className="space-y-2">
                {details.trainingRecords.map((training: unknown, i: number) => {
                  if (typeof training === 'string') return <div key={i} className="text-xs text-[#888888]">• {training}</div>
                  if (typeof training === 'object' && training !== null) {
                    const t = training as Record<string, unknown>
                    return (
                      <div key={i} className="border-b border-white/5 pb-1 last:border-0">
                        <span className="text-[10px] text-[#d4a373]">{String(t.time || t.date || '')}</span>
                        <span className="text-xs text-[#f0f0f0] ml-1">{String(t.content || t.title || '')}</span>
                        {!!t.effect && <span className="text-[10px] text-[#4ade80] ml-1">✓ {String(t.effect)}</span>}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}

          {details.evaluations && Array.isArray(details.evaluations) && details.evaluations.length > 0 && (
            <div className="border border-white/10 p-4" style={{ background: 'rgba(17,17,17,0.6)' }}>
              <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-3" style={{ fontFamily: MONO }}>EVALUATIONS / 评估结果</h2>
              <div className="space-y-2">
                {details.evaluations.map((evalItem: Record<string, unknown>, i: number) => (
                  <div key={i} className="border-b border-white/5 pb-1 last:border-0">
                    <div className="text-[10px] text-[#d4a373]">{String(evalItem.dimension || evalItem.type || '')}</div>
                    <p className="text-xs text-[#f0f0f0]">{String(evalItem.result || '')}</p>
                    {!!evalItem.notes && <p className="text-[10px] text-[#888888]">{String(evalItem.notes)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.careerSuggestions && Array.isArray(details.careerSuggestions) && details.careerSuggestions.length > 0 && (
            <div className="border border-white/10 p-4" style={{ background: 'rgba(17,17,17,0.6)' }}>
              <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-3" style={{ fontFamily: MONO }}>CAREER / 职业建议</h2>
              <div className="space-y-1">
                {details.careerSuggestions.map((suggestion: unknown, i: number) => {
                  if (typeof suggestion === 'string') return <div key={i} className="text-xs text-[#888888]">• {suggestion}</div>
                  if (typeof suggestion === 'object' && suggestion !== null) {
                    const s = suggestion as Record<string, unknown>
                    return (
                      <p key={i} className="text-xs text-[#888888]">
                        {s.direction || s.type ? <span className="text-[#d4a373]">{String(s.direction || s.type)}: </span> : ''}
                        {String(s.suggestion || s.description || '')}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {details.specialNotes && (
        <div className="border border-white/10 p-5 mt-6" style={{ background: 'rgba(17,17,17,0.6)' }}>
          <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-3" style={{ fontFamily: MONO }}>NOTES / 特殊备注</h2>
          {Array.isArray(details.specialNotes) ? (
            <div className="space-y-2">
              {details.specialNotes.map((note: unknown, i: number) => {
                if (typeof note === 'string') return <p key={i} className="text-xs text-[#888888]">{note}</p>
                if (typeof note === 'object' && note !== null) {
                  const n = note as Record<string, unknown>
                  return (
                    <p key={i} className="text-xs text-[#888888]">
                      {n.note || n.type ? <span className="text-[#d4a373]">{String(n.note || n.type)}: </span> : ''}
                      {String(n.detail || n.description || '')}
                    </p>
                  )
                }
                return null
              })}
            </div>
          ) : (
            <p className="text-sm text-[#888888] leading-relaxed">{String(details.specialNotes)}</p>
          )}
        </div>
      )}

      {details.archiveChanges && Array.isArray(details.archiveChanges) && details.archiveChanges.length > 0 && (
        <div className="border border-white/10 p-5 mt-4" style={{ background: 'rgba(17,17,17,0.6)' }}>
          <h2 className="text-xs text-[#d4a373] tracking-widest uppercase mb-3" style={{ fontFamily: MONO }}>HISTORY / 档案变更</h2>
          <div className="space-y-1">
            {details.archiveChanges.map((change: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-[#d4a373] whitespace-nowrap" style={{ fontFamily: MONO }}>{String(change.date || '')}</span>
                <span className="text-[#888888]">{String(change.description || '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
// 医疗报告内容渲染
function MedicalReportContent({ details }: { details: Record<string, unknown> }) {
  const hasDiagnosisInfo = details.executiveSummary || details.mechanismAnalysis

  return (
    <>
      {hasDiagnosisInfo && (
        <div className="border border-white/10 rounded p-3 mb-4">
          <div className="text-xs text-[#d4a373] mb-2 font-medium">诊断概要</div>
          <div className="space-y-2 text-xs">
            {hasContent(details.executiveSummary) && typeof details.executiveSummary === 'object' && !Array.isArray(details.executiveSummary) ? (
              <div>
                <div className="text-[#666666] mb-1">执行摘要：</div>
                <div className="space-y-1 pl-2">
                  {Object.entries(details.executiveSummary as Record<string, unknown>).map(([k, v]) => (
                    <div key={k}><span className="text-[#666666]">{formatKey(k)}：</span><span className="text-[#888888]">{String(v)}</span></div>
                  ))}
                </div>
              </div>
            ) : hasContent(details.executiveSummary) && (
              <div><span className="text-[#666666]">执行摘要：</span><span className="text-[#888888]">{String(details.executiveSummary)}</span></div>
            )}
            {hasContent(details.mechanismAnalysis) && typeof details.mechanismAnalysis === 'object' && !Array.isArray(details.mechanismAnalysis) ? (
              <div>
                <div className="text-[#666666] mb-1">机制分析：</div>
                <div className="space-y-1 pl-2">
                  {Object.entries(details.mechanismAnalysis as Record<string, unknown>).map(([k, v]) => (
                    <div key={k}><span className="text-[#666666]">{formatKey(k)}：</span><span className="text-[#888888]">{String(v)}</span></div>
                  ))}
                </div>
              </div>
            ) : hasContent(details.mechanismAnalysis) && (
              <div><span className="text-[#666666]">机制分析：</span><span className="text-[#888888]">{String(details.mechanismAnalysis)}</span></div>
            )}
          </div>
        </div>
      )}

      {details.coreHazards && Array.isArray(details.coreHazards) && details.coreHazards.length > 0 && (
        <Section title="核心危害" code="HAZ">
          <div className="space-y-3">
            {details.coreHazards.map((hazard: unknown, i: number) => {
              if (typeof hazard === 'string') {
                return (
                  <div key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                    <span className="text-[#e60012] mt-0.5">⚠</span>
                    {hazard}
                  </div>
                )
              }
              if (typeof hazard === 'object' && hazard !== null) {
                const h = hazard as Record<string, unknown>
                return (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                    <div className="text-xs text-[#e60012] font-medium mb-1">{String(h.type || '')}</div>
                    <p className="text-xs text-[#888888] leading-relaxed">{String(h.mechanism || h.description || '')}</p>
                  </div>
                )
              }
              return null
            })}
          </div>
        </Section>
      )}

      {details.clinicalStages && Array.isArray(details.clinicalStages) && details.clinicalStages.length > 0 && (
        <Section title="临床阶段" code="STAGE">
          <div className="mb-4">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={details.clinicalStages.map((s: Record<string, unknown>) => ({
                  name: String(s.name || '').substring(0, 4),
                  severity: (String(s.duration || '').match(/\d+/)?.[0] || '0').length * 10,
                }))}>
                  <PolarGrid stroke="rgba(255,255,255,0.15)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#cccccc', fontSize: 11 }} />
                  <Radar name="severity" dataKey="severity" stroke="#d4a373" fill="#d4a373" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4">
            {details.clinicalStages.map((stage: Record<string, unknown>, i: number) => (
              <div key={i} className="border-l-2 border-[#d4a373]/30 pl-4">
                <div className="text-xs text-[#d4a373] font-medium mb-1">{String(stage.name || '')}</div>
                <p className="text-xs text-[#888888]"><span className="text-[#666666]">时长：</span>{String(stage.duration || '')}</p>
                <p className="text-xs text-[#888888]"><span className="text-[#666666]">症状：</span>{String(stage.symptoms || '')}</p>
                <p className="text-xs text-[#888888]"><span className="text-[#666666]">生理指标：</span>{String(stage.physicalIndicators || '')}</p>
                <p className="text-xs text-[#888888]"><span className="text-[#666666]">心理指标：</span>{String(stage.psychologicalIndicators || '')}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.treatmentDifficulties && Array.isArray(details.treatmentDifficulties) && details.treatmentDifficulties.length > 0 && (
        <Section title="治疗难点" code="DIFF">
          <div className="space-y-3">
            {details.treatmentDifficulties.map((diff: unknown, i: number) => {
              if (typeof diff === 'string') {
                return (
                  <div key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                    <span className="text-[#e60012] mt-0.5">•</span>
                    {diff}
                  </div>
                )
              }
              if (typeof diff === 'object' && diff !== null) {
                const d = diff as Record<string, unknown>
                return (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                    <div className="text-xs text-[#e60012] font-medium mb-1">{String(d.type || '')}</div>
                    <p className="text-xs text-[#888888] leading-relaxed">{String(d.description || '')}</p>
                  </div>
                )
              }
              return null
            })}
          </div>
        </Section>
      )}

      {details.treatmentPlans && Array.isArray(details.treatmentPlans) && details.treatmentPlans.length > 0 && (
        <Section title="治疗方案" code="PLAN">
          <div className="space-y-3">
            {details.treatmentPlans.map((plan: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                <div className="text-sm text-[#f0f0f0] font-medium mb-1">{String(plan.stage || plan.name || '')}</div>
                {plan.target != null && <p className="text-xs text-[#d4a373]">目标: {String(plan.target)}</p>}
                {plan.method != null && <p className="text-xs text-[#888888]">方法: {String(plan.method)}</p>}
                {plan.measures != null && <p className="text-xs text-[#888888]">措施: {String(plan.measures)}</p>}
                {plan.description != null && <p className="text-xs text-[#888888]">{String(plan.description)}</p>}
                {!!plan.effectiveness && <p className="text-xs text-[#4ade80] mt-1">有效性: {String(plan.effectiveness)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.recommendations && Array.isArray(details.recommendations) && details.recommendations.length > 0 && (
        <Section title="建议" code="REC">
          <div className="space-y-3">
            {details.recommendations.map((rec: unknown, i: number) => {
              if (typeof rec === 'string') {
                return (
                  <div key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                    <span className="text-[#4ade80] mt-0.5">✓</span>
                    {rec}
                  </div>
                )
              }
              if (typeof rec === 'object' && rec !== null) {
                const r = rec as Record<string, unknown>
                return (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                    <div className="text-xs text-[#4ade80] font-medium mb-1">{String(r.type || '')}</div>
                    <p className="text-xs text-[#888888] leading-relaxed">{String(r.measures || r.description || '')}</p>
                  </div>
                )
              }
              return null
            })}
          </div>
        </Section>
      )}
    </>
  )
}

// 实验记录内容渲染
function ExperimentLogContent({ details }: { details: Record<string, unknown> }) {
  const hasBasicInfo = details.experimentDate || details.leadDepartment || details.experimentLead || details.dataSource || details.contentScope || details.experimentPurpose || details.experimentType || details.safetyLevel

  return (
    <>
      {hasBasicInfo && (
        <div className="border border-white/10 rounded p-3 mb-4">
          <div className="text-xs text-[#d4a373] mb-2 font-medium">实验概要</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {details.experimentDate != null && (
              <div><span className="text-[#666666]">实验日期：</span><span className="text-[#888888]">{String(details.experimentDate)}</span></div>
            )}
            {details.leadDepartment != null && (
              <div><span className="text-[#666666]">主导部门：</span><span className="text-[#888888]">{String(details.leadDepartment)}</span></div>
            )}
            {details.experimentLead != null && (
              <div><span className="text-[#666666]">实验主管：</span><span className="text-[#888888]">{String(details.experimentLead)}</span></div>
            )}
            {details.safetyLevel != null && (
              <div><span className="text-[#666666]">安全等级：</span><span className="text-[#888888]">{String(details.safetyLevel)}</span></div>
            )}
            {details.dataSource != null && (
              <div><span className="text-[#666666]">数据来源：</span><span className="text-[#888888]">{String(details.dataSource)}</span></div>
            )}
            {details.contentScope != null && (
              <div><span className="text-[#666666]">内容范围：</span><span className="text-[#888888]">{String(details.contentScope)}</span></div>
            )}
            {details.experimentPurpose != null && (
              <div className="md:col-span-2"><span className="text-[#666666]">实验目的：</span><span className="text-[#888888]">{String(details.experimentPurpose)}</span></div>
            )}
            {details.experimentType != null && (
              <div><span className="text-[#666666]">实验类型：</span><span className="text-[#888888]">{String(details.experimentType)}</span></div>
            )}
          </div>
        </div>
      )}

      {details.objectives && Array.isArray(details.objectives) && details.objectives.length > 0 && (
        <Section title="实验目标" code="OBJ">
          <div className="space-y-2">
            {details.objectives.map((obj: unknown, i: number) => {
              if (typeof obj === 'string') {
                return (
                  <div key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                    <span className="text-[#d4a373] mt-0.5">•</span>
                    {obj}
                  </div>
                )
              }
              if (typeof obj === 'object' && obj !== null) {
                const o = obj as Record<string, unknown>
                return (
                  <div key={i} className="border-b border-white/5 pb-1 last:border-0">
                    <span className="text-xs text-[#d4a373]">{String(o.code || '')}</span>
                    <span className="text-xs text-[#f0f0f0] ml-1">{String(o.objective || o.name || '')}</span>
                    {!!o.expectedResult && <p className="text-xs text-[#4ade80] mt-0.5">预期: {String(o.expectedResult)}</p>}
                  </div>
                )
              }
              return null
            })}
          </div>
        </Section>
      )}

      {details.objectDescription && (
        <Section title="对象描述" code="OBJD">
          <p className="text-sm text-[#888888] leading-relaxed">{String(details.objectDescription)}</p>
        </Section>
      )}

      {details.knownCharacteristics && Array.isArray(details.knownCharacteristics) && details.knownCharacteristics.length > 0 && (
        <Section title="已知特征" code="CHAR">
          <ul className="space-y-1">
            {details.knownCharacteristics.map((char: string, i: number) => (
              <li key={i} className="text-xs text-[#888888]">• {char}</li>
            ))}
          </ul>
        </Section>
      )}

      {details.environment && typeof details.environment === 'object' && (
        <Section title="实验环境" code="ENV">
          <RenderValue value={details.environment} />
        </Section>
      )}

      {details.testResults && Array.isArray(details.testResults) && details.testResults.length > 0 && (
        <Section title="测试结果" code="RES">
          <div className="mb-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={details.testResults.map((r: Record<string, unknown>) => ({
                    name: String(r.item || r.test || '').substring(0, 6),
                    anomaly: String(r.anomalyLevel || '').length,
                  }))}
                  margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis dataKey="name" tick={{ fill: chartTheme.text, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: chartTheme.text, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} wrapperStyle={{ background: 'transparent', border: 'none', outline: 'none' }} />
                  <Bar dataKey="anomaly" fill={chartTheme.bar} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            {details.testResults.map((result: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                <div className="text-sm text-[#f0f0f0] font-medium mb-1">{String(result.test || result.item || '')}</div>
                <p className="text-xs text-[#888888]">测值: {String(result.measuredValue || result.result || '')}</p>
                {result.standardValue != null && <p className="text-xs text-[#666666]">标准: {String(result.standardValue)}</p>}
                {result.anomalyLevel != null && <p className="text-xs text-[#d4a373] mt-1">异常: {String(result.anomalyLevel)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.experimentRounds && Array.isArray(details.experimentRounds) && details.experimentRounds.length > 0 && (
        <Section title="实验轮次" code="ROUND">
          <div className="space-y-3">
            {details.experimentRounds.map((round: Record<string, unknown>, i: number) => (
              <div key={i} className="border-l-2 border-[#d4a373]/30 pl-4">
                <div className="text-xs text-[#d4a373] font-medium mb-1">{String(round.round || '')}</div>
                <p className="text-xs text-[#888888]">{String(round.description || '')}</p>
                {!!round.result && <p className="text-xs text-[#f0f0f0] mt-1">结果: {String(round.result)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.observations && Array.isArray(details.observations) && details.observations.length > 0 && (
        <Section title="观察记录" code="OBS">
          <div className="space-y-3">
            {details.observations.map((obs: unknown, i: number) => {
              if (typeof obs === 'string') {
                return (
                  <div key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                    <span className="text-[#d4a373] mt-0.5">•</span>
                    {obs}
                  </div>
                )
              }
              if (typeof obs === 'object' && obs !== null) {
                const o = obs as Record<string, unknown>
                return (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                    {!!o.time && <div className="text-xs text-[#d4a373] mb-1">{String(o.time)}</div>}
                    <p className="text-xs text-[#888888] leading-relaxed">{String(o.note || o.description || '')}</p>
                  </div>
                )
              }
              return null
            })}
          </div>
        </Section>
      )}

      {details.riskAssessments && Array.isArray(details.riskAssessments) && details.riskAssessments.length > 0 && (
        <Section title="风险评估" code="RISK">
          <div className="space-y-2">
            {details.riskAssessments.map((risk: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-xs text-[#e60012] mt-0.5">⚠</span>
                <div>
                  <span className="text-xs text-[#f0f0f0]">{String(risk.type || risk.riskType || '')}:</span>
                  <span className="text-xs text-[#888888]"> {String(risk.level || risk.threatLevel || '')}</span>
                  {!!(risk.mitigation || risk.potentialConsequence) && <p className="text-xs text-[#4ade80]">后果: {String(risk.mitigation || risk.potentialConsequence)}</p>}
                  {!!risk.probability && <p className="text-xs text-[#666666]">概率: {String(risk.probability)}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.safetyRequirements && Array.isArray(details.safetyRequirements) && details.safetyRequirements.length > 0 && (
        <Section title="安全要求" code="SAFER">
          <ul className="space-y-1">
            {details.safetyRequirements.map((req: string, i: number) => (
              <li key={i} className="text-xs text-[#888888]">• {req}</li>
            ))}
          </ul>
        </Section>
      )}

      {details.recommendedMeasures && Array.isArray(details.recommendedMeasures) && details.recommendedMeasures.length > 0 && (
        <Section title="推荐措施" code="MEAS">
          <ul className="space-y-2">
            {details.recommendedMeasures.map((measure: string, i: number) => (
              <li key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                <span className="text-[#4ade80] mt-0.5">✓</span>
                {measure}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {details.conclusions && Array.isArray(details.conclusions) && details.conclusions.length > 0 && (
        <Section title="实验结论" code="CONC">
          <div className="space-y-3">
            {details.conclusions.map((conc: unknown, i: number) => {
              if (typeof conc === 'string') {
                return (
                  <div key={i} className="text-xs text-[#888888] leading-relaxed flex items-start gap-2">
                    <span className="text-[#d4a373] mt-0.5">→</span>
                    {conc}
                  </div>
                )
              }
              if (typeof conc === 'object' && conc !== null) {
                const c = conc as Record<string, unknown>
                return (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                    <span className="text-xs text-[#d4a373] font-medium">{String(c.finding || c.type || '')}：</span>
                    <span className="text-xs text-[#888888]">{String(c.description || c.conclusion || '')}</span>
                  </div>
                )
              }
              return null
            })}
          </div>
        </Section>
      )}

      {details.threatLevelAssessment && (
        <Section title="威胁等级评估" code="THREAT">
          <p className="text-sm text-[#888888]">{String(details.threatLevelAssessment)}</p>
        </Section>
      )}

      {details.followUpSuggestions && Array.isArray(details.followUpSuggestions) && details.followUpSuggestions.length > 0 && (
        <Section title="后续建议" code="FOLL">
          <div className="space-y-2">
            {details.followUpSuggestions.map((suggestion: unknown, i: number) => {
              if (typeof suggestion === 'string') {
                return <div key={i} className="text-xs text-[#888888]">• {suggestion}</div>
              }
              if (typeof suggestion === 'object' && suggestion !== null) {
                const s = suggestion as Record<string, unknown>
                return (
                  <div key={i} className="border-b border-white/5 pb-1 last:border-0">
                    <span className="text-xs text-[#d4a373]">{String(s.type || '')}:</span>
                    <span className="text-xs text-[#888888]"> {String(s.content || s.suggestion || '')}</span>
                    {!!s.priority && <span className="text-xs text-[#e60012] ml-2">({String(s.priority)})</span>}
                  </div>
                )
              }
              return null
            })}
          </div>
        </Section>
      )}
    </>
  )
}

// 理论文件内容渲染
function TheoreticalDocumentContent({ details }: { details: Record<string, unknown> }) {
  const hasDocInfo = details.abstract || details.coreConcept || details.introduction

  return (
    <>
      {hasDocInfo && (
        <div className="border border-white/10 rounded p-3 mb-4">
          <div className="text-xs text-[#d4a373] mb-2 font-medium">文档概要</div>
          <div className="space-y-2 text-xs">
            {hasContent(details.abstract) && (
              <div><span className="text-[#666666]">摘要：</span><span className="text-[#888888]">{String(details.abstract)}</span></div>
            )}
            {hasContent(details.coreConcept) && (
              <div><span className="text-[#666666]">核心概念：</span><span className="text-[#888888]">{String(details.coreConcept)}</span></div>
            )}
            {hasContent(details.introduction) && (
              <div><span className="text-[#666666]">引言：</span><span className="text-[#888888]">{String(details.introduction)}</span></div>
            )}
          </div>
        </div>
      )}

      {details.theoryComponents && Array.isArray(details.theoryComponents) && details.theoryComponents.length > 0 && (
        <Section title="理论组成" code="COMP">
          <div className="space-y-3">
            {details.theoryComponents.map((comp: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                <div className="text-sm text-[#f0f0f0] font-medium mb-1">{String(comp.component || comp.name || '')}</div>
                <p className="text-xs text-[#d4a373] mb-1">{String(comp.function || '')}</p>
                <p className="text-xs text-[#888888] leading-relaxed">{String(comp.mechanism || comp.description || '')}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.comparisonAnalysis && typeof details.comparisonAnalysis === 'object' && (
        <Section title="对比分析" code="COMPA">
          <RenderValue value={details.comparisonAnalysis} />
        </Section>
      )}

      {details.caseReevaluation && Array.isArray(details.caseReevaluation) && details.caseReevaluation.length > 0 && (
        <Section title="案例重评" code="CASE">
          <div className="space-y-3">
            {details.caseReevaluation.map((caseItem: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                <div className="text-sm text-[#f0f0f0] font-medium mb-1">{String(caseItem.case || '')}</div>
                <p className="text-xs text-[#888888]">{String(caseItem.reevaluation || '')}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.personnelScreening && Array.isArray(details.personnelScreening) && details.personnelScreening.length > 0 && (
        <Section title="人员筛查" code="SCREEN">
          <div className="space-y-3">
            {details.personnelScreening.map((item: unknown, i: number) => {
              if (typeof item === 'string') {
                return <div key={i} className="text-xs text-[#888888]">• {item}</div>
              }
              if (typeof item === 'object' && item !== null) {
                const s = item as Record<string, unknown>
                return (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[#e60012]">{String(s.category || '')}</span>
                      <span className="text-xs text-[#f0f0f0]">{String(s.type || '')}</span>
                      <span className="text-xs text-[#d4a373]">风险: {String(s.riskLevel || '')}</span>
                    </div>
                    <p className="text-xs text-[#888888]">  {String(s.action || '')} — {String(s.reason || '')}</p>
                  </div>
                )
              }
              return null
            })}
          </div>
        </Section>
      )}

      {details.equipmentProtocols && Array.isArray(details.equipmentProtocols) && details.equipmentProtocols.length > 0 && (
        <Section title="装备协议" code="EQUIP">
          <ul className="space-y-1">
            {details.equipmentProtocols.map((item: unknown, i: number) => (
              <li key={i} className="text-xs text-[#888888]">• {typeof item === 'string' ? item : String((item as Record<string, unknown>).description || (item as Record<string, unknown>).title || '')}</li>
            ))}
          </ul>
        </Section>
      )}

      {details.ultimateStrategy && (
        <Section title="最终策略" code="STRAT">
          <p className="text-sm text-[#888888] leading-relaxed">{String(details.ultimateStrategy)}</p>
        </Section>
      )}

      {details.hypothesisVerifications && Array.isArray(details.hypothesisVerifications) && details.hypothesisVerifications.length > 0 && (
        <Section title="假设验证" code="HYP">
          <div className="space-y-3">
            {details.hypothesisVerifications.map((hyp: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                <div className="text-sm text-[#f0f0f0] font-medium mb-1">{String(hyp.hypothesis || '')}</div>
                <p className="text-xs text-[#888888]">{String(hyp.verification || '')}</p>
                {!!hyp.result && <p className="text-xs text-[#d4a373] mt-1"> 结果: {String(hyp.result)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {details.appendixFiles && Array.isArray(details.appendixFiles) && details.appendixFiles.length > 0 && (
        <Section title="附录文件" code="APPX">
          <div className="space-y-2">
            {details.appendixFiles.map((file: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-[#d4a373] mt-0.5">{String(file.code || '')}</span>
                <span className="text-xs text-[#888888]">{String(file.title || '')}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

// 协议手册内容渲染
function ProtocolManualContent({ details }: { details: Record<string, unknown> }) {
  return (
    <>
      {details.version && (
        <Section title="版本" code="VER">
          <p className="text-sm text-[#888888]">{String(details.version)}</p>
        </Section>
      )}

      {details.effectiveDate && (
        <Section title="生效日期" code="DATE">
          <p className="text-sm text-[#888888]">{String(details.effectiveDate)}</p>
        </Section>
      )}

      {details.scope && (
        <Section title="适用范围" code="SCOPE">
          <p className="text-sm text-[#888888]">{String(details.scope)}</p>
        </Section>
      )}

      {details.sections && Array.isArray(details.sections) && details.sections.length > 0 && (
        <Section title="章节内容" code="SECT">
          <div className="space-y-4">
            {details.sections.map((section: Record<string, unknown>, i: number) => (
              <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                <div className="text-sm text-[#f0f0f0] font-medium mb-2">{String(section.title || '')}</div>
                {section.content && Array.isArray(section.content) ? (
                  <ul className="space-y-1">
                    {(section.content as unknown[]).map((item, j) => (
                      <li key={j} className="text-xs text-[#888888] leading-relaxed">• {String(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-[#888888] leading-relaxed whitespace-pre-wrap">{String(section.content || '')}</div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

// 通用动态详情渲染（备用）
function DynamicDetailsContent({ details }: { category: string; details: Record<string, unknown> }) {
  const entries = Object.entries(details)
  if (entries.length === 0) return null

  return (
    <>
      {entries.map(([key, value]) => {
        if (value === null || value === undefined) return null
        if (Array.isArray(value) && value.length === 0) return null
        if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return null

        const title = formatKey(key)
        const code = key.slice(0, 4).toUpperCase()

        return (
          <Section key={key} title={title} code={code}>
            <RenderValue value={value} />
          </Section>
        )
      })}
    </>
  )
}

function formatKey(key: string): string {
  const map: Record<string, string> = {
    archiveNature: '档案性质',
    coreFeatures: '核心特征',
    properties: '特性分析',
    phases: '进程阶段',
    environmentFeatures: '环境特征',
    knownEntities: '已知实体',
    discoveryLocation: '发现地点',
    anomalyReport: '异常报告',
    responseTeam: '响应队伍',
    threatAssessments: '威胁评估',
    comparisonThreats: '对比威胁',
    protocols: '应对协议',
    accessRequirements: '访问要求',
    emergencyProcedures: '应急程序',
    behaviorGuidelines: '行为准则',
    missionCode: '任务代号',
    targetThreshold: '目标阈界',
    team: '勘探队伍',
    teamLeader: '队长',
    explorationDate: '勘探日期',
    missionStatus: '任务状态',
    missionOverview: '任务概述',
    teamMembers: '队伍成员',
    equipment: '装备清单',
    timeline: '时间线',
    discoveries: '关键发现',
    analysis_result: '分析结果',
    lessons: '经验教训',
    safetyRecommendations: '安全建议',
    followUpActions: '后续行动',
    incidentNature: '事件性质',
    symptomCharacteristics: '症状特征',
    confirmedCause: '确认原因',
    transmissionMechanism: '传播机制',
    threatAssessment: '威胁评估',
    events: '事件记录',
    responseMeasures: '响应措施',
    currentStatus: '当前状态',
    appendices: '附录',
    personnelInfo: '人员信息',
    education: '教育背景',
    workExperience: '工作经历',
    skills: '专业技能',
    qualifications: '资质证书',
    performanceRecords: '绩效记录',
    trainingRecords: '培训记录',
    evaluations: '评估结果',
    careerSuggestions: '职业建议',
    specialNotes: '特殊备注',
    archiveChanges: '档案变更',
    accessRecords: '访问记录',
    executiveSummary: '执行摘要',
    mechanismAnalysis: '机制分析',
    coreHazards: '核心危害',
    clinicalStages: '临床阶段',
    treatmentDifficulties: '治疗难点',
    treatmentPlans: '治疗方案',
    recommendations: '建议',
    experimentDate: '实验日期',
    leadDepartment: '主导部门',
    experimentLead: '实验主管',
    dataSource: '数据来源',
    contentScope: '内容范围',
    experimentPurpose: '实验目的',
    experimentType: '实验类型',
    safetyLevel: '安全等级',
    objectives: '实验目标',
    objectDescription: '对象描述',
    knownCharacteristics: '已知特征',
    environment: '实验环境',
    testResults: '测试结果',
    experimentRounds: '实验轮次',
    observations: '观察记录',
    riskAssessments: '风险评估',
    safetyRequirements: '安全要求',
    recommendedMeasures: '推荐措施',
    conclusions: '实验结论',
    threatLevelAssessment: '威胁等级评估',
    followUpSuggestions: '后续建议',
    abstract: '摘要',
    introduction: '引言',
    coreConcept: '核心概念',
    theoryComponents: '理论组成',
    comparisonAnalysis: '对比分析',
    caseReevaluation: '案例重评',
    personnelScreening: '人员筛查',
    equipmentProtocols: '装备协议',
    ultimateStrategy: '最终策略',
    hypothesisVerifications: '假设验证',
    appendixFiles: '附录文件',
    communicationType: '通信类型',
    communicationTime: '通信时间',
    channel: '通信渠道',
    mainParties: '主要参与方',
    purpose: '通信目的',
    entries: '通信记录',
    keyEvents: '关键事件',
    analysis: '分析',
    suggestedMeasures: '建议措施',
    version: '版本',
    effectiveDate: '生效日期',
    scope: '适用范围',
    sections: '章节内容',
    // 通用键翻译
    physical: '物理环境',
    cognitive: '认知环境',
    item: '项目',
    test: '测试项',
    round: '轮次',
    measuredValue: '测量值',
    standardValue: '标准值',
    anomalyLevel: '异常等级',
    note: '备注',
    location: '地点',
    personnel: '人员',
    type: '类型',
    level: '等级',
    riskType: '风险类型',
    riskLevel: '风险等级',
    mitigation: '缓解措施',
    potentialConsequence: '潜在后果',
    probability: '概率',
    finding: '发现',
    description: '描述',
    priority: '优先级',
    content: '内容',
    suggestion: '建议',
    stage: '阶段',
    target: '目标',
    method: '方法',
    measures: '措施',
    effectiveness: '有效性',
    duration: '时长',
    symptoms: '症状',
    physicalIndicators: '生理指标',
    psychologicalIndicators: '心理指标',
    mechanism: '机制',
    manifestation: '表现',
    keyIndicator: '关键指标',
    behavior: '行为',
    dangerLevel: '危险等级',
    contactRecord: '接触记录',
    category: '类别',
    scope_range: '范围',
    susceptibilityReason: '易感原因',
    recommendedAction: '建议行动',
    procedureName: '流程名称',
    department: '部门',
    result: '结果',
    dimension: '维度',
    performance: '表现',
    direction: '方向',
    time: '时间',
    date: '日期',
    status: '状态',
    title: '标题',
    code: '编码',
    name: '名称',
  }
  return map[key] || key
}

function RenderValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) return null

  if (typeof value === 'string') {
    return <p className="text-sm text-[#888888] leading-relaxed whitespace-pre-line">{value}</p>
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return <p className="text-sm text-[#f0f0f0]">{String(value)}</p>
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="border-b border-white/5 pb-3 last:border-0">
            {typeof item === 'string' ? (
              <p className="text-sm text-[#888888]">{item}</p>
            ) : typeof item === 'object' && item !== null ? (
              <div className="space-y-1">
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} className="text-xs">
                    <span className="text-[#666666]">{formatKey(k)}：</span>
                    <span className="text-[#888888]">{typeof v === 'string' ? v : JSON.stringify(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#888888]">{String(item)}</p>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === 'object') {
    return (
      <div className="space-y-2">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="text-sm">
            <span className="text-[#666666]">{formatKey(k)}：</span>
            <span className="text-[#888888]">{typeof v === 'string' ? v : JSON.stringify(v)}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}
