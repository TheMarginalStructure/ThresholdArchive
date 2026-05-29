import { useState, useEffect } from 'react'
import { MONO, BODY } from '../../utils/fonts'

const FIELD_STATS = [
  { label: '现役勘探队', value: 8, unit: '支' },
  { label: '外勤人员', value: 34, unit: '人' },
  { label: '进行中任务', value: 12, unit: '项' },
  { label: '本月出勤', value: 156, unit: '人次' },
]

const OTHER_PERSONNEL = [
  { name: '乔治·马丁 (George Martin)', role: '联络官', id: 'GMartin' },
  { name: '玛丽亚·冈萨雷斯 (Maria Gonzalez)', role: '情报分析师', id: 'MGonzalez' },
]

const ACTIVE_TEAMS = [
  { name: '伽马队 (Gamma)', code: 'Γ-07', status: ' deployed', location: 'TMS-L0234 明知山', members: 8, leader: '米拉·陈' },
  { name: '堡垒队 (Fortress)', code: 'Φ-02', status: ' standby', location: 'Site-03', members: 4, leader: '"堡垒"' },
  { name: '西格玛队 (Sigma)', code: 'Σ-04', status: ' deployed', location: 'TMS-O0881 万花筒殿', members: 4, leader: '奥利弗·王' },
  { name: '守护者队 (Guardians)', code: 'Ω-05', status: ' training', location: '训练设施B', members: 4, leader: '亚历克斯·诺瓦克' },
  { name: '织梦者队 (Dreamweavers)', code: 'Ψ-01', status: ' standby', location: 'Site-01', members: 5, leader: '艾伦·凯' },
  { name: '守夜人队 (Nightwatch)', code: 'N-03', status: ' deployed', location: 'TMS-T0112 静默车站', members: 4, leader: '丽萨·张' },
  { name: '拾荒者队 (Scavengers)', code: 'S-06', status: ' standby', location: 'Site-05', members: 6, leader: '维克多·彼得罗夫' },
  { name: '贝塔队 (Beta)', code: 'B-08', status: ' training', location: 'Site-03', members: 5, leader: '莉亚·沃克中尉' },
]

const RECENT_OPS = [
  { date: '2026-05-24', type: '勘探', target: 'TMS-T0112 静默车站', team: '守夜人队', status: '进行中' },
  { date: '2026-05-22', type: '监控', target: 'TMS-O2847 否定之人', team: '堡垒队', status: '已完成' },
  { date: '2026-05-20', type: '勘探', target: 'TMS-L0735 深邃之海', team: '伽马队', status: '已完成' },
  { date: '2026-05-18', type: '救援', target: 'Site-07 设施故障', team: '西格玛队', status: '已完成' },
]

export default function FieldOperations() {
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
              <span className="text-[#e60012] text-xs tracking-widest" style={{ fontFamily: MONO }}>
                [DEPT-20]
              </span>
              <span className="text-[#666666]">/</span>
              <span className="text-[#888888] text-xs" style={{ fontFamily: MONO }}>
                {time.toISOString().replace('T', ' ').substring(0, 19)} UTC
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl text-[#f0f0f0] font-bold mb-4 tracking-tight">
              外勤行动部
            </h1>
            <p className="text-lg text-[#888888] max-w-2xl mb-8">
              FIELD OPERATIONS DEPARTMENT
            </p>
            <p className="text-sm text-[#888888] max-w-2xl leading-relaxed">
              负责所有阈界勘探、异常应对、人员救援及现场处置任务。下辖6支专业勘探队，
              是边际结构面对未知威胁的第一道防线。
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FIELD_STATS.map((stat) => (
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

        {/* Active Teams */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-[#f0f0f0] font-bold">现役勘探队</h2>
              <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                STATUS: OPERATIONAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACTIVE_TEAMS.map((team) => (
                <div key={team.code} className="border border-white/10 p-4 hover:border-[#e60012]/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#e60012]" style={{ fontFamily: MONO }}>
                      {team.code}
                    </span>
                    <span className={`text-xs px-2 py-0.5 ${
                      team.status.includes('deployed')
                        ? 'text-[#e60012] border border-[#e60012]/40'
                        : team.status.includes('standby')
                        ? 'text-[#facc15] border border-[#facc15]/40'
                        : 'text-[#4ade80] border border-[#4ade80]/40'
                    }`}>
                      {team.status.includes('deployed') ? '部署中' : team.status.includes('standby') ? '待命' : '训练中'}
                    </span>
                  </div>
                  <h3 className="text-sm text-[#f0f0f0] font-medium mb-1">{team.name}</h3>
                  <p className="text-xs text-[#888888] mb-2">{team.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                      队员 {team.members} 人
                    </span>
                    <span className="text-xs text-[#888888]">队长: {team.leader}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Operations */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl text-[#f0f0f0] font-bold mb-8">近期行动记录</h2>

            <div className="border border-white/10">
              <div className="grid grid-cols-5 gap-4 p-3 border-b border-white/10 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                <span>日期</span>
                <span>类型</span>
                <span>目标</span>
                <span>执行队伍</span>
                <span>状态</span>
              </div>
              {RECENT_OPS.map((op, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-3 border-b border-white/5 text-xs hover:bg-white/5 transition-colors">
                  <span className="text-[#888888]" style={{ fontFamily: MONO }}>{op.date}</span>
                  <span className="text-[#f0f0f0]">{op.type}</span>
                  <span className="text-[#f0f0f0]">{op.target}</span>
                  <span className="text-[#888888]">{op.team}</span>
                  <span className={op.status === '进行中' ? 'text-[#e60012]' : 'text-[#4ade80]'}>
                    {op.status}
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
                    <span className="text-xs text-[#e60012]" style={{ fontFamily: MONO }}>[部长]</span>
                    <span className="text-sm text-[#f0f0f0]">亚历山大·科瓦尔 (Alexander Koval) 部长</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#facc15]" style={{ fontFamily: MONO }}>[副部长]</span>
                    <span className="text-sm text-[#f0f0f0]">莉亚·沃克 (Leah Walker) 中尉</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#4ade80]" style={{ fontFamily: MONO }}>[首席]</span>
                    <span className="text-sm text-[#f0f0f0]">"堡垒" (Fortress) - 首席勘探员</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>[训练主管]</span>
                    <span className="text-sm text-[#f0f0f0]">卡洛斯·桑切斯 (Carlos Sanchez)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg text-[#f0f0f0] font-bold mb-4">其他人员</h3>
                <div className="space-y-3">
                  {OTHER_PERSONNEL.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>[{p.role}]</span>
                      <span className="text-sm text-[#f0f0f0]">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg text-[#f0f0f0] font-bold mb-4">联系方式</h3>
                <div className="space-y-2 text-sm text-[#888888]">
                  <p>内部频道: DEPT-20-COM</p>
                  <p>紧急联络: 2000-21-0015</p>
                  <p>指挥中心: Site-03 / 外勤行动部大楼</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
