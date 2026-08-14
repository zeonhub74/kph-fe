import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { useRegister } from '../hooks/api/useRegister'

function Register() {
  const navigate = useNavigate()
  const { registerUser, loading, error } = useRegister()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await registerUser({ name, email, password })
      navigate('/login', { state: { message: 'Account created. Please sign in.' } })
    } catch {
      // Error is exposed via the hook's error state.
    }
  }

  return (
    <div>
      <PageIntro title="Register" subtitle="Create your account to start managing products and categories." />
      <form onSubmit={handleSubmit} className="grid max-w-md gap-4 rounded-2xl border border-(--sand-200) bg-white p-6">
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
          <input
            type="password"
            className="rounded-xl border border-(--sand-200) px-4 py-2"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-(--accent-500) px-4 py-2 font-semibold text-white hover:bg-(--accent-700) disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}

export default Register

