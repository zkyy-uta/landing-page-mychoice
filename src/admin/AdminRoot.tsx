import { Outlet } from 'react-router-dom'
import { AdminAuthProvider } from './AdminAuth'

/** Shared auth context for every /admin route (login and the console itself). */
export function AdminRoot() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  )
}
