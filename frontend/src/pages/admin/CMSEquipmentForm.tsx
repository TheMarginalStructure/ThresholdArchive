import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import CMSLayout from '../../components/CMSLayout'

const API_BASE = 'http://localhost:3001/api/v1'

const CATEGORIES = [
  '个人防护装备', '武器弹药', '电子设备', '医疗设备',
  '特殊工具', '载具', '通讯设备', '生存装备', '化学品与药剂',
  '技术支援', '训练设备', '后勤补给', '其他',
]

const STATUS_OPTIONS = [
  { value: 'available', label: '可用' },
  { value: 'low_stock', label: '低库存' },
  { value: 'out_of_stock', label: '缺货' },
  { value: 'discontinued', label: '停产' },
]

const CURRENCIES = ['CNY', 'USD']

export default function CMSEquipmentForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [form, setForm] = useState({
    code: '', name: '', subtitle: '', description: '',
    category: '个人防护装备', price: '', currency: 'CNY',
    originalPrice: '', stock: '0', status: 'available',
    badge: '',
  })
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/equipment/${id}`)
        if (!res.ok) throw new Error('Not found')
        const item = await res.json()
        setForm({
          code: item.code || '', name: item.name || '', subtitle: item.subtitle || '',
          description: item.description || '', category: item.category || '个人防护装备',
          price: item.price ? String(item.price) : '',
          currency: item.currency || 'CNY', originalPrice: item.originalPrice || '',
          stock: String(item.stock ?? 0), status: item.status || 'available',
          badge: item.badge || '',
        })
        setImageUrl(item.imageUrl || '')
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    load()
  }, [id, isEdit])

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const cleanPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`
    return `http://localhost:3001${cleanPath}`
  }

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

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
    if (!form.code || !form.name) return
    setSaving(true)
    try {
      const body = {
        ...form,
        price: form.price ? Number(form.price) : null,
        stock: Number(form.stock),
        imageUrl,
      }
      const url = isEdit ? `${API_BASE}/cms/equipment/${id}` : `${API_BASE}/cms/equipment`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) navigate('/admin/equipment')
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
          <h1 className="text-xl font-medium">{isEdit ? '编辑装备' : '新建装备'}</h1>
          <p className="text-xs text-[#888888] mt-1">填写以下字段{isEdit ? '更新' : '创建'}装备物资</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-xs border border-white/10 rounded hover:bg-white/5">取消</button>
          <button onClick={handleSave} disabled={saving || !form.code || !form.name} className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463] disabled:opacity-30 disabled:cursor-not-allowed">
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm" style={{ color: '#d4a373' }}>基本信息</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">编码 *</label>
                <input
                  value={form.code}
                  onChange={e => handleChange('code', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none font-mono"
                  placeholder="EQP-XXXX"
                />
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">名称 *</label>
                <input
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">副标题</label>
                <input
                  value={form.subtitle}
                  onChange={e => handleChange('subtitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">徽章(SVG)</label>
                <input
                  value={form.badge}
                  onChange={e => handleChange('badge', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                  placeholder="<svg>...</svg>"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">分类</label>
                <select
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">状态</label>
                <select
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                >
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">价格</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => handleChange('price', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">货币</label>
                <select
                  value={form.currency}
                  onChange={e => handleChange('currency', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">原价</label>
                <input
                  value={form.originalPrice}
                  onChange={e => handleChange('originalPrice', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
                  placeholder="原价描述，如 ¥500"
                />
              </div>
              <div>
                <label className="text-xs text-[#888888] block mb-1">库存</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={e => handleChange('stock', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm" style={{ color: '#d4a373' }}>详细描述</h2>
            <textarea
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-3 text-xs focus:border-[#d4a373] focus:outline-none resize-y font-mono"
              placeholder="装备的详细描述..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-white/10 rounded p-4 space-y-4">
            <h2 className="text-sm" style={{ color: '#d4a373' }}>封面图片</h2>
            {imageUrl ? (
              <div className="relative group">
                <img src={getImageUrl(imageUrl)} alt="equipment" className="w-full h-40 object-cover rounded border border-white/10" />
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
                onClick={() => document.getElementById('cms-equip-img')?.click()}
              >
                {uploading ? (
                  <span className="text-xs text-[#888888]">上传中...</span>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-[#666666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <span className="text-xs text-[#666]">拖拽或点击上传</span>
                  </>
                )}
                <input id="cms-equip-img" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              </div>
            )}
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}