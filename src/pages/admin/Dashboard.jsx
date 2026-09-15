import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import PageIntro from '../../components/PageIntro'
import { sessionHasAdminManagerAccess, sessionHasAdminRole, useAuthSession, useLogin } from '../../hooks/api/useLogin'
import { useProfile } from '../../hooks/api/useProfile'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useProductSettings } from '../../context/ProductSettingsContext'

function CardShell({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300 ${className}`}
    >
      {children}
    </div>
  )
}

function ActionCard({ to, href, eyebrow, title, description, external = false, className = '' }) {
  const inner = (
    <>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{eyebrow}</p>
      ) : null}
      <p className="mt-1 text-xl font-bold text-gray-900">{title}</p>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </>
  )

  const className_ = `block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300 ${className}`

  if (external) {
    return (
      <a href={href} className={className_} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }

  return (
    <Link to={to} className={className_}>
      {inner}
    </Link>
  )
}

function Dashboard() {
  const session = useAuthSession()
  const { profile } = useProfile()
  const { error } = useLogin()
  const {
    isPriceDisabled,
    setIsPriceDisabled,
    loading: isPriceSettingsLoading,
    isSaving: isPriceSettingsSaving,
    error: priceSettingsError,
  } = useProductSettings()
  const [statusMessage] = useState('')

  if (!sessionHasAdminRole(session)) {
    return <Navigate to="/" replace state={{ message: 'Admin access is required.' }} />
  }

  const isAdminManager = sessionHasAdminManagerAccess(session, profile)

  return (
    <div className="">
      <PageIntro title="Dashboard for Admins" subtitle="Admin landing page for quick management actions." />

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      ) : null}
      {priceSettingsError ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
          {priceSettingsError.message}
        </p>
      ) : null}
      {statusMessage ? (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-800">
          {statusMessage}
        </p>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 p-4">
        <ActionCard
          external
          href="https://admin.shopify.com/store/karitonph/products"
          eyebrow="Products"
          title="Manage Products"
          description="Create, update, and remove product listings."
          className="sm:col-span-2"
        />

        <ActionCard
          to="/manage-ads"
          eyebrow="Advertisements"
          title="Manage Advertisements"
          description="Upload, activate, edit, and delete promotional banner images."
          className="sm:col-span-2"
        />

        {isAdminManager ? (
          <ActionCard
            to="/manage-users"
            eyebrow="Users"
            title="Manage Users"
            description="View registered users and manage administrator access."
            className="sm:col-span-2"
          />
        ) : null}

        <CardShell>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Settings</p>
          <p className="mt-1 text-sm text-gray-500">Disable Product Price</p>
          <div className="mt-4 flex items-center space-x-2">
            <Switch
              id="disable-product-price"
              checked={isPriceDisabled}
              onCheckedChange={setIsPriceDisabled}
              disabled={isPriceSettingsLoading || isPriceSettingsSaving}
              aria-label="Disable product prices"
            />
            <Label htmlFor="disable-product-price">
              {isPriceSettingsSaving ? 'Saving...' : isPriceDisabled ? 'Disabled' : 'Enabled'}
            </Label>
          </div>
        </CardShell>
      </div>
    </div>
  )
}

export default Dashboard