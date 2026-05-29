import PageLayout from '../components/PageLayout'
import { MONO, BODY } from '../utils/fonts'

const LEADERSHIP = [
  { position: '总指挥', name: '伊利亚·彼得连科 (Ilya Petrenko) 总指挥', department: '最高指挥部', id: 'IPetrenko', note: '年近七十，以现实主义和决断力著称' },
  { position: '副总指挥', name: '索菲亚·罗德里格斯 (Sofia Rodriguez) 副总指挥', department: '最高指挥部', id: 'SRodriguez', note: '负责日常运营和危机协调' },
  { position: '科学顾问', name: '哈维尔·冈萨雷斯 (Javier Gonzalez) 博士', department: '最高指挥部', id: 'HGonzalez', note: '监督跨部门研究项目' },
  { position: '安全顾问', name: '娜塔莉·李 (Natalie Li)', department: '最高指挥部', id: 'NLi', note: '评估组织整体威胁' },
]

const COUNCIL_MEMBERS = [
  { position: '外勤行动部部长', name: '亚历山大·科瓦尔 (Alexander Koval) 部长' },
  { position: '档案与研究部部长', name: '陈维华 (Chen Weihua) 博士' },
  { position: '医疗与心理部部长', name: '埃莉诺·肖 (Eleanor Shaw) 博士' },
  { position: '后勤与架构部部长', name: '彼得·安德森 (Peter Anderson) 部长' },
  { position: '安全与防护部部长', name: '维克多·科瓦列夫 (Victor Kovalev)/铁墙 部长' },
]

const DEPARTMENTS = [
  {
    id: 'DEPT-FIELD',
    name: '外勤行动部',
    head: '亚历山大·科瓦尔 部长',
    staff: 32,
    active: 31,
    description: '负责阈界实体的勘探、收容与清理。下辖伽马队、堡垒队、西格玛队、守护者队、贝塔队、织梦者队、拾荒者队、守夜人队等专业勘探队伍。',
    teams: ['伽马队', '堡垒队', '西格玛队', '守护者队', '贝塔队', '织梦者队', '拾荒者队', '守夜人队'],
  },
  {
    id: 'DEPT-ARCHIVE',
    name: '档案与研究部',
    head: '陈维华 博士',
    staff: 8,
    active: 8,
    description: '负责记录、分类、交叉引用所有来自阈界的数据。管理档案编码系统、威胁等级评定和知识管理体系。',
    teams: ['档案员团队', '分析员团队', '研究员团队'],
  },
  {
    id: 'DEPT-MED',
    name: '医疗与心理部',
    head: '埃莉诺·肖 博士',
    staff: 7,
    active: 7,
    description: '治疗由阈界经历引发的PTSD、认知扭曲、模因感染等。提供生理医疗、心理评估与康复服务。',
    teams: ['生理医疗团队', '心理评估与康复团队', '净化协议团队'],
  },
  {
    id: 'DEPT-SEC',
    name: '安全与防护部',
    head: '维克多·科瓦列夫/铁墙 部长',
    staff: 10,
    active: 10,
    description: '负责设施安全评估、威胁分析和防护措施制定。管理安全专员团队、防护技术团队和应急响应团队。',
    teams: ['安全专员团队', '防护技术团队', '应急响应团队'],
  },
  {
    id: 'DEPT-LOG',
    name: '后勤与架构部',
    head: '彼得·安德森 部长',
    staff: 5,
    active: 5,
    description: '在稳定的阈界连接点建造前哨站、安全屋、隔离墙。"锁匠"小组负责研究、建立、维持或关闭连接点。',
    teams: ['架构师团队', '后勤支援团队', '"锁匠"技术小组'],
  },
]

const PERSONNEL_STATS = [
  { label: '总人员数', value: '71', color: '#f0f0f0' },
  { label: '现役人员', value: '70', color: '#4ade80' },
  { label: '阵亡人员', value: '1', color: '#e60012' },
  { label: '现役率', value: '98.6%', color: '#d4a373' },
]

