import { useEffect, useRef, useState } from 'react'
import { MONO } from '../utils/fonts'

export default function LoadingScreen({ onProgress, onComplete }: { onProgress?: (progress: number) => void; onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += Math.random() * 15 + 5
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.transform = 'translateY(-100%)'
            containerRef.current.style.transition = 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)'
          }
          setTimeout(onComplete, 800)
        }, 400)
      }
      const rounded = Math.floor(current)
      setProgress(rounded)
      onProgress?.(rounded)
    }, 120)

    return () => clearInterval(interval)
  }, [onComplete, onProgress])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center"
    >
      <div className="text-center">
        <div
          className="text-[#e60012] font-mono text-6xl font-bold tracking-tighter"
          style={{ fontFamily: MONO }}
        >
          {progress}%
        </div>
        <div
          className="mt-4 text-[#888888] font-mono text-xs tracking-widest uppercase"
          style={{ fontFamily: MONO }}
        >
          INITIALIZING SECURE CONNECTION
        </div>
      </div>
    </div>
  )
}
