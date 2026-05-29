import { useEffect, useRef, useState, useCallback } from 'react'
import { MONO } from '../utils/fonts'

interface LightboxProps {
  isOpen: boolean
  src: string
  alt?: string
  onClose: () => void
}

export default function Lightbox({ isOpen, src, alt = '', onClose }: LightboxProps) {
  const [visible, setVisible] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [error, setError] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setImgLoaded(false)
      setError(false)
      requestAnimationFrame(() => {
        setVisible(true)
      })
      document.body.style.overflow = 'hidden'
    } else {
      setVisible(false)
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      onClose()
      setImgLoaded(false)
      setError(false)
    }, 300)
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
      onClick={handleClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClose()
      }}
    >
      <style>{`
        .custom-cursor-root {
          z-index: 10001 !important;
        }
      `}</style>
      {/* Close indicator */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-[#888888] tracking-widest uppercase"
        style={{ fontFamily: MONO }}
      >
        点击任意处关闭 · ESC
      </div>

      {/* Image container */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {!imgLoaded && !error && (
          <div className="flex flex-col items-center gap-4">
            <div
              className="text-[#d4a373] text-xs tracking-widest uppercase animate-pulse"
              style={{ fontFamily: MONO }}
            >
              加载影像中...
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl text-[#666666]">∅</div>
            <div
              className="text-[#888888] text-xs tracking-widest uppercase"
              style={{ fontFamily: MONO }}
            >
              影像加载失败
            </div>
          </div>
        )}

        {src && (
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] object-contain"
            style={{
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setError(true)
              setImgLoaded(true)
            }}
          />
        )}
      </div>

      {/* Bottom caption */}
      {imgLoaded && !error && alt && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#888888] tracking-widest uppercase text-center max-w-[80vw]"
          style={{ fontFamily: MONO }}
        >
          {alt}
        </div>
      )}
    </div>
  )
}
