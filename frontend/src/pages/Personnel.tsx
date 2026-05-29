import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { api, type ApiPersonnel } from '../lib/api'
import { MONO } from '../utils/fonts'

export default function Personnel() {
  const [personnel, setPersonnel] = useState<ApiPersonnel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.personnel.list({})
      .then((data) => setPersonnel(data))
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false))
  }, [])

  const statusCounts = personnel.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const total = personnel.length
  const active = statusCounts['现役'] || 0
  const mia = statusCounts['MIA'] || 0
  const kia = statusCounts['阵亡'] || 0

  return (
    <PageLayout
      breadcrumbs={[{ label: 'PERSONNEL' }, { label: '人员档案' }]}
      title="人员档案 / Personnel Database"
      subtitle={`边际结构组织在编人员档案。共计 ${total} 条记录，现役 ${active} 人，MIA ${mia} 人，阵亡 ${kia} 人。`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {loading && (
          <div className="text-center py-24 text-[#888888]">
            <div className="text-xs text-[#d4a373] tracking-widest uppercase mb-4 animate-pulse" style={{ fontFamily: MONO }}>
              LOADING PERSONNEL DATA...
            </div>
            <div className="w-48 h-[1px] bg-white/10 mx-auto overflow-hidden">
              <div className="h-full bg-[#d4a373] animate-[loadingSlide_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-24 text-[#e60012]">
            <div className="text-4xl mb-4">!</div>
            <p>数据加载失败：{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="border border-white/10 p-4" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
                <div className="text-[10px] text-[#888888] mb-1" style={{ fontFamily: MONO }}>TOTAL</div>
                <div className="text-2xl text-[#f0f0f0] font-bold">{total}</div>
              </div>
              <div className="border border-white/10 p-4" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
                <div className="text-[10px] text-[#4ade80] mb-1" style={{ fontFamily: MONO }}>ACTIVE</div>
                <div className="text-2xl text-[#4ade80] font-bold">{active}</div>
              </div>
              <div className="border border-white/10 p-4" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
                <div className="text-[10px] text-[#facc15] mb-1" style={{ fontFamily: MONO }}>MIA</div>
                <div className="text-2xl text-[#facc15] font-bold">{mia}</div>
              </div>
              <div className="border border-white/10 p-4" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
                <div className="text-[10px] text-[#e60012] mb-1" style={{ fontFamily: MONO }}>KIA</div>
                <div className="text-2xl text-[#e60012] font-bold">{kia}</div>
              </div>
            </div>

            {/* Personnel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personnel.map((person) => (
                <div
                  key={person.id}
                  className="border border-white/10 p-5 hover:border-white/20 transition-all"
                  style={{ background: 'rgba(17, 17, 17, 0.4)' }}
                  data-cursor-hover
                >
                  {/* Header: Name + Codename + Status */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm text-[#f0f0f0] font-medium truncate">
                          {person.name}
                        </span>
                        {person.codename && (
                          <span className="text-[10px] text-[#888888] leading-none" style={{ fontFamily: MONO }}>
                            / {person.codename}
                          </span>
                        )}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 border leading-none ${
                            person.status === '现役'
                              ? 'text-[#4ade80] border-[#4ade80]/40'
                              : person.status === '阵亡'
                              ? 'text-[#e60012] border-[#e60012]/40'
                              : person.status === 'MIA'
                              ? 'text-[#facc15] border-[#facc15]/40'
                              : 'text-[#888888] border-white/10'
                          }`}
                        >
                          {person.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#888888] mt-0.5">
                        {person.title || person.position || '未分配'}
                      </div>
                    </div>
                  </div>

                  {/* Meta: Department · Clearance · Code */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-[#888888] mb-2 p-2 bg-black/20 rounded border border-white/5">
                    <span className="text-[#d4a373]" style={{ fontFamily: MONO }}>{person.department?.name || '未分配'}</span>
                    <span className="text-[#555]">|</span>
                    <span>{person.clearanceLevel}级</span>
                    <span className="text-[#555]">|</span>
                    <span style={{ fontFamily: MONO }}>{person.code}</span>
                  </div>

                  {/* Extra: Specialty + E-Sig inline */}
                  {(person.specialty || person.esigCode) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#888888]">
                      {person.specialty && (
                        <span><span className="text-[#666666]">专长</span> {person.specialty}</span>
                      )}
                      {person.esigCode && (
                        <span><span className="text-[#666666]">签名</span> <span style={{ fontFamily: MONO }}>{person.esigCode}</span></span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}
