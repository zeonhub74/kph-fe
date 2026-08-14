import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { useAuthSession, useLogin } from '../hooks/api/useLogin'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = useAuthSession()
  const { loginUser, loading, error } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const successMessage = location.state?.message
  const redirectTo = location.state?.from || '/profile'

  if (session?.access_token) {
    return <Navigate to="/profile" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await loginUser({ email, password })
      navigate(redirectTo)
    } catch {
      // Error is exposed via the hook's error state.
    }
  }

  return (
    <div>
      <PageIntro title="Login" subtitle="Sign in with your account to access dashboard actions." />
    <div className="flex flex-col px-4 justify-left mb-8">
      <form onSubmit={handleSubmit} className="grid max-w-md gap-4 rounded-2xl border border-(--sand-200) bg-white p-6">
        {successMessage ? <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-800">{successMessage}</p> : null}
        {error ? <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}
        <label className="grid gap-2 select-none">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            className="rounded-xl border border-(--sand-200) px-4 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 select-none">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            className="rounded-xl border border-(--sand-200) px-4 py-2"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="rounded-xl green-button px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <p className="text-sm select-none">
          No account yet?{' '}
          <Link to="/register" className="font-semibold text-(--color-blue) hover:text-(--color-green)">
            Create account
          </Link>
        </p>
      </form>
    </div>
    </div>
  )
}

export default Login

