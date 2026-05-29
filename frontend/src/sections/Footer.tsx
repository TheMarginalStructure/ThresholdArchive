import { Link } from 'react-router'
import Logo from '../components/Logo'
import { MONO, BODY } from '../utils/fonts'

const FOOTER_LINKS = {
  档案库: [
    { label: '实体档案', href: '#' },
    { label: '勘探记录', href: '#' },
    { label: '事件报告', href: '#' },
    { label: '理论文件', href: '#' },
  ],
  组织: [
    { label: '指挥理事会', href: '#' },
    { label: '外勤行动部', href: '#' },
    { label: '档案与研究部', href: '#' },
    { label: '医疗与心理部', href: '#' },
  ],
  协议: [
    { label: '用户协议', href: '#' },
    { label: '心智安全守则', href: '#' },
    { label: '隐私政策', href: '#' },
    { label: '版权声明', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4" data-cursor-hover>
              <Logo size={36} />
              <span
                className="text-[#f0f0f0] text-lg font-medium"
                style={{ fontFamily: BODY }}
              >
                边际结构
              </span>
            </Link>
            <p className="text-sm text-[#888888] leading-relaxed max-w-xs">
              一个致力于记录、隔离并尝试理解超自然阈界现象的国际秘密组织。测绘黑暗，设立路标，而非征服。
            </p>
            <div
              className="mt-6 text-xs text-[#666666]"
              style={{ fontFamily: MONO }}
            >
              THE MARGINAL STRUCTURE
              <br />
              EST. [DATA REDACTED]
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-xs text-[#d4a373] tracking-widest uppercase mb-4"
                style={{ fontFamily: MONO }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#888888] hover:text-[#f0f0f0] transition-colors duration-300"
                      data-cursor-hover
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="text-xs text-[#666666]"
            style={{ fontFamily: MONO }}
          >
            © 2026 THE MARGINAL STRUCTURE. ALL RIGHTS RESERVED.
          </div>
          <div
            className="text-xs text-[#e60012]/60 animate-pulse"
            style={{ fontFamily: MONO, letterSpacing: '0.1em' }}
          >
            YOU ARE BEING WATCHED.
          </div>
        </div>

        {/* Style reference credit */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-[#888888]/40">
            本网站视觉风格与交互设计参考了{' '}
            <a
              href="https://earthonline.org.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888888]/60 hover:text-[#d4a373] transition-colors underline underline-offset-2"
              data-cursor-hover
            >
              earthonline.org.cn
            </a>{' '}
            · 界面布局借鉴了 Terminal / Server Log 式信息面板风格
          </p>
        </div>
      </div>
    </footer>
  )
}
