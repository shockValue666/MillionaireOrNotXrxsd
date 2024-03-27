"use client";
import React, { useRef, useState } from 'react'
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import SlotCounter from 'react-slot-counter';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BiggerOrSmallerSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { Auth } from '../auth/auth';
import { Button } from '../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { addGamble, getAndSetBalance } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import { useToast } from '../ui/use-toast';
import { useAppState } from '@/lib/providers/state-provider';

const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘", "😗", "😙", "😚", "😋", "😛", "😜", "😝", "🤑", "🤗", "🤓", "😎", "🤡", "🤠", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "😤", "😠", "😡", "😶", "😐", "😑", "😯", "😦", "😧", "😮", "😲", "😵", "😳", "😱", "😨", "😰", "😢", "😥", "🤤", "😭", "😓", "😪", "😴", "🙄", "🤔", "🤥", "😬", "🤐", "🤢", "🤧", "😷", "🤒", "🤕", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "👾", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"];




const EmojiSlots = () => {
    const [winner, setWinner] = useState<string>("50000");
    const [disabled,setDisabled] = useState<boolean>(false);
    const [amount, setAmount] = useState<string | null>(null);
    const [reset,setReset] = useState<boolean>(false);
    const {toast} = useToast();
    const {user} = useSupabaseUser();
    const {profile} = useAppState()


    const form = useForm<z.infer<typeof BiggerOrSmallerSchema>>({
        mode:"onSubmit",
        resolver:zodResolver(BiggerOrSmallerSchema),
        defaultValues:{amount:"1"}
    })

    const onSubmit:SubmitHandler<z.infer<typeof BiggerOrSmallerSchema>> = async (data) => {
        console.log("data: ", data);
        setAmount(data.amount);
    }

    const slotValues = winner.toString().split('').map(num => 
        <span key={num}
        >{num}</span>
    );


    const getRandomWinner = async () => {
        setDisabled(true);
        const drand = Array.from({ length: 5 }, () => Math.floor(Math.random() * 92));
        const emojisArray = drand.map(index => emojis[index]);
        const answer = emojisArray.join('');
        setWinner(answer);
        console.log("Generated emojis: ", answer);
        console.log("slot values: ",slotValues)
        // if(!user?.id || !amount || !choice) return;
        // const res = await addGamble({
        //     userId:user?.id,
        //     amount:amount,
        //     choice:choice,
        //     winner:drand.toString(),
        //     id:v4(),
        //     createdAt:new Date().toISOString(),
        //     status: drand>50000 && choice === "bigger" || drand<50000 && choice === "smaller"
        // });
        // console.log("res: ",res)
        // await new Promise(resolve=>setTimeout(resolve, 525));
        // if(drand>50000 && choice === "bigger" || drand<50000 && choice === "smaller"){
        //     toast({title:"You won!", description:"You guessed right"});
        //     await getAndSetBalance({balance:"bet"},user?.id);
        // }else if(drand<50000 && choice === "bigger" || drand>50000 && choice === "smaller"){
        //     toast({title:"You Lost!", description:"You guessed wrong", variant:"destructive"})
        // }
        setReset(true);
    }

    const resetTheGame = () => {
        setReset(false);
        setAmount(null);
        setWinner("50000");
        setDisabled(false);
    }

  return (
    <div className='w-[90%] md:w-[50%] text-center'>
            {
                !user &&
                <div className='tracking-tight text-center text-hotPink bg-black hover:bg-accent hover:text-accent-foreground rounded-xl' onClick={()=>{console.log("kenta")}}>
                    <Auth>LOG IN TO PLAY</Auth>
                </div>
            }
            <div className={`flex flex-col justify-center align-center border w-[100%] border-white rounded-lg gap-4 p-4 ${!profile ? 'blur-sm' : ""}`}>
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
                            dummyCharacters={emojis}
                        />

                    </div>
                    {/*  */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-8 flex items-center">
                            <FormField
                            disabled = {disabled}
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
                            <Button disabled={disabled} type="submit">set</Button>
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
        </div>
  )
}

export default EmojiSlots