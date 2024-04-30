"use client";
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import SlotCounter, { SlotCounterRef } from 'react-slot-counter';
import TestSlotCounter from './test-slot-counter';

const emojis = ["😈", "💀", "💩", "💰","🤑"];

const Page = () => {

    const [currentEmojisNew, setCurrentEmojisNew] = useState<string[] | []>([])
    const [notificationState, setNotificationState] = useState<boolean>(false);

    const getWinnerNew = async () => {
        // setDisabled(true);
        const drand = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5));
        const winnerEmojis = drand.map(index => emojis[index])
        setCurrentEmojisNew(winnerEmojis)
        setTimeout(() => {
        console.log("inside first timeout")
        setNotificationState(true);

        // Set another timeout to disable the notification after the first one completes
        setTimeout(() => {
                console.log("inside second timeout")
                setNotificationState(false);
            }, 1000);  // Adjust the duration according to your needs
        }, 1000);  // This ensures the first timeout runs before the second
        // if(emojisArray === undefined || emojisArray===null) return;
        return winnerEmojis;
    }

    const handleSpinNew = async () => {
        console.log("handleSpinNew() called")
        const winnerEmojis = await getWinnerNew();
        console.log("some other shit", winnerEmojis, " await getWinnerNew(): ",await getWinnerNew())
    }

    const autospin = async () => {
        for(let i = 0; i<=5; i++){
            // console.log("something")
            await handleSpinNew()
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    
  return (
    <div className='flex w-full flex-col items-center mt-8'>
        {notificationState && (<div>
            notification lol
        </div>)}
        <SlotCounter
                startValue={['💰','💰','💰','💰','💰']}
                startValueOnce={true}
                
                value={currentEmojisNew}
                charClassName='text-4xl'
                animateUnchanged
                autoAnimationStart={false}
                dummyCharacters={emojis}
                duration={0.5}
                // hasInfiniteList={true}
                // useMonospaceWidth={true}
                debounceDelay={3}
        />
        <Button 
            // disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} 
            // disabled={!rollButtonVisibilityNew || disabledRollButtonNew}
            className='w-[20%] rounded-full border border-hotPink bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
            onClick={() => {handleSpinNew();}} onKeyDown={(e)=>{
                // if(e.key===" "){
                //     handleSpinNew();}
                // }
                console.log("key: ",e.key)
                }}>
                SPIN
        </Button>
        <Button 
            // disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} 
            // disabled={!rollButtonVisibilityNew || disabledRollButtonNew}
            className='w-[20%] rounded-full border border-hotPink bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
            onClick={() => {autospin();}} onKeyDown={(e)=>{
                // if(e.key===" "){
                //     handleSpinNew();}
                // }
                console.log("key: ",e.key)
                }}>
                AUTOSPIN
        </Button>
    </div>
  )
}

export default Page