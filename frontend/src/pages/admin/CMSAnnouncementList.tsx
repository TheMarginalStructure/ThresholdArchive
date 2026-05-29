import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import CMSLayout from '../../components/CMSLayout'
import { api, API_BASE } from '../../lib/api'

const TYPE_LABELS: Record<string, string> = {
  info: '通知', warn: '警告', alert: '紧急', maintenance: '维护',
}

const TYPE_COLORS: Record<string, string> = {
  info: '#4ade80', warn: '#d4a373', alert: '#e60012', maintenance: '#d4a373',
}

export default function CMSAnnouncementList() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.announcements.list()
      setAnnouncements(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此公告？')) return
    try {
      await fetch(`${API_BASE}/cms/announcements/${id}`, { method: 'DELETE' })
      setAnnouncements(prev => prev.filter(a => a.id !== id))
    } catch (e) { console.error(e) }
  }

  return (
    <CMSLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">系统公告管理</h1>
          <p className="text-xs text-[#888888] mt-1">共 {announcements.length} 条公告</p>
        </div>
        <Link to="/admin/announcements/new" className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463] transition-colors">
          + 新建公告
        </Link>
      </div>

      <div className="border border-white/10 rounded overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5">
            <tr className="text-[#888888] border-b border-white/5">
              <th className="text-left px-4 py-3 font-medium w-12">序号</th>
              <th className="text-left px-4 py-3 font-medium">标题</th>
              <th className="text-left px-4 py-3 font-medium">类型</th>
              <th className="text-left px-4 py-3 font-medium">排序</th>
              <th className="text-left px-4 py-3 font-medium">创建时间</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#666]">加载中...</td></tr>
            ) : announcements.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#666]">暂无公告</td></tr>
            ) : (
              announcements.map(announcement => (
                <tr key={announcement.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-[#888888] font-mono">{announcement.id}</td>
                  <td className="px-4 py-3 text-[#f0f0f0]">{announcement.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ color: TYPE_COLORS[announcement.type] || '#888888', background: `${TYPE_COLORS[announcement.type] || '#888888'}20` }}>
                      {TYPE_LABELS[announcement.type] || announcement.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#888888] font-mono">{announcement.order}</td>
                  <td className="px-4 py-3 text-[#888888] text-[11px]">{new Date(announcement.createdAt).toLocaleDateString('zh-CN')}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/announcements/${announcement.id}`} className="text-[#d4a373] hover:underline mr-3">编辑</Link>
                    <button onClick={() => handleDelete(announcement.id)} className="text-[#e60012] hover:underline">删除</button>
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