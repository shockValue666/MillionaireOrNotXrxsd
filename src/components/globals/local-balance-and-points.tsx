"use client";
import { useAppState } from '@/lib/providers/state-provider';
import React, { useEffect } from 'react'
import { Card } from '../ui/card';

interface LocalBalanceAndPointsProps{
    localBalance?:number,
    localPoints?:number
}

const LocalBalanceAndPoints:React.FC<LocalBalanceAndPointsProps> = ({localBalance,localPoints}) => {
//   const {emojiSlot} = useAppState();
//     const [balance, setBalance] = React.useState<string>("0");
//     const [points, setPoints] = React.useState<string>("0");

//     useEffect(()=>{
//         // console.log("profile from balance: ",profile)
//         // console.log("profile balance: ",profile?.balance)
//         if(emojiSlot && emojiSlot.currentAmount){
//             const bal = emojiSlot.currentAmount.toFixed(2)
//             setBalance(bal)
//         }
//         if(emojiSlot && emojiSlot.points!==null){
//             const points = emojiSlot.points.toFixed(2)
//             setPoints(points)
//         }
//     },[emojiSlot])
  return (
    <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2C2C2C] text-white p-3 rounded-lg shadow-lg">
      <div className="flex gap-x-4 md:gap-x-9 flex-col items-start justify-center md:items-center">
        <div className="text-2xl font-bold mb-4">${localBalance?.toFixed(2)}</div>
        <div className="text-lg font-medium">
          <StarIcon className="w-5 h-5 inline-block mr-1 text-yellow-500" />
          {localPoints?.toFixed(2)} Points
        </div>
      </div>
    </Card>
  )
}

export default LocalBalanceAndPoints

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