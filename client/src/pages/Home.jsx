import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  console.log("Home component re-rendered")
  return (
    <div className='flex flex-col items-center justify-center min-h-screen 
    bg-[url("/bg_img.png)] bg-center bg-cover'>
     <Navbar/>
     <Header/>
    </div>
  )
}

export default Home
