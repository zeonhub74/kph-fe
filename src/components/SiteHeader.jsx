import { NavLink } from 'react-router-dom'
import { sessionHasAdminRole, useAuthSession } from '@/hooks/api/useLogin'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
]

function navClass({ isActive }) {
  return isActive
    ? 'rounded-full bg-(--color-green) px-4 py-2 text-white'
    : 'rounded-full px-4 py-2 text-(--color-black) hover:bg-(--color-green) transition-colors duration-200 hover:text-white'
}

function SiteHeader() {
  const session = useAuthSession()
  const isLoggedIn = Boolean(session?.access_token)
  const isAdmin = sessionHasAdminRole(session)

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-8xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <a href="/">
            <img src="KPH-White.png" alt="KaritonPH Logo" className="h-14 w-14 rounded-full" />
          </a>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
          {isAdmin ? (
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
          ) : null}
          {isLoggedIn ? (
            <NavLink to="/profile" className={navClass}>
              Profile
            </NavLink>
          ) : (
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader

