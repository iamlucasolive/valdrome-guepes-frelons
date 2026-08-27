import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Photo {
  src: string
  alt: string
}

interface PhotoCarouselProps {
  photos: Photo[]
  autoplayInterval?: number
  className?: string
}

const SWIPE_THRESHOLD = 50

export default function PhotoCarousel({
  photos,
  autoplayInterval = 4500,
  className = '',
}: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > index || (index === photos.length - 1 && next === 0) ? 1 : -1)
      setIndex(((next % photos.length) + photos.length) % photos.length)
    },
    [index, photos.length]
  )

  const goNext = useCallback(() => goTo(index + 1), [goTo, index])
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (isPaused || photos.length <= 1) return
    timerRef.current = setInterval(goNext, autoplayInterval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, goNext, autoplayInterval, photos.length])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext()
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev()
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div
      className={`group relative h-72 w-full overflow-hidden rounded-xl bg-wasp-black md:h-96 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          src={photos[index].src}
          alt={photos[index].alt}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
        />
      </AnimatePresence>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Photo précédente"
            onClick={goPrev}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-wasp-black/60 text-white opacity-0 transition-opacity hover:bg-wasp-yellow hover:text-wasp-black group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Photo suivante"
            onClick={goNext}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-wasp-black/60 text-white opacity-0 transition-opacity hover:bg-wasp-yellow hover:text-wasp-black group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {photos.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                aria-label={`Aller à la photo ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-wasp-yellow' : 'w-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
