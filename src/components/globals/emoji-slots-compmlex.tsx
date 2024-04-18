"use client";
import React, { useEffect, useRef, useState } from 'react'
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import SlotCounter from 'react-slot-counter';
import { SubmitHandler, useForm } from 'react-hook-form';
import { set, z } from 'zod';
import { EmojiSlotSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { Auth } from '../auth/auth';
import { Button } from '../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { addGamble, createEmojiSlot, getAndSetBalance, updateEmojiSlot } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import { useToast } from '../ui/use-toast';
import { useAppState } from '@/lib/providers/state-provider';
import { CustomInputForEmojiSlots } from '../ui/custom-input-for-emoji-slots';

const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘", "😗", "😙", "😚", "😋", "😛", "😜", "😝", "🤑", "🤗", "🤓", "😎", "🤡", "🤠", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "😤", "😠", "😡", "😶", "😐", "😑", "😯", "😦", "😧", "😮", "😲", "😵", "😳", "😱", "😨", "😰", "😢", "😥", "🤤", "😭", "😓", "😪", "😴", "🙄", "🤔", "🤥", "😬", "🤐", "🤢", "🤧", "😷", "🤒", "🤕", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "👾", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"];


// crete custom slots
// just create an emoju input and let people choose the emojis they want to use
// they will also be able to choose the number of slots they want to use
// it will also be in copy-pasteable format so they can use it in their own projects
//actually it may be more beneficial for us to HOST their emoji slots and share with them a percentage of the earnings

//fetch the emojis from the database and use them in the slots
// create the states


