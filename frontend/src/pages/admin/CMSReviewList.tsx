import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import CMSLayout from '../../components/CMSLayout'
import { api, API_BASE } from '../../lib/api'

const RATING_LABELS: Record<number, string> = { 1: '极差', 2: '较差', 3: '一般', 4: '良好', 5: '优秀' }

export default function CMSReviewList() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRating, setFilterRating] = useState('')
  const [filterVerified, setFilterVerified] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = {}
      if (filterRating) params.rating = filterRating
      if (filterVerified) params.verified = filterVerified
      const list = await api.reviews.list(params)
      setReviews(list)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [filterRating, filterVerified])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此评价？')) return
    try {
      await fetch(`${API_BASE}/cms/reviews/${id}`, { method: 'DELETE' })
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch (e) { console.error(e) }
  }

  const handleToggleVerified = async (id: number, current: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/cms/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !current }),
      })
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, verified: !current } : r))
      }
    } catch (e) { console.error(e) }
  }

  const filtered = reviews.filter(r =>
    (!search || r.author.toLowerCase().includes(search.toLowerCase()) || r.content.toLowerCase().includes(search.toLowerCase()))
  )

  const renderStars = (rating: number) => {
    return (
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{ color: i <= rating ? '#d4a373' : '#333333' }}>★</span>
        ))}
      </span>
    )
  }

  return (
    <CMSLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">用户评价管理</h1>
          <p className="text-xs text-[#888888] mt-1">共 {filtered.length} 条评价</p>
        </div>
        <Link to="/admin/reviews/new" className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463] transition-colors">
          + 新建评价
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索作者或内容..."
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        />
        <select
          value={filterRating}
          onChange={e => setFilterRating(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        >
          <option value="">全部评分</option>
          {Object.entries(RATING_LABELS).map(([k, v]) => <option key={k} value={k}>{v}（{k}★）</option>)}
        </select>
        <select
          value={filterVerified}
          onChange={e => setFilterVerified(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        >
          <option value="">全部状态</option>
          <option value="true">已验证</option>
          <option value="false">未验证</option>
        </select>
      </div>

      <div className="border border-white/10 rounded overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5">
            <tr className="text-[#888888] border-b border-white/5">
              <th className="text-left px-4 py-3 font-medium">作者</th>
              <th className="text-left px-4 py-3 font-medium">评价内容</th>
              <th className="text-left px-4 py-3 font-medium">评分</th>
              <th className="text-left px-4 py-3 font-medium">日期</th>
              <th className="text-left px-4 py-3 font-medium">验证</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#666]">加载中...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#666]">无数据</td></tr>
            ) : (
              filtered.map(review => (
                <tr key={review.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-[#f0f0f0]">{review.author}</td>
                  <td className="px-4 py-3 text-[#888888] max-w-xs truncate">{review.content}</td>
                  <td className="px-4 py-3">{renderStars(review.rating)}</td>
                  <td className="px-4 py-3 text-[#888888] text-[11px]">{new Date(review.date).toLocaleDateString('zh-CN')}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleVerified(review.id, review.verified)}
                      className="px-1.5 py-0.5 rounded text-[10px] transition-colors"
                      style={{
                        color: review.verified ? '#4ade80' : '#e60012',
                        background: review.verified ? 'rgba(74,222,128,0.15)' : 'rgba(230,0,18,0.15)',
                      }}
                    >
                      {review.verified ? '已验证' : '未验证'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/reviews/${review.id}`} className="text-[#d4a373] hover:underline mr-3">编辑</Link>
                    <button onClick={() => handleDelete(review.id)} className="text-[#e60012] hover:underline">删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CMSLayout>
  )
}