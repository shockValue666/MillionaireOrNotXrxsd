"use client";
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { calculatePNLForUser, getGamesPlayed } from '@/lib/supabase/queries';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';

const PnL = () => {
    const [pnl,setPnl] = useState(0);
    const [gamesPlayed,setGamesPlayed] = useState(0);
    const {user} = useSupabaseUser();
    const [balance,setBalance] = useState(0);
    useEffect(()=>{
        if(!user) return;
        const getPnl = async () => {
            const pnl = await calculatePNLForUser(user?.id)   
            const gamesPlayed = await getGamesPlayed(user?.id);
            const balance = await fetch('http://localhost:3000/api/balance',{
                method:'GET'
            });
            if(balance){
                const data = await balance.json()
                console.log("data: ",data.balance);
                setBalance(data.balance)
            }
            setPnl(pnl)
            setGamesPlayed(gamesPlayed)
        }

        getPnl();
    },[user])
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
            <div className="text-2xl font-bold">{balance/1000000000}</div>
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