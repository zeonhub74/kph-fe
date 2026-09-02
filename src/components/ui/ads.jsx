import { useEffect, useState } from 'react'
import { useAds } from '@/hooks/api/useAds'

const COLUMN_COUNT = 3
const ROTATION_INTERVAL_MS = 3 * 60 * 60 * 1000 // 3 hours
const CHECK_INTERVAL_MS = 60 * 1000 // re-check every minute in case the tab stays open

// Simple seeded PRNG (mulberry32) so the "random" pick is deterministic
// for a given 3-hour window -> every visitor in that window sees the same
// set, and it naturally cycles to a new random set once the window passes.
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function currentTimeBucket() {
  return Math.floor(Date.now() / ROTATION_INTERVAL_MS)
}

function pickForBucket(items, bucket, count) {
  if (items.length === 0) return []
  const rand = mulberry32(bucket)
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

function Ads() {
  const { fetchAds } = useAds()
  const [allAds, setAllAds] = useState([])
  const [bucket, setBucket] = useState(currentTimeBucket())

  useEffect(() => {
    let isMounted = true

    async function loadAds() {
      try {
        const ads = await fetchAds()
        if (isMounted) setAllAds(ads)
      } catch {
        // Keep empty state; component just renders nothing.
      }
    }

    loadAds()

    return () => {
      isMounted = false
    }
  }, [fetchAds])

  useEffect(() => {
    const id = setInterval(() => {
      const next = currentTimeBucket()
      setBucket((prev) => (prev !== next ? next : prev))
    }, CHECK_INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  const visibleAds = pickForBucket(allAds, bucket, COLUMN_COUNT)

  if (visibleAds.length === 0) return null

  const desktopColumnClass =
    visibleAds.length === 1
      ? 'md:grid-cols-1'
      : visibleAds.length === 2
        ? 'md:grid-cols-2'
        : 'md:grid-cols-3'

  return (
    <section className={`mb-8 mt-2 grid grid-cols-1 gap-0 ${desktopColumnClass}`}>
      {visibleAds.map((ad) => (
        <article key={ad.id} className="p-0">
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={ad.imageUrl}
              alt={ad.alt_text || 'Advertisement'}
              className="h-full w-full object-cover select-none"
            />
          </div>
        </article>
      ))}
    </section>
  )
}

export default Ads