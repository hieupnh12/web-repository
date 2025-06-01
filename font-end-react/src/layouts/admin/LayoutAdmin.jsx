import React from 'react'
import NavbarAdmin from './NavbarAdmin'
import { Outlet } from 'react-router-dom'

export default function LayoutAdmin() {

  return (
    <div className="bg-[#D1E4E2] min-h-screen flex">
  {/* Sidebar */}
  <aside className="w-64 bg-white shadow-md">
    <NavbarAdmin />
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-6 space-y-6">
    <Outlet />
  </main>
</div>

  )
}
