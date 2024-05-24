"use client";
import React, { useEffect, useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import SlotCounter from 'react-slot-counter';
import LocalBalanceAndPoints from './local-balance-and-points';
import { createCumBet } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import { useAppState } from '@/lib/providers/state-provider';
import { EmojiSelect } from './emoji-select';
import { CustomInputForAmount } from '../ui/custom-input-for-amount';
import Picker from './picker';




export const BiggerCoSchema = z.object(
    {
        amount:z.string().describe("amount"),
    }
)

const BiggerCo = () => {
  const [amount,setAmount] = useState("1");
  const [inchesValue,setInchesValue] = useState("0");
  const [localBalance, setLocalBalance] = useState<string | null>("0")
  const [localPoints, setLocalPoints] = useState<number | null>(0);
  const [autoRoll,setAutoRoll] = useState(false)
  
  const {profile} = useAppState();


  const form = useForm<z.infer<typeof BiggerCoSchema>>({
    mode:"onSubmit",
    resolver:zodResolver(BiggerCoSchema),
    // defaultValues:{amount:amount ? amount : "1"}
  })
  const isLoading = form.formState.isSubmitting;
  const onSubmit:SubmitHandler<z.infer<typeof BiggerCoSchema>> = async (data) => {
    if(!profile){
      console.log("no profile in bigger cock")
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
      status:"pending"
    })
    if(createCumBetError || !createCumBetData){
      console.log("error at creating cumbet");
      return;
    }
    //update balance or some shit
  }
  const cum = async () => {
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
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAmount = event.target.value;
    console.log("New amount:", newAmount); // Verify the value in console
    setAmount(newAmount);
  };

  useEffect(()=>{
    console.log("amount changed: ",amount)
  },[amount])
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
              // disabled={!choice || disabled} 
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
      onClick={cum}
      >
        cum
      </Button>
      <EmojiSelect/>
    </div>

  )
}

export default BiggerCo