import { useState, useEffect } from 'react'
import { MONO, BODY } from '../../utils/fonts'

const SECURITY_STATS = [
  { label: '安全人员', value: 56, unit: '人' },
  { label: '设施警戒', value: 12, unit: '处' },
  { label: '本月事件', value: 3, unit: '起' },
  { label: '装备库存', value: 892, unit: '件' },
]

const FACILITIES_STATUS = [
  { name: 'Site-01 总部', level: '一级警戒', status: '正常', guards: 12, lastCheck: '2026-05-27 06:00' },
  { name: 'Site-02 医疗中心', level: '二级警戒', status: '正常', guards: 8, lastCheck: '2026-05-27 06:00' },
  { name: 'Site-03 外勤基地', level: '一级警戒', status: '正常', guards: 15, lastCheck: '2026-05-27 06:00' },
  { name: 'Site-04 研究设施', level: '三级警戒', status: '正常', guards: 6, lastCheck: '2026-05-27 06:00' },
  { name: 'Site-05 仓储中心', level: '二级警戒', status: '正常', guards: 4, lastCheck: '2026-05-27 06:00' },
  { name: 'Site-07 观测站', level: '一级警戒', status: '维护中', guards: 3, lastCheck: '2026-05-26 18:00' },
]

const SECURITY_LOG = [
  { time: '2026-05-27 05:47', event: 'Site-03 例行巡逻完成', level: '信息', operator: '安保-047' },
  { time: '2026-05-27 04:12', event: 'Site-01  perimeter 传感器自检通过', level: '信息', operator: '系统' },
  { time: '2026-05-27 02:30', event: 'Site-07 设施故障警报', level: '警告', operator: '安保-031' },
  { time: '2026-05-26 23:15', event: '不明身份人员接近 Site-05', level: '警告', operator: '安保-052' },
  { time: '2026-05-26 20:00', event: '全设施夜间警戒启动', level: '信息', operator: '安保-001' },
]

const EQUIPMENT_INVENTORY = [
  { category: '防护装备', items: '战术背心、头盔、防化服', count: 234, status: '充足' },
  { category: '武器系统', items: '非致命武器、威慑装置', count: 156, status: '充足' },
  { category: '监控设备', items: '传感器、摄像头、无人机', count: 312, status: '充足' },
  { category: '通信设备', items: '加密电台、应急信标', count: 98, status: '需补充' },
  { category: '应急物资', items: '医疗包、照明、口粮', count: 92, status: '充足' },
]

export default function SecurityProtection() {
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
              <span className="text-[#facc15] text-xs tracking-widest" style={{ fontFamily: MONO }}>
                [DEPT-40]
              </span>
              <span className="text-[#666666]">/</span>
              <span className="text-[#888888] text-xs" style={{ fontFamily: MONO }}>
                {time.toISOString().replace('T', ' ').substring(0, 19)} UTC
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl text-[#f0f0f0] font-bold mb-4 tracking-tight">
              安全与防护部
            </h1>
            <p className="text-lg text-[#888888] max-w-2xl mb-8">
              SECURITY & PROTECTION DEPARTMENT
            </p>
            <p className="text-sm text-[#888888] max-w-2xl leading-relaxed">
              负责所有设施的安全防护、人员安保、威胁应对及装备管理工作。
              确保组织在内外威胁下维持正常运转，是边际结构的坚实盾牌。
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SECURITY_STATS.map((stat) => (
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

        {/* Facilities Status */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-[#f0f0f0] font-bold">设施警戒状态</h2>
              <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                ALL CLEAR
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FACILITIES_STATUS.map((fac) => (
                <div key={fac.name} className="border border-white/10 p-4 hover:border-[#facc15]/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#facc15]" style={{ fontFamily: MONO }}>
                      {fac.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 border ${
                      fac.status === '正常'
                        ? 'text-[#4ade80] border-[#4ade80]/40'
                        : 'text-[#facc15] border-[#facc15]/40'
                    }`}>
                      {fac.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">警戒等级</span>
                      <span className="text-xs text-[#f0f0f0]" style={{ fontFamily: MONO }}>{fac.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">在岗安保</span>
                      <span className="text-xs text-[#f0f0f0]" style={{ fontFamily: MONO }}>{fac.guards} 人</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">最后检查</span>
                      <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>{fac.lastCheck}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Log */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl text-[#f0f0f0] font-bold mb-8">安全日志</h2>

            <div className="border border-white/10">
              <div className="grid grid-cols-4 gap-4 p-3 border-b border-white/10 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                <span>时间</span>
                <span>事件</span>
                <span>等级</span>
                <span>操作员</span>
              </div>
              {SECURITY_LOG.map((log, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 p-3 border-b border-white/5 text-xs hover:bg-white/5 transition-colors">
                  <span className="text-[#888888]" style={{ fontFamily: MONO }}>{log.time}</span>
                  <span className="text-[#f0f0f0]">{log.event}</span>
                  <span className={log.level === '警告' ? 'text-[#facc15]' : 'text-[#4ade80]'}>
                    {log.level}
                  </span>
                  <span className="text-[#888888]" style={{ fontFamily: MONO }}>{log.operator}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipment Inventory */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl text-[#f0f0f0] font-bold mb-8">装备库存</h2>

            <div className="border border-white/10">
              <div className="grid grid-cols-4 gap-4 p-3 border-b border-white/10 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                <span>类别</span>
                <span>包含物品</span>
                <span>数量</span>
                <span>状态</span>
              </div>
              {EQUIPMENT_INVENTORY.map((eq, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 p-3 border-b border-white/5 text-xs hover:bg-white/5 transition-colors">
                  <span className="text-[#facc15]" style={{ fontFamily: MONO }}>{eq.category}</span>
                  <span className="text-[#888888]">{eq.items}</span>
                  <span className="text-[#f0f0f0]" style={{ fontFamily: MONO }}>{eq.count}</span>
                  <span className={eq.status === '充足' ? 'text-[#4ade80]' : 'text-[#facc15]'}>
                    {eq.status}
                  </span>
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
                    <span className="text-xs text-[#facc15]" style={{ fontFamily: MONO }}>[部长]</span>
                    <span className="text-sm text-[#f0f0f0]">维克多·科瓦列夫/铁墙 (Victor Kovalev) 部长</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#facc15]" style={{ fontFamily: MONO }}>[副部长]</span>
                    <span className="text-sm text-[#f0f0f0]">莎拉·布莱克伍德 (Sarah Blackwood)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#4ade80]" style={{ fontFamily: MONO }}>[首席]</span>
                    <span className="text-sm text-[#f0f0f0]">马库斯·斯通/哨兵 (Marcus Stone) - 应急响应主管</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg text-[#f0f0f0] font-bold mb-4">联系方式</h3>
                <div className="space-y-2 text-sm text-[#888888]">
                  <p>内部频道: DEPT-40-COM</p>
                  <p>紧急安保: 4000-40-0001</p>
                  <p>指挥中心: Site-01 / 安全与防护部大楼</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
