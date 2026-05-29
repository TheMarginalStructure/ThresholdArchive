import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { MONO } from '../utils/fonts'
import { api, type ApiEquipmentItem } from '../lib/api'

export default function Equipment() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [equipments, setEquipments] = useState<ApiEquipmentItem[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([{ name: '全部', count: 0 }])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (activeCategory !== '全部') params.category = activeCategory
        const res = await api.equipment.list(params)
        setEquipments(res.data)
        setCategories([{ name: '全部', count: res.total }, ...res.categories])
      } catch {
        setEquipments([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeCategory])

  return (
    <PageLayout
      breadcrumbs={[{ label: 'EQUIPMENT' }, { label: '物资管理' }]}
      title="物资管理 / Equipment"
      subtitle="土块、石块、砖块三种货币，三种代价。本库唯一能从任务中 earned 的入口；多数真正需要的物资长期停止配给。"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-1 mb-8 border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`text-xs px-4 py-3 transition-colors ${activeCategory === cat.name ? 'text-[#d4a373] bg-[#d4a373]/10' : 'text-[#888888] hover:text-[#f0f0f0] hover:bg-white/5'}`}
              data-cursor-hover
            >
              {cat.name} <span className="opacity-50">{cat.count}</span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4 px-4">
            <span className="text-xs text-[#888888]">显示 {equipments.length} / {categories[0]?.count ?? 0}</span>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-white/10 p-4 animate-pulse" style={{ background: 'rgba(17,17,17,0.6)' }}>
                <div className="flex justify-between mb-3"><div className="h-3 w-16 bg-white/5 rounded" /><div className="h-3 w-10 bg-white/5 rounded" /></div>
                <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                <div className="h-3 w-1/2 bg-white/5 rounded mb-3" />
                <div className="h-3 bg-white/5 rounded mb-4" />
                <div className="h-3 bg-white/5 rounded mb-4" />
                <div className="h-8 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {equipments.map((item) => (
              <div
                key={item.id}
                className={`border p-4 flex flex-col ${item.status === 'soldout' ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-white/20'} transition-all`}
                style={{ background: 'rgba(17, 17, 17, 0.6)' }}
                data-cursor-hover
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-[#888888]">{item.category}</span>
                  {item.badge && (
                    <span
                      className="text-[10px] px-1.5 py-0.5"
                      style={{
                        color: item.badge === '已停止配给' ? '#e60012' : '#d4a373',
                        border: `1px solid ${item.badge === '已停止配给' ? '#e6001240' : '#d4a37340'}`,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className={`text-sm mb-0.5 ${item.status === 'soldout' ? 'text-[#888888] line-through' : 'text-[#f0f0f0]'}`}>
                  {item.name}
                </h3>
                <span className="text-xs text-[#888888] mb-3">{item.subtitle || ''}</span>
                <p className="text-xs text-[#888888] leading-relaxed mb-4 flex-1">{item.description || ''}</p>

                {/* Price & Action */}
                {item.status === 'available' ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg text-[#f0f0f0]" style={{ fontFamily: MONO }}>
                        <span className="text-[#888888]">⊞</span> {item.price ?? 0}
                      </span>
                      {item.currency && <span className="text-xs text-[#888888]">{item.currency}</span>}
                      {item.originalPrice && (
                        <span className="text-xs text-[#888888] line-through">{item.originalPrice}</span>
                      )}
                    </div>
                    <button
                      className="w-full text-xs border border-white/20 text-[#f0f0f0] py-2 hover:border-[#d4a373] hover:text-[#d4a373] transition-colors"
                      data-cursor-hover
                    >
                      申请
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg text-[#888888] mb-3" style={{ fontFamily: MONO }}>
                      ¥??
                    </div>
                    <button
                      className="w-full text-xs border border-white/5 text-[#888888] py-2 cursor-not-allowed"
                      disabled
                    >
                      已停止配给
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
