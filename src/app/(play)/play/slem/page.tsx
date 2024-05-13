"use client";
import BiggerOrSmaller from '@/components/globals/bigget-or-smaller'
import EmojiSlotsComplex from '@/components/globals/emoji-slots-compmlex'
import EmojiSlots from '@/components/globals/emoji-slots'
import PnL from '@/components/profile/PnL'
import React from 'react'
import ConcurrentGamesNav from '@/components/globals/concurrent-games-nav'
import SecondSlut from '@/components/globals/second-slut';
import ThirdSlut from '@/components/globals/third-slut';
import BalanceAndPoints from '@/components/globals/balance-and-points';
import JackPot from '@/components/globals/jackpot';
// import DoubleSluts from '@/components/globals/double-sluts';

const Page = () => {
  const [numberOfGames, setNumberOfGames] = React.useState<number>(0)
  return (
    <div className='flex w-full flex-col items-center mt-8'>
      <p>{numberOfGames}</p>
      {/* <BiggerOrSmaller checkBalance={false}/>
      <EmojiSlotsComplex/> */}
      <div className="md:absolute md:left-2 flex justify-start items-center">
                <BalanceAndPoints/>
      </div>
      {/* <div className="md:absolute md:right-2 flex justify-start items-center">
        <JackPot/>
      </div> */}
      <ConcurrentGamesNav setNumberOfGames={setNumberOfGames}/>
      {numberOfGames===1 && (<EmojiSlots/>) }
      {numberOfGames === 2 && (<div className='flex flex-col lg:flex-row items-center gap-x-4 gap-y-4 w-full lg:w-[50%]'>
        <EmojiSlots/>
        <SecondSlut/>
      </div>)}

      {numberOfGames ===3 && (<div className='flex flex-col lg:flex-row items-center gap-x-4 gap-y-4 w-full lg:w-[50%]'>
        <EmojiSlots/>
        <SecondSlut/>
        <ThirdSlut/>
      </div>)}
    </div>
  )
}

export default Page