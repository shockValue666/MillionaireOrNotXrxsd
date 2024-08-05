"use client";
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils';
import { generateNumber, initializeGame } from '@/lib/server-actions/casino-actions';
import { useAppState } from '@/lib/providers/state-provider';


const emojis = ["😈", "💀", "💩", "💰","🤑"];
const New = () => {

    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
    const {profile} = useAppState()

    // i need to split the code into 2 parts: 
    // 1 - the createGame functionality, which will take the amount and spins, generate a game
    //on the server and save it in the database
    const handleAmountClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("event: ",e.currentTarget.id)
        setSelectedAmount(parseInt(e.currentTarget.id))
    }
    const generateGame = async () => {

        console.log("selectedAmount: ",selectedAmount)
        if(!selectedAmount || !profile){
            console.log("no amount selected")
            return
        }
        const randomnumber = await generateNumber(selectedAmount,selectedAmount/22);


        const game = await initializeGame(selectedAmount, selectedAmount/22, profile?.id);

        console.log("random number: ",randomnumber)
    }
    useEffect(()=>{
        console.log("selectedAmount changed: ",selectedAmount)
    },[selectedAmount])
    //2 - the game itself, where when someone spins the slot, it will be displayed on the client
    // the equivalent entry in the database
  return (
    <div className='flex flex-col w-[60%] gap-y-4'>
        <div className='border border-white flex flex-col items-center gap-y-4 md:gap-y-0 md:flex-row justify-around w-[100%]'>
            <Button id='10' onClick={e=>{handleAmountClick(e)}} className={cn('rounded-full border border-hotPink bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl',
                selectedAmount === 10 ? 'bg-accent text-accent-foreground' : '',
            )}>
                10$ / 22 spins
            </Button>
            <Button id='20' onClick={e=>{handleAmountClick(e)}} className={cn('rounded-full border border-hotPink bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl',
                selectedAmount === 20 ? 'bg-accent text-accent-foreground' : '',
            )}>
                20$ / 22 spins
            </Button>
            <Button id='50' onClick={e=>{handleAmountClick(e)}} className={cn('rounded-full border border-hotPink bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl',
                selectedAmount === 50 ? 'bg-accent text-accent-foreground' : '',
            )}>
                50$ / 22 spins
            </Button>
        </div>
        <div className='w-[100%] text-center'>
            <Button onClick={generateGame} className='bg-slate-700 hover:bg-slate-400 hover:text-black text-lg'>
                create game
            </Button>
        </div>
    </div>
  )
}

export default New