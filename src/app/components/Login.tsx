import React from 'react'
import { login } from '../libs/login'

export default function Login() {
  return (
    <div onClick={login} className='px-5 py-2 bg-[#02B150] opacity-80 hover:opacity-100 transition-all duration-300 rounded-full cursor-pointer'>Login</div>
  )
}
