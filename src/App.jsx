import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Terms from './pages/Terms'
import PageLayout from './components/PageLayout'
import About from './pages/About'
import Dashboard from './pages/admin/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import ManageCategories from './pages/admin/ManageCategories'
import ManageProducts from './pages/admin/ManageProducts'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Refund from './pages/Refund'
import { ProductSettingsProvider } from './context/ProductSettingsContext'
import { sessionHasAdminRole, useAuthSession } from './hooks/api/useLogin'

function hasStoredAccessToken() {
  try {
    const raw = localStorage.getItem('kph.auth.session')
    if (!raw) {
      return false
    }

    const parsed = JSON.parse(raw)
    return Boolean(parsed?.access_token)
  } catch {
    return false
  }
}

function RequireAuth({ children }) {
  const location = useLocation()

  if (!hasStoredAccessToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please sign in to continue.' }} />
  }

  return children
}

function RequireAdmin({ children }) {
  const session = useAuthSession()

  if (!sessionHasAdminRole(session)) {
    return <Navigate to="/" replace state={{ message: 'Admin access is required.' }} />
  }

  return children
}

function App() {
  return (
    <ProductSettingsProvider>
      <Routes>
        <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:handle" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route
          path="/profile"
          element={(
            <RequireAuth>
              <Profile />
            </RequireAuth>
          )}
        />
        <Route
          path="/dashboard"
          element={(
            <RequireAdmin>
              <Dashboard />
            </RequireAdmin>
          )}
        />
        <Route
          path="/manage-products"
          element={(
            <RequireAuth>
              <ManageProducts />
            </RequireAuth>
          )}
        />
        <Route
          path="/manage-categories"
          element={(
            <RequireAuth>
              <ManageCategories />
            </RequireAuth>
          )}
        />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProductSettingsProvider>
  )
}

export default App
