"use client";
import BiggerOrSmaller from '@/components/globals/bigget-or-smaller'
import EmojiSlotsComplex from '@/components/globals/emoji-slots-compmlex'
import EmojiSlots from '@/components/globals/emoji-slots'
import PnL from '@/components/profile/PnL'
import React, { useEffect } from 'react'
import ConcurrentGamesNav from '@/components/globals/concurrent-games-nav'
import SecondSlut from '@/components/globals/second-slut';
import ThirdSlut from '@/components/globals/third-slut';
import BalanceAndPoints from '@/components/globals/balance-and-points';
import JackPot from '@/components/globals/jackpot';
import { Button } from '@/components/ui/button';
import Video from 'next-video';
import surfers from "../../../../../videos/subway.mp4"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// import DoubleSluts from '@/components/globals/double-sluts';

const Page = () => {
  const [numberOfGames, setNumberOfGames] = React.useState<number>(0)
  const [video,setVideo] = React.useState<any>(null)
  const supabase = createClientComponentClient();

  const pressButton = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // const {data,error} = await supabase.storage.from('privlocal').upload(`local.png`,surfers,{upsert:true});
    // const getIt = supabase.storage.from('avatars').getPublicUrl(response.avatarUrl).data.publicUrl : ""
    // const getIt = supabase.storage.from('avatars').getPublicUrl()
    
    console.log("button pressed")
  }
  useEffect(()=>{
    const vid = supabase.storage.from("private").getPublicUrl("subway.mp4")
    if(vid.data.publicUrl){
        setVideo(vid.data.publicUrl)
    }
    console.log("vid: ",vid.data.publicUrl)
  },[supabase])
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
      <Button onClick={(e) => pressButton(e)}>
            click
        </Button>
      <ConcurrentGamesNav setNumberOfGames={setNumberOfGames}/>
      {numberOfGames===1 && (
      <div className='w-full flex flex-col md:flex-row justify-center items-center'>
        <EmojiSlots/>
        <div className='flex md:absolute right-0'>
            {/* {video && <Video src={video} autoPlay={true} muted={true} loop={true}></Video>} */}
            <div className='relative w-[100%]  border border-white'>
                <Video className='absolute top-0 left-0 w-[100%] h-[100%]' src={surfers} autoPlay={true} muted={true} height={400} width={200} loop={true}></Video>
            </div>
        </div>
      </div>
    )}
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