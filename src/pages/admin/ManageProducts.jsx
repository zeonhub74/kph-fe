import { useEffect, useMemo, useState } from 'react'
import PageIntro from '../../components/PageIntro'
import { useCategories } from '../../hooks/api/useCategories'
import { useProducts } from '../../hooks/api/useProducts'

const AUTH_STORAGE_KEY = 'kph.auth.session'

function readAccessToken() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const session = JSON.parse(raw)
    return session?.access_token ?? null
  } catch {
    return null
  }
}

function emptyProductForm(defaultCategoryId = '') {
  return {
    category_id: defaultCategoryId,
    name: '',
    price: '',
    description: '',
    image_url: '',
    stock: 0,
  }
}

function ManageProducts() {
  const { fetchProducts, createProductItem, updateProductItem, deleteProductItem, loading: productsLoading, error: productsError } = useProducts()
  const { fetchCategories, loading: categoriesLoading, error: categoriesError } = useCategories()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [token, setToken] = useState(() => readAccessToken())
  const [activeProductId, setActiveProductId] = useState(null)
  const [createForm, setCreateForm] = useState(emptyProductForm())
  const [editForm, setEditForm] = useState(emptyProductForm())
  const [actionError, setActionError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (!statusMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setStatusMessage(''), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [statusMessage])

  const isBusy = productsLoading || categoriesLoading
  const defaultCategoryId = useMemo(() => (categories.length ? String(categories[0].id) : ''), [categories])

  async function loadData() {
    try {
      const [productList, categoryList] = await Promise.all([fetchProducts(), fetchCategories()])
      setProducts(productList)
      setCategories(categoryList)
      if (!createForm.category_id && categoryList.length) {
        setCreateForm((prev) => ({ ...prev, category_id: String(categoryList[0].id) }))
      }
    } catch {
      // Errors are surfaced via hook error states.
    }
  }

  useEffect(() => {
    loadData()
    setToken(readAccessToken())
  }, [])

  function toProductPayload(formState) {
    return {
      category_id: Number(formState.category_id),
      name: formState.name.trim(),
      price: Number(formState.price),
      description: formState.description ? formState.description.trim() : null,
      image_url: formState.image_url ? formState.image_url.trim() : null,
      stock: Number(formState.stock),
    }
  }

  function startEditing(product) {
    setActiveProductId(product.id)
    setEditForm({
      category_id: String(product.category_id),
      name: product.name,
      price: String(product.price),
      description: product.description ?? '',
      image_url: product.image_url ?? '',
      stock: product.stock,
    })
    setActionError('')
    setStatusMessage('')
  }

  function cancelEditing() {
    setActiveProductId(null)
    setEditForm(emptyProductForm(defaultCategoryId))
  }

  async function handleCreate(event) {
    event.preventDefault()
    setActionError('')
    setStatusMessage('')

    if (!token) {
      setActionError('You must sign in before creating products.')
      return
    }

    try {
      await createProductItem(toProductPayload(createForm), token)
      await loadData()
      setCreateForm(emptyProductForm(defaultCategoryId))
      setStatusMessage('Product created successfully.')
    } catch {
      setActionError('Failed to create product.')
    }
  }

  async function handleUpdate(event) {
    event.preventDefault()
    setActionError('')
    setStatusMessage('')

    if (!token || activeProductId === null) {
      setActionError('You must sign in before updating products.')
      return
    }

    try {
      await updateProductItem(activeProductId, toProductPayload(editForm), token)
      await loadData()
      setStatusMessage('Product updated successfully.')
      cancelEditing()
    } catch {
      setActionError('Failed to update product.')
    }
  }

  async function handleDelete(productId) {
    setActionError('')
    setStatusMessage('')

    if (!token) {
      setActionError('You must sign in before deleting products.')
      return
    }

    try {
      await deleteProductItem(productId, token)
      await loadData()
      if (activeProductId === productId) {
        cancelEditing()
      }
      setStatusMessage('Product deleted successfully.')
    } catch {
      setActionError('Failed to delete product.')
    }
  }

  return (
    <div>
      <PageIntro
        title="Manage Products"
        subtitle="Create, edit, and delete products using live backend endpoints."
      />
      {!token ? <p className="m-4 rounded-xl bg-amber-50 px-4 pb-2 text-sm text-amber-800">Sign in first to manage products.</p> : null}
      {productsError ? <p className="m-4 rounded-xl bg-red-50 px-4 pb-2 text-sm text-red-700">{productsError}</p> : null}
      {categoriesError ? <p className="m-4 rounded-xl bg-red-50 px-4 pb-2 text-sm text-red-700">{categoriesError}</p> : null}
      {actionError ? <p className="m-4 rounded-xl bg-red-50 px-4 pb-2 text-sm text-red-700">{actionError}</p> : null}
      {statusMessage ? <p className="m-4 rounded-xl bg-green-50 px-4 pb-2 text-sm text-green-800">{statusMessage}</p> : null}
   
    <div className="flex flex-row items-start justify-start gap-6 px-4 mb-8 sm:px-6">
      <section className="basis-1/2 rounded-2xl border border-(--color-light-gray) bg-white p-6">
        <h2 className="text-xl font-semibold">Create Product</h2>
        <form onSubmit={handleCreate} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Name</span>
            <input
              className="rounded-xl border border-(--color-light-gray) px-3 py-2"
              value={createForm.name}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Category</span>
            <select
              className="rounded-xl border border-(--color-light-gray) px-3 py-2"
              value={createForm.category_id}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, category_id: event.target.value }))}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Price</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="rounded-xl border border-(--color-light-gray) px-3 py-2"
              value={createForm.price}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, price: event.target.value }))}
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Stock</span>
            <input
              type="number"
              min="0"
              className="rounded-xl border border-(--color-light-gray) px-3 py-2"
              value={createForm.stock}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, stock: event.target.value }))}
              required
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              className="rounded-xl border border-(--color-light-gray) px-3 py-2"
              rows={3}
              value={createForm.description}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm font-medium">Image URL</span>
            <input
              className="rounded-xl border border-(--color-light-gray) px-3 py-2"
              value={createForm.image_url}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, image_url: event.target.value }))}
              placeholder="https://..."
            />
          </label>
          <button
            type="submit"
            disabled={isBusy || !token}
            className="rounded-xl green-button px-4 py-2 font-semibold text-white hover:bg-(--accent-700) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isBusy ? 'Saving...' : 'Create Product'}
          </button>
        </form>
      </section>

      <section className="basis-2/3 rounded-2xl border border-(--color-light-gray) bg-white p-6">
        <h2 className="text-xl font-semibold">Current Products</h2>
        {isBusy && products.length === 0 ? <p className="mt-3 text-sm text-(--ink-700)">Loading products...</p> : null}
        {!isBusy && products.length === 0 ? <p className="mt-3 text-sm text-(--ink-700)">No products found.</p> : null}
        <ul className="mt-4 grid gap-4">
          {products.map((product) => {
            const isEditing = activeProductId === product.id

            return (
              <li key={product.id} className="rounded-xl border border-(--color-light-gray) p-4">
                {!isEditing ? (
                  <div className="grid gap-2 md:grid-cols-4 md:items-center">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-(--ink-700)">Category ID: {product.category_id}</p>
                    </div>
                    <p className="text-sm">PHP {product.price}</p>
                    <p className="text-sm">Stock: {product.stock}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(product)}
                        className="rounded-lg border border-(--color-light-gray) px-3 py-1 text-sm hover:border-(--accent-500)"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                        disabled={isBusy || !token}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-sm font-medium">Name</span>
                      <input
                        className="rounded-xl border border-(--color-light-gray) px-3 py-2"
                        value={editForm.name}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-sm font-medium">Category</span>
                      <select
                        className="rounded-xl border border-(--color-light-gray) px-3 py-2"
                        value={editForm.category_id}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, category_id: event.target.value }))}
                        required
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1">
                      <span className="text-sm font-medium">Price</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="rounded-xl border border-(--color-light-gray) px-3 py-2"
                        value={editForm.price}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, price: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-sm font-medium">Stock</span>
                      <input
                        type="number"
                        min="0"
                        className="rounded-xl border border-(--color-light-gray) px-3 py-2"
                        value={editForm.stock}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, stock: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="grid gap-1 md:col-span-2">
                      <span className="text-sm font-medium">Description</span>
                      <textarea
                        className="rounded-xl border border-(--color-light-gray) px-3 py-2"
                        rows={3}
                        value={editForm.description}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, description: event.target.value }))}
                      />
                    </label>
                    <label className="grid gap-1 md:col-span-2">
                      <span className="text-sm font-medium">Image URL</span>
                      <input
                        className="rounded-xl border border-(--color-light-gray) px-3 py-2"
                        value={editForm.image_url}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, image_url: event.target.value }))}
                      />
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-(--accent-500) px-4 py-2 font-semibold text-white hover:bg-(--accent-700) disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={isBusy || !token}
                      >
                        {isBusy ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-(--color-light-gray) px-4 py-2 font-semibold hover:border-(--accent-500)"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </li>
            )
          })}
        </ul>
      </section>
      </div>
    </div>
  )
}

export default ManageProducts

