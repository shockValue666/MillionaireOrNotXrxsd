"use client";
import React, { useEffect, useState } from 'react';
import SlotCounter from 'react-slot-counter';
import { Button } from '../ui/button';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BiggerOrSmallerSchema } from '@/lib/types';
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { addGamble, getAndSetBalance } from '@/lib/supabase/queries';
import { v4 } from 'uuid';

interface BiggerOrSmallerProps {
    checkBalance?:boolean;
}

const BiggerOrSmaller:React.FC<BiggerOrSmallerProps> = ({
    checkBalance
}) => {
    const [winner, setWinner] = useState(50000);
    const [choice,setChoice] = useState<string | null>(null);   
    const [amount, setAmount] = useState<string | null>(null);
    const [reset,setReset] = useState<boolean>(false);
    const [disabled,setDisabled] = useState<boolean>(true);
    const {toast} = useToast();
    const {user} = useSupabaseUser();

    const form = useForm<z.infer<typeof BiggerOrSmallerSchema>>({
        mode:"onSubmit",
        resolver:zodResolver(BiggerOrSmallerSchema),
        defaultValues:{amount:"1"}
    })
    const isLoading = form.formState.isSubmitting;

    const onSubmit:SubmitHandler<z.infer<typeof BiggerOrSmallerSchema>> = async (data) => {
        console.log("data: ", data);
        setAmount(data.amount);
    }
    
    // Use the winner state directly to trigger animations.
    // If necessary, convert winner to a format that SlotCounter expects.
    const slotValues = winner.toString().split('').map(num => 
        <span key={num}
        >{num}</span>
    );

    useEffect(()=>{
        if(!user){
            setDisabled(true)
        }else{
            setDisabled(false)
        }
    },[user])
    useEffect(()=>{
        if(!checkBalance || !user) return;
        

    },[user])

    const getRandomWinner = async () => {
        const drand = Math.floor(Math.random() * 100000);
        setWinner(drand);
        if(!user?.id || !amount || !choice) return;
        const res = await addGamble({
            userId:user?.id,
            amount:amount,
            choice:choice,
            winner:drand.toString(),
            id:v4(),
            createdAt:new Date().toISOString(),
            status: drand>50000 && choice === "bigger" || drand<50000 && choice === "smaller"
        });
        console.log("res: ",res)
        await new Promise(resolve=>setTimeout(resolve, 525));
        if(drand>50000 && choice === "bigger" || drand<50000 && choice === "smaller"){
            toast({title:"You won!", description:"You guessed right"});
            await getAndSetBalance({balance:"bet"},user?.id);
        }else if(drand<50000 && choice === "bigger" || drand>50000 && choice === "smaller"){
            toast({title:"You Lost!", description:"You guessed wrong", variant:"destructive"})
        }
        setDisabled(true);
        setReset(true);
    }

    const resetTheGame = () => {
        setReset(false);
        setChoice(null);
        setAmount(null);
        setWinner(50000);
        setDisabled(false);
    }

    return (
        <div className='flex flex-col justify-center align-center border w-[100%] md:w-[50%] border-white rounded-lg gap-4 p-4'>
            <p className='w-full text-center'>bigger or smaller than</p>
            <div className='w-full flex flex-col items-center gap-y-6'> 
                <div className='flex items-center gap-x-4'>
                    <SlotCounter
                        key={winner} // Use winner as key to force re-render
                        value={slotValues}
                        duration={0.5}
                        startValue={'?????'}
                        charClassName='text-4xl'
                        sequentialAnimationMode={true}
                        startValueOnce={true}
                    />
                    {choice === "smaller" && <FaArrowAltCircleDown size={40} color='red'/>}
                    {choice === "bigger" && <FaArrowAltCircleUp size={40} color='green'/>}

                </div>
                <div className=' flex flex-col md:flex-row gap-4 w-[50%] justify-around items-center '>
                    <Button onClick={()=>setChoice("bigger")} disabled={disabled} className='bg-green-500'>BIGGER</Button>
                    <Button onClick={()=>setChoice("smaller")} disabled={disabled} className='bg-red-500'>SMALLER</Button>
                </div>
                {/*  */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-8 flex items-center">
                        <FormField
                        disabled = {!choice || disabled}
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                Bet amount in $$$
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button disabled={!choice || disabled} type="submit">set</Button>
                    </form>
                </Form>
                {/*  */}
                {!reset && <Button disabled={!amount} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                onClick={() => {getRandomWinner(); console.log("pressed winner: ", winner);}}>
                    ROLL
                </Button>}
                {reset && <Button disabled={!amount} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                onClick={() => {resetTheGame();}}>
                    RESET
                </Button>}
            </div>
        </div>
    );
};

export default BiggerOrSmaller;
