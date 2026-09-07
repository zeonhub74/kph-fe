import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Rocket, Sparkles, ShieldCheck } from 'lucide-react'
import PageIntro from '../components/PageIntro'
import { Input } from '@/components/ui/input'
import { useRegister } from '../hooks/api/useRegister'
import Ads from '@/components/ui/ads'
import { Spinner } from '@/components/ui/spinner'
function Register() {
  const navigate = useNavigate()
  const { registerUser, loading, error } = useRegister()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [adReady, setAdReady] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await registerUser({ name, email, password, terms_accepted: termsAccepted })
      navigate('/login', { state: { message: 'Account created. Please sign in.' } })
    } catch {
      // Error is exposed via the hook's error state.
    }
  }

  if (!adReady) {
    return (
      <div>
        <PageIntro title="Register" subtitle="Create your account to start managing products and categories." />
        {/* Kept mounted (but hidden) so the ad can load and fire onReady */}
        <div className="hidden">
          <Ads count={1} onReady={() => setAdReady(true)} />
        </div>
        <div className="flex min-h-[70vh] w-full items-center justify-center px-4">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageIntro title="Register" subtitle="Create your account to start managing products and categories." />
      <div className="flex min-h-[70vh] justify-center px-4 mb-8">
        <div className="flex h-fit w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-(--color-light-gray) bg-white md:flex-row">
          <form onSubmit={handleSubmit} className="grid w-full content-center gap-4 p-6 md:w-1/2">
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

          <div className="hidden w-1/2 md:block">
            <Ads count={1} onReady={() => setAdReady(true)} />
          </div>
        </div>
      </div>

      <div className="items-center justify-center m-10 grid gap-4">
        <section className="w-full max-w-6xl grid gap-6 md:grid-cols-3">
          <Link
            to="/home"
            className="group rounded-2xl border border-(--color-light-gray) bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:border-(--color-green)"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--color-green)/10 text-(--color-green) transition group-hover:bg-(--color-green)/20">
              <Rocket className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">Browse Our Products</h2>
            <p className="mt-3 text-sm leading-6 text-chart-4">
              Discover simple, practical solutions designed to make everyday living and business easier.
            </p>
          </Link>

          <Link
            to="/products"
            className="group rounded-2xl border border-(--color-light-gray) bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:border-(--color-blue)"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--color-blue)/10 text-(--color-blue) transition group-hover:bg-(--color-blue)/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">Nationwide Delivery</h2>
            <p className="mt-3 text-sm leading-6 text-chart-4">
              Fast, reliable shipping to homes across the Philippines.
            </p>
          </Link>

          <a
            href="https://customer.karitonph.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-(--color-light-gray) bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:border-(--color-green)"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--color-green)/10 text-(--color-green) transition group-hover:bg-(--color-green)/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">Register Your Appliance</h2>
            <p className="mt-3 text-sm leading-6 text-chart-4">
              Upload proof photos, activate your warranty, and unlock more promos.
            </p>
          </a>
        </section>
      </div>
    </div>
  )
}

export default Register