'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from "@/components/ui/button"

const Navbar = () => {
    const {data: session} = useSession();
    const user : User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 bg-white border-b-4 border-black text-black z-50 relative">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo Section */}
        <div className='flex justify-center items-center gap-4'>
          <img
            src="/logo.jfif"
            className="w-12 h-12 md:w-16 md:h-16 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-400"
            alt="Cypher Logo"
          />
          <Link href="/" className="text-4xl md:text-5xl font-black uppercase tracking-tighter hover:bg-yellow-400 hover:px-2 transition-all">
            CYPHER
          </Link>
        </div>
      
        {/* User Controls */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {session ? (
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <span className="font-bold uppercase text-lg bg-pink-300 border-2 border-black px-3 py-1 transform -rotate-1 hidden md:block">
                Sup, {user?.username || user?.email}
              </span>
              <Button onClick={() => signOut()} className="w-full md:w-auto px-6 py-6 bg-red-500 hover:bg-red-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-widest text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                LOGOUT
              </Button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Link href="/signin" className="w-full md:w-auto px-6 py-6 bg-blue-500 hover:bg-blue-600 text-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-widest text-lg flex items-center gap-2 justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                LOGIN
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar