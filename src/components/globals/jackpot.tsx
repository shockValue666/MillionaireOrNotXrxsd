/**
 * v0 by Vercel.
 * @see https://v0.dev/t/HOcfjO8530b
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import React from 'react'

const JackPot = () => {
  return (
    <div className='w-[50%]'>
        <div className="mx-auto bg-gradient-to-br from-[#ff6b6b] to-[#ffa500] rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-gradient-to-br from-[#ff6b6b] to-[#ffa500] rounded-full p-4 shadow-lg">
                <div className="bg-black/80 rounded-full p-6 shadow-inner">
                    <h1 className="text-2xl font-bold text-[#00ff00] tracking-tight">$1,234,567</h1>
                </div>
                </div>
                <div className="bg-black/80 rounded-full px-6 py-2 text-white text-sm font-medium">JACKPOT</div>
            </div>
        </div>
    </div>
  )
}

export default JackPot;