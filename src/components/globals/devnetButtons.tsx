"use client";
import React from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useAppState } from '@/lib/providers/state-provider';
import { getAndSetBalance } from '@/lib/supabase/queries';

interface Props {
    resetRewardsButtonVisibility: boolean;
    setButtonVisibility: boolean;
    setResetRewardsButtonVisibility: React.Dispatch<React.SetStateAction<boolean>>;
    airdropButtonVisibility: boolean;
    setAirdropButtonVisibility: React.Dispatch<React.SetStateAction<boolean>>;

}

const DevnetButtons:React.FC<Props> = ({
    resetRewardsButtonVisibility,
    setButtonVisibility,
    setResetRewardsButtonVisibility,
    airdropButtonVisibility,
    setAirdropButtonVisibility
}) => {

    const {profile,emojiSlot:emojiSlotFromAppState,dispatch} = useAppState()

     //renew the balance
    const reNewTheBalance = async () => {
        setResetRewardsButtonVisibility(false)
        if(!profile) return;
        const {data,error} = await getAndSetBalance({balance:"0"},profile.id);
        dispatch({type:"UPDATE_USER",payload:{...profile, balance:"0"}})
        setResetRewardsButtonVisibility(true)
    }


    //airdrop amount
    const airdropAmount = async () => {
        setAirdropButtonVisibility(false)
        if(!profile || !profile.balance) return;
        const {data,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)+1000).toString()},profile.id);
        dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)+1000).toString()}})
        setAirdropButtonVisibility(true)
    }
  return (
    <div className='flex justify-center  items-center flex-col gap-y-4 mt-4'>
        <Button 
            disabled={!resetRewardsButtonVisibility}
            className={cn('rounded-full border border-hotPink bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl',
                // setButtonVisibility && 'hidden',
            )}
            onClick={() => {reNewTheBalance();}}>
                <p className='hidden lg:block'>RENEW BALANCE</p>
                <p className='block lg:hidden'>0</p>
            </Button>
            <Button 
            // disabled={!amount} 
            disabled={!airdropButtonVisibility}
            className={cn('rounded-full border border-hotPink bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl',
                // setButtonVisibility && 'hidden',
            )}
            onClick={() => {airdropAmount();}}>
                <p className='hidden lg:block'>AIRDROP</p> 1000
        </Button>
    </div>
  )
}

export default DevnetButtons