export default function About() {
  return (
    <PageLayout
      breadcrumbs={[{ label: 'OFFICIAL' }, { label: '关于组织' }]}
      title="关于边际结构 / About TMS"
      subtitle="测绘黑暗，设立路标，而非征服。EST. [DATA REDACTED] · 非公募组织"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 pb-16 border-b border-white/10">
          <div>
            <div
              className="inline-block px-3 py-1 mb-6 border border-white/10 text-[#888888] text-[10px] tracking-widest"
              style={{ fontFamily: MONO }}
            >
              EST. [DATA REDACTED] · NON-PUBLIC · NO EXTERNAL RECRUITMENT
            </div>
            <h2 className="text-3xl text-[#f0f0f0] font-bold mb-6" style={{ fontFamily: BODY }}>
              以组织名义守护现实
            </h2>
            <div className="space-y-4 text-sm text-[#888888] leading-relaxed">
              <p>
                边际结构是一个<span className="text-[#f0f0f0]">国际性非公募组织</span>，致力于研究和缓解阈界异常现象带来的威胁。
              </p>
              <p>
                人员来源是秘密选拔——<span className="text-[#f0f0f0]">各领域天才、超自然事件幸存者、拥有特殊认知能力的个体</span>，
                以及那些因自身秘密而无法融入主流社会的"边缘人"。
              </p>
              <p>
                我们的使命是<span className="text-[#e60012]">测绘黑暗，设立路标，而非征服</span>。
              </p>
            </div>
            <div className="mt-6 border-l-2 border-[#d4a373] pl-4">
              <p className="text-xs text-[#888888]">
                本组织为<span className="text-[#f0f0f0]">非公募性质</span>，不依据任何公开法律条文运作。
              </p>
            </div>
          </div>

          {/* Personnel Stats */}
          <div className="grid grid-cols-2 gap-4">
            {PERSONNEL_STATS.map((stat) => (
              <div key={stat.label} className="border border-white/10 p-5" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
                <div className="text-xs text-[#888888] mb-2">{stat.label}</div>
                <div className="text-2xl font-bold" style={{ fontFamily: MONO, color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Council */}
        <div className="mb-16">
          <div
            className="text-xs text-[#d4a373] tracking-wider mb-8"
            style={{ fontFamily: MONO }}
          >
            LEADERSHIP COUNCIL · 指挥理事会
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEADERSHIP.map((member) => (
              <div
                key={member.id}
                className="border border-white/10 p-5"
                style={{ background: 'rgba(17, 17, 17, 0.6)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#888888] mb-1">{member.position}</div>
                    <div className="text-base text-[#f0f0f0] font-medium">{member.name}</div>
                    <div className="text-xs text-[#888888] mt-1">{member.department}</div>
                  </div>
                  <span className="text-[10px] text-[#888888]" style={{ fontFamily: MONO }}>
                    {member.id}
                  </span>
                </div>
                <div className="mt-3 text-xs text-[#d4a373] italic">{member.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Council Members */}
        <div className="mb-16">
          <div
            className="text-xs text-[#d4a373] tracking-wider mb-8"
            style={{ fontFamily: MONO }}
          >
            COUNCIL MEMBERS · 理事会成员
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COUNCIL_MEMBERS.map((member) => (
              <div
                key={member.position}
                className="border border-white/10 p-4 text-center"
                style={{ background: 'rgba(17, 17, 17, 0.6)' }}
              >
                <div className="text-[10px] text-[#888888] mb-2">{member.position}</div>
                <div className="text-xs text-[#f0f0f0]">{member.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="mb-16">
          <div
            className="text-xs text-[#d4a373] tracking-wider mb-8"
            style={{ fontFamily: MONO }}
          >
            DEPARTMENTS · 部门架构 · 05 DEPARTMENTS
          </div>

          <div className="space-y-6">
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                className="border border-white/10 overflow-hidden"
                style={{ background: 'rgba(17, 17, 17, 0.6)' }}
              >
                <div className="p-5 border-b border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg text-[#f0f0f0] font-medium">{dept.name}</h3>
                      <span className="text-[10px] text-[#888888]" style={{ fontFamily: MONO }}>
                        {dept.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-xs">
                      <span>主管: <span className="text-[#d4a373]">{dept.head}</span></span>
                      <span>人员: <span className="text-[#f0f0f0]">{dept.active}</span> / {dept.staff}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#888888] mt-3 leading-relaxed">{dept.description}</p>
                </div>
                
                {/* Teams */}
                <div className="p-5 bg-black/30">
                  <div className="text-[10px] text-[#888888] mb-3" style={{ fontFamily: MONO }}>
                    TEAMS / 下属团队
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dept.teams.map((team) => (
                      <span
                        key={team}
                        className="px-3 py-1 border border-white/10 text-xs text-[#888888]"
                      >
                        {team}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organizational Chart */}
        <div className="mb-16">
          <div
            className="text-xs text-[#d4a373] tracking-wider mb-8"
            style={{ fontFamily: MONO }}
          >
            ORGANIZATIONAL CHART · 组织架构总览
          </div>

          <div className="border border-white/10 p-6 overflow-x-auto" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
            <pre className="text-xs text-[#888888] whitespace-pre-wrap font-mono leading-relaxed">
{`边际结构 (The Marginal Structure)
├── 领导层
│   ├── 指挥理事会
│   │   ├── 总指挥：伊利亚·彼得连科总指挥
│   │   ├── 副总指挥：索菲亚·罗德里格斯副总指挥
│   │   ├── 科学顾问：哈维尔·冈萨雷斯博士
│   │   └── 安全顾问：娜塔莉·李
│   └── 理事会成员（各部门部长）
├── 外勤行动部 (32人)
│   ├── 部长：亚历山大·科瓦尔部长
│   ├── 首席勘探员："堡垒"
│   └── 8支专业勘探队伍
├── 档案与研究部 (8人)
│   ├── 部长：陈维华博士
│   ├── 首席档案员：安雅·夏尔马
│   └── 首席研究员：林知远博士
├── 医疗与心理部 (7人)
│   ├── 部长：埃莉诺·肖博士
│   └── 副部长：戴维·卡特博士
├── 安全与防护部 (10人)
│   ├── 部长：维克多·科瓦列夫/铁墙部长
│   └── 应急响应主管：马库斯·斯通/哨兵
└── 后勤与架构部 (5人)
    ├── 部长：彼得·安德森部长
    └── "锁匠"技术小组`}
            </pre>
          </div>
        </div>

        {/* Personnel Statistics */}
        <div className="mb-16">
          <div
            className="text-xs text-[#d4a373] tracking-wider mb-8"
            style={{ fontFamily: MONO }}
          >
            PERSONNEL STATISTICS · 人员统计
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Department */}
            <div className="border border-white/10 p-6" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
              <div className="text-xs text-[#888888] mb-4">按部门统计</div>
              <div className="space-y-3">
                {[
                  { dept: '领导层', active: 9, total: 9 },
                  { dept: '外勤行动部', active: 31, total: 32 },
                  { dept: '档案与研究部', active: 8, total: 8 },
                  { dept: '医疗与心理部', active: 7, total: 7 },
                  { dept: '安全与防护部', active: 10, total: 10 },
                  { dept: '后勤与架构部', active: 5, total: 5 },
                ].map((item) => (
                  <div key={item.dept} className="flex items-center gap-4">
                    <div className="w-24 text-xs text-[#888888]">{item.dept}</div>
                    <div className="flex-1 h-2 bg-white/5 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${(item.active / item.total) * 100}%`,
                          background: item.active === item.total ? '#4ade80' : '#e60012',
                        }}
                      />
                    </div>
                    <div className="w-16 text-xs text-[#f0f0f0]" style={{ fontFamily: MONO }}>
                      {item.active}/{item.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Status */}
            <div className="border border-white/10 p-6" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
              <div className="text-xs text-[#888888] mb-4">按状态统计</div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { status: '现役', count: 70, percent: '98.6%', color: '#4ade80' },
                  { status: '阵亡', count: 1, percent: '1.4%', color: '#e60012' },
                  { status: 'MIA', count: 0, percent: '0.0%', color: '#888888' },
                ].map((item) => (
                  <div key={item.status} className="text-center">
                    <div className="text-2xl font-bold" style={{ fontFamily: MONO, color: item.color }}>
                      {item.count}
                    </div>
                    <div className="text-xs text-[#888888] mt-1">{item.status}</div>
                    <div className="text-[10px] text-[#888888]">{item.percent}</div>
                  </div>
                ))}
              </div>
              
              {/* Loss Causes */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-xs text-[#888888] mb-3">主要损失原因</div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-[#888888]">认知溶解</div>
                  <div className="flex-1 h-2 bg-white/5">
                    <div className="h-full w-full bg-[#e60012]" />
                  </div>
                  <div className="text-xs text-[#e60012]">1人</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Notice */}
        <div className="border border-[#d4a373]/30 p-6" style={{ background: 'rgba(212, 163, 115, 0.05)' }}>
          <div className="text-xs text-[#d4a373] mb-3" style={{ fontFamily: MONO }}>
            ACCESS LEVEL · 访问权限
          </div>
          <p className="text-sm text-[#888888]">
            本组织架构表访问权限为 <span className="text-[#d4a373]">4级</span>。所有人员信息需严格用于内部管理，未经授权不得传播。人事信息涉及阈界暴露史需加密存储。
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
