import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { useShopifyProducts } from '../hooks/api/useShopifyProducts'
import { useCart } from '../hooks/api/useCart'
import JoinBanner from '../components/ui/join-banner'
import { useProductSettings } from '../context/ProductSettingsContext'
import { useNavigate } from "react-router-dom";

function ProductDetails() {
  const { handle } = useParams()
  const navigate = useNavigate();
  const { fetchProductByHandle, loading, error } = useShopifyProducts()
  const { buyNow, loading: buyLoading, error: buyError } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { isPriceDisabled } = useProductSettings()
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [isSkeletonExiting, setIsSkeletonExiting] = useState(false)

  useEffect(() => {
    if (!handle) {
      setProduct(null)
      return
    }

    let isMounted = true

    async function loadProduct() {
      try {
        const result = await fetchProductByHandle(handle)
        if (isMounted) {
          setProduct(result)
          setSelectedVariantId(result?.variants.edges[0]?.node.id ?? '')
        }
      } catch {
        if (isMounted) {
          setProduct(null)
        }
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [fetchProductByHandle, handle])

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

  const variants = useMemo(() => product?.variants.edges.map((edge) => edge.node) ?? [], [product])
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) ?? variants[0]
  const invalidHandle = !handle
  const shouldShowContent = !loading && !showSkeleton

  async function handleBuyNow() {
    if (!selectedVariant) {
      return
    }

    try {
      const cart = await buyNow(selectedVariant.id, quantity)
      window.location.href = cart.checkoutUrl
    } catch {
      // Error is exposed via buyError.
    }
  }

  return (
    <div>
        <PageIntro
          title="Product Details"
          subtitle="View live product details from our Shopify store."
        />
    <div className="px-6">
      {invalidHandle ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">Invalid product.</p> : null}
      {error && !invalidHandle ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}
      {buyError ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{buyError}</p> : null}
      {showSkeleton && !invalidHandle ? (
      <div className="flex justify-center">
        <section className={`flex w-full max-w-4xl animate-pulse gap-5 rounded-2xl p-3 ${isSkeletonExiting ? 'products-skeleton-exit' : ''}`.trim()}>
          {/* Image */}
          <div className="h-80 w-80 shrink-0 rounded-xl bg-(--color-light-gray)/60" />

          {/* Right content */}
          <div className="flex flex-1 flex-col">
            {/* Category - short */}
            <div className="h-3 w-24 rounded bg-(--color-light-gray)/60" />

            {/* Title - normal */}
            <div className="mt-3 h-6 w-3/4 rounded bg-(--color-light-gray)/60" />

            {/* Price - short */}
            <div className="mt-3 h-6 w-28 rounded bg-(--color-light-gray)/60" />

            {/* Description - normal */}
            <div className="mt-4 space-y-2">
              <div className="h-4 w-11/12 rounded bg-(--color-light-gray)/60" />
              <div className="h-4 w-11/12 rounded bg-(--color-light-gray)/60" />
              <div className="h-4 w-4/5 rounded bg-(--color-light-gray)/60" />
            </div>

            {/* Stock / final info - short */}
            <div className="mt-4 h-4 w-24 rounded bg-(--color-light-gray)/60" />
          </div>
        </section>
      </div>
      ) : null}
      {shouldShowContent && !error && !invalidHandle && product ? (
        <div className="page-enter flex justify-center">
          <section className="flex w-full max-w-4xl flex-row gap-4 rounded-xl p-3">
            {/* Image */}
            <img
              src={product.images.edges[0]?.node.url}
              alt={product.images.edges[0]?.node.altText || product.title}
              className="max-h-100 max-w-90 shrink-0 rounded-base object-cover"
            />

            {/* Product details */}
            <div className="min-w-0 flex-1">
              {/* <p className="text-xs uppercase tracking-wider">
                {product.productType || 'Uncategorized'}
              </p> */}

            <h2 className="mt-2 text-2xl font-semibold text-(--ink-900)">
              {product.title}
            </h2>

            {!isPriceDisabled && selectedVariant ? <p className="mt-1 text-lg">PHP {selectedVariant.price.amount}</p> : null}

            <div
              className="mt-4 text-sm text-(--ink-700)"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml || 'No description available.' }}
            />

            {variants.length > 1 ? (
              <div className="mt-4">
                <label htmlFor="variant" className="block text-sm text-(--ink-700)">Options</label>
                <select
                  id="variant"
                  value={selectedVariantId}
                  onChange={(event) => setSelectedVariantId(event.target.value)}
                  className="mt-1 rounded-base border border-(--sand-200) px-2 py-1 text-sm"
                >
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                      {variant.title} {!variant.availableForSale ? '(Sold out)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <button
              onClick={() => navigate(-1)}
              className="mt-4 block text-sm text-(--color-b)/50 hover:underline"
            >
              Back
            </button>
          </div>
        </section>
        </div>
      ) : null}
    </div>
    < JoinBanner />
  </div>
  )
}

export default ProductDetails

