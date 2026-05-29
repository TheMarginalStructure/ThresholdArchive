import { useEffect, useState } from 'react'
import { MONO, BODY } from '../utils/fonts'
import { api, type ApiReview } from '../lib/api'

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ApiReview[]>([])
  const [loading, setLoading] = useState(true)
  const [avgRating, setAvgRating] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.reviews.list({ verified: 'true' })
        const all = Array.isArray(data) ? data : []
        setReviews(all.slice(0, 4))
        setTotalCount(all.length)
        if (all.length > 0) {
          const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length
          setAvgRating(Math.round(avg * 10) / 10)
        }
      } catch {
        setReviews([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <section id="reviews" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="mb-16">
          <div
            className="text-xs text-[#d4a373] tracking-widest uppercase mb-2"
            style={{ fontFamily: MONO }}
          >
            FIELD REPORTS / 已验证评价
          </div>
          <h2
            className="text-3xl md:text-4xl text-[#f0f0f0] font-bold"
            style={{ fontFamily: BODY }}
          >
            评价与回响
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div
              className="h-full p-8 flex flex-col justify-between"
              style={{ background: '#e60012' }}
            >
              <div>
                <div
                  className="text-[80px] md:text-[100px] text-white font-bold leading-none tracking-tighter"
                  style={{ fontFamily: MONO }}
                >
                  {loading ? '...' : avgRating.toFixed(1)}
                </div>
                <div
                  className="text-white/60 text-sm mt-2"
                  style={{ fontFamily: MONO }}
                >
                  / 5 · 平均评分
                </div>
              </div>

              <div>
                <div className="text-white text-lg font-medium mb-1">人员评价汇总</div>
                <div className="text-white/60 text-xs">
                  基于 {loading ? '...' : totalCount} 条已验证评价
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="border border-white/10 p-6 animate-pulse" style={{ background: 'rgba(17, 17, 17, 0.6)' }}>
                    <div className="h-5 w-20 bg-white/5 rounded mb-4" />
                    <div className="h-4 bg-white/5 rounded mb-2" />
                    <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-white/5 rounded mb-4 w-1/2" />
                    <div className="border-t border-white/10 pt-4"><div className="h-3 w-32 bg-white/5 rounded" /></div>
                  </div>
                ))}
              </>
            ) : reviews.length === 0 ? (
              <div className="col-span-2 text-center py-24 text-[#888888]">
                <div className="text-xs text-[#d4a373] tracking-widest uppercase mb-4" style={{ fontFamily: MONO }}>
                  NO VERIFIED REVIEWS
                </div>
              </div>
            ) : (
              reviews.map((review, i) => (
                <div
                  key={review.id}
                  className="border border-white/10 p-6 flex flex-col justify-between"
                  style={{ background: 'rgba(17, 17, 17, 0.6)' }}
                  data-cursor-hover
                >
                  <div>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 mb-4"
                      style={{ background: review.verified ? '#4ade8020' : '#88888820' }}
                    >
                      <span
                        className="text-xs"
                        style={{ color: review.verified ? '#4ade80' : '#888888', fontFamily: MONO }}
                      >
                        {i === 0 ? '推荐' : review.verified ? '已验证' : '待验证'}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={star <= review.rating ? '#d4a373' : 'transparent'}
                            stroke="#d4a373"
                            strokeWidth="1.5"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-[#f0f0f0] leading-relaxed mb-4">
                      "{review.content}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#888888]" style={{ fontFamily: MONO }}>
                          EO-{String(review.id).padStart(4, '0')}
                        </div>
                        <div className="text-xs text-[#d4a373] mt-0.5">{review.author}</div>
                      </div>
                      <div className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="#/personnel"
            className="inline-flex items-center gap-2 border border-white/20 text-[#f0f0f0] px-6 py-3 text-sm hover:border-[#e60012] hover:text-[#e60012] transition-colors duration-300"
            data-cursor-hover
          >
            查看全部评价
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}