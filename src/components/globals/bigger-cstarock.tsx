"use client";
import React, { useEffect, useRef, useState } from 'react'
import { Progress } from "@/components/ui/progress"
//the progress represents the cock
import { SubmitHandler, useForm } from 'react-hook-form';
//form for the inches bet
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
//form components
import { Input } from '../ui/input';
//input for bet or inches 
import {  useToast } from '../ui/use-toast';
//toast to notify
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
//input validation
import { Button } from '../ui/button';
import SlotCounter from 'react-slot-counter';
//dick length result
import LocalBalanceAndPoints from './local-balance-and-points';
//local poitns
import { createCumBet, updateCumBet, updateProfile } from '@/lib/supabase/queries';
//supabase database save for each bet in the table called: cum_bets
import { v4 } from 'uuid';
//for the id of the bet
import { useAppState } from '@/lib/providers/state-provider';
//state provider
import { EmojiSelect } from './emoji-select';
//idk why
import { CustomInputForAmount } from '../ui/custom-input-for-amount';
import Picker from './picker';
import CumfettiButton from './cumfetti-button';
import Cumfetti from './cumfetti';
//represents the cum 


//GENERAL RULE IS BIGGER COCK WINS

export const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

// utils/scaleParticleCount.js
//configuration for the cum 
export const scaleParticleCount = (inchesValue:number) => {
  const minParticles = 10; // Minimum particles for inchesValue 1
  const maxParticles = 300; // Maximum particles for inchesValue 12
  const scale = 2; // Adjust this value to control the steepness of the curve

  return Math.round(minParticles + (maxParticles - minParticles) * Math.pow((inchesValue - 1) / 11, scale));
};

//needed for the cum bet amount
export const BiggerCoSchema = z.object(
    {
        amount:z.string().describe("amount"),
    }
)

