"use client";
import BiggerOrSmaller from '@/components/globals/bigget-or-smaller'
import EmojiSlotsComplex from '@/components/globals/emoji-slots-compmlex'
import EmojiSlots from '@/components/globals/emoji-slots'
import PnL from '@/components/profile/PnL'
import React from 'react'
import ConcurrentGamesNav from '@/components/globals/concurrent-games-nav'
import DoubleSluts from '@/components/globals/double-sluts';

const Page = () => {
  const [numberOfGames, setNumberOfGames] = React.useState<number>(0)
  return (
    <div className='flex w-full flex-col items-center mt-8'>
      <p>{numberOfGames}</p>
      {/* <BiggerOrSmaller checkBalance={false}/>
      <EmojiSlotsComplex/> */}
      <ConcurrentGamesNav setNumberOfGames={setNumberOfGames}/>
      {numberOfGames===1 && (<EmojiSlots/>) }
      {numberOfGames === 2 && (<DoubleSluts/>)}
    </div>
  )
}

export default Page