import { useAppState } from '@/lib/providers/state-provider';
import React, { useEffect } from 'react'

const Balance: React.FC = () => {
    const [balance, setBalance] = React.useState<string>("0");
    const {profile} = useAppState();

    useEffect(()=>{
        // console.log("profile from balance: ",profile)
        // console.log("profile balance: ",profile?.balance)
        if(profile && profile.balance!==null){
            const bal = parseFloat(profile.balance).toFixed(2)
            setBalance(bal)
        }
    },[profile])
  return (
    <div className='relative'>
        <div className="absolute md:top-20 left-4 top-0 md:left-10 bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-xl flex items-center text-sm md:text-base">
            <span className="font-bold">Balance: </span>
            <span className="ml-2 font-semibold">{balance} $USDC</span>
        </div>
    </div>
  )
}

export default Balance
