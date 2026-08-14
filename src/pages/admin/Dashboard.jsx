import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import PageIntro from '../../components/PageIntro'
import { sessionHasAdminRole, useAuthSession, useLogin } from '../../hooks/api/useLogin'
import { Label } from "@/components/ui/label" 
import { Switch } from "@/components/ui/switch"
import { useProductSettings } from '../../context/ProductSettingsContext'

function Dashboard() {
  const navigate = useNavigate()
  const session = useAuthSession()
  const { error } = useLogin()
  const { isPriceDisabled, setIsPriceDisabled } = useProductSettings()
  const [statusMessage] = useState('')

  if (!sessionHasAdminRole(session)) {
    return <Navigate to="/" replace state={{ message: 'Admin access is required.' }} />
  }

  return (
    <div className="mb-8">
      <PageIntro title="Dashboard for Admins" subtitle="Admin landing page for quick management actions." />
      {error ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}
      {statusMessage ? <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-800">{statusMessage}</p> : null}

      {/* ==== PRODUCTS ==== */}
      <div>
        <p className="text-lg font-bold px-4 py-0 uppercase tracking-widest">Products</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 px-4 py-4 mb-4">
        {/* Total Categories */}
        <div className="rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg">
          <p className="text-sm text-gray-500">Total Categories</p>
          <p className="mt-2 text-3xl font-bold">12</p>
          <p className="mt-2 text-xs text-gray-500">
            Product categories
          </p>
        </div>

        {/* Total Products */}
        <div className="rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="mt-2 text-3xl font-bold">128</p>
          <p className="mt-2 text-xs text-green-600">
            Active products
          </p>
        </div>


        {/* Low Stock */}
        <div className="rounded-2xl border border-gray-200  p-5 shadow-sm hover:shadow-lg">
          <p className="text-sm text-gray-500">Low Stock Products</p>
          <p className="mt-2 text-3xl font-bold">8</p>
          <p className="mt-2 text-xs text-orange-600">
            Consider restocking
          </p>
        </div>

       {/* Out of Stock */}
        <div className="rounded-2xl border border-gray-200  p-5 shadow-sm hover:shadow-lg">
          <p className="text-sm text-gray-500">Out of Stock Products</p>
          <p className="mt-2 text-3xl font-bold">3</p>
          <p className="mt-2 text-xs text-red-600">
            Currently unavailable
          </p>
        </div>

        <Link to="/manage-categories" className="rounded-2xl border border-gray-200 p-5 lg:col-span-2 shadow-sm hover:shadow-lg">
          <p className="text-2xl font-bold">Manage Categories</p>
          <p className="mt-2 text-sm ">Edit product classification and grouping.</p>
        </Link>

        <Link to="/manage-products" className="rounded-2xl border border-gray-200 p-5 lg:col-span-2 shadow-sm hover:shadow-lg">
          <p className="text-2xl font-bold">Manage Products</p>
          <p className="mt-2 text-sm ">Create, update, and remove product listings.</p>
        </Link>
        </div>

        {/* ==== ORDERS ==== */}
        <div>
          <p className="text-lg font-bold px-4 py-0 uppercase tracking-widest">Orders</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 px-4 py-4 mb-4">

        {/* Pending Orders */}
        <div className="rounded-2xl border border-gray-200  p-5 shadow-sm hover:shadow-lg">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="mt-2 text-3xl font-bold">24</p>
          <p className="mt-2 text-xs text-orange-600">
            Requires attention
          </p>
        </div>

        {/* Total Orders - Larger */}
        <div className="rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-2 text-4xl font-bold">1,284</p>
          <p className="mt-2 text-xs text-green-600">
            +12.5% from last month
          </p>
        </div>

        {/* Revenue - Larger */}
        <div className="rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg">
          <p className="text-sm text-gray-500">Total Sales / Revenue</p>
          <p className="mt-2 text-4xl font-bold">₱248,560</p>
          <p className="mt-2 text-xs text-green-600">
            +8.4% from last month
          </p>
        </div>

        </div>


      {/* ==== CUSTOMERS ==== */}
      <div>
        <p className="text-lg font-bold px-4 py-0 uppercase tracking-widest">Customers</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 px-4 py-2 mb-4">
        {/* Customers */}
        <div className="rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg">
          <p className="text-sm text-gray-500">Registered Customers</p>
          <p className="mt-2 text-3xl font-bold">542</p>
          <p className="mt-2 text-xs text-green-600">
            +24 this month
          </p>
        </div>
        </div>

     {/* ==== SETTINGS ==== */}
      <div>
        <p className="text-lg font-bold px-4 py-0 uppercase tracking-widest">Settings</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 px-4 py-2 mb-4">
        {/* Customers */}
        <div className="rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg">
          <p className="text-sm text-gray-500">Disable Product Price</p>

          <div className="mt-4 flex items-center space-x-2">
            <Switch
              id="disable-product-price"
              checked={isPriceDisabled}
              onCheckedChange={setIsPriceDisabled}
              aria-label="Disable product prices"
            />
            <Label htmlFor="disable-product-price">{isPriceDisabled ? 'Disabled' : 'Enabled'}</Label>
          </div>
        </div>
        </div>

      </div>
  )
}

export default Dashboard