const BiggerCo = () => {
  const [amount,setAmount] = useState("1");
  //bet amount of cum_bet
  const [inchesValue,setInchesValue] = useState("0");
  //inches of cock
  const [localBalance, setLocalBalance] = useState<string | null>("0")
  const [localPoints, setLocalPoints] = useState<number | null>(0);
  const [autoRoll,setAutoRoll] = useState(false)
  const [disableSetButton,setDisableSetButton] = useState(false)
  const [disableCumButton,setDisableCumButton] = useState(true)

  const {toast} = useToast();

  //needed for the cum
  const confettiRef = useRef<{ fire: (x: number, y: number) => void }>(null);
  
  const {profile,cumBet,dispatch} = useAppState();


  const form = useForm<z.infer<typeof BiggerCoSchema>>({
    mode:"onSubmit",
    resolver:zodResolver(BiggerCoSchema),
    // defaultValues:{amount:amount ? amount : "1"}
  })
  const isLoading = form.formState.isSubmitting;
  //runs when i set the amount of the cumbet
  const onSubmit:SubmitHandler<z.infer<typeof BiggerCoSchema>> = async (data) => {
    if(!profile || !profile?.balance || parseFloat(profile?.balance) < parseFloat(data.amount)){
      console.log("no profile in bigger cock or actually balance is smaller than the amountl ol")
      return;
    }
    console.log("data from bigger cock: ",data)
    setAmount(data.amount)
    //WIP create cumBet set LocalBalance, reduce from global balance
    const {data:createCumBetData,error:createCumBetError} = await createCumBet({
      id:v4(),
      createdAt:new Date().toISOString(),
      profileId:profile?.id,
      betAmount:parseFloat(data.amount),
      targetValue:6,
      achievedValue:0,
      description:"",
      status:"pending",
      cumBetBalance:parseFloat(data.amount)
    })
    if(createCumBetError || !createCumBetData){
      console.log("error at creating cumbet");
      return;
    }
    
    dispatch({
      type:"SET_CUM_BET",
      payload:createCumBetData[0]
    })
    setDisableSetButton(true)
    //update balance or some shit
    const {data:updateProfileData,error:updateProfileError} = await updateProfile({balance:(parseFloat(profile?.balance)-parseFloat(data.amount)).toString()},profile.id)
    if(updateProfileError || !updateProfileData){
      console.log("couldn't update user after creating cumbet");
      return;
    }
    dispatch({
      type:"UPDATE_USER",
      payload:{...profile,balance:(parseFloat(profile?.balance)-parseFloat(data.amount)).toString()}
    })


    toast({title:"Success",description:"Slot created successfully"})


  }

  //my goal is to create a session of 10/20/100 cums in a row like slot games, but with cum bets instead

  //runs when i click the cum button
  const cum = async () => {
    toast({
      title:"Cumming",
      description:"CUMMING",
    })
    console.log("cum")
    const result = Math.floor(Math.random()*12+1)
    let assignedValue;
    if(result<10){
      assignedValue=`0${result}`
    }else{
      assignedValue=`${result}`
    }
    setInchesValue(assignedValue)

    ///WIP UPDATE cumBet
    if(!profile || !cumBet){
      console.log("profile or cumbet don't exist inside cum", profile, cumBet);
      return;
    }
    if(result>cumBet.targetValue){
      console.log("won")
      const {data:updateCumBetData,error:updateCumBetError} = await updateCumBet({status:"won",cumBetBalance:0},cumBet.id)
      if(updateCumBetError || !updateCumBetData){
        console.log("error at updating cumbet");
        return;
      }
      dispatch({
        type:"UPDATE_CUM_BET",
        payload:updateCumBetData[0]
      })

      console.log("updatedData: ",updateCumBetData[0])
      //update profile BALANCE
      const {data:updateProfileData,error:updateProfileError} = await updateProfile({balance:(parseFloat(profile?.balance || "0")+cumBet.betAmount).toString()},profile.id)
      if(updateProfileError || !updateProfileData){
        console.log("error at updating profile balance");
        return;
      }
      dispatch({
        type:"UPDATE_USER",
        payload:{...profile,balance:(parseFloat(profile?.balance || "0")+cumBet.betAmount).toString()}
      })
    }else if(result<cumBet.targetValue){
      console.log("lost")
      const {data:updateCumBetData,error:updateCumBetError} = await updateCumBet({status:"lost",cumBetBalance:cumBet.betAmount},cumBet.id)
      if(updateCumBetError || !updateCumBetData){
        console.log("error at updating cumbet");
        return;
      }
      dispatch({
        type:"UPDATE_CUM_BET",
        payload:updateCumBetData[0]
      })
      //update profile BALANCE
      // const {data:updateProfileData,error:updateProfileError} = await updateProfile({balance:(parseFloat(profile?.balance || "0")).toString()},profile.id)
      //actually there is not need to update the balance if the user lost
    }else{
      console.log("house won")
    }
  }

  const trigger = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Trigger function called');
    console.log('Event currentTarget:', e.currentTarget);
    if(!e.currentTarget.parentElement) return;
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const x = rect.right / window.innerWidth;
    const y = (rect.top + rect.bottom) / 2 / window.innerHeight;

    confettiRef.current?.fire(x, y);
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAmount = event.target.value;
    console.log("New amount:", newAmount); // Verify the value in console
    setAmount(newAmount);
  };

  useEffect(()=>{
    console.log("amount changed: ",amount)
    if(cumBet){
      console.log("cumBet :",cumBet)
    }
  },[amount,cumBet])
  return (
    <div className='border flex-col gap-4 border-white flex justify-center items-center p-4'>
        <h1>dickcel or BBCchad</h1>
        <LocalBalanceAndPoints localBalance={localBalance ? parseFloat(localBalance) : 0} localPoints={localPoints ? localPoints : 0}/>
        {/* here should go the ruler */}
        <div className="w-full flex justify-between text-xl px-2">
          {/* Custom Ruler Here */}
          {[...Array(12)].map((_, i) => (
            <span key={i} className="flex justify-center flex-1">{i + 1}</span>
          ))}
        </div>
        <Progress className='h-[100px] bg-white' value={(parseFloat(inchesValue)/12)*100}/>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-8 flex items-center">
              <FormField
              // disabled = {!choice || disabled}
              control={form.control}
              name="amount"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                      {/* <Input placeholder="shadcn" type='number' {...field} /> */}
                      {/* <CustomInputForAmount min={1}
                        max={100}
                        step={1}
                        value={parseFloat(amount)}
                        onChange={(e) => {
                          setAmount(e.target.value); // Update the amount
                          console.log("Value changed to:", e.target.value);
                        }}
                      /> */}
                      {/* <Picker min={1} max={12} step={1} onChange={()=>setAmount(parseFloat(amount).toString())} defaultValue={6} /> */}
                      <CustomInputForAmount
                        min={1}
                        max={100}
                        step={1}
                        // value={amount}
                        // onChange={handleChange}
                        {...field}
                      />
                  </FormControl>
                  <FormDescription>
                      Bet amount in $$$
                  </FormDescription>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <Button 

              disabled={disableSetButton} 
              type="submit">set</Button>
          </form>
      </Form>
      <SlotCounter
        startValue={1}
        startValueOnce={true}
        value={inchesValue}
        charClassName='text-4xl'
        animateUnchanged
        autoAnimationStart={false}
        duration={0.4}
        separatorClassName=''
        valueClassName='char'
        
    />
      <Button className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
      onClick={async (e)=>{
        cum();
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // await delay(1000);
        await trigger(e);
      }}
      >
        cum
        <Cumfetti ref={confettiRef} particleCount={
          // (parseFloat(inchesValue)/12)*300
          scaleParticleCount(parseFloat(inchesValue))
        }/>
      </Button>
      {/* <CumfettiButton/> */}
      <EmojiSelect/>
    </div>

  )
}

export default BiggerCo