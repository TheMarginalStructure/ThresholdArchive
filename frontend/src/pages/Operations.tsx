import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { api, type ApiArchive } from '../lib/api'
import { MONO, BODY } from '../utils/fonts'

export default function Operations() {
  const [explorations, setExplorations] = useState<ApiArchive[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.archives.list({ category: '勘探实验记录', limit: '10', page: '1' })
      .then((res) => setExplorations(res.data))
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout
      breadcrumbs={[{ label: 'OPERATIONS' }, { label: '任务中心' }]}
      title="行动计划 / Operations"
      subtitle="系统每天给您发两份日常简报 · 您给自己定主线和支线。其余的事——全域共建、同事互助——请前往隔壁两个房间。"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {loading && (
          <div className="text-center py-24 text-[#888888]">
            <div className="text-xs text-[#d4a373] tracking-widest uppercase mb-4 animate-pulse" style={{ fontFamily: MONO }}>
              LOADING OPERATIONS DATA...
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
            {/* Exploration Missions */}
            <div className="border border-white/10 p-6 mb-8" style={{ background: 'rgba(17, 17, 17, 0.4)' }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#d4a373] animate-pulse" />
                  <span className="text-xs text-[#d4a373] tracking-wider" style={{ fontFamily: MONO }}>
                    EXPLORATION · 勘探任务
                  </span>
                </div>
                <div className="text-xs text-[#888888]">
                  活跃任务 <span className="text-[#f0f0f0] font-bold">{explorations.length}</span> 项
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {explorations.map((exp) => (
                  <div key={exp.id} className="border border-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-[#d4a373]" style={{ fontFamily: MONO }}>{exp.code}</span>
                      <span className={`text-[10px] px-2 py-0.5 border ${
                        exp.status === '活跃' ? 'text-[#4ade80] border-[#4ade80]/40' :
                        exp.status === '封存' ? 'text-[#888888] border-white/10' :
                        'text-[#facc15] border-[#facc15]/40'
                      }`}>
                        {exp.status}
                      </span>
                    </div>
                    <h3 className="text-base text-[#f0f0f0] mb-2">{exp.title}</h3>
                    <p className="text-xs text-[#888888] leading-relaxed mb-4">{exp.description || '暂无描述'}</p>
                    <div className="flex items-center justify-between text-xs text-[#888888]">
                      <span>威胁等级：{exp.threatLevel || '-'}</span>
                      <span>归档：{exp.archiveDate ? new Date(exp.archiveDate).toLocaleDateString('zh-CN') : '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* World Quest placeholder */}
            <div className="border p-6 mb-8" style={{ borderColor: '#e6001230', background: 'rgba(230, 0, 18, 0.03)' }}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] px-2 py-0.5 border border-[#e60012] text-[#e60012]" style={{ fontFamily: MONO }}>
                    WORLD QUEST · 全域共建中
                  </span>
                  <h3 className="text-lg text-[#f0f0f0]">
                    「点燃初生之火」 · <span className="text-[#e60012]">47.3%</span> · 距截止 94 天
                  </h3>
                </div>
                <button className="text-xs border border-white/20 text-[#f0f0f0] px-4 py-2 hover:border-[#e60012] hover:text-[#e60012] transition-colors" data-cursor-hover>
                  进入全域任务 ↗
                </button>
              </div>
              <p className="text-sm text-[#888888] mb-4">做一些小事就能推一点进度条。已点亮 183 / 195 国 · 已贡献现实锚点 4,738,291</p>
              <div className="w-full h-1 bg-white/10">
                <div className="h-full bg-[#e60012]" style={{ width: '47.3%' }} />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-white/10 mb-8">
              {['01 主线', '02 支线', '03 悬赏大厅'].map((tab, i) => (
                <button
                  key={tab}
                  className={`text-sm pb-3 border-b-2 transition-colors ${i === 0 ? 'border-[#d4a373] text-[#d4a373]' : 'border-transparent text-[#888888] hover:text-[#f0f0f0]'}`}
                  data-cursor-hover
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Mainline Quests placeholder */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-[#d4a373] tracking-wider mb-1" style={{ fontFamily: MONO }}>
                    PERSONAL MAINLINE · 给自己定的行动主线
                  </div>
                  <h2 className="text-2xl text-[#f0f0f0]" style={{ fontFamily: BODY }}>
                    您的主线任务
                  </h2>
                  <p className="text-xs text-[#888888] mt-1">
                    主线由您自己创建，系统不发任何货币，完成后您只换自己一句"做到了"。
                  </p>
                </div>
                <button className="text-sm bg-[#e60012] text-white px-5 py-2.5 hover:bg-[#c40010] transition-colors" data-cursor-hover>
                  + 新建主线 →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 1, level: 'LV.5 长期', progress: '23 / 365 天', title: '今年戒掉认知过载', desc: '建立：2026-01-01 · 已坚持 23 天 · 中断 2 次', trigger: '每天 23:00 后系统轻提示一次。', status: '今日打卡' },
                  { id: 2, level: 'LV.3 中期', progress: '4 / 12 章', title: '读完《阈界现象学》', desc: '建立：2026-03-12 · 上次进度 2026-04-28', trigger: '当前章：第 5 章「我们终将看见真相」', status: '更新进度' },
                  { id: 3, level: 'LV.8 终生', progress: '永不结算', title: '不在阈界中失去自己', desc: '建立：2024-09-04 · 系统提示："本主线无法完成，但也无法失败。"', trigger: '这是您给自己的承诺，不是任务。', status: '静默运行中' },
                ].map((quest) => (
                  <div
                    key={quest.id}
                    className="border border-white/10 p-5 hover:border-white/20 transition-all"
                    style={{ background: 'rgba(17, 17, 17, 0.6)' }}
                    data-cursor-hover
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-[#888888]">主线 · {quest.level}</span>
                      <span className="text-[10px] text-[#888888]">{quest.progress}</span>
                    </div>
                    <h3 className="text-base text-[#f0f0f0] mb-3">{quest.title}</h3>
                    <p className="text-xs text-[#888888] mb-2">{quest.desc}</p>
                    <p className="text-xs text-[#d4a373]/70 mb-4">{quest.trigger}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-xs text-[#888888]">奖励：自己定 · 系统不审、不发币、只记录</span>
                      <button className="text-xs text-[#d4a373] hover:text-[#e60012] transition-colors" data-cursor-hover>
                        {quest.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}
