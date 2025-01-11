import React from 'react'
import {assets} from '../assets/assets/'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between '>
        <h1 className="text-xl font-bold text-gray-800 flex flex-col items-center">
      <span className="flex items-center space-x-1">
        <span>MY LOCAL BAZZAR</span>
        <span className="text-pink-400">.</span>
      </span>
      <span className="text-pink-400 text-lg font-medium">ADMIN PANEL</span>
    </h1>
        <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm '>Logout</button>
      
    </div>
  )
}

export default Navbar
