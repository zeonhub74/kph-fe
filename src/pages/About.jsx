import PageIntro from '../components/PageIntro'

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
              <h1 className="py-2 text-3xl md:text-4xl">
                KaritonPH
              </h1>

              <p className="py-2 text-base leading-relaxed text-justify md:text-xl">
                To bring high-quality products from around the world to
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
    </div>
  )
}

export default About