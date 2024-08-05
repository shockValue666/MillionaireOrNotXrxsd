import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DexScreenerPair as DexScreenerPairType } from '@/lib/supabase/supabase.types';
import Link from 'next/link'
import Image from 'next/image'
 


interface Props{
  poolInfo?:DexScreenerPairType
}
const TokenInfo:React.FC<Props> = ({
  poolInfo
}) => {

  // console.log("poolInfo from inside token-info: ",poolInfo?.priceChange5m)
  useEffect(()=>{

    console.log("poolInfo from inside token-info: ",poolInfo)
  },[poolInfo])

  return (
    <div className="w-[350px] mx-auto md:mx-0">
      <div className=' flex flex-col md:flex-row justify-around w-full bg-gray-800 items-center'>
        {poolInfo?.imageUrl && <Image
          src={poolInfo?.imageUrl}
          alt="logo"
          width={50}
          height={50}
          className='rounded-md'
        />}
        <p className='text-center p-4 rounded-t-lg'>{ poolInfo?.baseTokenName ? poolInfo?.baseTokenName : "token name"}</p>
      </div>
      {/* top bar */}
      <div className='flex justify-center gap-x-4 bg-gray-800 p-4 rounded-b-xl'>
        <Link target="_blank" href={poolInfo?.website ? poolInfo.website : "#"} className="bg-black p-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground font-extrabold tracking-tight text-center text-hotPink uppercase">
            Website
        </Link>
        <Link target="_blank" href={poolInfo?.twitter ? poolInfo.twitter : "#"} className="bg-black p-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground font-extrabold tracking-tight text-center text-hotPink uppercase">
            Twitter
        </Link>
        <Link target="_blank" href={poolInfo?.telegram ? poolInfo.telegram : "#"} className="bg-black p-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground font-extrabold tracking-tight text-center text-hotPink uppercase">
            Telegram
        </Link>
      </div>
      {/* price information */}
      <div className='flex justify-around bg-gray-900 p-4 text-white'>
        <div>
          <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
            PRICE USD
          </p>
          <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
            ${poolInfo?.priceUsd ? poolInfo.priceUsd : "0.00"}
          </p>
        </div>
        <div>
          <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
            PRICE SOL
          </p>
          <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
            {poolInfo?.priceNative ? poolInfo.priceNative : "0.00 SOL"}
          </p>
        </div>
      </div>

    {/* liquidity, fdv, mcap */}
    <div className='flex justify-around bg-gray-900 p-4 text-white'>
      <div>
        <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
          Liquidity
        </p>
        <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
          {/* $303K */}
          {poolInfo?.usdLiquidity ? poolInfo.usdLiquidity : "$0.00"} 
        </p>
      </div>
      <div>
        <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
          FDV
        </p>
        <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
          {/* $4.7M */}
          {poolInfo?.fdv ? poolInfo.fdv : "$0.00"}
        </p>
      </div>
      <div>
        <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
          MCAP
        </p>
        <p className="text-sm font-extrabold tracking-tight text-center text-gray-400 uppercase">
          {/* $4.7M */}
          {poolInfo?.fdv ? poolInfo.fdv : "$0.00"}
          {/* wip fetch the market cap forgot to add it, or   */}
          {/* marketcap = current supply * current price */}
          {/* fdv = total supply * current price */}
          {/* we have fdv, total supply and current price */}
          {/* so we can calculate the mcap */}
          {/* in most cases with memecoins fdv = mcap =  */}
        </p>
      </div>
    </div>
    {/* time based changes components */}
    
    <div className='flex justify-around bg-gray-800 p-4 text-white rounded-t-lg'>
      <div className='flex flex-col items-center'>
        <p>
          5M
        </p>
        <p className='text-green-500'>{poolInfo?.priceChange5m ? poolInfo.priceChange5m : "0%"} %</p>
      </div>
      <div className='flex flex-col items-center'>
        <p>
          1H
        </p>
        <p className='text-red-500'>{poolInfo?.priceChangeH1 ? poolInfo.priceChangeH1 : "0%"} %</p>
      </div>
      <div className='flex flex-col items-center'>
        <p>
          6H
        </p>
        <p className='text-red-500'>{poolInfo?.priceChangeH6 ? poolInfo.priceChangeH6 : "0%"} %</p>
      </div>
      <div className='flex flex-col items-center'>
        <p>
          24H
        </p>
        <p className='text-green-500'>{poolInfo?.priceChangeH24 ? poolInfo.priceChangeH24 : "0%"} %</p>
      </div>
    </div>

    {/* transaction infromation component */}
    <div className='bg-gray-800 p-4 text-white rounded-b-lg'>
      <div className='flex justify-between'>
        <div className='flex flex-col items-center'>
          <p>TXNS(5M)</p>
          <p>{poolInfo?.txns5m ? JSON.parse(poolInfo.txns5m).buys + JSON.parse(poolInfo.txns5m).sells : "0"}</p>
        </div>
        <div className='flex flex-col items-center'>
          <p>BUYS</p>
          <p>{poolInfo?.txns5m ? JSON.parse(poolInfo.txns5m).buys: "0"}</p>
        </div>
        <div className='flex flex-col items-center'>
          <p>SELLS</p>
          <p>{poolInfo?.txns5m ? JSON.parse(poolInfo.txns5m).sells : "0"}</p>
        </div>
      </div>
      <div className='flex justify-between mt-4'>
        <div className='flex flex-col items-center'>
          <p>VOLUME(5M)</p>
          <p>${poolInfo?.volume5m ? poolInfo.volume5m : "0"}</p>
        </div>
        <div className='flex flex-col items-center'>
          <p>BUY VOL</p> 
          {/* <p>$7.5M</p> */}
          <p>${(poolInfo?.txns5m && poolInfo?.priceUsd) ? (parseInt(JSON.parse(poolInfo.txns5m).buys)*poolInfo.priceUsd).toFixed(2) : "0"}</p>
          {/* WIP, idk how to calculate the volume
          maybe it's just buys*currentPrice ?
          would  that be accurate? or would it be Sum(buy(t_i)*price(t_i)) */}
        </div>
        <div className='flex flex-col items-center'>
          <p>SELL VOL</p>
          {/* <p>$7.4M</p> */}
        <p>{(poolInfo?.txns5m && poolInfo?.priceUsd) ? (parseInt(JSON.parse(poolInfo.txns5m).sells)*poolInfo.priceUsd).toFixed(2) : "0"}</p>
        </div>
      </div>
      {/* <div className='flex justify-between mt-4'>
        <div className='flex flex-col items-center'>
          <p>MAKERS</p>
          <p>40,134</p>
        </div>
        <div className='flex flex-col items-center'>
          <p>BUYERS</p>
          <p>39,426</p>
        </div>
        <div className='flex flex-col items-center'>
          <p>SELLERS</p>
          <p>3,585</p>
        </div>
      </div> */}
    </div>

    </div>
  )
}

export default TokenInfo