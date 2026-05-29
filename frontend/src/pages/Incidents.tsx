import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { api, type ApiArchive } from '../lib/api'
import { MONO } from '../utils/fonts'

const TAGS = ['认知危害', '空间扭曲', '时间异常', '模因感染', '物理法则', '实体威胁', '心理创伤', '设备故障']

export default function Incidents() {
  const [posts, setPosts] = useState<ApiArchive[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.archives.list({ category: '事件报告', limit: '20', page: '1' })
      .then((res) => setPosts(res.data))
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout
      breadcrumbs={[{ label: 'COMMUNITY' }, { label: '事件通报' }]}
      title="事件通报 / Incident Reports"
      subtitle="阈界异常事件的实时通报与经验共享。把能活下来的方法开源，记录不是成功学，是同事互相留下的生存参考。"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="border border-white/10 p-4 mb-6" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 border border-[#e60012] flex items-center justify-center text-[#e60012] text-sm font-bold">
                  匿
                </div>
                <div>
                  <div className="text-sm text-[#f0f0f0]">匿名人员</div>
                  <div className="text-[10px] text-[#888888]" style={{ fontFamily: MONO }}>
                    EO-ANON-XXXX
                  </div>
                </div>
              </div>
              <a href="#" className="text-xs text-[#d4a373] hover:text-[#e60012] transition-colors">个人主页</a>
            </div>

            <div className="mb-6">
              <div className="text-xs text-[#888888] mb-3 tracking-wider">频道</div>
              <div className="space-y-0">
                {[
                  { id: '01', name: '操作协议开源', status: 'OPEN' },
                  { id: '02', name: '事件日志', status: 'LIVE' },
                  { id: '03', name: '异常上报', status: 'WARN' },
                ].map((ch) => (
                  <a
                    key={ch.id}
                    href="#"
                    className="flex items-center justify-between py-3 border-b border-white/5 text-sm hover:text-[#f0f0f0] transition-colors"
                    data-cursor-hover
                  >
                    <span className="text-[#888888]">{ch.name}</span>
                    <span className="text-[10px]" style={{ fontFamily: MONO }}>
                      {ch.status}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-[#888888] mb-3 tracking-wider">标签</div>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[#888888] border border-white/10 px-2 py-1 hover:border-[#d4a373]/50 hover:text-[#d4a373] transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex items-center gap-6 border-b border-white/10 mb-6">
              {['推荐', '最新', '高赞', '已同步'].map((tab, i) => (
                <button
                  key={tab}
                  className={`text-sm pb-3 border-b-2 transition-colors ${i === 0 ? 'border-[#d4a373] text-[#d4a373]' : 'border-transparent text-[#888888] hover:text-[#f0f0f0]'}`}
                  data-cursor-hover
                >
                  {tab}
                </button>
              ))}
            </div>

            {loading && (
              <div className="text-center py-24 text-[#888888]">
                <div className="text-xs text-[#d4a373] tracking-widest uppercase mb-4 animate-pulse" style={{ fontFamily: MONO }}>
                  LOADING INCIDENT DATA...
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
              <div className="space-y-4">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="border border-white/10 hover:border-white/20 transition-all duration-300 p-5"
                    style={{ background: 'rgba(17, 17, 17, 0.4)' }}
                    data-cursor-hover
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] px-2 py-0.5 text-[#d4a373] border border-[#d4a373]/40">
                        {post.status}
                      </span>
                      <span className="text-xs text-[#888888]">
                        {post.archiveDate ? new Date(post.archiveDate).toLocaleDateString('zh-CN') : '-'}
                      </span>
                    </div>

                    <h3 className="text-base text-[#f0f0f0] font-medium mb-2 hover:text-[#d4a373] transition-colors cursor-pointer">
                      {post.title}
                    </h3>

                    <p className="text-sm text-[#888888] leading-relaxed mb-4">{post.description || '暂无描述'}</p>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {post.mainDangers.map((tag) => (
                        <span key={tag} className="text-[10px] text-[#888888] border border-white/10 px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                      <span>{post.code}</span>
                      <span className="ml-auto">{post.threatLevel || '-'}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
