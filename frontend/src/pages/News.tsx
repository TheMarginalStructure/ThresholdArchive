import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { api, type ApiNewsBulletin } from '../lib/api'

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  WARN: { label: '警告', color: '#e60012' },
  OK: { label: '正常', color: '#4ade80' },
  INFO: { label: '通知', color: '#888888' },
  NEW: { label: '新增', color: '#d4a373' },
}

export default function News() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [news, setNews] = useState<ApiNewsBulletin[]>([])
  const [loading, setLoading] = useState(true)

  const categories = ['全部', '阈界内', '组织新闻', '协议修订']

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (activeCategory !== '全部') params.category = activeCategory
        const res = await api.news.list(params)
        setNews(res.data)
      } catch {
        setNews([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeCategory])

  return (
    <PageLayout
      breadcrumbs={[{ label: 'NEWS' }, { label: '最新通报' }]}
      title="最新通报 / News"
      subtitle="阈界动态、组织新闻、协议修订。本库的信息发布中心，所有消息都是真的——除非标了待验证。"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-1 mb-8 border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4 py-3 transition-colors ${activeCategory === cat ? 'text-[#d4a373] bg-[#d4a373]/10' : 'text-[#888888] hover:text-[#f0f0f0] hover:bg-white/5'}`}
              data-cursor-hover
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4 px-4">
            <span className="text-xs text-[#888888]">共 {news.length} 条通报</span>
          </div>
        </div>

        {/* News List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border border-white/10 p-4 animate-pulse" style={{ background: 'rgba(17,17,17,0.6)' }}>
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 bg-white/5 rounded" />
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <div className="h-4 w-12 bg-white/5 rounded" />
                      <div className="h-4 w-8 bg-white/5 rounded" />
                    </div>
                    <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
                    <div className="h-4 w-full bg-white/5 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-[#888888]">
            <p className="text-lg mb-2">暂无通报</p>
            <p className="text-xs">当前分类下没有新闻通报</p>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => {
              const p = PRIORITY_MAP[item.priority] || PRIORITY_MAP.INFO
              return (
                <div
                  key={item.id}
                  className="border border-white/10 p-4 hover:border-white/20 transition-all cursor-pointer group"
                  style={{ background: 'rgba(17, 17, 17, 0.6)' }}
                  data-cursor-hover
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div
                      className="w-20 h-20 rounded border border-white/10 flex-shrink-0 flex items-center justify-center text-2xl"
                      style={{ background: 'rgba(20,20,20,0.8)' }}
                    >
                      {item.category === '阈界内' ? '◈' : item.category === '协议修订' ? '⬡' : '◎'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ color: p.color, background: `${p.color}20` }}
                        >
                          {p.label}
                        </span>
                        <span className="text-[10px] text-[#888888]">{item.category}</span>
                        <span className="text-[10px] text-[#666666] ml-auto">
                          {new Date(item.publishedAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>

                      <h3 className="text-sm text-[#f0f0f0] mb-1 group-hover:text-[#d4a373] transition-colors truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#888888] line-clamp-2">{item.summary || ''}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
