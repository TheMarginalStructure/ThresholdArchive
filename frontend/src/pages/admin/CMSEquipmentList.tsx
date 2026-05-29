import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import CMSLayout from '../../components/CMSLayout'
import { api, API_BASE } from '../../lib/api'

const CATEGORIES = [
  '全部', '个人防护装备', '武器弹药', '电子设备', '医疗设备',
  '特殊工具', '载具', '通讯设备', '生存装备', '化学品与药剂',
  '技术支援', '训练设备', '后勤补给', '其他',
]

const STATUS_LABELS: Record<string, string> = {
  available: '可用', low_stock: '低库存', out_of_stock: '缺货', discontinued: '停产',
}

const STATUS_COLORS: Record<string, string> = {
  available: '#4ade80', low_stock: '#d4a373', out_of_stock: '#e60012', discontinued: '#666666',
}

export default function CMSEquipmentList() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('全部')
  const [filterStatus, setFilterStatus] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { limit: 200 }
      if (filterCategory !== '全部') params.category = filterCategory
      if (filterStatus) params.status = filterStatus
      const data = await api.equipment.list(params)
      setItems(data.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [filterCategory, filterStatus])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此装备？')) return
    try {
      await fetch(`${API_BASE}/cms/equipment/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (e) { console.error(e) }
  }

  const filtered = items.filter(item =>
    (!search || item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <CMSLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">装备物资管理</h1>
          <p className="text-xs text-[#888888] mt-1">共 {filtered.length} 件装备</p>
        </div>
        <Link to="/admin/equipment/new" className="px-4 py-2 text-xs bg-[#d4a373] text-black rounded hover:bg-[#c49463] transition-colors">
          + 新建装备
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索名称或编码..."
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:border-[#d4a373] focus:outline-none"
        >
          <option value="">全部状态</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="border border-white/10 rounded overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5">
            <tr className="text-[#888888] border-b border-white/5">
              <th className="text-left px-4 py-3 font-medium">编码</th>
              <th className="text-left px-4 py-3 font-medium">名称</th>
              <th className="text-left px-4 py-3 font-medium">分类</th>
              <th className="text-left px-4 py-3 font-medium">状态</th>
              <th className="text-right px-4 py-3 font-medium">库存</th>
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
                  <td className="px-4 py-3 text-[#f0f0f0]">{item.name}</td>
                  <td className="px-4 py-3 text-[#888888]">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ color: STATUS_COLORS[item.status] || '#888888', background: `${STATUS_COLORS[item.status] || '#888888'}20` }}>
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[#f0f0f0]">{item.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/equipment/${item.id}`} className="text-[#d4a373] hover:underline mr-3">编辑</Link>
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