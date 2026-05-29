import { useState, useEffect } from 'react'
import { MONO, BODY } from '../../utils/fonts'

const LOGISTICS_STATS = [
  { label: '在编人员', value: 67, unit: '人' },
  { label: '设施总数', value: 12, unit: '处' },
  { label: '物资储备', value: 89, unit: '%' },
  { label: '本月采购', value: 127, unit: '项' },
]

const FACILITIES = [
  { name: 'Site-01 总部', type: '行政/研究', status: '正常运行', capacity: '120人', maintenance: '良好' },
  { name: 'Site-02 医疗中心', type: '医疗/心理', status: '正常运行', capacity: '40人', maintenance: '良好' },
  { name: 'Site-03 外勤基地', type: '行动/训练', status: '正常运行', capacity: '60人', maintenance: '一般' },
  { name: 'Site-04 研究设施', type: '研究/实验', status: '正常运行', capacity: '35人', maintenance: '良好' },
  { name: 'Site-05 仓储中心', type: '仓储/物流', status: '正常运行', capacity: '20人', maintenance: '良好' },
  { name: 'Site-06 训练场', type: '训练/模拟', status: '维护中', capacity: '50人', maintenance: '检修中' },
  { name: 'Site-07 观测站', type: '观测/监控', status: '部分运行', capacity: '15人', maintenance: '故障' },
]

const SUPPLY_STATUS = [
  { category: '食品补给', stock: 85, unit: '天', status: '充足', trend: '稳定' },
  { category: '医疗物资', stock: 62, unit: '天', status: '充足', trend: '下降' },
  { category: '能源储备', stock: 45, unit: '天', status: '需关注', trend: '下降' },
  { category: '通信设备', stock: 120, unit: '件', status: '充足', trend: '稳定' },
  { category: '交通工具', stock: 18, unit: '辆', status: '充足', trend: '稳定' },
  { category: '建筑材料', stock: 34, unit: '吨', status: '需补充', trend: '下降' },
]

const MAINTENANCE_SCHEDULE = [
  { date: '2026-05-28', facility: 'Site-06 训练场', type: '例行维护', priority: '中', status: '计划中' },
  { date: '2026-05-29', facility: 'Site-07 观测站', type: '故障修复', priority: '高', status: '计划中' },
  { date: '2026-06-02', facility: 'Site-03 外勤基地', type: '设备升级', priority: '中', status: '计划中' },
  { date: '2026-06-05', facility: 'Site-01 总部', type: '系统检查', priority: '低', status: '计划中' },
]

