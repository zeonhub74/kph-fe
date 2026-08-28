import { Link } from 'react-router-dom'

function HomeBanner({ title, subtitle }) {
  return (
    <section className="relative p-6">
      <img src="/Background.png" alt="KaritonPH Logo" className="h-100 w-full object-cover" />
      <div className="absolute inset-6 flex flex-col items-center justify-center bg-black/50 px-4 text-center">
        <h1 className="text-4xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-lg text-white max-w-xl">{subtitle}</p>
        <Link to="/products" className="mt-4 inline-block rounded-full blue-button select-none px-4 py-2 text-sm font-semibold text-white">
          Explore Our Solutions
        </Link>
      </div>
    </section>
  )
}

export default HomeBanner

