import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import ProductCardsSkeleton from '../components/ui/skeleton-product'
import { useShopifyProducts } from '../hooks/api/useShopifyProducts'
import JoinBanner from '../components/ui/join-banner'
import { useProductSettings } from '../context/ProductSettingsContext'

function Products() {
  const { fetchProducts, loading, error } = useShopifyProducts()
  const { isPriceDisabled } = useProductSettings()
  const [products, setProducts] = useState([])
  const [hasLoadedProducts, setHasLoadedProducts] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [isSkeletonExiting, setIsSkeletonExiting] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      try {
        const result = await fetchProducts()
        if (isMounted) {
          setProducts(result)
          setHasLoadedProducts(true)
        }
      } catch {
        // Error is exposed via the hook's error state.
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [fetchProducts])

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true)
      setIsSkeletonExiting(false)
      return
    }

    if (!showSkeleton) {
      return
    }

    setIsSkeletonExiting(true)
    const hideSkeletonTimeout = window.setTimeout(() => {
      setShowSkeleton(false)
      setIsSkeletonExiting(false)
    }, 220)

    return () => {
      window.clearTimeout(hideSkeletonTimeout)
    }
  }, [loading, showSkeleton])

  const shouldShowContent = !loading && !showSkeleton

  return (
    <div>
      <PageIntro title="Our Solutions" subtitle="Browse products from our Shopify store." />
      {error ? <p className="p-4 px-4 py-2 text-sm text-red-700">{error}</p> : null}
      {showSkeleton ? <ProductCardsSkeleton className={isSkeletonExiting ? 'products-skeleton-exit' : ''} /> : null}
      {shouldShowContent && hasLoadedProducts && products.length === 0 ? (
        <p className="page-enter rounded-xl border border-(--sand-200) bg-white p-5 text-sm text-(--ink-700)">No products found.</p>
      ) : null}
      {shouldShowContent && hasLoadedProducts && products.length > 0 ? (
        <div className="page-enter px-6 space-y-6">
          {Object.entries(
            products.reduce((groups, product) => {
              const groupName = product.productType || 'Uncategorized'
              if (!groups[groupName]) {
                groups[groupName] = []
              }

              groups[groupName].push(product)
              return groups
            }, {}),
          ).map(([groupName, groupProducts]) => (
            <section key={groupName} className="space-y-2">
              {/* <p className="px-1 text-sm uppercase tracking-wide font-semibold select-none">
                {groupName}
              </p> */}

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {groupProducts.map((product) => {
                  const image = product.images.edges[0]?.node
                  const price = product.priceRange.minVariantPrice

                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.handle}`}
                      className="block cursor-pointer rounded-xl bg-white p-3 shadow-sm hover:shadow-md"
                    >
                      {image ? (
                        <img
                          src={image.url}
                          alt={image.altText || product.title}
                          className="mt-2 h-60 w-full rounded-lg object-cover select-none"
                        />
                      ) : null}

                      <h2 className="mt-2 text-lg">
                        {product.title}
                      </h2>

                      {!isPriceDisabled ? <p className="mt-0 text-sm">PHP {price.amount}</p> : null}
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}

        </div>
      ) : null}
      < JoinBanner />
    </div>
  )
}

export default Products