export default function LogisticsInfrastructure() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a]" style={{ fontFamily: BODY }}>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-6 py-16 md:py-24 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#d4a373] text-xs tracking-widest" style={{ fontFamily: MONO }}>
                [DEPT-50]
              </span>
              <span className="text-[#666666]">/</span>
              <span className="text-[#888888] text-xs" style={{ fontFamily: MONO }}>
                {time.toISOString().replace('T', ' ').substring(0, 19)} UTC
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl text-[#f0f0f0] font-bold mb-4 tracking-tight">
              后勤与架构部
            </h1>
            <p className="text-lg text-[#888888] max-w-2xl mb-8">
              LOGISTICS & INFRASTRUCTURE DEPARTMENT
            </p>
            <p className="text-sm text-[#888888] max-w-2xl leading-relaxed">
              负责所有设施的建设维护、物资供应、人员调配及后勤保障工作。
              确保组织运转所需的一切资源及时到位，是边际结构的生命线。
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {LOGISTICS_STATS.map((stat) => (
                <div key={stat.label} className="border border-white/10 p-4">
                  <div className="text-xs text-[#888888] mb-2" style={{ fontFamily: MONO }}>
                    {stat.label}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl text-[#f0f0f0] font-bold" style={{ fontFamily: MONO }}>
                      {stat.value}
                    </span>
                    <span className="text-xs text-[#888888]">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Overview */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-[#f0f0f0] font-bold">设施概览</h2>
              <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                7 ACTIVE SITES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FACILITIES.map((fac) => (
                <div key={fac.name} className="border border-white/10 p-4 hover:border-[#d4a373]/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#d4a373]" style={{ fontFamily: MONO }}>
                      {fac.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 border ${
                      fac.status === '正常运行'
                        ? 'text-[#4ade80] border-[#4ade80]/40'
                        : fac.status === '维护中'
                        ? 'text-[#facc15] border-[#facc15]/40'
                        : 'text-[#e60012] border-[#e60012]/40'
                    }`}>
                      {fac.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">类型</span>
                      <span className="text-xs text-[#f0f0f0]">{fac.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">容量</span>
                      <span className="text-xs text-[#f0f0f0]" style={{ fontFamily: MONO }}>{fac.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">维护状态</span>
                      <span className={`text-xs ${
                        fac.maintenance === '良好' ? 'text-[#4ade80]' : fac.maintenance === '一般' ? 'text-[#facc15]' : 'text-[#e60012]'
                      }`}>
                        {fac.maintenance}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Supply Status */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl text-[#f0f0f0] font-bold mb-8">物资储备</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUPPLY_STATUS.map((sup) => (
                <div key={sup.category} className="border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#d4a373]" style={{ fontFamily: MONO }}>{sup.category}</span>
                    <span className={`text-xs ${
                      sup.status === '充足' ? 'text-[#4ade80]' : sup.status === '需关注' ? 'text-[#facc15]' : 'text-[#e60012]'
                    }`}>
                      {sup.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl text-[#f0f0f0] font-bold" style={{ fontFamily: MONO }}>
                      {sup.stock}
                    </span>
                    <span className="text-xs text-[#888888]">{sup.unit}</span>
                  </div>
                  <div className="h-2 bg-white/5 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${Math.min((sup.stock / (sup.unit === '天' ? 100 : 150)) * 100, 100)}%`,
                        backgroundColor: sup.status === '充足' ? '#4ade80' : sup.status === '需关注' ? '#facc15' : '#e60012',
                        opacity: sup.status === '需补充' ? 0.6 : 1
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                    趋势: {sup.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Maintenance Schedule */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl text-[#f0f0f0] font-bold mb-8">维护计划</h2>

            <div className="border border-white/10">
              <div className="grid grid-cols-5 gap-4 p-3 border-b border-white/10 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                <span>日期</span>
                <span>设施</span>
                <span>类型</span>
                <span>优先级</span>
                <span>状态</span>
              </div>
              {MAINTENANCE_SCHEDULE.map((sch, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-3 border-b border-white/5 text-xs hover:bg-white/5 transition-colors">
                  <span className="text-[#888888]" style={{ fontFamily: MONO }}>{sch.date}</span>
                  <span className="text-[#f0f0f0]">{sch.facility}</span>
                  <span className="text-[#888888]">{sch.type}</span>
                  <span className={sch.priority === '高' ? 'text-[#e60012]' : sch.priority === '中' ? 'text-[#facc15]' : 'text-[#4ade80]'}>
                    {sch.priority}
                  </span>
                  <span className="text-[#4ade80]">{sch.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Department Info */}
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg text-[#f0f0f0] font-bold mb-4">部门领导</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#d4a373]" style={{ fontFamily: MONO }}>[部长]</span>
                    <span className="text-sm text-[#f0f0f0]">彼得·安德森 (Peter Anderson) 部长</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#facc15]" style={{ fontFamily: MONO }}>[副部长]</span>
                    <span className="text-sm text-[#f0f0f0]">奥尔加·波波娃 (Olga Popova)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#4ade80]" style={{ fontFamily: MONO }}>[首席]</span>
                    <span className="text-sm text-[#f0f0f0]">维克多·彼得罗夫/锁匠 (Victor Petrov) - 连接点技术专家</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg text-[#f0f0f0] font-bold mb-4">联系方式</h3>
                <div className="space-y-2 text-sm text-[#888888]">
                  <p>内部频道: DEPT-50-COM</p>
                  <p>物资申请: 5000-50-0010</p>
                  <p>后勤中心: Site-05 / 后勤与架构部大楼</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
