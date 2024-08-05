"use client";
import { Button } from '@/components/ui/button';
import { useAppState } from '@/lib/providers/state-provider'
import React, { useEffect, useState } from 'react'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getPrivateKey, getSwapperpk } from '@/lib/supabase/queries';
import * as dotenv from 'dotenv'
import Loader from '@/components/globals/Loader';
import TradeForm from '@/components/trade/trade-form';
import NewTradeForm from '@/components/trade/new-trade-form';
import { fetch_pool_file_and_add_it_to_the_local_file_if_not_there_already } from '../api/test/stack/swap';
import { useToast } from '@/components/ui/use-toast';
import { title } from 'process';
dotenv.config({path:".env"});
import { DexScreenerPair as DexScreenerPairType } from '@/lib/supabase/supabase.types';
import { v4 } from 'uuid';

const formSchema = z.object({
  tokenOrAddress: z.string().min(44).max(44),
  amount: z.coerce.number(),
  slippage:z.coerce.number().max(100).min(0),
  percentage:z.coerce.number().min(0).max(100)
})

const Page = () => {
  const {userId,profile} = useAppState();
  const {toast} = useToast();
  const [loadingState,setLoadingState] = useState<boolean>(false)
  const [loadingFetchPoolInfo,setLoadingFetchPoolInfo] = useState<boolean>(false)
  const [loadingDexScreenerPoolInfo,setLoadingDexScreenerPoolInfo] = useState<boolean>(false)
  const [poolOrTokenMint,setPoolOrTokenMint] = useState<string | null>(null)
  const [poolInfo,setPoolInfo] = useState<DexScreenerPairType | null>(null)
  // console.log("profile: ",profile)
  const fetchPoolInfo = async () => {
    setLoadingFetchPoolInfo(true)
    if(!poolOrTokenMint){
      return;
    }
    const res = await fetch("/api/test/info",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({address:poolOrTokenMint})
    })
    if(res){
      setLoadingFetchPoolInfo(false)
      const result = await res.json()
      if(result.message.pool){
        setLoadingDexScreenerPoolInfo(true)
        toast({
          title:"Success",
          description:"Pool found, now fetching pool info",
          duration:3000
        })
        const secondRes = await fetch("/api/test/dexscreener",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({address:result.message.pool.id})
        })
        if(secondRes){
          setLoadingDexScreenerPoolInfo(false)
          const secondResult = await secondRes.json()
          console.log("secondResult: ",secondResult.message.priceChange5m)
          setPoolInfo(secondResult.message)
        }else{
          setLoadingDexScreenerPoolInfo(false)
          console.log("couln't fetch result from the api")
        }
      }
    }else{
      console.log("couln't fetch result from the api")
      setLoadingDexScreenerPoolInfo(false)
      setLoadingFetchPoolInfo(false)
    }
  }


  useEffect(()=>{
    console.log("poolinfo changed inside the page.tsx :",poolInfo)
  },[poolInfo])



  return (
   <div className='' >
    {/* <TradeForm loadingState={loadingState} setLoadingState={setLoadingState} /> */}
    <div className='flex justify-center items-center mx-auto w-1/2 py-4'>
      <div className='w-1/4 ml-8 text-gray-400'>
        token or pool address:
      </div>
      <div className='w-3/4 flex gap-x-4'>
        <Input min={44} max={44} onChange={(e)=>setPoolOrTokenMint(e.target.value)} type="text" />
        {loadingFetchPoolInfo && (<>
        <div className='flex justify-center items-center'>
          <Loader/>
          <p className='text-gray-400'>
            Looking for pool keys(this might take 5-50 seconds)...
          </p>
        </div>
        </>)}
        
        {loadingDexScreenerPoolInfo && (<>
        <div className='flex justify-center items-center'>
          <Loader/>
          <p className='text-gray-400'>
            Found pool now looking for info...
          </p>
        </div>
        </>)}
        
        {!loadingDexScreenerPoolInfo && !loadingFetchPoolInfo && <Button onClick={()=>{fetchPoolInfo()}}>Find</Button>}
      </div>
    </div>
    <NewTradeForm poolInfo={poolInfo as DexScreenerPairType}/>
   </div>
  )
}

export default Page