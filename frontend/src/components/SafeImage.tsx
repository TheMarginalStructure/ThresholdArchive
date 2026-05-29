import { useState } from 'react'
import { MONO } from '../utils/fonts'

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  fallbackClassName?: string
  fallbackText?: string
}

export default function SafeImage({
  src,
  alt,
  className = '',
  style = {},
  fallbackClassName = '',
  fallbackText = '暂无影像',
}: SafeImageProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#1a1a1a] border border-white/10 ${fallbackClassName}`}
      >
        <div className="text-3xl text-[#666666] mb-1">∅</div>
        <div className="text-[10px] text-[#666666] tracking-wider uppercase" style={{ fontFamily: MONO }}>
          {fallbackText}
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  )
}
