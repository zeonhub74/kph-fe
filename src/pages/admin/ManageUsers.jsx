import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import PageIntro from '../../components/PageIntro'
import { Spinner } from '@/components/ui/spinner'
import { ApiError, getApiErrorMessage } from '../../api/http'
import { sessionHasAdminRole, useAuthSession } from '../../hooks/api/useLogin'
import { useUsers } from '../../hooks/api/useUsers'

function ManageUsers() {
  const session = useAuthSession()
  const { users, loading, error, makeAdmin } = useUsers()
  const [promotingUserId, setPromotingUserId] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [actionError, setActionError] = useState('')

  if (!sessionHasAdminRole(session)) {
    return <Navigate to="/" replace state={{ message: 'Admin access is required.' }} />
  }

  const handleMakeAdmin = async (user) => {
    if (!window.confirm(`Make ${user.name || user.email} an admin?`)) return

    setPromotingUserId(user.id)
    setStatusMessage('')
    setActionError('')

    try {
      await makeAdmin(user.id)
      setStatusMessage(`${user.name || user.email} is now an admin.`)
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setActionError('You are not authorized to manage administrator access.')
      } else {
        setActionError(getApiErrorMessage(err))
      }
    } finally {
      setPromotingUserId(null)
    }
  }

  return (
    <div>
      <PageIntro title="Manage Users" subtitle="View registered users and manage administrator access." />

      {error ? <p className="mx-4 mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}
      {actionError ? <p className="mx-4 mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{actionError}</p> : null}
      {statusMessage ? <p className="mx-4 mb-4 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{statusMessage}</p> : null}

      <div className="mx-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center p-8"><Spinner className="size-5" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4 text-gray-900">{user.name || '-'}</td>
                    <td className="px-5 py-4 text-gray-600">{user.email}</td>
                    <td className="px-5 py-4 capitalize text-gray-600">{user.role}</td>
                    <td className="px-5 py-4">
                      {user.role === 'admin' ? (
                        <span className="text-sm font-semibold text-gray-500">Admin</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMakeAdmin(user)}
                          disabled={promotingUserId === user.id}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {promotingUserId === user.id ? <Spinner className="mr-2 inline size-4" /> : null}
                          {promotingUserId === user.id ? 'Making Admin...' : 'Make Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!error && !users.length ? <p className="p-8 text-center text-sm text-gray-500">No registered users found.</p> : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers