import React from 'react'
import logo from "../Image/Accu_logo.png"
// import dark_mdoe from "../Image/dark_mode_moon.png"
import { HiOutlineMoon } from "react-icons/hi2";

const Header = () => {
  return (
    <nav className='bg-black flex justify-between items-center min-h-[10vh] w-full'>
        <div className="left flex ">
            <img src={logo} alt="" className='size-10 cursor-pointer	'/>
            
            <p className='text-neutral-50 text-4xl font-bold align-middle cursor-pointer'>
                AccuWeather
            </p>
            <p className='text-neutral-50 text-3xl font-bold ml-5 align-middle cursor-pointer'>
                Temple, TX  <span className='text-1xl cursor-pointer'>-1°</span>
                <span className='text-base'>C</span>
                </p>
                <p><HiOutlineMoon className='text-neutral-50 text-white text-3xl ml-5 align-middle cursor-pointer'/></p>
            
        </div>

        <div className="right">
        
        </div>
    </nav>
  )
}

export default Header