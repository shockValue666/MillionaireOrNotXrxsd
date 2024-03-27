import BiggerOrSmaller from '@/components/globals/bigget-or-smaller'
import EmojiSlots from '@/components/globals/emoji-slots'
import PnL from '@/components/profile/PnL'
import React from 'react'

const Page = () => {
  return (
    <div className='flex w-full flex-col items-center mt-8'>
      <BiggerOrSmaller checkBalance={false}/>
      <EmojiSlots/>
    </div>
  )
}

export default Page