import React from 'react'
import {Outlet} from "react-router-dom"
import {Navbar} from "./Navbar.jsx"
import {Sidebar} from "./Sidebar.jsx"

export function AppLayout({user, onLogout}) {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 flex flex-col'>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className='flex flex-1'>

        <Sidebar />

        <main className='flex-1 p-8 max-w-7xl mx-auto w-full overflow-y-auto'>

            <Outlet />
            
        </main>
      </div>
    </div>
  );
};
