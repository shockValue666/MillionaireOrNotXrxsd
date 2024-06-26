"use client";
import React, { useEffect, useState } from 'react';
import SlotCounter from 'react-slot-counter';
import { Button } from '../ui/button';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { SubmitHandler, useForm } from 'react-hook-form';
import { set, z } from 'zod';
import { BiggerOrSmallerSchema } from '@/lib/types';
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { addGamble, getAndSetBalance } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import { Auth } from '../auth/auth';
import { useAppState } from '@/lib/providers/state-provider';
import { Profile } from '@/lib/supabase/supabase.types';

interface BiggerOrSmallerProps {
    checkBalance?:boolean;
}

const BiggerOrSmaller:React.FC<BiggerOrSmallerProps> = ({
    checkBalance
}) => {
    const [winner, setWinner] = useState(5);
    const [choice,setChoice] = useState<string | null>(null);   
    const [amount, setAmount] = useState<string | null>(null);
    const [reset,setReset] = useState<boolean>(false);
    const [disabled,setDisabled] = useState<boolean>(true);
    const {toast} = useToast();
    const {user} = useSupabaseUser();
    const {profile,gamble,dispatch} = useAppState()
    const [stateProfile,setStateProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [localBalance, setLocalBalance] = useState<string | null>(null);
    const [sessionPnl, setSessionPnl] = useState<number>(0);
    const [disableRollButton, setDisableRollButton] = useState<boolean>(true);

    const form = useForm<z.infer<typeof BiggerOrSmallerSchema>>({
        mode:"onSubmit",
        resolver:zodResolver(BiggerOrSmallerSchema),
        defaultValues:{amount:"1"}
    })
    const isLoading = form.formState.isSubmitting;

    const onSubmit:SubmitHandler<z.infer<typeof BiggerOrSmallerSchema>> = async (data) => {
        console.log("data: ", data);
        setAmount(data.amount);
        setLocalBalance(data.amount);
        setDisableRollButton(false);
    }
    
    // Use the winner state directly to trigger animations.
    // If necessary, convert winner to a format that SlotCounter expects.
    const slotValues = winner.toString().split('').map(num => 
        <span key={num}
        >{num}</span>
    );

    useEffect(()=>{
        if(profile) {
            setStateProfile(profile)
            setDisabled(false)
        }else{
            setDisabled(true)
        }
        if(gamble){
            console.log("gamble: ",gamble)
        }
    },[profile])
    useEffect(()=>{
        if(!checkBalance || !user) return;
        

    },[user])

    const getRandomWinner = async () => {
        // setLoading(true);
        setDisabled(true);
        setDisableRollButton(true);
        const drand = Math.floor(Math.random() * 10);
        setWinner(drand);
        if(!user?.id || !amount || !choice || !profile || !profile?.balance) return;
        const res = await addGamble({
            userId:user?.id,
            amount:amount,
            choice:choice,
            winner:drand.toString(),
            id:v4(),
            createdAt:new Date().toISOString(),
            status: drand>50000 && choice === "bigger" || drand<50000 && choice === "smaller",
            localBalance:0
        });
        if(!res.data) return;
        dispatch({type:"SET_GAMBLE",payload:res.data[0]})
        console.log("res: ",res)
        await new Promise(resolve=>setTimeout(resolve, 525));
        if(drand>5 && choice === "bigger" || drand<5 && choice === "smaller"){
            toast({title:"You won!", description:"You guessed right"});

            await getAndSetBalance({balance:(parseFloat(profile?.balance)+(parseFloat(amount))).toString()},user?.id);
            setLocalBalance(amount)
            setSessionPnl(oldSessionPnl=>oldSessionPnl+(parseFloat(amount)))
            dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile?.balance)+parseFloat(amount)).toString()}})
        }else if(drand<=5 && choice === "bigger" || drand>=5 && choice === "smaller"){
            toast({title:"You Lost!", description:"You guessed wrong", variant:"destructive"})
            await getAndSetBalance({balance:(parseFloat(profile?.balance)-parseFloat(amount)).toString()},user?.id);
            setSessionPnl(oldSessionPnl=>oldSessionPnl-parseFloat(amount))
            dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile?.balance)-parseFloat(amount)).toString()}})
            setLocalBalance("0")
        }
        // setDisabled(true);
        setReset(true);
    }

    const resetTheGame = () => {
        setReset(false);
        setChoice(null);
        setAmount(null);
        setWinner(5);
        setDisabled(false);
        setLocalBalance(null);
    }

    return (
        <div className='w-[90%] md:w-[50%] text-center mt-[10%]'>
            {
                !profile &&
                <div className='tracking-tight text-center text-hotPink bg-black hover:bg-accent hover:text-accent-foreground rounded-xl' onClick={()=>{console.log("kenta")}}>
                    <Auth>LOG IN TO PLAY</Auth>
                </div>
            }
            <div className={`flex flex-col justify-center align-center border w-[100%] border-white rounded-lg gap-4 p-4 ${!profile ? 'blur-sm' : ""}`}>
                <p className='w-full text-center'>bigger or smaller</p>
                <p>session pnl: {sessionPnl && <>{sessionPnl}</>}</p>
                <div className='w-full flex flex-col items-center gap-y-6'> 
                    <div className="flex items-center flex-col lg:flex-row gap-y-4 justify-between w-full">
                        <div className="flex-initial">
                            {localBalance && <p className='text-2xl'>Bet: {localBalance}</p>}
                        </div>

                        <div className="flex-grow text-center">
                            <SlotCounter
                            key={winner} // Assuming 'winner' is a state that changes, triggering re-render
                            value={slotValues}
                            duration={0.5}
                            startValue={'?'}
                            charClassName='text-4xl'
                            sequentialAnimationMode={true}
                            startValueOnce={true}
                            />
                            <div className="inline-block align-middle ml-2"> {/* Wrap arrows in an inline-block for center alignment */}
                                {choice === "smaller" && <FaArrowAltCircleDown size={40} color='red'/>}
                                {choice === "bigger" && <FaArrowAltCircleUp size={40} color='green'/>}
                                </div>
                            </div>

                            <div className="flex-initial">
                                {/* This is a placeholder for right alignment, keeping the balance text on the far left and slot/arrows centered */}
                                {/* You can place something else here or keep it empty for alignment purposes */}
                            </div>
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
                                    <Input placeholder="shadcn" type='number' {...field} />
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
                    {!reset && <Button disabled={!amount || disableRollButton} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent  hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {getRandomWinner(); console.log("pressed winner: ", winner);}}>
                        ROLL
                    </Button>}
                    {reset && <Button disabled={!amount} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent  hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {resetTheGame();}}>
                        RESET
                    </Button>}
                </div>
            </div>
        </div>
    );
};

export default BiggerOrSmaller;