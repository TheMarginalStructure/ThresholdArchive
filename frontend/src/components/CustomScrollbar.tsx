import { useEffect, useRef, type ReactNode } from 'react'

interface CustomScrollbarProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function CustomScrollbar({ children, className, style }: CustomScrollbarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const originalScrollTo = window.scrollTo

    window.scrollTo = function (optionsOrX: ScrollToOptions | number = {}, y?: number) {
      // 对象参数
      if (typeof optionsOrX === 'object' && optionsOrX !== null) {
        const opts = optionsOrX as ScrollToOptions
        if (opts.top === 0 || opts.behavior === 'instant') {
          el.scrollTop = 0
        }
        originalScrollTo(optionsOrX as ScrollToOptions)
        return
      }
      // 数字参数
      const x = typeof optionsOrX === 'number' ? optionsOrX : 0
      const yy = y ?? 0
      if (x === 0) {
        el.scrollTop = 0
      }
      originalScrollTo(x, yy)
    }

    return () => {
      window.scrollTo = originalScrollTo
    }
  }, [])

  return (
    <div ref={scrollRef} className={`custom-scrollbar ${className || ''}`} style={style}>
      {children}
    </div>
  )
}
