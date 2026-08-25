import PageIntro from '@/components/PageIntro'

function About() {
  return (
    <div>
      <PageIntro
        title="About"
        subtitle="KaritonPH is a starter project structure with clear frontend and backend separation."
      />

      <div className="flex justify-center px-4 mb-8 sm:px-6">
        <section className="w-full max-w-6xl text-(--color-b)">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <img
              src="/KPH-Black.png"
              alt="KaritonPH"
              className="h-auto w-full rounded-lg object-cover"
            />

            <div>
              <h1 className="py-2 text-2xl font-semibold">
                About KaritonPH
              </h1>

              <p className="py-2 text-base leading-relaxed text-justify md:text-xl">
                Our mission is to bring high-quality products from around the world to
                Filipino homes and businesses, carefully selected to serve
                practical and specialized needs.
              </p>

              <p className="py-2 text-base leading-relaxed text-justify md:text-xl">
                We are committed to delivering reliable solutions through
                professional installation, dependable support, and long-term
                maintenance, helping our customers operate with confidence,
                efficiency, and ease.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-center px-4 mb-12 sm:px-6">
        <section className="w-full max-w-6xl text-(--color-b) border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-semibold md:text-3xl mb-2">
            Contact Us
          </h2>
          <p className="text-base leading-relaxed md:text-lg mb-3">
            We'd love to hear from you! Reach out through any of these channels:
          </p>
          <ul className="space-y-1 text-base leading-relaxed md:text-lg">
            <li>
              <span className="font-medium">Email:</span>{' '}
              <a
                href="mailto:admin@karitonPH.com"
                className="text-(--color-blue) hover:underline"
              >
                admin@karitonPH.com
              </a>
            </li>
            <li>
              <span className="font-medium">Facebook:</span>{' '}
              <a
                href="https://www.facebook.com/karitonphpurewater"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--color-blue) hover:underline"
              >
                facebook.com/karitonphpurewater
              </a>
            </li>
            <li>
              <span className="font-medium">Instagram:</span>{' '}
              <a
                href="https://www.instagram.com/karitonphpurewater"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--color-blue) hover:underline"
              >
                instagram.com/karitonphpurewater
              </a>
            </li>
            <li>
              <span className="font-medium">Tiktok:</span>{' '}
              <a
                href="https://www.tiktok.com/@karitonphpurewater"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--color-blue) hover:underline"
              >
                tiktok.com/@karitonphpurewater
              </a>
            </li>
          </ul>
        </section>
        </div>

        <div className="flex justify-center px-4 mb-12 sm:px-4">
        <section className="w-full max-w-6xl text-(--color-b) border-t border-gray-200 pt-10 text-justify">
          <h2 className="text-2xl font-semibold md:text-3xl mb-2">
            Business Information
          </h2>
          <p className="text-base leading-relaxed md:text-lg mb-4">
            KaritonPH Appliances Trading is a registered business operating
            in the Philippines. In the interest of transparency and to give
            our customers confidence when shopping with us, we disclose our
            registration details below.
          </p>
          <p className="text-base leading-relaxed md:text-lg mb-3">
          This seal, issued through the BIR's online registration system, confirms
          that KaritonPH Appliances Trading is a duly registered taxpayer, and
          reflects our commitment to operating openly and responsibly.
          </p>
          <img
            src="/BIR-Seal.png"
            alt="KaritonPH BIR Registration Seal Badge"
            className="h-auto w-full max-w-xs rounded-lg border border-gray-200 object-contain"
          />
          <p className="text-sm leading-relaxed mb-4">
            KaritonPH BIR Registration Seal Badge
          </p>
        </section>
      </div>
    </div>
  )
}

export default About