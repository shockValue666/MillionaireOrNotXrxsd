"use client";
import React from 'react'
import { Card } from '../ui/card'

interface ApsCurrentSpinProps{
    aps: number,
    currentSpin: number,
    totalSpins: number
}

const ApsCurrentSpin:React.FC<ApsCurrentSpinProps> = ({aps,currentSpin,totalSpins}) => {
  return (
    <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2C2C2C] text-white p-3 rounded-lg shadow-lg">
      <div className="flex gap-x-4 md:gap-x-9 flex-col items-stretch md:items-center">
        <div className="text-xl md:text-2xl font-bold mb-4">APS: {aps}</div>
        <div className="text-md md:text-lg font-medium">
          {currentSpin}/{totalSpins} 
        </div>
      </div>
    </Card>
  )
}

export default ApsCurrentSpin

function StarIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}