import { useEffect, useState } from 'react'
import { useAds } from '@/hooks/api/useAds'

const DEFAULT_COLUMN_COUNT = 3
const ROTATION_INTERVAL_MS = 3 * 60 * 60 * 1000 // 3 hours
const CHECK_INTERVAL_MS = 60 * 1000 // re-check every minute in case the tab stays open
const READY_TIMEOUT_MS = 4000 // never let onReady hang forever

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

function Ads({ count = DEFAULT_COLUMN_COUNT, onReady }) {
  const { fetchAds } = useAds()
  const [allAds, setAllAds] = useState([])
  const [bucket, setBucket] = useState(currentTimeBucket())
  const [hasResolved, setHasResolved] = useState(false)

  function resolve() {
    setHasResolved((prev) => {
      if (!prev) onReady?.()
      return true
    })
  }

  useEffect(() => {
    let isMounted = true

    async function loadAds() {
      try {
        const ads = await fetchAds()
        if (!isMounted) return
        setAllAds(ads)
        // No ads to show -> nothing to wait for, resolve immediately.
        if (ads.length === 0) resolve()
      } catch (err) {
        console.error('Ads: fetchAds failed', err)
        // Fetch failed -> don't block the page waiting for an image that'll never load.
        if (isMounted) resolve()
      }
    }

    loadAds()

    // Safety net: never let the page wait on this forever — if fetchAds
    // hangs, or the image never fires onLoad/onError (e.g. it's inside a
    // hidden/display:none container), force-resolve anyway.
    const timeoutId = setTimeout(() => {
      if (isMounted) resolve()
    }, READY_TIMEOUT_MS)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAds])

  useEffect(() => {
    const id = setInterval(() => {
      const next = currentTimeBucket()
      setBucket((prev) => (prev !== next ? next : prev))
    }, CHECK_INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  const visibleAds = pickForBucket(allAds, bucket, count)

  if (visibleAds.length === 0) return null

  const desktopColumnClass =
    visibleAds.length === 1
      ? 'md:grid-cols-1'
      : visibleAds.length === 2
        ? 'md:grid-cols-2'
        : 'md:grid-cols-3'

  return (
    <section className={`grid h-full grid-cols-1 gap-0 ${desktopColumnClass}`}>
      {visibleAds.map((ad) => (
        <article key={ad.id} className="h-full p-0">
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={ad.imageUrl}
              alt={ad.alt_text || 'Advertisement'}
              onLoad={resolve}
              onError={resolve}
              className="h-full w-full object-cover select-none"
            />
          </div>
        </article>
      ))}
    </section>
  )
}

export default Ads