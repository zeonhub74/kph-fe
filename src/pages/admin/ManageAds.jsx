import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import PageIntro from '../../components/PageIntro'
import { sessionHasAdminRole, useAuthSession } from '../../hooks/api/useLogin'
import { useAds } from '../../hooks/api/useAds'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB limit
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

function ManageAds() {
  const session = useAuthSession()
  const isAdmin = sessionHasAdminRole(session)
  const accessToken = session?.access_token

  const {
    loading: adsLoading,
    error: adsError,
    fetchAllAds,
    uploadAdImage,
    deleteAdImage,
    createAd,
    updateAd,
    deleteAd,
  } = useAds()

  const [ads, setAds] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [togglingAdId, setTogglingAdId] = useState(null)

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [editingAd, setEditingAd] = useState(null)
  const [deletingAd, setDeletingAd] = useState(null)

  // Upload Form state
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadPreview, setUploadPreview] = useState(null)
  const [uploadAltText, setUploadAltText] = useState('')
  const [uploadIsActive, setUploadIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit Form state
  const [editAltText, setEditAltText] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)
  const [editReplacementFile, setEditReplacementFile] = useState(null)
  const [editReplacementPreview, setEditReplacementPreview] = useState(null)

  // Clear status message after timeout
  useEffect(() => {
    if (!statusMessage) return undefined
    const timer = setTimeout(() => setStatusMessage(''), 5000)
    return () => clearTimeout(timer)
  }, [statusMessage])

  // Load all advertisements
  const loadAdsList = async () => {
    try {
      const data = await fetchAllAds()
      setAds(data)
    } catch {
      // Error handled by hook state
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadAdsList()
    }
  }, [isAdmin])

  // Clean up object URLs when preview changes
  useEffect(() => {
    return () => {
      if (uploadPreview) URL.revokeObjectURL(uploadPreview)
    }
  }, [uploadPreview])

  useEffect(() => {
    return () => {
      if (editReplacementPreview) URL.revokeObjectURL(editReplacementPreview)
    }
  }, [editReplacementPreview])

  if (!isAdmin) {
    return <Navigate to="/" replace state={{ message: 'Admin access is required.' }} />
  }

  // Handle image file selection with validation
  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files?.[0]
    setActionError('')

    if (!file) {
      setFile(null)
      setPreview(null)
      return
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setActionError('Invalid file type. Please upload a JPEG, PNG, WebP, GIF, or SVG image.')
      setFile(null)
      setPreview(null)
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setActionError('File size exceeds the 5MB limit. Please choose a smaller image.')
      setFile(null)
      setPreview(null)
      return
    }

    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  // Handle Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    setActionError('')
    setStatusMessage('')

    if (!uploadFile) {
      setActionError('Please select an advertisement image file.')
      return
    }

    setIsSubmitting(true)
    try {
      if (!accessToken) {
        throw new Error('Your session has expired. Please sign in again.')
      }

      // 1. Upload image to Storage
      const imagePath = await uploadAdImage(uploadFile, accessToken)

      // 2. Insert record into DB
      await createAd({
        image_path: imagePath,
        alt_text: uploadAltText.trim() || null,
        is_active: uploadIsActive,
      }, accessToken)

      // 3. Reset form and refresh list
      resetUploadForm()
      setIsUploadOpen(false)
      await loadAdsList()
      setStatusMessage('Advertisement uploaded and created successfully!')
    } catch (err) {
      setActionError(err?.message || 'Failed to upload advertisement.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetUploadForm = () => {
    if (uploadPreview) URL.revokeObjectURL(uploadPreview)
    setUploadFile(null)
    setUploadPreview(null)
    setUploadAltText('')
    setUploadIsActive(true)
    setActionError('')
  }

  // Toggle Active/Inactive directly
  const handleToggleActive = async (ad) => {
    if (togglingAdId) return

    setActionError('')
    setStatusMessage('')
    const newStatus = !ad.is_active
    setTogglingAdId(ad.id)
    setAds((currentAds) => currentAds.map((currentAd) => (
      currentAd.id === ad.id ? { ...currentAd, is_active: newStatus } : currentAd
    )))

    try {
      if (!accessToken) {
        throw new Error('Your session has expired. Please sign in again.')
      }
      const updatedAd = await updateAd(ad.id, { is_active: newStatus }, accessToken)
      setAds((currentAds) => currentAds.map((currentAd) => (
        currentAd.id === ad.id ? { ...currentAd, ...updatedAd } : currentAd
      )))
      setStatusMessage(`Advertisement set to ${newStatus ? 'Active' : 'Inactive'}.`)
    } catch (err) {
      setAds((currentAds) => currentAds.map((currentAd) => (
        currentAd.id === ad.id ? { ...currentAd, is_active: ad.is_active } : currentAd
      )))
      setActionError(err?.message || 'Failed to update advertisement status.')
    } finally {
      setTogglingAdId(null)
    }
  }

  // Open Edit Modal
  const openEditModal = (ad) => {
    setActionError('')
    setEditingAd(ad)
    setEditAltText(ad.alt_text || '')
    setEditIsActive(ad.is_active)
    setEditReplacementFile(null)
    setEditReplacementPreview(null)
  }

  const closeEditModal = () => {
    if (editReplacementPreview) URL.revokeObjectURL(editReplacementPreview)
    setEditingAd(null)
    setEditReplacementFile(null)
    setEditReplacementPreview(null)
    setActionError('')
  }

  // Submit Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingAd) return

    setActionError('')
    setStatusMessage('')
    setIsSubmitting(true)

    try {
      if (!accessToken) {
        throw new Error('Your session has expired. Please sign in again.')
      }
      let newImagePath = undefined
      const oldImagePath = editingAd.image_path

      // If replacing image file
      if (editReplacementFile) {
        newImagePath = await uploadAdImage(editReplacementFile, accessToken)
      }

      // Update DB record
      await updateAd(editingAd.id, {
        alt_text: editAltText.trim() || null,
        is_active: editIsActive,
        ...(newImagePath && { image_path: newImagePath }),
      }, accessToken)

      // Remove old image from storage if replaced
      if (newImagePath && oldImagePath) {
        await deleteAdImage(oldImagePath, accessToken)
      }

      closeEditModal()
      await loadAdsList()
      setStatusMessage('Advertisement updated successfully!')
    } catch (err) {
      setActionError(err?.message || 'Failed to update advertisement.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingAd) return

    setActionError('')
    setStatusMessage('')
    setIsSubmitting(true)

    try {
      if (!accessToken) {
        throw new Error('Your session has expired. Please sign in again.')
      }
      await deleteAd(deletingAd.id, deletingAd.image_path, accessToken)
      setDeletingAd(null)
      await loadAdsList()
      setStatusMessage('Advertisement deleted successfully.')
    } catch (err) {
      setActionError(err?.message || 'Failed to delete advertisement.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mb-12">
      <PageIntro
        title="Manage Advertisements"
        subtitle="Upload and manage the advertisements displayed throughout the website."
      />

      <div className="px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <button
            onClick={() => {
              resetUploadForm()
              setIsUploadOpen(true)
            }}
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors cursor-pointer"
          >
            + Upload Advertisement
          </button>
        </div>

        {/* Notifications */}
        {adsError ? (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {adsError}
          </p>
        ) : null}
        {actionError ? (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {actionError}
          </p>
        ) : null}
        {statusMessage ? (
          <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800 border border-green-200">
            {statusMessage}
          </p>
        ) : null}

        {/* Advertisements List */}
        <section className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-wide uppercase">
              All Advertisements ({ads.length})
            </h2>
          </div>

            {adsLoading && ads.length === 0 ? (
            <div className="flex items-center justify-center rounded-2xl border border-gray-200 p-8 text-gray-500">
            <Spinner className="size-5" />
            </div>
            ) : !adsLoading && ads.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-700">No advertisements found</p>
              <p className="mt-1 text-sm text-gray-500">
                Upload your first advertisement banner to display it on the storefront.
              </p>
              <button
                onClick={() => {
                  resetUploadForm()
                  setIsUploadOpen(true)
                }}
                className="mt-4 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                + Upload Advertisement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all"
                >
                  <div>
                    {/* Image Preview */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                      {ad.imageUrl ? (
                        <img
                          src={ad.imageUrl}
                          alt={ad.alt_text || 'Advertisement'}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No Image Available
                        </div>
                      )}
                      {/* Status Badge overlay */}
                      <div className="absolute top-3 right-3">
                        {ad.is_active ? (
                          <span className="inline-flex items-center rounded-full bg-green-100/90 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-green-800 border border-green-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100/90 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-gray-600 border border-gray-200">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-4 space-y-2">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                          Alt Text
                        </p>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                          {ad.alt_text ? ad.alt_text : <span className="italic text-gray-400">None</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                          Created Date
                        </p>
                        <p className="text-xs text-gray-600">
                          {ad.created_at ? new Date(ad.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`status-toggle-${ad.id}`}
                        checked={ad.is_active}
                        onCheckedChange={() => handleToggleActive(ad)}
                        disabled={togglingAdId !== null}
                        aria-label="Toggle advertisement status"
                      />
                      <Label htmlFor={`status-toggle-${ad.id}`} className="text-xs text-gray-600 cursor-pointer">
                        {ad.is_active ? 'Active' : 'Inactive'}
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(ad)}
                        className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingAd(ad)}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Upload Modal */}
      {isUploadOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold">Upload Advertisement</h3>
              <button
                onClick={() => {
                  setIsUploadOpen(false)
                  resetUploadForm()
                }}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              {/* File input */}
              <div>
                <Label className="block text-sm font-medium mb-1">
                  Advertisement Image <span className="text-red-500">*</span>
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setUploadFile, setUploadPreview)}
                  required
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border file:border-gray-200 file:bg-gray-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-100 cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: JPG, PNG, WebP, GIF, SVG. Max file size: 5MB.
                </p>
              </div>

              {/* Preview */}
              {uploadPreview ? (
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Image Preview</p>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={uploadPreview}
                      alt="Upload Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : null}

              {/* Alt Text */}
              <div>
                <Label htmlFor="upload-alt-text" className="block text-sm font-medium mb-1">
                  Alt Text (Optional)
                </Label>
                <input
                  id="upload-alt-text"
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="Descriptive text for accessibility (e.g. Summer Sale Banner)"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Status Switch */}
              <div className="flex items-center space-x-3 pt-2">
                <Switch
                  id="upload-is-active"
                  checked={uploadIsActive}
                  onCheckedChange={setUploadIsActive}
                />
                <Label htmlFor="upload-is-active" className="text-sm font-medium cursor-pointer">
                  Start as Active (visible on website)
                </Label>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadOpen(false)
                    resetUploadForm()
                  }}
                  disabled={isSubmitting}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadFile}
                  className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Advertisement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Edit Modal */}
      {editingAd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold">Edit Advertisement</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              {/* Current Image & Optional Replacement */}
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Current Image</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 mb-3">
                  <img
                    src={editReplacementPreview || editingAd.imageUrl}
                    alt={editingAd.alt_text || 'Current Ad'}
                    className="h-full w-full object-cover"
                  />
                </div>

                <Label className="block text-sm font-medium mb-1">
                  Replace Image (Optional)
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setEditReplacementFile, setEditReplacementPreview)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border file:border-gray-200 file:bg-gray-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-100 cursor-pointer"
                />
              </div>

              {/* Alt Text */}
              <div>
                <Label htmlFor="edit-alt-text" className="block text-sm font-medium mb-1">
                  Alt Text
                </Label>
                <input
                  id="edit-alt-text"
                  type="text"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  placeholder="Descriptive text for accessibility"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Active Switch */}
              <div className="flex items-center space-x-3 pt-2">
                <Switch
                  id="edit-is-active"
                  checked={editIsActive}
                  onCheckedChange={setEditIsActive}
                />
                <Label htmlFor="edit-is-active" className="text-sm font-medium cursor-pointer">
                  Active (visible on website)
                </Label>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSubmitting}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {deletingAd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Delete Advertisement</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this advertisement? This will permanently remove the advertisement and its image.
            </p>

            {deletingAd.imageUrl ? (
              <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <img
                  src={deletingAd.imageUrl}
                  alt={deletingAd.alt_text || 'Ad to delete'}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAd(null)}
                disabled={isSubmitting}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ManageAds