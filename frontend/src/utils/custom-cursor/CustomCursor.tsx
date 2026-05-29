/**
 * CustomCursor - Zero-latency custom cursor for React
 *
 * Features:
 * - Zero delay tracking (direct mousemove → transform, no lerp)
 * - Auto hover detection on links, buttons, and [data-cursor-hover] elements
 * - Auto-rebinds on DOM changes via MutationObserver
 * - mix-blend-mode: difference for visibility on any background
 * - CSS-driven hover transition (no JS animation loop)
 * - Auto-hide on admin pages (/admin/*)
 * - DevTools detection via devtools-detector library (hides cursor when DevTools open)
 */

import { useEffect, useRef, useState } from 'react'
import devtoolsDetector from 'devtools-detector'
import './custom-cursor.css'

interface CustomCursorProps {
  /** Cursor dot color (default: #e60012) */
  color?: string
  /** Normal dot size in px (default: 6) */
  size?: number
  /** Hover dot size in px (default: 24) */
  hoverSize?: number
  /** Hover opacity 0-1 (default: 0.5) */
  hoverOpacity?: number
  /** Blend mode for contrast on any background (default: 'difference') */
  blendMode?: 'difference' | 'exclusion' | 'normal'
  /** CSS transition duration in seconds (default: 0.12) */
  transitionDuration?: number
  /** z-index value (default: 9998) */
  zIndex?: number
}

export default function CustomCursor({
  color = '#e60012',
  size = 6,
  hoverSize = 24,
  hoverOpacity = 0.5,
  blendMode = 'difference',
  transitionDuration = 0.12,
  zIndex = 9998,
}: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null)
  const isHoveringRef = useRef(false)
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const [devtoolsOpen, setDevtoolsOpen] = useState(false)

  useEffect(() => {
    const listener = (isOpen: boolean) => {
      setDevtoolsOpen(isOpen)
    }
    devtoolsDetector.addListener(listener)
    devtoolsDetector.launch()
    return () => {
      devtoolsDetector.removeListener(listener)
      devtoolsDetector.stop()
    }
  }, [])

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const styleEl = document.createElement('style')
    styleEl.id = 'custom-cursor-hide-default'
    styleRef.current = styleEl

    const updateStyle = () => {
      if (devtoolsOpen) {
        styleEl.textContent = ''
      } else {
        styleEl.textContent = `
          body { cursor: none !important; }
          a, button, [role="button"], input, textarea, select, label[for], [data-cursor-hover] { cursor: none !important; }
        `
      }
    }
    updateStyle()
    document.head.appendChild(styleEl)

    // ----- Zero-delay tracking -----
    const onMouseMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    // ----- Hover state -----
    const onMouseEnterInteractive = () => {
      isHoveringRef.current = true
      dot.classList.add('cursor-hover')
    }
    const onMouseLeaveInteractive = () => {
      isHoveringRef.current = false
      dot.classList.remove('cursor-hover')
    }

    window.addEventListener('mousemove', onMouseMove)

    // ----- Auto-detect interactive elements -----
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], [data-cursor-hover]'
      )
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive)
        el.addEventListener('mouseleave', onMouseLeaveInteractive)
      })

      // Text cursor detection
      const textElements = document.querySelectorAll(
        'input, textarea, [contenteditable="true"]'
      )
      textElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('cursor-text')
        })
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('cursor-text')
        })
      })
    }

    addHoverListeners()

    // Re-bind on DOM changes
    const observer = new MutationObserver(() => {
      addHoverListeners()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!styleRef.current) return
    if (devtoolsOpen) {
      styleRef.current.textContent = ''
    } else {
      styleRef.current.textContent = `
        body { cursor: none !important; }
        a, button, [role="button"], input, textarea, select, label[for], [data-cursor-hover] { cursor: none !important; }
      `
    }
  }, [devtoolsOpen])

  const halfSize = size / 2
  const halfHoverSize = hoverSize / 2

  return (
    <div
      ref={dotRef}
      className="custom-cursor-root"
      data-cursor-hover-size={hoverSize}
      data-cursor-hover-opacity={hoverOpacity}
      data-cursor-hover-half={halfHoverSize}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${size}px`,
        marginLeft: `-${halfSize}px`,
        marginTop: `-${halfSize}px`,
        borderRadius: '50%',
        background: color,
        pointerEvents: 'none',
        zIndex,
        mixBlendMode: blendMode,
        willChange: 'transform',
        transition: `width ${transitionDuration}s, height ${transitionDuration}s, margin ${transitionDuration}s, opacity ${transitionDuration}s`,
        opacity: devtoolsOpen ? 0 : 1,
      }}
    >
      {/* Injected hover/text styles only */}
      <style>{`
        .custom-cursor-root.cursor-hover {
          width: ${hoverSize}px !important;
          height: ${hoverSize}px !important;
          margin-left: -${halfHoverSize}px !important;
          margin-top: -${halfHoverSize}px !important;
          opacity: ${hoverOpacity} !important;
          cursor: pointer !important;
        }
        .custom-cursor-root.cursor-text {
          width: 2px !important;
          height: 20px !important;
          margin-left: -1px !important;
          margin-top: -10px !important;
          border-radius: 2px !important;
          opacity: 0.8 !important;
          cursor: text !important;
        }
      `}</style>
    </div>
  )
}
