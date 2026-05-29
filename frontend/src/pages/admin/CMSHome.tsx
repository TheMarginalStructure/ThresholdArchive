import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import CMSLayout from '../../components/CMSLayout'
import { MONO } from '../../utils/fonts'
import { api } from '../../lib/api'

interface Stats {
  archives: number
  news: number
  equipment: number
  reviews: number
  reviewsVerified: number
  announcements: number
}

const STAT_CARDS = [
  { key: 'archives', label: '档案总数', icon: '📄', color: '#d4a373', link: '/admin/archives' },
  { key: 'news', label: '新闻通报', icon: '📰', color: '#d4a373', link: '/admin/news' },
  { key: 'equipment', label: '装备物资', icon: '🔧', color: '#4ade80', link: '/admin/equipment' },
  { key: 'reviews', label: '用户评价', icon: '⭐', color: '#d4a373', link: '/admin/reviews' },
  { key: 'reviewsVerified', label: '已验证评价', icon: '✅', color: '#4ade80' },
  { key: 'announcements', label: '系统公告', icon: '📢', color: '#d4a373', link: '/admin/announcements' },
]

const QUICK_LINKS = [
  { label: '新建档案', path: '/admin/archives/new', desc: '创建新的威胁档案或勘探报告' },
  { label: '发布新闻', path: '/admin/news/new', desc: '发布组织新闻通报' },
  { label: '添加入库装备', path: '/admin/equipment/new', desc: '登记新装备物资' },
  { label: '发布公告', path: '/admin/announcements/new', desc: '发布系统公告' },
]

export default function CMSHome() {
  const [stats, setStats] = useState<Stats>({
    archives: 0, news: 0, equipment: 0, reviews: 0, reviewsVerified: 0, announcements: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.cms.stats()
        setStats(data)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <CMSLayout>
      <div className="mb-8">
        <h1 className="text-xl font-medium">控制台</h1>
        <p className="text-xs text-[#888888] mt-1">阈界档案库 · 内容管理系统</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {STAT_CARDS.map((card) => {
          const value = stats[card.key as keyof Stats]
          const content = (
            <div
              key={card.key}
              className="border border-white/[0.06] rounded p-4 bg-[#0c0c0c] hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{card.icon}</span>
                {loading ? (
                  <div className="w-8 h-4 bg-white/5 rounded animate-pulse" />
                ) : (
                  <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: MONO, color: card.color }}>
                    {value}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#666]" style={{ fontFamily: MONO }}>
                {card.label}
              </span>
            </div>
          )

          if (card.link) {
            return <Link key={card.key} to={card.link}>{content}</Link>
          }
          return <div key={card.key}>{content}</div>
        })}
      </div>

      <div className="border border-white/[0.06] rounded p-5 bg-[#0c0c0c]">
        <h2 className="text-sm font-medium mb-4" style={{ color: '#d4a373', fontFamily: MONO }}>
          QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_LINKS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-start gap-3 p-3 rounded border border-white/[0.04] hover:border-white/10 transition-colors hover:bg-white/[0.01]"
            >
              <span className="text-sm mt-0.5" style={{ color: '#d4a373' }}>+</span>
              <div>
                <div className="text-xs text-[#f0f0f0] font-medium">{item.label}</div>
                <div className="text-[10px] text-[#555] mt-0.5">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </CMSLayout>
  )
}