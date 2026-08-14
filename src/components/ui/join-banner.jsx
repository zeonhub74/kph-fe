function JoinBanner() {
  return (
    <div className="flex w-full justify-center mt-6 bg-(--color-light-gray)/20 py-6">
      <div className="flex w-full max-w-6xl flex-col items-center justify-center text-center text-sm  select-none">
        <h1 className="text-2xl font-bold">Join Us</h1>

        <p className="mt-1 text-sm">
          Empower your business today with KaritonPH's trusted products.
        </p>

        <a
          href="/products"
          className="plain-button mt-2 inline-block rounded-full px-4 py-2 text-sm min-w-sm"
        >
          Become a Seller
        </a>
      </div>
    </div>
  )
}

export default JoinBanner