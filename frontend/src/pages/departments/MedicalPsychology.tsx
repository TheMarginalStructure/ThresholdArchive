import { useState, useEffect } from 'react'
import { MONO, BODY } from '../../utils/fonts'

const MEDICAL_STATS = [
  { label: '现役医护人员', value: 28, unit: '人' },
  { label: '在院伤员', value: 7, unit: '人' },
  { label: '心理评估待审', value: 15, unit: '例' },
  { label: '本月救治', value: 43, unit: '人次' },
]

const ACTIVE_CASES = [
  { id: 'MED-2026-089', patient: '███ ████', type: '阈界暴露创伤', status: '治疗中', ward: '隔离病房A', days: 12 },
  { id: 'MED-2026-088', patient: '███ ████', type: '认知污染后遗症', status: '观察中', ward: '隔离病房B', days: 8 },
  { id: 'MED-2026-085', patient: '███ ████', type: '物理创伤', status: '康复中', ward: '普通病房3', days: 5 },
  { id: 'MED-2026-082', patient: '███ ████', type: '心理崩溃', status: '治疗中', ward: '心理干预室', days: 21 },
  { id: 'MED-2026-079', patient: '███ ████', type: '阈界暴露创伤', status: '稳定', ward: '隔离病房C', days: 3 },
]

const PSYCH_EVALS = [
  { date: '2026-05-26', subject: '伽马队全体', type: '任务后评估', result: '通过', examiner: '詹姆斯·帕克博士' },
  { date: '2026-05-24', subject: '堡垒队全体', type: '例行评估', result: '通过', examiner: '詹姆斯·帕克博士' },
  { date: '2026-05-22', subject: '西格玛队全体', type: '任务后评估', result: '需复查', examiner: '詹姆斯·帕克博士' },
  { date: '2026-05-20', subject: '新入职人员(3人)', type: '入职评估', result: '通过', examiner: '詹姆斯·帕克博士' },
]

const RESOURCE_STATUS = [
  { name: '隔离病房', total: 12, used: 5, unit: '间' },
  { name: '心理干预室', total: 4, used: 2, unit: '间' },
  { name: '医疗物资', total: 100, used: 67, unit: '%' },
  { name: '心理评估配额', total: 30, used: 15, unit: '例/周' },
]

export default function MedicalPsychology() {
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
              <span className="text-[#4ade80] text-xs tracking-widest" style={{ fontFamily: MONO }}>
                [DEPT-30]
              </span>
              <span className="text-[#666666]">/</span>
              <span className="text-[#888888] text-xs" style={{ fontFamily: MONO }}>
                {time.toISOString().replace('T', ' ').substring(0, 19)} UTC
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl text-[#f0f0f0] font-bold mb-4 tracking-tight">
              医疗与心理部
            </h1>
            <p className="text-lg text-[#888888] max-w-2xl mb-8">
              MEDICAL & PSYCHOLOGY DEPARTMENT
            </p>
            <p className="text-sm text-[#888888] max-w-2xl leading-relaxed">
              负责所有人员的医疗救治、心理健康评估、认知污染检测及康复工作。
              在阈界威胁面前，保障人员身心健康是组织存续的基石。
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MEDICAL_STATS.map((stat) => (
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

        {/* Resource Status */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-[#f0f0f0] font-bold">资源状态</h2>
              <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                STATUS: OPERATIONAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {RESOURCE_STATUS.map((res) => {
                const percentage = typeof res.used === 'number' && typeof res.total === 'number'
                  ? (res.used / res.total) * 100
                  : 0
                return (
                  <div key={res.name} className="border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>{res.name}</span>
                      <span className="text-xs text-[#f0f0f0]" style={{ fontFamily: MONO }}>
                        {res.used}/{res.total} {res.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-[#4ade80] transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          opacity: percentage > 80 ? 0.6 : 1,
                          backgroundColor: percentage > 80 ? '#e60012' : percentage > 60 ? '#facc15' : '#4ade80'
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Active Cases */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-[#f0f0f0] font-bold">在院病例</h2>
              <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                CONFIDENTIAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACTIVE_CASES.map((c) => (
                <div key={c.id} className="border border-white/10 p-4 hover:border-[#4ade80]/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#4ade80]" style={{ fontFamily: MONO }}>
                      {c.id}
                    </span>
                    <span className={`text-xs px-2 py-0.5 border ${
                      c.status === '治疗中'
                        ? 'text-[#e60012] border-[#e60012]/40'
                        : c.status === '观察中'
                        ? 'text-[#facc15] border-[#facc15]/40'
                        : c.status === '康复中'
                        ? 'text-[#4ade80] border-[#4ade80]/40'
                        : 'text-[#888888] border-white/20'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#888888] mb-1">患者: {c.patient}</p>
                  <p className="text-sm text-[#f0f0f0] font-medium mb-2">{c.type}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>{c.ward}</span>
                    <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>住院 {c.days} 天</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Psych Evaluations */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl text-[#f0f0f0] font-bold mb-8">近期心理评估</h2>

            <div className="border border-white/10">
              <div className="grid grid-cols-5 gap-4 p-3 border-b border-white/10 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                <span>日期</span>
                <span>评估对象</span>
                <span>类型</span>
                <span>结果</span>
                <span>评估师</span>
              </div>
              {PSYCH_EVALS.map((ev, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-3 border-b border-white/5 text-xs hover:bg-white/5 transition-colors">
                  <span className="text-[#888888]" style={{ fontFamily: MONO }}>{ev.date}</span>
                  <span className="text-[#f0f0f0]">{ev.subject}</span>
                  <span className="text-[#888888]">{ev.type}</span>
                  <span className={ev.result === '通过' ? 'text-[#4ade80]' : 'text-[#facc15]'}>
                    {ev.result}
                  </span>
                  <span className="text-[#888888]">{ev.examiner}</span>
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
                    <span className="text-xs text-[#4ade80]" style={{ fontFamily: MONO }}>[部长]</span>
                    <span className="text-sm text-[#f0f0f0]">埃莉诺·肖 (Eleanor Shaw) 博士</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#facc15]" style={{ fontFamily: MONO }}>[副部长]</span>
                    <span className="text-sm text-[#f0f0f0]">戴维·卡特 (David Carter) 博士</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#4ade80]" style={{ fontFamily: MONO }}>[首席]</span>
                    <span className="text-sm text-[#f0f0f0]">詹姆斯·帕克 (James Parker) 博士 - 心理治疗主管</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg text-[#f0f0f0] font-bold mb-4">联系方式</h3>
                <div className="space-y-2 text-sm text-[#888888]">
                  <p>内部频道: DEPT-30-COM</p>
                  <p>急救热线: 3000-30-0001</p>
                  <p>医疗中心: Site-02 / 医疗与心理部大楼</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
