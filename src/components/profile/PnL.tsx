"use client";
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { calculatePNLForUser, getGamesPlayed, getSlotPnl, getTotalSlotCount } from '@/lib/supabase/queries';
import { useAppState } from '@/lib/providers/state-provider';

const PnL = () => {
    const [pnl,setPnl] = useState(0);
    const [gamesPlayed,setGamesPlayed] = useState(0);
    const {profile} = useAppState();
    const [balance,setBalance] = useState(0);
    useEffect(()=>{
        if(!profile) return;
        const getPnl = async () => {
            const pnl = await calculatePNLForUser(profile?.id)   
            const slotPnl = await getSlotPnl(profile?.id);
            if(slotPnl?.data){
                const realPnl = slotPnl?.data*(-1)
                console.log('typeof slotpnjl.data*-1',typeof realPnl.toFixed(2) )
                setPnl(parseFloat(realPnl.toFixed(2)))
            }
            console.log("slotpnl: ",slotPnl)
            const gamesPlayed = await getGamesPlayed(profile?.id);
            // const balance = await fetch('http://localhost:3000/api/balance',{
            //     method:'GET'
            // });
            const balance = profile.solBalance || 0;
            if(balance){
                // let estimBal =  parseFloat(balance);
                // setBalance(parseFloat(estimBal.toFixed(2)))
                const newB = parseFloat(balance.toFixed(2))
                setBalance(newB)
            }
            // setPnl(pnl)
            const gamesP = await getTotalSlotCount(profile.id)
            if(gamesP?.data){
                setGamesPlayed(gamesP?.data)
            }
        }

        getPnl();
    },[profile])
  return (
    <div className='flex flex-col md:flex-row gap-y-4 gap-x-4'>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
            >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
            </svg>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{balance}</div>
            <p className="text-xs text-muted-foreground">
                +19% from last month
            </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                PnL
            </CardTitle>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
            >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">${pnl}</div>
            <p className="text-xs text-muted-foreground">
                +20.1% from last month
            </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                Games Played
            </CardTitle>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
            >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{gamesPlayed}</div>
            <p className="text-xs text-muted-foreground">
                +180.1% from last month
            </p>
            </CardContent>
        </Card>
    </div>
  )
}

export default PnL