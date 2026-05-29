import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import CMSLayout from '../../components/CMSLayout'
import { api, API_BASE } from '../../lib/api'

export default function CMSNewsList() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.news.list()
      setNews(data.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此新闻？')) return
    try {
      await fetch(`${API_BASE}/cms/news/${id}`, { method: 'DELETE' })
      setNews(prev => prev.filter(n => n.id !== id))
    } catch (e) { console.error(e) }
  }

  const filtered = news.filter(n =>
    !filter || n.title.toLowerCase().includes(filter.toLowerCase()) || n.code.toLowerCase().includes(filter.toLowerCase())
  )

  const PRIORITY_COLORS: Record<string, string> = {
    WARN: '#e60012', OK: '#4ade80', INFO: '#888888', NEW: '#d4a373',
  }

  return (
    <CMSLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">新闻管理</h1>
          <p className="text-xs text-[#888888] mt-1">共 {filtered.length} 条新闻</p>
        </div>
        <Link to="/admin/news/new" className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463]">
          + 新建新闻
        </Link>
      </div>

      <div className="mb-4">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="搜索标题或编码..."
          className="w-full max-w-md bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        />
      </div>

      <div className="border border-white/10 rounded overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5">
            <tr className="text-[#888888] border-b border-white/5">
              <th className="text-left px-4 py-3 font-medium">编码</th>
              <th className="text-left px-4 py-3 font-medium">标题</th>
              <th className="text-left px-4 py-3 font-medium">分类</th>
              <th className="text-left px-4 py-3 font-medium">优先级</th>
              <th className="text-left px-4 py-3 font-medium">日期</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#666]">加载中...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#666]">无数据</td></tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-[#888888]">{item.code}</td>
                  <td className="px-4 py-3 text-[#f0f0f0]">{item.title}</td>
                  <td className="px-4 py-3 text-[#888888]">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ color: PRIORITY_COLORS[item.priority] || '#888888', background: `${PRIORITY_COLORS[item.priority] || '#888888'}20` }}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#888888]">{new Date(item.publishedAt).toLocaleDateString('zh-CN')}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/news/${item.id}`} className="text-[#d4a373] hover:underline mr-3">编辑</Link>
                    <button onClick={() => handleDelete(item.id)} className="text-[#e60012] hover:underline">删除</button>
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
