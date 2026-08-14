function ProductCardSkeleton() {
	return (
		<div className="animate-pulse rounded-xl bg-white p-3 shadow-sm">
			<div className="h-4 w-24 rounded-full bg-(--color-light-gray)/60" />

			<div className="mt-2 h-48 w-full rounded-lg bg-(--color-light-gray)/60" />

			<div className="mt-2 h-6 w-3/4 rounded-full bg-(--color-light-gray)/60" />

			<div className="mt-2 h-5 w-1/2 rounded-full bg-(--color-light-gray)/60" />
		</div>
	)
}

export function ProductCardsSkeleton({ className = '' }) {
	return (
		<div className={`p-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}>
			{Array.from({ length: 3 }).map((_, index) => (
				<ProductCardSkeleton key={index} />
			))}
		</div>
	)
}

export default ProductCardsSkeleton
