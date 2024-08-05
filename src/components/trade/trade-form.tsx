"use client";
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Loader from '../globals/Loader'
import { getSwapperpk } from '@/lib/supabase/queries'


const formSchema = z.object({
  tokenOrAddress: z.string().min(44).max(44),
  amount: z.coerce.number(),
  slippage:z.coerce.number().max(100).min(0),
  percentage:z.coerce.number().min(0).max(100)
})



type Props = {
    loadingState:boolean, 
    setLoadingState:React.Dispatch<React.SetStateAction<boolean>>    
}
const TradeForm:React.FC<Props> = ({
    loadingState,setLoadingState
}) => {

  const [buy,setBuy] = useState<boolean>(true)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        tokenOrAddress:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        amount:1,
        slippage:30,
        percentage:50
        }
    })

      const onSubmit = async (values:z.infer<typeof formSchema>) => {
        //WIP fetch private key of the involved address

        // const pk = await getPrivateKey("35U34k2qjBUTULcmZ3XiSDwU3PgVDoVgHCSdb3JiyTKs")
        // const pk = process.env.SWAPPER_PRIVATE_KEY
        const pk = await getSwapperpk();
        console.log("pk: ",pk);
        console.log("values øf the shit form: ",values);
        const bodyObject = {
        ...values,
        privateKey:pk
        }
        console.log("bodyObject: ",bodyObject);
        setLoadingState(true)
        const res = await fetch("/api/test/swap",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(bodyObject)
        })
        if(res){
        setLoadingState(false)
        }else{
        setLoadingState(false)
        } 

        console.log("res: ",await res.json());
    }

  return (
    <div className='w-[100%] border border-white flex flex-col items-center justify-center gap-y-6'>
      <div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 justify-center items-center flex flex-col w-[100%] border border-white' action="">
            <FormField
              control={form.control}
              name="tokenOrAddress"
              render={({ field }) => (
                <FormItem className=' w-[50%]'>
                  <FormLabel>Token mint or Pool address</FormLabel>
                  <FormControl>
                    <Input className='' type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter the token mint or Pool address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='border border-yellow-300'>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                      type="number" 
                      {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Please enter the amount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the percentage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slippage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slippage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the slippage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!loadingState && <Button type="submit">buy now</Button>}
              {/* <Button disabled={loadingState}  type="submit">Submit</Button> */}
              {loadingState && (
                <div className="mb-4">
                  <p>loading...</p>
                  <Loader/>
                </div>
              )}
            </div>
            <div>
              some other shit
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default TradeForm