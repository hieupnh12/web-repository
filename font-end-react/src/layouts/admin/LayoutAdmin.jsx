import React from 'react'
import NavbarAdmin from './NavbarAdmin'
import { Outlet } from 'react-router-dom'

export default function LayoutAdmin() {

  return (
    <div className='bg-[#D1E4E2] min-h-screen flex'>
      <div><NavbarAdmin /></div>
      <main className='class="flex-1 p-6 bg-[#D1E4E2] space-y-6"'>
        <Outlet />
      </main>
    </div>
  )
}