const EmojiSlotsComplex = () => {
    const [disabled,setDisabled] = useState<boolean>(false);
    
    const [amount, setAmount] = useState<number | null>(null);
    const [spinz, setSpinz] = useState<number | null>(null);
    const [currentAmountCount,setCurrentAmountCount] = useState<number>(0);
    const [currentspinCount,setCurrentSpinCount] = useState<number>(0);
    const [spinButtonCooldown,setSpinButtonCooldown] = useState<boolean>(false);

    //amount we will increase or reduce from balance after rolling the slot
    const [amountToChange, setAmountToChange] = useState<number | null>(null);
    
    const [reset,setReset] = useState<boolean>(false);
    const [savedEmojiSlot, setSavedEmojiSlot] = useState<boolean>(false);
    
    const {toast} = useToast();
    const {user} = useSupabaseUser();
    
    const {profile,emojiSlot:emojiSlotFromAppState,dispatch} = useAppState()
    const [emojisArray, setEmojisArray] = useState<string[]>(["😀", "😃", "😄", "😁", "😆"]);

    const [currentEmojiSlot,setCurrentEmojiSlot] = useState<z.infer<typeof EmojiSlotSchema> | null>(null);


    const form = useForm<z.infer<typeof EmojiSlotSchema>>({
        mode:"onSubmit",
        resolver:zodResolver(EmojiSlotSchema),
        defaultValues:{amount:"1",spinz:"1"}
    })

    //create new EmojiSlot if there is no previous unfinished game
    const setAmountAndSpinz:SubmitHandler<z.infer<typeof EmojiSlotSchema>> = async (data) => {
        console.log("reached here!")
        if(!profile || !data.amount || !data.spinz){
            console.log("no profile or data amount or data spinz");
            toast({title:"Error",description:"Please fill all fields",variant:"destructive"})
            return;
        }
        console.log("data: ", data);
        setAmount(parseInt(data.amount));
        setSpinz(parseInt(data.spinz))
        setAmountToChange(parseInt(data.amount)/parseInt(data.spinz))
        const res = await createEmojiSlot({
            id: v4(),
            amount: parseFloat(data.amount),
            spinz: parseInt(data.spinz),
            createdAt: new Date().toISOString(),
            profileId: profile?.id,
            currentAmount: 0,
            currentSpin: 0,
            currentEmojis: emojisArray.toString(),
            payPerSpin: parseFloat(data.amount)/parseInt(data.spinz),
            entryAmount: parseFloat(data.amount), // Add the missing entryAmount property
            pnl:0,
            points:0
        });
        if(res.data){
            setSavedEmojiSlot(true);
            // toast({title:"Success",description:"Slot created successfully"})
            dispatch({type:"SET_EMOJI_SLOT",payload:res.data[0]})
        }else{
            toast({title:"Error",description:"Slot creation failed",variant:"destructive"})
        }
    }


    const getRandomWinner = async () => {
        setDisabled(true);
        const drand = Array.from({ length: 5 }, () => Math.floor(Math.random() * 92));
        const winnerEmojis = drand.map(index => emojis[index])
        setEmojisArray(winnerEmojis)
        if(emojisArray === undefined || emojisArray===null) return;
        return winnerEmojis;
        // console.log("slot values: ",slotValues)
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
        // setReset(true);
    }

    const handleSpin = async () => {
        if(!spinz) return;
        if(currentspinCount<spinz){
            setSpinButtonCooldown(true)
            if(!amount || !spinz) return;
            setAmountToChange(amount/spinz)
            console.log("works!!!", amountToChange)
            setCurrentSpinCount(currentspinCount+1);
            const currentEmojis = await getRandomWinner();
            if(!emojiSlotFromAppState || !currentEmojis) {
                console.log("emojiSlotFromAppState doesn't exist");
                return;
            };
            const {data,error} = await updateEmojiSlot({id:emojiSlotFromAppState.id,currentSpin:currentspinCount+1,currentEmojis:currentEmojis.toString()});
            if(error){
                console.log("error at updating the emoji slot: ",error)
            }
            dispatch({type:"UPDATE_EMOJI_SLOT",payload:{...emojiSlotFromAppState,currentSpin:currentspinCount+1,currentEmojis:currentEmojis.toString()}})
            if(!amount ||  !profile?.id || !amountToChange) {
                console.log(" no amount or prfoileId or amountToChange");
                console.log("amount: ",amount, " profileId: ",profile?.id, " amountToChange: ",amountToChange)
                return;
            };
            const {data:profileData,error:profileError} = await getAndSetBalance({balance:(amount-(amount/spinz)).toString()},profile?.id);
            if(profileError){
                console.log("error at updating the balance: ",profileError)
            }
            if(profileError){
                console.log("error at updating the balance: ",profileError)
            }
            dispatch({type: "UPDATE_USER",payload:{...profile, balance:(amount-(amount/spinz)).toString()}})
            if(data){
                console.log("updated the emoji slot")
                setSpinButtonCooldown(false);
            }else{
                console.log("error at updating the emoji slot: ",error)
            }
            // setTimeout(() => {
            //     getRandomWinner();
            // }, 500);
        }else{
            console.log("spin count bigger than spinz or equal to spinz")
            setReset(true);
            return;
        }
    }

    const resetTheGame = () => {
        setCurrentSpinCount(0);
        setReset(false);
        setAmount(null);
        // setWinner(["50000"]);
        setDisabled(false);
    }

    //set initial state
    useEffect(()=>{
        console.log("emojiSlotFromAppState: ",emojiSlotFromAppState)
        if(emojiSlotFromAppState && emojiSlotFromAppState.amount > emojiSlotFromAppState.currentAmount && emojiSlotFromAppState.spinz > emojiSlotFromAppState.currentSpin){
            setAmount(emojiSlotFromAppState.amount);
            setSpinz(emojiSlotFromAppState.spinz);
            const emAr = emojiSlotFromAppState.currentEmojis.split(",");
            console.log("will set the emojis because the game of slot hasn't been finished: ",emAr)
            setEmojisArray(emAr);
            setReset(false)
            setSavedEmojiSlot(true)
            setCurrentSpinCount(emojiSlotFromAppState.currentSpin)
            setDisabled(true);
        }else{
            console.log("will set the default emoji values because the last game has bee finished")
            setDisabled(false)
            setReset(true)
        }
    },[emojiSlotFromAppState])

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
                    <div className='flex items-center gap-x-4 border border-white'>
                        <div>
                            {/* amount: {currentAmountCount} */}
                            amount: {amount}
                        </div>
                        <SlotCounter
                            startValue={emojisArray}
                            startValueOnce={true}
                            value={emojisArray}
                            charClassName='text-4xl'
                            animateUnchanged
                            autoAnimationStart={false}
                            dummyCharacters={emojis}
                        />
                        {
                            spinz && 
                            (<div>
                                remaining spinz: {spinz - currentspinCount}
                            </div>)
                        }
                    </div>
                    {/*  */}
                    <Form {...form}>
                        <form onSubmit={
                            form.handleSubmit(setAmountAndSpinz)
                            // (e)=>{
                            //     e.preventDefault();
                            //     console.log("here");
                            //     form.handleSubmit(onSubmit)
                            // }
                        } className="space-x-8 flex items-center">
                            <FormField
                            disabled = {disabled}
                            control={form.control}
                            name="amount"
                            render={({ field }) =>  (
                                <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <CustomInputForEmojiSlots  type='number' {...field} />
                                </FormControl>
                                <FormDescription>
                                    Bet amount in $$$
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            disabled = {disabled}
                            control={form.control}
                            name="spinz"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>spinz</FormLabel>
                                <FormControl>
                                    <CustomInputForEmojiSlots type='number' {...field} />
                            </FormControl>
                                <FormDescription>
                                    How many spinz you want
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button disabled={disabled} type="submit">set</Button>
                        </form>
                    </Form>
                    {/*  */}
                    {!reset && <Button disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {handleSpin();}}>
                        SPIN
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

export default EmojiSlotsComplex