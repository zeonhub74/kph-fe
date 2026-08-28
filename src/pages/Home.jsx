import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HomeBanner from '../components/ui/home-banner'
import { sessionHasAdminRole, useAuthSession } from '../hooks/api/useLogin'
import { useShopifyProducts } from '../hooks/api/useShopifyProducts'

function Home() {
  const session = useAuthSession()
  const isAdmin = sessionHasAdminRole(session)
  const { fetchProducts } = useShopifyProducts()
  const [featuredProducts, setFeaturedProducts] = useState([])

  function pickRandomProducts(products, count) {
    const shuffled = [...products].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  useEffect(() => {
    let isMounted = true

    async function loadFeaturedProducts() {
      try {
        const products = await fetchProducts()
        if (isMounted && products.length > 0) {
          setFeaturedProducts(pickRandomProducts(products, 2))
        }
      } catch {
        // Keep fallback card content when product fetch fails.
      }
    }

    loadFeaturedProducts()

    return () => {
      isMounted = false
    }
  }, [fetchProducts])

  return (
    <div>
      <HomeBanner
        title={<img src="/KPH-Logo-Text-W.png" alt="KARITONPH" className="h-15" />}
        subtitle="Empowering Filipino Retailers and Online Sellers with practical, high-quality, transformative home and business solutions"
      />  
      <section className="grid gap-8 md:grid-cols-3 p-10 items-center justify-left">
        <p>
          Bringing value to Filipinos through products rooted in integrity and practicality.
        </p>
        <p>
          Curating solutions that tackle everyday challenges at home and in business.
        </p>
        <p>
          Prioritizing Filipino needs by sourcing innovation worldwide for local homes and enterprises.
        </p>
      </section>

      <h2 className="px-6 text-2xl font-semibold leading-tight">Upgrading your home begins here</h2>
      <section className={`grid gap-0 mb-8 ${isAdmin ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
        {featuredProducts.length > 0
          ? featuredProducts.map((product) => (
              <article key={product.id} className="p-0  text-justify">
                <div className="relative mt-2 h-80 w-full overflow-hidden">
                  <img
                    src={product.images.edges[0]?.node.url}
                    alt={product.images.edges[0]?.node.altText || product.title}
                    className="h-full w-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3 text-white select-none">
                    <h2 className="px-2 text-xl font-semibold leading-tight">{product.title}</h2>
                    <p className="max-w-140 px-2 text-xs text-white/95">
                        {(() => {
                        const text =
                          product.descriptionHtml
                            ?.replace(/<[^>]*>/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim() ||
                          'Explore practical products tailored for your home and business needs.';

                        const firstPeriod = text.indexOf('.');

                        return firstPeriod !== -1
                          ? text.slice(0, firstPeriod + 1)
                          : text;
                      })()}
                    </p>
                  </div>
                </div>
              </article>
            ))
          : null}
          </section>

        {isAdmin ? (
          <div className='mb-8 p-2'>
          <article className="bg-white p-5">
            <h2 className="text-xl font-semibold">Admin Workspace</h2>
            <p className="mt-2 text-sm">Manage products and categories from the dashboard.</p>
            <Link to="/dashboard" className="mt-2 inline-block text-sm font-semibold text-(--color-blue) hover:text-(--color-green) select-none">Go to Dashboard</Link>
          </article>
          </div>
        ) : null}

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          {/* Thinking of Upgrading */}
          <article className="border border-white/10 p-4 text-center">
            <h2 className="text-xl font-semibold">
              Thinking of Improving Your Home?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Whether you're starting small or planning a bigger improvement, we're here to help you
              find practical solutions for your needs.
            </p>
          </article>

          {/* Questions */}
          <article className="border border-white/10 p-4 text-center">
            <h2 className="text-xl font-semibold">
              We're Happy to Help.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Not sure which product is right for you? Ask us anything. Our team is
              happy to help you understand your options and choose what works best for
              your home.
            </p>
          </article>

          {/* Contact */}
          <article className="border border-white/10 p-4 text-center">
            <h2 className="text-xl font-semibold">
              Start at Your Own Pace.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              You don't have to upgrade everything at once. Start with what matters
              most, and take each step toward a more comfortable and convenient home.
            </p>
          </article>
        </section>

    </div>
  )
}

export default Home

