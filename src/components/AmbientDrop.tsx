import { useEffect, useRef } from 'react'

/**
 * A single paint-drop silhouette: a rounded square with one softened
 * corner (the classic teardrop trick), whose sharp corner and roundness
 * breathe gently so it reads as dripping rather than static.
 */
function dropRadius(t: number): string {
  const point = 10 + 8 * Math.sin(t) // the "drip point" corner, 10%-18%
  const round = 62 + 6 * Math.cos(t) // the three round corners
  return `${round}% ${round}% ${round}% ${point}%`
}

export function AmbientDrop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    function update() {
      frame = 0
      const y = window.scrollY
      const el = ref.current
      if (!el) return

      const wave = y / 340
      const translateY = Math.sin(wave) * 130
      const translateX = Math.sin(wave * 0.6 + 0.8) * 18
      const rotate = -34 + Math.sin(wave * 0.5) * 26
      const scale = 1 + Math.sin(wave * 0.8 + 0.4) * 0.06

      el.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`
      el.style.borderRadius = dropRadius(wave)
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, black 0%, black 7vw, transparent 28vw)',
        maskImage: 'linear-gradient(to right, black 0%, black 7vw, transparent 28vw)',
      }}
    >
      <div
        ref={ref}
        className="absolute -left-20 top-[30%] h-64 w-64 bg-accent shadow-[0_40px_90px_-30px_rgba(140,26,36,0.6)]"
      />
    </div>
  )
}
