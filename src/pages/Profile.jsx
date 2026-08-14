import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { sessionHasAdminRole, useAuthSession, useLogin } from '../hooks/api/useLogin'
import { supabase } from '../components/supabaseClient'

function Profile() {
  const navigate = useNavigate()
  const session = useAuthSession()
  const { logoutUser, loading, error } = useLogin()
  const [statusMessage, setStatusMessage] = useState('')
  const [changePasswordError, setChangePasswordError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const email = session?.user?.email ?? 'Unknown'
  const role = sessionHasAdminRole(session) ? 'Admin' : 'User'
  const maskedPassword = '************'

  async function handleChangePassword(event) {
    event.preventDefault()
    setStatusMessage('')
    setChangePasswordError('')

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setChangePasswordError('Enter and confirm your new password.')
      return
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError('New password and confirmation do not match.')
      return
    }

    if (newPassword.length < 8) {
      setChangePasswordError('Password must be at least 8 characters long.')
      return
    }

    if (!session?.access_token || !session?.refresh_token) {
      setChangePasswordError('Your session is missing required auth tokens. Please sign in again and retry.')
      return
    }

    setIsUpdatingPassword(true)

    try {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })

      if (sessionError) {
        throw sessionError
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) {
        throw updateError
      }

      setNewPassword('')
      setConfirmPassword('')
      setStatusMessage('Password updated successfully.')
    } catch {
      setChangePasswordError('Unable to change password right now. Please sign out and sign in again, then retry.')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  async function handleLogout() {
    setStatusMessage('')

    try {
      await logoutUser()
      navigate('/login', { replace: true, state: { message: 'You have been signed out.' } })
    } catch {
      setStatusMessage('Unable to sign out right now.')
    }
  }

  function handleToggleChangePassword() {
    setStatusMessage('')
    setChangePasswordError('')
    setShowChangePassword((currentValue) => !currentValue)
  }

  function handleCancelChangePassword() {
    setChangePasswordError('')
    setNewPassword('')
    setConfirmPassword('')
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setShowChangePassword(false)
  }

  return (
    <div className="">
      <PageIntro title="Profile" subtitle="Your account details and sign-out access." />
    <div className="flex flex-col px-4 justify-left mb-8">
      <div className="p-2 select-none">
      {error ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}
      {changePasswordError ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{changePasswordError}</p> : null}
      {statusMessage ? <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-800">{statusMessage}</p> : null}
    </div>
      <section className="grid max-w-2xl gap-2 p-2">
        <div className="rounded-xl border border-(--color-light-gray) px-4 py-3 select-none">
          <p className="text-xs font-semibold uppercase tracking-wide )">Email</p>
          <p className="mt-1 text-sm text-(--ink-900)">{email}</p>
        </div>

        <div className="rounded-xl border border-(--color-light-gray) px-4 py-3 select-none">
          <p className="text-xs font-semibold uppercase tracking-wide )">Password</p>
          <p className="mt-1 font-mono text-sm text-(--ink-900)">{maskedPassword}</p>
        </div>

        <div className="rounded-xl border border-(--color-light-gray) px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide select-none">Change Password</p>

          <button
            type="button"
            className="mt-2 w-fit rounded-xl select-none border border-(--color-light-gray)/40  px-2 py-2 text-xs hover:border-(--color-green) hover:text-(--color-green)"
            onClick={handleToggleChangePassword}
          >
            {showChangePassword ? 'Cancel' : 'Change Password'}
          </button>

          {showChangePassword ? (
            <form className="mt-3 grid gap-3" onSubmit={handleChangePassword}>
              <label className="grid gap-1 text-sm select-none">
                <span>New Password</span>
                <div className="flex gap-2">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    className="min-w-0 grow rounded-xl border border-(--color-light-gray) bg-white px-3 py-2 text-sm outline-none focus:border-black"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    className="shrink-0 rounded-xl border border-(--color-light-gray) bg-white px-3 py-2 text-sm font-semibold hover:border-(--color-blue) hover:text-(--color-blue)"
                    onClick={() => setShowNewPassword((currentValue) => !currentValue)}
                  >
                    {showNewPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              <label className="grid gap-1 text-sm select-none">
                <span>Confirm New Password</span>
                <div className="flex gap-2">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    className="min-w-0 grow rounded-xl border border-(--color-light-gray) bg-white px-3 py-2 text-sm outline-none focus:border-black"
                    placeholder="Re-enter your new password"
                  />
                  <button
                    type="button"
                    className="shrink-0 rounded-xl border border-(--color-light-gray) bg-white px-3 py-2 text-sm font-semibold hover:border-(--color-blue) hover:text-(--color-blue)"
                    onClick={() => setShowConfirmPassword((currentValue) => !currentValue)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="w-fit rounded-xl border border-(--color-light-gray) bg-white px-4 py-2 text-sm font-semibold hover:border-(--color-green) hover:text-(--color-green) disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          ) : null}
        </div>

        <div className="rounded-xl border border-(--color-light-gray) px-4 py-3 select-none">
          <p className="text-xs font-semibold uppercase tracking-wide )">Role</p>
          <p className="mt-1 text-sm">{role}</p>
        </div>

        <button
          type="button"
          className="mt-2 w-fit rounded-xl border border-(--color-light-gray) bg-white px-4 py-2 text-sm font-semibold hover:border-(--color-blue) hover:text-(--color-blue) disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? 'Signing Out...' : 'Logout'}
        </button>
      </section>
    </div>
    </div>
  )
}

export default Profile
