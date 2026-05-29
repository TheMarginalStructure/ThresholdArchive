import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import CMSLayout from '../../components/CMSLayout'

const API_BASE = 'http://localhost:3001/api/v1'

export default function CMSReviewForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [form, setForm] = useState({
    author: '', content: '', rating: '5', date: new Date().toISOString().split('T')[0], verified: false,
  })

  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/reviews/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setForm({
          author: data.author || '',
          content: data.content || '',
          rating: String(data.rating || 5),
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          verified: data.verified || false,
        })
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    load()
  }, [id, isEdit])

  const handleChange = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    if (!form.author || !form.content) return
    setSaving(true)
    try {
      const body = { ...form, rating: Number(form.rating), date: new Date(form.date).toISOString() }
      const url = isEdit ? `${API_BASE}/cms/reviews/${id}` : `${API_BASE}/cms/reviews`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) navigate('/admin/reviews')
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const renderStarSelect = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => handleChange('rating', String(i))}
          className="text-lg transition-colors"
          style={{ color: i <= rating ? '#d4a373' : '#333333' }}
        >
          ★
        </button>
      ))}
    </div>
  )

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
          <h1 className="text-xl font-medium">{isEdit ? '编辑评价' : '新建评价'}</h1>
          <p className="text-xs text-[#888888] mt-1">填写以下字段{isEdit ? '更新' : '创建'}用户评价</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-xs border border-white/10 rounded hover:bg-white/5">取消</button>
          <button onClick={handleSave} disabled={saving || !form.author || !form.content} className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463] disabled:opacity-30 disabled:cursor-not-allowed">
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="border border-white/10 rounded p-4 space-y-4">
          <h2 className="text-sm" style={{ color: '#d4a373' }}>评价信息</h2>

          <div>
            <label className="text-xs text-[#888888] block mb-1">作者 *</label>
            <input
              value={form.author}
              onChange={e => handleChange('author', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
              placeholder="评价者姓名"
            />
          </div>

          <div>
            <label className="text-xs text-[#888888] block mb-1">评价内容 *</label>
            <textarea
              value={form.content}
              onChange={e => handleChange('content', e.target.value)}
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-3 text-xs focus:border-[#d4a373] focus:outline-none resize-y"
              placeholder="评价内容..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#888888] block mb-1">评分</label>
              {renderStarSelect(Number(form.rating))}
            </div>
            <div>
              <label className="text-xs text-[#888888] block mb-1">评价日期</label>
              <input
                type="date"
                value={form.date}
                onChange={e => handleChange('date', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-[#888888] cursor-pointer">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={e => handleChange('verified', e.target.checked)}
                className="accent-[#d4a373]"
              />
              验证此评价
            </label>
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}