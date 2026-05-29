import PageLayout from '../components/PageLayout'
import { MONO, BODY } from '../utils/fonts'

const CHANNELS = [
  {
    id: '01',
    type: 'VIDEO · 长内容',
    name: '哔哩哔哩',
    nameEn: 'bilibili',
    desc: '协议修订视频、外勤访谈、阈界纪录片。深度内容在这里发，弹幕区是民间剧本扩展区。',
    account: '@边际结构官方',
    bio: 'UID 待填 · 关注后可解锁开发者动态',
    code: 'CH-01 · BILI',
    cta: '扫码关注',
  },
  {
    id: '02',
    type: 'SHORT · 短内容',
    name: '抖音',
    nameEn: 'douyin',
    desc: '15秒到1分钟的阈界切片，专治"今天又是相同的一天"——把勘探日常剪成可消费的片段。',
    account: '@边际结构',
    bio: '每日推送 · 算法分发由系统玄学决定',
    code: 'CH-02 · DOUYIN',
    cta: '扫码关注',
  },
  {
    id: '03',
    type: 'LIFESTYLE · 图文',
    name: '小红书',
    nameEn: 'xiaohongshu',
    desc: '外勤日常、阈界操作协议、物资搭配、心情笔记。在这里"生存"这件事被认真对待。',
    account: '@边际结构',
    bio: '评论区可投稿真实外勤故事',
    code: 'CH-03 · XHS',
    cta: '扫码关注',
  },
  {
    id: '04',
    type: 'GLOBAL · 国际频道',
    name: 'YouTube',
    nameEn: 'global',
    desc: '面向跨区域人员的英文版/双字幕内容。协议修订、官方访谈、全域任务公告全球同步。',
    account: '@MarginalStructure',
    bio: 'EN · 字幕由 AI 翻译，质量请见谅',
    code: 'CH-04 · YT',
    cta: '扫码订阅',
  },
  {
    id: '05',
    type: 'GUILD · 部门大厅',
    name: '官方 QQ 群聊',
    nameEn: 'guild hall',
    desc: '这是唯一一个能让您**直接说话**的频道。任务反馈、异常即时上报、找同事组勘探队、抱团取暖。',
    account: '群号待填入 · 8 位数字',
    bio: '入群暗号："我已知本组织秘密性质" · 管理员是真人，回复时延 0~12 小时',
    code: 'CH-05 · QQ',
    cta: '扫码入群',
    note: '2000 / 2000（满）· 排队中 · 禁打广告 · 禁劝退 · 禁剧透人生',
  },
]

export default function Contact() {
  return (
    <PageLayout
      breadcrumbs={[{ label: 'OFFICIAL' }, { label: '联络终端' }]}
      title="联络终端 / Contact"
      subtitle="官方对外通讯频道。由于安全协议限制，所有通讯均需通过审核。"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Email Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12 pb-8 border-b border-white/10">
          <div>
            <h2 className="text-2xl text-[#f0f0f0] font-bold mb-2" style={{ fontFamily: BODY }}>
              官方对外<span className="text-[#e60012]">通讯频道</span> / Contact
            </h2>
          </div>
          <div className="flex items-center gap-4 border border-white/10 p-3">
            <div>
              <div className="text-[10px] text-[#888888] mb-1">合作邮箱 / BUSINESS</div>
              <a
                href="mailto:contact@tms.org"
                className="text-sm text-[#f0f0f0] hover:text-[#d4a373] transition-colors"
                style={{ fontFamily: MONO }}
              >
                contact@tms.org
              </a>
            </div>
            <button
              className="text-xs border border-white/20 text-[#888888] px-3 py-1.5 hover:border-[#d4a373] hover:text-[#d4a373] transition-colors"
              data-cursor-hover
              onClick={() => navigator.clipboard?.writeText('contact@tms.org')}
            >
              ⎘ 复制
            </button>
          </div>
        </div>

        {/* Channel Matrix */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div
              className="text-xs text-[#d4a373] tracking-wider"
              style={{ fontFamily: MONO }}
            >
              CHANNEL MATRIX · 05 项
            </div>
            <div
              className="text-xs text-[#888888]"
              style={{ fontFamily: MONO }}
            >
              UPDATED / v2026.5.13 · RESPONSE / 人工 · 慢回复
            </div>
          </div>

          <h2 className="text-3xl text-[#f0f0f0] font-bold mb-8" style={{ fontFamily: BODY }}>
            扫码即可触发<span className="text-[#e60012]">官方接触</span>
          </h2>
        </div>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHANNELS.slice(0, 4).map((ch) => (
            <div
              key={ch.id}
              className="border border-white/10 hover:border-white/20 transition-all"
              style={{ background: 'rgba(17, 17, 17, 0.6)' }}
              data-cursor-hover
            >
              {/* Header */}
              <div className="p-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] px-1.5 py-0.5 text-[#f0f0f0]"
                    style={{ background: '#e60012' }}
                  >
                    {ch.type.split(' · ')[0]}
                  </span>
                  <span className="text-[10px] text-[#888888]">{ch.type.split(' · ')[1]}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-lg text-[#f0f0f0]">{ch.name}</h3>
                  <span className="text-[10px] text-[#888888] uppercase">{ch.nameEn}</span>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed mb-4">{ch.desc}</p>

                <div className="space-y-2 mb-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#888888] w-8">账号</span>
                    <span className="text-xs text-[#f0f0f0]">{ch.account}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#888888] w-8">简介</span>
                    <span className="text-xs text-[#888888]">{ch.bio}</span>
                  </div>
                </div>

                {/* QR Placeholder */}
                <div className="border border-dashed border-white/10 p-8 mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div
              className="text-2xl text-[#888888] mb-2 font-bold"
              style={{ fontFamily: MONO }}
            >
              QR
            </div>
                    <div className="text-[10px] text-[#888888]">
                      扫码即显示
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-3 border-t border-white/5">
                <span className="text-[10px] text-[#888888]" style={{ fontFamily: MONO }}>
                  {ch.code}
                </span>
                <a href="#" className="text-xs text-[#d4a373] hover:text-[#e60012] transition-colors">
                  {ch.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* QQ Guild - Full Width */}
        <div className="mt-4 border border-white/10 hover:border-white/20 transition-all" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
          <div className="p-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 text-[#f0f0f0]" style={{ background: '#e60012' }}>
                {CHANNELS[4].type.split(' · ')[0]}
              </span>
              <span className="text-[10px] text-[#888888]">{CHANNELS[4].type.split(' · ')[1]}</span>
              <span className="text-[10px] text-[#e60012] ml-auto">{CHANNELS[4].note}</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-xl text-[#f0f0f0]">{CHANNELS[4].name}</h3>
              </div>
              <p className="text-xs text-[#888888] leading-relaxed">{CHANNELS[4].desc}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#888888] w-8">群号</span>
                <span className="text-xs text-[#f0f0f0]">{CHANNELS[4].account}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#888888] w-8">简介</span>
                <span className="text-xs text-[#888888]">{CHANNELS[4].bio}</span>
              </div>
            </div>

            <div className="border border-dashed border-white/10 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl text-[#888888] mb-2 font-bold" style={{ fontFamily: MONO }}>
                  QR
                </div>
                <div className="text-[10px] text-[#888888]">扫码即显示</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border-t border-white/5">
            <span className="text-[10px] text-[#888888]" style={{ fontFamily: MONO }}>
              {CHANNELS[4].code}
            </span>
            <a href="#" className="text-xs text-[#d4a373] hover:text-[#e60012] transition-colors">
              {CHANNELS[4].cta}
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
