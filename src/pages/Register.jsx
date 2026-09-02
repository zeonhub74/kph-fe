import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import PageIntro from '../components/PageIntro'
import { Input } from '@/components/ui/input'
import { useRegister } from '../hooks/api/useRegister'
import Ads from '@/components/ui/ads'

function Register() {
  const navigate = useNavigate()
  const { registerUser, loading, error } = useRegister()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await registerUser({ name, email, password, terms_accepted: termsAccepted })
      navigate('/login', { state: { message: 'Account created. Please sign in.' } })
    } catch {
      // Error is exposed via the hook's error state.
    }
  }

  return (
    <div>
      <PageIntro title="Register" subtitle="Create your account to start managing products and categories." />
      <div className="flex flex-col items-center px-4 mb-8">
        <form onSubmit={handleSubmit} className="grid w-full max-w-md gap-4 rounded-2xl border border-(--color-light-gray) bg-white p-6">
          <h2 className="text-center text-xl font-semibold">Create a KaritonPH account</h2>
          {error ? <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}
          <label className="grid gap-2">
            <span className="text-sm font-medium">Name</span>
            <input
              type="text"
              className="rounded-xl border border-(--sand-200) px-4 py-2"
              placeholder="Juan Dela Cruz"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label className="grid gap-2">
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
          <label className="grid gap-2">
            <span className="text-sm font-medium">Password</span>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                className="rounded-xl border-(--sand-200) pr-10"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-light-gray) hover:text-(--color-blue)"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              required
            />
            <span>
              I have read and agree to the{' '}
              <Link to="/terms" className="underline text-(--color-blue) hover:text-(--color-green)">
                Terms and Conditions
              </Link>{' '}
              {/* and{' '}
              <Link to="/privacy" target="_blank" className="underline">
                Privacy Policy  
              </Link> */}
              .
            </span>
          </label>
          <button
            type="submit"
            className="rounded-xl green-button px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading || !termsAccepted}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-(--color-light-gray)">
            Already have an account?{' '}
            <Link to="/login" className="text-(--color-blue) hover:text-(--color-green) underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      <Ads count={1} />
    </div>
  )
}

export default Register