import { useEffect, useState } from 'react'
import PageIntro from '../../components/PageIntro'
import { useCategories } from '../../hooks/api/useCategories'

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

function ManageCategories() {
  const { fetchCategories, createCategoryItem, updateCategoryItem, deleteCategoryItem, loading, error } = useCategories()
  const [categories, setCategories] = useState([])
  const [token, setToken] = useState(() => readAccessToken())
  const [newCategoryName, setNewCategoryName] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [actionError, setActionError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  async function loadCategories() {
    try {
      const result = await fetchCategories()
      setCategories(result)
    } catch {
      // Error is surfaced via hook error state.
    }
  }

  useEffect(() => {
    loadCategories()
    setToken(readAccessToken())
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    setActionError('')
    setStatusMessage('')

    if (!token) {
      setActionError('You must sign in before creating categories.')
      return
    }

    try {
      await createCategoryItem({ name: newCategoryName.trim() }, token)
      await loadCategories()
      setNewCategoryName('')
      setStatusMessage('Category created successfully.')
    } catch {
      setActionError('Failed to create category.')
    }
  }

  function startEditing(category) {
    setActiveCategoryId(category.id)
    setEditCategoryName(category.name)
  }

  function cancelEditing() {
    setActiveCategoryId(null)
    setEditCategoryName('')
  }

  async function handleUpdate(event) {
    event.preventDefault()
    setActionError('')
    setStatusMessage('')

    if (!token || activeCategoryId === null) {
      setActionError('You must sign in before updating categories.')
      return
    }

    try {
      await updateCategoryItem(activeCategoryId, { name: editCategoryName.trim() }, token)
      await loadCategories()
      setStatusMessage('Category updated successfully.')
      cancelEditing()
    } catch {
      setActionError('Failed to update category.')
    }
  }

  async function handleDelete(categoryId) {
    setActionError('')
    setStatusMessage('')

    if (!token) {
      setActionError('You must sign in before deleting categories.')
      return
    }

    try {
      await deleteCategoryItem(categoryId, token)
      await loadCategories()
      if (activeCategoryId === categoryId) {
        cancelEditing()
      }
      setStatusMessage('Category deleted successfully.')
    } catch {
      setActionError('Failed to delete category.')
    }
  }

  return (
    <div>
      <PageIntro
        title="Manage Categories"
        subtitle="Create, edit, and delete categories using live backend endpoints."
      />
      {!token ? <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-800">Sign in first to manage categories.</p> : null}
      {error ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}
      {actionError ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{actionError}</p> : null}
      {statusMessage ? <p className="mb-4 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-800">{statusMessage}</p> : null}

    <div className="justify-left px-4 mb-8 sm:px-6">
      <section className="rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg">
        <h2 className="text-xl font-semibold select-none">Create Category</h2>
        <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3 md:flex-row px-0 pb-4">
          <input
            className="rounded-2xl border border-gray-200 p-2 shadow-sm hover:shadow-lg md:min-w-80 focus:outline-1"
            placeholder="Category name"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading || !token}
            className="rounded-full px-4 py-2 border border-gray-200 shadow-sm font-semibold hover:border-(--color-green) hover:text-(--color-green) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Saving...' : '+'}
          </button>
        </form>

        <p className="text-sm tracking-wider font-bold select-none pt-4 uppercase">Current Categories</p>
        {!loading && categories.length === 0 ? <p className="mt-3 text-sm text-(--ink-700)">No categories found.</p> : null}
        <ul className="mt-4 grid gap-3">
          {categories.map((category) => {
            const isEditing = activeCategoryId === category.id

            return (
              <li key={category.id} className="rounded-2xl border border-gray-200 hover:border-gray-500 p-4">
                {!isEditing ? (
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="font-semibold select-none">{category.name}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(category)}
                        className="rounded-lg border border-(--color-light-gray) px-3 py-1 text-sm hover:border-(--color-blue) hover:text-(--color-blue)"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                        disabled={loading || !token}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} className="flex flex-col gap-3 md:flex-row">
                    <input
                      className="rounded-xl border border-(--color-light-gray) px-3 py-2 md:min-w-80"
                      value={editCategoryName}
                      onChange={(event) => setEditCategoryName(event.target.value)}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-(--accent-500) px-4 py-2 font-semibold text-white hover:bg-(--accent-700) disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={loading || !token}
                      >
                        {loading ? 'Saving...' : 'Save'}
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

export default ManageCategories

