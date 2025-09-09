import React from 'react'
import Navbar from '../components/Navbar'

export default function page() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start overflow-x-hidden">
      <Navbar />
      <div className='flex flex-col items-center justify-center w-full h-full'>
        <div>Contact us via line by using our chatbot!</div>
        <img src="https://qr-official.line.me/sid/L/610xgrek.png" alt="" />
        <div>Or add : @610xgrek</div>
      </div>
    </div>
  )
}
