import BiggerOrSmaller from '@/components/globals/bigget-or-smaller'
import EmojiSlotsComplex from '@/components/globals/emoji-slots-compmlex'
import EmojiSlots from '@/components/globals/emoji-slots'
import PnL from '@/components/profile/PnL'
import React from 'react'
import Link from 'next/link'
import GameGrid from '@/components/play/game-grid'
// import SletsIcon from "../../public/emojislots.png"
// import BiggerOrSmallerIcon from "../../public/biggerOrSmaller.png"
import SletsIcon from '../../../../public/emojislots.png'
import BiggerOrSmallerIcon from '../../../../public/biggerOrSmaller.png'
import ExperimentalIcon from "../../../../public/experimental.png"
import CockFirst from "../../../../public/cockfirst.png"


const games = [
  {
    title: 'Slots',
    description: 'Description of Game 1...',
    image: SletsIcon,
    url: '/play/slem'
    // Add more details as needed
  },
  {
    title: 'Bigger Or Smaller',
    description: 'Description of Game 2...',
    url: '/play/biggerOrSmaller',
    image:BiggerOrSmallerIcon
    // Add more details as needed
  },
  // Add more games as needed
  {
    title: 'Experimental',
    description: 'Description of Game 3...',
    url: '/play/experimental',
    image:ExperimentalIcon
    // Add more details as needed
  },
  {
    //i represent the cocks with progress bars from shadcn ui 
    title: 'bigger c*ck wins',
    description: 'Description of Game 3...',
    url: '/play/experimental',
    image:CockFirst
    // Add more details as needed
  },
];

const Page = () => {
  return (
    <div className='flex w-full flex-col items-center mt-8'>
      {/* <BiggerOrSmaller checkBalance={false}/>
      <EmojiSlotsComplex/> */}
      <GameGrid games={games}/>
    </div>
  )
}

export default Page