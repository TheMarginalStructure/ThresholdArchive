import { useState } from 'react'
import { useNavigate } from 'react-router'
import MDEditor from '@uiw/react-md-editor'
import CMSLayout from '../../components/CMSLayout'

const API_BASE = 'http://localhost:3001/api/v1'

export default function CMSNewsForm() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: '', title: '', summary: '', content: '',
    category: '组织新闻', priority: 'INFO', featured: false,
    publishedAt: new Date().toISOString().split('T')[0],
  })
  const [imageUrl, setImageUrl] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 拼接完整图片URL
  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const cleanPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`
    return `http://localhost:3001${cleanPath}`
  }

  const handleChange = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }))

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setImageUrl(data.url)
    } catch (e) { console.error(e) }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, imageUrl, publishedAt: new Date(form.publishedAt) }
      const res = await fetch(`${API_BASE}/cms/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) navigate('/admin/news')
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  return (
    <CMSLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">新建新闻</h1>
          <p className="text-xs text-[#888888] mt-1">填写以下字段创建新的新闻通报</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-xs border border-white/10 rounded hover:bg-white/5">取消</button>
          <button onClick={handleSave} disabled={saving || !form.code || !form.title} className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463] disabled:opacity-30 disabled:cursor-not-allowed">
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">基本信息</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">编码 *</label>
                <input
                  value={form.code}
                  onChange={e => handleChange('code', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                  placeholder="IR-XXXX"
                />
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">分类</label>
                <select
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                >
                  <option value="组织新闻">组织新闻</option>
                  <option value="阈界内">阈界内</option>
                  <option value="协议修订">协议修订</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#888888] block mb-1">标题 *</label>
              <input
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">优先级</label>
                <select
                  value={form.priority}
                  onChange={e => handleChange('priority', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                >
                  <option value="WARN">警告</option>
                  <option value="OK">正常</option>
                  <option value="INFO">通知</option>
                  <option value="NEW">新增</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">发布日期</label>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={e => handleChange('publishedAt', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-xs text-[#888888] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => handleChange('featured', e.target.checked)}
                    className="accent-[#d4a373]"
                  />
                  推荐到首页
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#888888] block mb-1">摘要</label>
              <textarea
                value={form.summary}
                onChange={e => handleChange('summary', e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">正文内容（Markdown）</h2>
            <div className="border border-white/10 rounded overflow-hidden" data-color-mode="dark">
              <MDEditor
                value={form.content}
                onChange={(val) => handleChange('content', val || '')}
                preview="edit"
                height={500}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm text-[#d4a373]">封面图片</h2>
            {imageUrl ? (
              <div className="relative group">
                <img src={getImageUrl(imageUrl)} alt="cover" className="w-full h-40 object-cover rounded border border-white/10" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setImageUrl('')} className="text-xs text-[#e60012] px-3 py-1 border border-[#e60012] rounded">移除</button>
                  <label className="text-xs text-[#d4a373] px-3 py-1 border border-[#d4a373] rounded cursor-pointer">
                    更换
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  </label>
                </div>
              </div>
            ) : (
              <div
                className={`h-40 rounded border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${dragging ? 'border-[#d4a373] bg-[#d4a373]/5' : 'border-white/10 hover:border-white/20'}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]) }}
                onClick={() => document.getElementById('cms-news-img')?.click()}
              >
                {uploading ? (
                  <span className="text-xs text-[#888888]">上传中...</span>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-[#666666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <span className="text-xs text-[#666]">拖拽或点击上传</span>
                  </>
                )}
                <input id="cms-news-img" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              </div>
            )}
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}
