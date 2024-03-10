import React from 'react'
import Image from 'next/image'
import HeroImage from '../../../public/hero.png'

const Hero = () => {
  return (
    <div className='flex w-full justify-around items-center h-[100%] '>
        {/* <div>
            <p className='text-4xl'>
                Start Gambing Today
            </p>
        </div> */}
        <div className="hero-section py-12 px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Start Gambing Now!</h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8">Join the Excitement and Log In Today!</p>
            <button className="bg-black text-hotPink  py-2 px-6 rounded-full text-lg sm:text-xl font-semibold hover:bg-accent transition duration-600">Log In</button>
        </div>
        <Image src={HeroImage} alt="hero" height={1400} width={800}/>
    </div>
  )
}

export default Hero