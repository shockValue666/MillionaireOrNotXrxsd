"use client";
import { useAppState } from '@/lib/providers/state-provider';
import SlotCounter from 'react-slot-counter';
import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { set, z } from 'zod';
import { EmojiSlotSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInputForEmojiSlots } from '../ui/custom-input-for-emoji-slots';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { createEmojiSlot, getAndSetBalance, updateEmojiSlot } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import AmountNotification from './amount-notification';


const emojis = ["😈", "💀", "💩", "💰","🤑"];

const EmojiSlots = () => {
    const {profile,emojiSlot:emojiSlotFromAppState,dispatch} = useAppState()

    const [createNewGame, setCreateNewGame] = useState(false)
    const [totalBetAmount, setTotalBetAmount] = useState<number | null>(null)
    const [currentBetAmount, setCurrentBetAmount] = useState<number | null>(null)
    const [totalSpinCount, setTotalSpinCount] = useState<number | null>(null)
    const [currentSpinCount, setCurrentSpinCount] = useState<number | null>(null)
    const [amountPerSpin, setAmountPerSpin] = useState<number | null>(null)
    const [currentEmojis, setCurrentEmojis] = useState<string[]>(['💰','💰','💰','💰','💰'])

    const [rollButtonVisibility, setRollButtonVisibility] = useState(false)
    const [resetButtonVisibility, setResetButtonVisibility] = useState(false)
    const [setButtonVisibility, setSetButtonVisibility] = useState(false)
    const [newGameInTheSameSession, setNewGameInTheSameSession] = useState(false)
    const [disabledRollButton,setDisabledRollButton] = useState(false)
    const [disableInputs, setDisableInputs] = useState(false)
    const [amountWonOrLostState, setAmountWonOrLostState] = useState<number | null>(null)

    const {toast} = useToast();
    const [amountNotification, setAmountNotification] = useState<boolean>(false)

    const form = useForm<z.infer<typeof EmojiSlotSchema>>({
        mode:"onSubmit",
        resolver:zodResolver(EmojiSlotSchema),
        defaultValues:{amount:"1",spinz:"1"}
    })

    //initialize game
    const initializeGame:SubmitHandler<z.infer<typeof EmojiSlotSchema>> = async (data) => {
        console.log("data: ",data)
        if(!profile || !data.amount || !data.spinz){
            console.log("no profile or data amount or data spinz");
            toast({title:"Error",description:"Please fill all fields",variant:"destructive"})
            return;
        }
        setTotalBetAmount(parseInt(data.amount));
        setTotalSpinCount(parseInt(data.spinz));
        setAmountPerSpin(parseInt(data.amount)/parseInt(data.spinz));

        const res = await createEmojiSlot({
            id:v4(),
            amount:parseFloat(data.amount),
            spinz:parseInt(data.spinz),
            createdAt:new Date().toISOString(),
            profileId:profile?.id,
            currentAmount:0,
            currentSpin:0,
            currentEmojis:['💰','💰','💰','💰','💰'].toString(),
            payPerSpin:parseFloat(data.amount)/parseInt(data.spinz),
            entryAmount:parseFloat(data.amount)
            })
        if(res.data){
            // setSavedEmojiSlot(true);
            // toast({title:"Success",description:"Slot created successfully"})
            console.log("created emoji slot: ",res.data[0])
            dispatch({type:"SET_EMOJI_SLOT",payload:res.data[0]})
            setCreateNewGame(false);
        }else{
            toast({title:"Error",description:"Slot creation failed",variant:"destructive"})
        }
    }

    //get winning emojis
    const getWinner = async () => {
        // setDisabled(true);
        const drand = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5));
        const winnerEmojis = drand.map(index => emojis[index])
        setCurrentEmojis(winnerEmojis)
        // if(emojisArray === undefined || emojisArray===null) return;
        return winnerEmojis;
    }

    const getAmountWonOrLost = async (winnerEmojis:string[]) => {
        if(!amountPerSpin) return;
        const emojiCount:any = {}
        winnerEmojis.forEach(emoji=>{
            if(emojiCount[emoji]){
                emojiCount[emoji]++
            }else{
                emojiCount[emoji] = 1
            }
        })

        const uniqueEmojis = Object.keys(emojiCount).length;
        console.log("emoji count: ",emojiCount)
        if(uniqueEmojis === 1){
            return amountPerSpin*5;
        }else if (uniqueEmojis === 2) {
            if(Object.values(emojiCount).includes(3) && Object.values(emojiCount).includes(2)){
                return amountPerSpin*1.5;
            }
            if(Object.values(emojiCount).includes(4)){
                return amountPerSpin*1.2
            }
        }else if (uniqueEmojis === 3) {
            if(Object.values(emojiCount).includes(3)){
                return amountPerSpin*1.15;
            }
            if(Object.values(emojiCount).includes(2)){
                return amountPerSpin*0.888;
            }
        }else if (uniqueEmojis === 4) {
            return -amountPerSpin*0.5;
        }else if (uniqueEmojis === 5) {
            return -amountPerSpin;
        }
        console.log("emoji count: ",emojiCount)
        return 1;
    }

    //handle spin
    const handleSpin = async () => {
        console.log("spin")
        setDisabledRollButton(true)

        if(currentSpinCount===null || totalSpinCount===null || !emojiSlotFromAppState) {
            console.log("currentSpincount or totalspincount or emojistateformappstate doesn't exist");
            console.log("currentSpinCount: ",currentSpinCount)
            console.log("totalSpinCount: ",totalSpinCount)
            console.log("emojiSlotFromAppState: ",emojiSlotFromAppState)
            return;
        };
        setCurrentSpinCount(currentSpinCount+1)
        if(currentSpinCount < totalSpinCount){
            setNewGameInTheSameSession(true)
            const winnerEmojis = await getWinner()
            const amountWonOrLost = await getAmountWonOrLost(winnerEmojis)
            if(amountWonOrLost === undefined) return;
            setAmountWonOrLostState(amountWonOrLost)
            setAmountNotification(true)
            dispatch({
                type:"UPDATE_EMOJI_SLOT",
                payload:{
                    ...emojiSlotFromAppState, 
                    currentSpin:currentSpinCount+1,
                    currentEmojis:winnerEmojis.toString(),

                }
            })
            const {data,error} = await updateEmojiSlot({id:emojiSlotFromAppState.id,currentSpin:currentSpinCount+1,currentEmojis:winnerEmojis.toString()});
            if(error){
                toast({title:"Error",description:"Failed to update slot",variant:"destructive"})
                console.log("error updating slot: ",error)
            }
            if(data){
                console.log("successfully updated the database: ",data)
                let userBalance = profile?.balance;
                if(userBalance && amountPerSpin && profile?.id){
                    const {data:profileData,error:profileError} = await getAndSetBalance({balance:(parseFloat(userBalance)+(amountPerSpin+amountWonOrLost)).toString()},profile?.id);
                    if(profileError){
                        toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
                        console.log("error updating balance: ",profileError)
                    }
                    if([profileData]){
                        // console.log("successfully updated the balance: ",profileData)
                        console.log("amount won or lost plus the balance: ",(parseFloat(userBalance)+(amountPerSpin+amountWonOrLost)), " amountWonOrLost: ",amountWonOrLost)
                        dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(userBalance)+amountWonOrLost).toString()}})    
                    }
                }
                setDisabledRollButton(false)
                setAmountWonOrLostState(null)
                setAmountNotification(false)
            }

            // if(!data || )
        }else{
            console.log("game finished")
            setResetButtonVisibility(true)
            setRollButtonVisibility(false)
            // setReset(true)
        }
    }
    
    //reset 
    const resetTheGame = async () => {
        setResetButtonVisibility(false)
        setDisableInputs(false)
        console.log("reset")
        dispatch({
            type:"DELETE_EMOJI_SLOT",
            payload:null
        })
    }
    //check if there is a saved Emoji slot game and either set it to the saved game or a new game
    useEffect(()=>{
        console.log("emojiSlotFromAppState: ",emojiSlotFromAppState)
        if(emojiSlotFromAppState && emojiSlotFromAppState.amount > emojiSlotFromAppState.currentAmount && emojiSlotFromAppState.spinz > emojiSlotFromAppState.currentSpin){
            console.log("emoji slot exists and the game hasn't been finished: ", emojiSlotFromAppState)
            setSetButtonVisibility(false)
            setResetButtonVisibility(false)
            setTotalBetAmount(parseInt(emojiSlotFromAppState.amount.toString()));
            setTotalSpinCount(parseInt(emojiSlotFromAppState.spinz.toString()));
            setAmountPerSpin(parseInt(emojiSlotFromAppState.amount.toString())/parseInt(emojiSlotFromAppState.spinz.toString()));
            setCurrentEmojis(emojiSlotFromAppState.currentEmojis.split(","));
            setCurrentBetAmount(parseInt(emojiSlotFromAppState.currentAmount.toString()));
            setCurrentSpinCount(parseInt(emojiSlotFromAppState.currentSpin.toString()));
            setRollButtonVisibility(true)
            setDisableInputs(true)
            // setAmount(emojiSlotFromAppState.amount);
            // setSpinz(emojiSlotFromAppState.spinz);
            // const emAr = emojiSlotFromAppState.currentEmojis.split(",");
            // console.log("will set the emojis because the game of slot hasn't been finished: ",emAr)
            // setEmojisArray(emAr);
            // setReset(false)
            // setSavedEmojiSlot(true)
            // setCurrentSpinCount(emojiSlotFromAppState.currentSpin)
            // setDisabled(true);
        }
        else if (emojiSlotFromAppState && emojiSlotFromAppState.spinz === emojiSlotFromAppState.currentSpin && newGameInTheSameSession) {
            console.log("new game in the same session")
            setResetButtonVisibility(true)
            setRollButtonVisibility(false)
            setDisableInputs(false)

        }
        else if (emojiSlotFromAppState && 
                // emojiSlotFromAppState.amount === emojiSlotFromAppState.currentAmount && 
                emojiSlotFromAppState.spinz === emojiSlotFromAppState.currentSpin) {
            console.log("game finished")
            // setResetButtonVisibility(true)
            setRollButtonVisibility(false)
            setSetButtonVisibility(true)
            setDisableInputs(false)

        }
        else if(!emojiSlotFromAppState){
            console.log("will set the default emoji values because the last game has been finished")
            setSetButtonVisibility(true)
            // setResetButtonVisibility(true)
            setRollButtonVisibility(false)
            setDisableInputs(false)
            // setDisabled(false)
            // setReset(true)
        }
    },[emojiSlotFromAppState])

    //space pressed
    // useEffect(() => {
    //     const handleKeyPress = (event: KeyboardEvent) => {
    //         if (event.key === ' ') { // Check if the pressed key is space
    //             event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
    //             if(totalSpinCount && currentSpinCount && totalSpinCount>currentSpinCount){
    //                 handleSpin(); // Call handleSpin function
    //             }
    //         }
    //     };

    //     // Add event listener for keydown event
    //     document.addEventListener('keydown', handleKeyPress);

    //     // Clean up event listener when component unmounts
    //     return () => {
    //         document.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, [emojiSlotFromAppState,totalSpinCount,currentSpinCount]); // Empty dependency array to run this effect only once
  return (
    <div className='w-[90%] md:w-[50%] text-center'>
        {amountNotification && amountWonOrLostState && <AmountNotification message={amountWonOrLostState.toString()}/>}
            {/* {
                !user &&
                <div className='tracking-tight text-center text-hotPink bg-black hover:bg-accent hover:text-accent-foreground rounded-xl' onClick={()=>{console.log("kenta")}}>
                    <Auth>LOG IN TO PLAY</Auth>
                </div>
            } */}
            <div className={`flex flex-col justify-center align-center border w-[100%] border-white rounded-lg gap-4 p-4 ${!profile ? 'blur-sm' : ""}`}>
                <p className='w-full text-center'>bigger or smaller than</p>
                <div className='w-full flex flex-col items-center gap-y-6'> 
                    <div className='flex items-center gap-x-4 border border-white'>
                        <div>
                            {/* amount: {currentAmountCount} */}
                            {/* amount: {amount} */}
                            amount: {amountPerSpin?.toFixed(3)}
                        </div>
                        <SlotCounter
                            startValue={currentEmojis}
                            startValueOnce={true}
                            value={currentEmojis}
                            // value={[`💰`,'💰','💰','💰','💰']}
                            charClassName='text-4xl'
                            animateUnchanged
                            autoAnimationStart={false}
                            dummyCharacters={emojis}
                        />
                        {currentSpinCount && totalSpinCount && (<>spinz: {currentSpinCount}/{totalSpinCount}</>)}
                    </div>
                    {/*  */}
                    <Form {...form}>
                        <form onSubmit={
                            form.handleSubmit(initializeGame)
                            // (e)=>{
                            //     e.preventDefault();
                            //     console.log("here");
                            //     form.handleSubmit(onSubmit)
                            // }
                        } className="space-x-8 flex items-center">
                            <FormField
                            // disabled = {disabled}
                            control={form.control}
                            name="amount"
                            render={({ field }) =>  (
                                <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <CustomInputForEmojiSlots disabled={disableInputs}  type='number' {...field} />
                                </FormControl>
                                <FormDescription>
                                    Bet amount in $$$
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            // disabled = {disabled}
                            control={form.control}
                            name="spinz"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>spinz</FormLabel>
                                <FormControl>
                                    <CustomInputForEmojiSlots disabled={disableInputs} type='number' {...field} />
                            </FormControl>
                                <FormDescription>
                                    How many spinz you want
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button 
                            disabled={!setButtonVisibility} 
                            type="submit"
                            >set</Button>
                        </form>
                    </Form>
                    {/*  */}
                    {/* {!reset && <Button disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {handleSpin();}}>
                        SPIN
                    </Button>} */}
                    
                    <Button 
                    // disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} 
                    disabled={!rollButtonVisibility || disabledRollButton}
                    className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {handleSpin();}} onKeyDown={(e)=>{
                        // if(e.key===" "){
                        //     handleSpin();}
                        // }
                        console.log("key: ",e.key)
                        }}>
                        SPIN
                    </Button>
                    {/* {reset && <Button disabled={!amount} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {resetTheGame();}}>
                        RESET
                    </Button>} */}
                        <Button 
                        // disabled={!amount} 
                        disabled={!resetButtonVisibility}
                        className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                        onClick={() => {resetTheGame();}}>
                            RESET
                        </Button>
                </div>
            </div>
        </div>
    )
}

export default EmojiSlots