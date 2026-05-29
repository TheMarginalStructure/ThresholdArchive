import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import CMSLayout from '../../components/CMSLayout'
import { api, API_BASE } from '../../lib/api'

export default function CMSArchiveList() {
  const [archives, setArchives] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ search: '', category: '', status: '', threatLevel: '' })

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.archives.list({ limit: 999 })
      setArchives(data.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此档案？')) return
    try {
      await fetch(`${API_BASE}/cms/archives/${id}`, { method: 'DELETE' })
      setArchives(prev => prev.filter(a => a.id !== id))
    } catch (e) { console.error(e) }
  }

  const categories = [...new Set(archives.map(a => a.category))].sort()
  const threatLevels = [...new Set(archives.map(a => a.threatLevel).filter(Boolean))].sort()

  const filtered = archives.filter(a => {
    if (filter.search && !a.title.toLowerCase().includes(filter.search.toLowerCase()) && !a.code.toLowerCase().includes(filter.search.toLowerCase())) return false
    if (filter.category && a.category !== filter.category) return false
    if (filter.status && a.status !== filter.status) return false
    if (filter.threatLevel === 'null') { if (a.threatLevel !== null) return false }
    else if (filter.threatLevel && a.threatLevel !== filter.threatLevel) return false
    return true
  })

  return (
    <CMSLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">档案管理</h1>
          <p className="text-xs text-[#888888] mt-1">共 {filtered.length} 条档案</p>
        </div>
        <Link to="/admin/archives/new" className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463]">
          + 新建档案
        </Link>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={filter.search}
          onChange={e => setFilter(prev => ({ ...prev, search: e.target.value }))}
          placeholder="搜索标题或编码..."
          className="w-full max-w-md bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        />
        <select
          value={filter.category}
          onChange={e => setFilter(prev => ({ ...prev, category: e.target.value }))}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        >
          <option value="">所有类别</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === '勘探实验记录' ? '勘探记录' : cat}</option>
          ))}
        </select>
        <select
          value={filter.status}
          onChange={e => setFilter(prev => ({ ...prev, status: e.target.value }))}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        >
          <option value="">所有状态</option>
          <option value="活跃">活跃</option>
          <option value="封存">封存</option>
          <option value="销毁待定">销毁待定</option>
          <option value="已销毁">已销毁</option>
        </select>
        <select
          value={filter.threatLevel}
          onChange={e => setFilter(prev => ({ ...prev, threatLevel: e.target.value }))}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        >
          <option value="">所有威胁等级</option>
          {threatLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
          <option value="null">不适用</option>
        </select>
        {(filter.search || filter.category || filter.status || filter.threatLevel) && (
          <button
            onClick={() => setFilter({ search: '', category: '', status: '', threatLevel: '' })}
            className="text-xs text-[#888888] hover:text-[#d4a373] px-2"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-white/10 rounded overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5">
            <tr className="text-[#888888] border-b border-white/5">
              <th className="text-left px-4 py-3 font-medium">编码</th>
              <th className="text-left px-4 py-3 font-medium">标题</th>
              <th className="text-left px-4 py-3 font-medium">类别</th>
              <th className="text-left px-4 py-3 font-medium">状态</th>
              <th className="text-left px-4 py-3 font-medium">威胁等级</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#666]">加载中...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#666]">无数据</td></tr>
            ) : (
              filtered.map(archive => (
                <tr key={archive.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-[#888888]">{archive.code}</td>
                  <td className="px-4 py-3 text-[#f0f0f0]">{archive.title}</td>
                  <td className="px-4 py-3 text-[#888888]">{archive.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      archive.status === '活跃' ? 'text-[#4ade80] bg-[#4ade80]/10' :
                      archive.status === '封存' ? 'text-[#d4a373] bg-[#d4a373]/10' :
                      archive.status === '销毁待定' ? 'text-[#d4a373] bg-[#d4a373]/10' :
                      archive.status === '已销毁' ? 'text-[#868686] bg-[#868686]/10' :
                      'text-[#888888] bg-white/5'
                    }`}>
                      {archive.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#888888]">{archive.threatLevel || '不适用'}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <a href={`/archive/${archive.id}`} target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-[#d4a373] mr-3">预览</a>
                    <Link to={`/admin/archives/${archive.id}`} className="text-[#d4a373] hover:underline mr-3">编辑</Link>
                    <button onClick={() => handleDelete(archive.id)} className="text-[#e60012] hover:underline">删除</button>
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
