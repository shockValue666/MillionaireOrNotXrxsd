"use client";
import { Card } from "@/components/ui/card"
import { useAppState } from "@/lib/providers/state-provider";
import React,{useEffect} from 'react'

const BalanceAndPoints = () => {

    const {profile} = useAppState();
    const [balance, setBalance] = React.useState<string>("0");
    const [points, setPoints] = React.useState<string>("0");
    const [username, setUsername] = React.useState<string>("");

    useEffect(()=>{
        // console.log("profile from balance: ",profile)
        // console.log("profile balance: ",profile?.balance)
        if(profile && profile.balance!==null){
            const bal = parseFloat(profile.balance).toFixed(2)
            setBalance(bal)
        }
        if(profile && profile.points!==null){
            const points = profile.points.toFixed(2)
            setPoints(points)
        }
        if(profile && profile?.username){
            setUsername(profile.username)
        }
    },[profile])
  return (
    <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2C2C2C] text-white p-3 rounded-lg shadow-lg">
      <div className="flex gap-x-4 md:gap-x-9 md:flex-col items-center md:items-center py-2">
        <div className="text-xl font-bold ">{username}</div>
        <div className="text-2xl font-bold ">${balance}</div>
        <div className="text-lg font-medium">
          <StarIcon className="w-5 h-5 inline-block mr-1 text-yellow-500" />
          {points} Points
        </div>
      </div>
    </Card>
  )
}

export default BalanceAndPoints


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