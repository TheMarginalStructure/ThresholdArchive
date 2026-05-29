import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import CMSLayout from '../../components/CMSLayout'

const API_BASE = 'http://localhost:3001/api/v1'

const TYPES = [
  { value: 'info', label: '通知' },
  { value: 'warn', label: '警告' },
  { value: 'alert', label: '紧急' },
  { value: 'maintenance', label: '维护' },
]

export default function CMSAnnouncementForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [form, setForm] = useState({
    title: '', content: '', type: 'info', order: '0',
  })

  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/announcements/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setForm({
          title: data.title || '',
          content: data.content || '',
          type: data.type || 'info',
          order: String(data.order ?? 0),
        })
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    load()
  }, [id, isEdit])

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    if (!form.title || !form.content) return
    setSaving(true)
    try {
      const body = { ...form, order: Number(form.order) }
      const url = isEdit ? `${API_BASE}/cms/announcements/${id}` : `${API_BASE}/cms/announcements`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) navigate('/admin/announcements')
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  if (loading) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center h-64 text-[#666] text-xs">加载中...</div>
      </CMSLayout>
    )
  }

  return (
    <CMSLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">{isEdit ? '编辑公告' : '新建公告'}</h1>
          <p className="text-xs text-[#888888] mt-1">填写以下字段{isEdit ? '更新' : '创建'}系统公告</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-xs border border-white/10 rounded hover:bg-white/5">取消</button>
          <button onClick={handleSave} disabled={saving || !form.title || !form.content} className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463] disabled:opacity-30 disabled:cursor-not-allowed">
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="border border-white/10 rounded p-4 space-y-4">
          <h2 className="text-sm" style={{ color: '#d4a373' }}>公告信息</h2>

          <div>
            <label className="text-xs text-[#888888] block mb-1">标题 *</label>
            <input
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none font-mono"
              placeholder="公告标题"
            />
          </div>

          <div>
            <label className="text-xs text-[#888888] block mb-1">内容 *</label>
            <textarea
              value={form.content}
              onChange={e => handleChange('content', e.target.value)}
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-3 text-xs focus:border-[#d4a373] focus:outline-none resize-y font-mono"
              placeholder="公告详细内容..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#888888] block mb-1">类型</label>
              <select
                value={form.type}
                onChange={e => handleChange('type', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
              >
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#888888] block mb-1">排序</label>
              <input
                type="number"
                value={form.order}
                onChange={e => handleChange('order', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}