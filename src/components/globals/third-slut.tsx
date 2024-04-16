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
import { createTripleSlut, getAndSetBalance, getTripleEmojiSlotById, getProfile,  updateTripleSlut } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import AmountNotificationNew from './amount-notification';


const emojis = ["😈", "💀", "💩", "💰","🤑"];

const ThirdSlut = () => {
    const {profile,tripleSlut,dispatch} = useAppState()

    const [createNewGameNewer, setCreateNewGameNewer] = useState(false)
    const [totalBetAmountNewer, setTotalBetAmountNewer] = useState<number | null>(null)
    const [currentBetAmountNewer, setCurrentBetAmountNewer] = useState<number | null>(null)
    const [totalSpinCountNewer, setTotalSpinCountNewer] = useState<number | null>(null)
    const [currentSpinCountNewer, setCurrentSpinCountNewer] = useState<number | null>(null)
    const [amountPerSpinNewer, setAmountPerSpinNewer] = useState<number | null>(null)
    const [currentEmojisNewer, setCurrentEmojisNewer] = useState<string[]>(['💰','💰','💰','💰','💰'])
    
    const [localBalanceNewer, setLocalBalanceNewer] = useState<string | null>("0")

    const [rollButtonVisibilityNewer, setRollButtonVisibilityNewer] = useState(false)
    const [resetButtonVisibilityNewer, setResetButtonVisibilityNewer] = useState(false)
    const [setButtonVisibilityNewer, setSetButtonVisibilityNewer] = useState(false)
    const [newGameInTheSameSessionNewer, setNewGameInTheSameSessionNewer] = useState(false)
    const [disabledRollButtonNewer,setDisabledRollButtonNewer] = useState(false)
    const [disableInputsNewer, setDisableInputsNewer] = useState(false)
    const [amountWonOrLostStateNewer, setAmountWonOrLostStateNewer] = useState<number | null>(null)
    const [resetRewardsButtonVisibilityNewer, setResetRewardsButtonVisibilityNewer] = useState(true)
    const [airdropButtonVisibilityNewer, setAirdropButtonVisibilityNewer] = useState(true)
    const [autoSpinButtonVisibilityNewer, setAutoSpinButtonVisibilityNewer] = useState(true)

    const {toast} = useToast();
    const [amountNotificationNew, setAmountNotificationNew] = useState<boolean>(false)

    const form = useForm<z.infer<typeof EmojiSlotSchema>>({
        mode:"onSubmit",
        resolver:zodResolver(EmojiSlotSchema),
        defaultValues:{amount:"1",spinz:"1"}
    })

    //initialize game
    const initializeGameNew:SubmitHandler<z.infer<typeof EmojiSlotSchema>> = async (data) => {
        console.log("data: ",data)
        if(!profile || !data.amount || !data.spinz){
            console.log("no profile or data amount or data spinz");
            toast({title:"Error",description:"Please fill all fields",variant:"destructive"})
            return;
        }
        setTotalBetAmountNewer(parseInt(data.amount));
        setTotalSpinCountNewer(parseInt(data.spinz));
        setAmountPerSpinNewer(parseInt(data.amount)/parseInt(data.spinz));

        const res = await createTripleSlut({
            id:v4(),
            amount:parseFloat(data.amount),
            spinz:parseInt(data.spinz),
            createdAt:new Date().toISOString(),
            profileId:profile?.id,
            currentAmount:parseFloat(data.amount),
            currentSpin:0,
            currentEmojisNewer:['💰','💰','💰','💰','💰'].toString(),
            payPerSpin:parseFloat(data.amount)/parseInt(data.spinz),
            entryAmount:parseFloat(data.amount),
            pnl:0
            })
        if(res.data){
            // setSavedEmojiSlot(true);
            // toast({title:"Success",description:"Slot created successfully"})
            console.log("created emoji slot: ",res.data[0])
            console.log("red.data[0]: ",res.data[0])
            dispatch({type:"SET_TRIPLE_SLUT",payload:res.data[0]})
            if(profile?.balance){
                const {data:profileData,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)-parseFloat(data.amount)).toString()},profile.id);
                if(error){
                    toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
                    console.log("error updating balance: ",error)
                }
                if(profileData){
                    console.log("successfully updated the balance: ",data)
                    dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)-parseFloat(data.amount)).toString()}})
                }
            }
            setLocalBalanceNewer(res.data[0].entryAmount.toString()) //here
            // setRollButtonVisibilityNewer(true)
            setCreateNewGameNewer(false);
        }else{
            toast({title:"Error",description:"Slot creation failed",variant:"destructive"})
        }
    }

    //get winning emojis
    const getWinnerNew = async () => {
        // setDisabled(true);
        const drand = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5));
        const winnerEmojis = drand.map(index => emojis[index])
        setCurrentEmojisNewer(winnerEmojis)
        // if(emojisArray === undefined || emojisArray===null) return;
        return winnerEmojis;
    }

    const getAmountWonOrLostNew = async (winnerEmojis:string[]) => {
        if(!amountPerSpinNewer) return;
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
            return amountPerSpinNewer*10;
            // return amountPerSpinNewer*0.5;
        }else if (uniqueEmojis === 2) {
            if(Object.values(emojiCount).includes(3) && Object.values(emojiCount).includes(2)){
                return amountPerSpinNewer*5;
                // return amountPerSpinNewer*0.5;
            }
            if(Object.values(emojiCount).includes(4)){
                return amountPerSpinNewer*2
                // return amountPerSpinNewer*0.5;
            }
        }else if (uniqueEmojis === 3) {
            if(Object.values(emojiCount).includes(3)){
                return amountPerSpinNewer;
                // return amountPerSpinNewer*0.5;
            }
            if(Object.values(emojiCount).includes(2)){
                return amountPerSpinNewer;
                // return amountPerSpinNewer*0.5;
            }
        }else if (uniqueEmojis === 4) {
            return amountPerSpinNewer*0;
            // return amountPerSpinNewer*0.5;
        }else if (uniqueEmojis === 5) {
            return 0;
            // return amountPerSpinNewer*0.5;
        }
        console.log("emoji count: ",emojiCount)
        return 1;
    }

    //handle spin
    const handleSpinNew = async () => {
        console.log("spin")
        setDisabledRollButtonNewer(true)
        if(currentSpinCountNewer===null || totalSpinCountNewer===null || !tripleSlut || !amountPerSpinNewer || !localBalanceNewer) {
            console.log("currentSpincountNewer or totalspincountNewer or emojistateformappstate doesn't exist");
            console.log("currentSpinCountNewer: ",currentSpinCountNewer)
            console.log("totalSpinCountNewer: ",totalSpinCountNewer)
            console.log("tripleSlut: ",tripleSlut)
            return;
        };
        setLocalBalanceNewer((parseFloat(localBalanceNewer)-amountPerSpinNewer).toString())
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("localBalanceNewer: ",localBalanceNewer, " amountPerSpinNewer: ",amountPerSpinNewer, "parceFloat(localBalanceNewer)-amountPerSpinNewer: ",(parseFloat(localBalanceNewer)-amountPerSpinNewer))
        setCurrentSpinCountNewer(currentSpinCountNewer+1)
        if(currentSpinCountNewer < totalSpinCountNewer){
            setNewGameInTheSameSessionNewer(true)
            const winnerEmojis = await getWinnerNew()
            const amountWonOrLost = await getAmountWonOrLostNew(winnerEmojis)
            if(amountWonOrLost === undefined) return;
            //alright i think the problem is with the amountWonOrLost when it's 0
            console.log("amountWonOrLost from hadnel spin in order to check if the notification works with 0: ",amountWonOrLost)
            setAmountWonOrLostStateNewer(amountWonOrLost)
            setAmountNotificationNew(true)
            const newCurAmount = parseFloat(localBalanceNewer)-amountPerSpinNewer+amountWonOrLost;
            if(!totalBetAmountNewer) return;
            dispatch({
                type:"UPDATE_TRIPLE_SLUT",
                payload:{
                    ...tripleSlut, 
                    currentSpin:currentSpinCountNewer+1,
                    currentEmojisNewer:winnerEmojis.toString(),
                    currentAmount:parseFloat(localBalanceNewer)-amountPerSpinNewer+amountWonOrLost,
                    pnl:totalBetAmountNewer-newCurAmount
                }
            })
            const {data,error} = await updateTripleSlut({id:tripleSlut.id,currentSpin:currentSpinCountNewer+1,currentEmojisNewer:winnerEmojis.toString(),currentAmount:(parseFloat(localBalanceNewer)-amountPerSpinNewer+amountWonOrLost),pnl:totalBetAmountNewer-newCurAmount});
            if(error){
                toast({title:"Error",description:"Failed to update slot",variant:"destructive"})
                console.log("error updating slot: ",error)
            }
            if(data){
                console.log("successfully updated the database: ",data)
                // let userBalance = profile?.balance;
                // if(userBalance && amountPerSpinNewer && profile?.id){
                //     const {data:profileData,error:profileError} = await getAndSetBalance({balance:(parseFloat(userBalance)+amountWonOrLost).toString()},profile?.id);
                //     if(profileError){
                //         toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
                //         console.log("error updating balance: ",profileError)
                //     }
                //     if([profileData]){
                //         // console.log("successfully updated the balance: ",profileData)
                //         console.log("amount won or lost plus the balance: ",(parseFloat(userBalance)+(amountPerSpinNewer+amountWonOrLost)), " amountWonOrLost: ",amountWonOrLost)
                //         dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(userBalance)+amountWonOrLost).toString()}})    
                //     }
                // }
                setDisabledRollButtonNewer(false)
                // setAmountWonOrLostStateNewer(null)
                // setAmountNotificationNew(false)

                console.log("localBalanceNewer: ",localBalanceNewer, "amountWonOrLost: ",amountWonOrLost, "amountPerSpinNewer: ",amountPerSpinNewer, "parseFloat(localBalanceNewer)+amountWonOrLost-amountPerSpinNewer: ",(parseFloat(localBalanceNewer)-amountPerSpinNewer+amountWonOrLost))

                setLocalBalanceNewer((parseFloat(localBalanceNewer)-amountPerSpinNewer+amountWonOrLost).toString())

                // await new Promise(resolve => setTimeout(resolve, 2500));
                setAmountNotificationNew(false)
                setAmountWonOrLostStateNewer(null)
                //?
                // setAmountWonOrLostStateNewer(amountWonOrLost)
                console.log("amount notification is supposed to be set")
            }

            // if(!data || )
        }else{
            console.log("game finished third slut triple slut") 
            setResetButtonVisibilityNewer(true)
            setRollButtonVisibilityNewer(false)
            // setReset(true)
        }
    }
    //handle autospin
    const autoSpinNew = async () => {
        if(!totalSpinCountNewer || !currentSpinCountNewer || !tripleSlut) return;
        const remainingSpins = totalSpinCountNewer-currentSpinCountNewer;
        console.log("autospin remaining lol", remainingSpins)
        setDisabledRollButtonNewer(true)
        setAutoSpinButtonVisibilityNewer(false)

        const asyncProcess = async (i:number,curBal:string,lcLocal:string) => {
            let currentBalance = curBal;
            const remSpins = i;
            // console.log("remSpins: ",remSpins)
            const curSpi = totalSpinCountNewer - remSpins + 1;
            // console.log("curSpi: ",curSpi)
            console.log("lc local: ",lcLocal)
            if(curSpi===null || totalSpinCountNewer===null || !tripleSlut) {
                console.log("currentSpincountNewer or totalspincountNewer or emojistateformappstate doesn't exist");
                console.log("currentSpinCountNewer: ",curSpi)
                console.log("totalSpinCountNewer: ",totalSpinCountNewer)
                console.log("tripleSlut: ",tripleSlut)
                return;
            };
            if(!localBalanceNewer || !amountPerSpinNewer) return;

            console.log("localBalanceNewer: ",localBalanceNewer, " amountPerSpinNewer: ",amountPerSpinNewer, "parceFloat(localBalanceNewer)-amountPerSpinNewer: ",(parseFloat(localBalanceNewer)-amountPerSpinNewer))
            // setLocalBalanceNewer(lc=>{
            //     if(!lc) return "0";
            //     console.log("lc: ",lc)
            //     return (parseFloat(lc)-amountPerSpinNewer).toString()
            // })
            setLocalBalanceNewer(lc=>(parseFloat(lcLocal)-amountPerSpinNewer).toString())
            console.log("new localbalanceNewer: ",localBalanceNewer)
            await new Promise(resolve => setTimeout(resolve, 500));

            setCurrentSpinCountNewer(currentSpinCountNewer=>{
                return curSpi;
            })  
            // console.log("here 3, currentSpin: ",curSpi, " totalSpin: ",totalSpinCountNewer, "updatedCount: ")

            if(currentSpinCountNewer < totalSpinCountNewer){
                setNewGameInTheSameSessionNewer(true)
                const winnerEmojis = await getWinnerNew()
                // console.log("winnerEmojis: ",winnerEmojis)
                const amountWonOrLost = await getAmountWonOrLostNew(winnerEmojis)
                // console.log("amountWonOrLost: ",amountWonOrLost)
                if(amountWonOrLost === undefined) {console.log("amountWinorLost undefined");return;};
                setAmountWonOrLostStateNewer(amountWonOrLost)
                setAmountNotificationNew(true)
                dispatch({
                    type:"UPDATE_TRIPLE_SLUT",
                    payload:{
                        ...tripleSlut, 
                        currentSpin:curSpi,
                        currentEmojisNewer:winnerEmojis.toString(),
                        currentAmount:parseFloat(lcLocal)-amountPerSpinNewer+amountWonOrLost
                    }
                })
                const {data,error} = await updateTripleSlut({id:tripleSlut.id,currentSpin:curSpi,currentEmojisNewer:winnerEmojis.toString(),currentAmount:(parseFloat(lcLocal)-amountPerSpinNewer+amountWonOrLost)});
                if(error){
                    toast({title:"Error",description:"Failed to update slot",variant:"destructive"})
                    console.log("error updating slot: ",error)
                    return;
                }
                if(data){
                    // console.log("here 4 ")
                    // console.log("successfully updated the database: ",data)

                    // console.log("curBal: ",currentBalance)
                    if(currentBalance && amountPerSpinNewer && profile?.id){
                        // console.log("here c5")
                        // const {data:profileData,error:profileError} = await getAndSetBalance({balance:(parseFloat(currentBalance)+amountWonOrLost).toString()},profile?.id);
                        // if(profileError){
                        //     toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
                        //     console.log("error updating balance: ",profileError)
                        // }
                        
                        // if([profileData]){
                        //     // console.log("successfully updated the balance: ",profileData)
                        //     // console.log("amount won or lost plus the balance: ",(parseFloat(userBalance)+amountWonOrLost), " amountWonOrLost: ",amountWonOrLost)
                        //     // console.log("balance ", currentBalance, " + amountWonOrLost: ",amountWonOrLost, " = ", (parseFloat(currentBalance)+amountWonOrLost))
                        //     //the problem is that the userBalance is not updated 
                        //     //how can i solve it? 
                        //     dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(currentBalance)+amountWonOrLost).toString()}})    
                        // }
                    }
                    setDisabledRollButtonNewer(false)
                    setAmountWonOrLostStateNewer(null)
                    setAmountNotificationNew(false)
                    // setAmountNotificationNew(true)
                    console.log("here 6 6 6 ")
                    console.log("localBalanceNewer: ",lcLocal, "amountWonOrLost: ",amountWonOrLost, "amountPerSpinNewer: ",amountPerSpinNewer, "parseFloat(lcLocal)+amountWonOrLost-amountPerSpinNewer: ",(parseFloat(lcLocal)-amountPerSpinNewer+amountWonOrLost), " ||||||    parseFloat(localBalanceNewer) + amountWonOrLost", parseFloat(lcLocal)+amountWonOrLost)
                    setLocalBalanceNewer((parseFloat(lcLocal)-amountPerSpinNewer+amountWonOrLost).toString())
                    return;
                }
    
                // if(!data || )
            }else{
                console.log("game finished third slut")
                setResetButtonVisibilityNewer(true)
                setRollButtonVisibilityNewer(false)
                // setReset(true)
                return;
            }
        }
        //spin twice 
        for (let i = 0; i < remainingSpins; i++) {
            // console.log("here: lol lol oll")
            if(!profile || !profile.balance || !tripleSlut) return;
            const curProf = await getProfile(profile.id);
            const curEmojiSlot = await getTripleEmojiSlotById(tripleSlut.id);
            if(curProf.data){
                await asyncProcess(remainingSpins-i, curProf.data.balance || "", curEmojiSlot.data?.currentAmount.toString() || "0");
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        //alternative approach
        // const executeSequentially = async (n:number) => {
        // if (n <= 0) {
        //         // Base case: all iterations completed
        //         setAutoSpinButtonVisibilityNewer(true);
        //         return;
        //     }

        //     // Execute asyncProcess and wait for it to complete
        //     await asyncProcess();

        //     // Wait for 1 second before starting the next iteration
        //     await new Promise(resolve => setTimeout(resolve, 1000));

        //     // Call executeSequentially recursively with n-1
        //     await executeSequentially(n - 1);
        // };
        // await executeSequentially(3);
        setAutoSpinButtonVisibilityNewer(true)
        setRollButtonVisibilityNewer(true)
    }
    
    //reset 
    const resetTheGameNew = async () => {
        setResetButtonVisibilityNewer(false)
        setDisableInputsNewer(false)
        const finishedGame = tripleSlut;
        if(!profile || !profile?.balance || !finishedGame) {
            console.log("profile or localbalanceNewer don't exist")
            return;
        }
        console.log("tripleSlut?.currentAmount: ",finishedGame?.currentAmount, "parseFloat(profile?.balance): ",parseFloat(profile?.balance), "(tripleSlut?.currentAmount+parseFloat(profile?.balance)).toString(): ",(tripleSlut?.currentAmount+parseFloat(profile?.balance)).toString())
        const {data,error} = await getAndSetBalance({balance:(finishedGame?.currentAmount+parseFloat(profile?.balance)).toString()},profile?.id || "")
        if(error || !data || !data[0] || !data[0].balance){
            console.log("error at updating the balance at reseting, ",error)
            return;
        }
        dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile?.balance)+finishedGame?.currentAmount).toString()}})
        dispatch({type:"UPDATE_TRIPLE_SLUT",payload:{...finishedGame, currentAmount:0}})
        const {data:updateTripleSlutData,error:updateTripleSlutError} = await updateTripleSlut({id:finishedGame.id,currentAmount:0})
        if(updateTripleSlutError || !updateTripleSlutData){
            console.log("error at updating the emoji slot at reseting, ",updateTripleSlutError)
            return;
        }
        setLocalBalanceNewer("0")

        console.log("reset")
        dispatch({
            type:"DELETE_TRIPLE_SLUT",
            payload:null
        })
    }

    //renew the balance
    const reNewTheBalanceNew = async () => {
        setResetRewardsButtonVisibilityNewer(false)
        if(!profile) return;
        const {data,error} = await getAndSetBalance({balance:"0"},profile.id);
        dispatch({type:"UPDATE_USER",payload:{...profile, balance:"0"}})
        setResetRewardsButtonVisibilityNewer(true)
    }
    //airdrop amount
    const airdropAmountNew = async () => {
        setAirdropButtonVisibilityNewer(false)
        if(!profile || !profile.balance) return;
        const {data,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)+1000).toString()},profile.id);
        dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)+1000).toString()}})
        setAirdropButtonVisibilityNewer(true)
    }
    //check if there is a saved Emoji slot game and either set it to the saved game or a new game
    useEffect(()=>{
        // console.log("tripleSlut: ",tripleSlut)
        if(tripleSlut &&  tripleSlut.spinz > tripleSlut.currentSpin){
            console.log("emoji slot exists and the game hasn't been finished: ", tripleSlut)
            setSetButtonVisibilityNewer(false)
            setResetButtonVisibilityNewer(false)
            setTotalBetAmountNewer(parseInt(tripleSlut.entryAmount.toString()));
            setTotalSpinCountNewer(parseInt(tripleSlut.spinz.toString()));
            setAmountPerSpinNewer(parseInt(tripleSlut.amount.toString())/parseInt(tripleSlut.spinz.toString()));
            setCurrentEmojisNewer(tripleSlut.currentEmojisNewer.split(","));
            setCurrentBetAmountNewer(parseInt(tripleSlut.currentAmount.toString()));
            setCurrentSpinCountNewer(parseInt(tripleSlut.currentSpin.toString()));
            setRollButtonVisibilityNewer(true)
            setDisableInputsNewer(true)
            setLocalBalanceNewer(tripleSlut.currentAmount.toString())
            // setLocalBalanceNewer(tripleSlut.currentAmount.toString())
            // setAmount(tripleSlut.amount);
            // setSpinz(tripleSlut.spinz);
            // const emAr = tripleSlut.currentEmojisNewer.split(",");
            // console.log("will set the emojis because the game of slot hasn't been finished: ",emAr)
            // setEmojisArray(emAr);
            // setReset(false)
            // setSavedEmojiSlot(true)
            // setCurrentSpinCountNewer(tripleSlut.currentSpin)
            // setDisabled(true);
        }
        else if (tripleSlut && tripleSlut.spinz === tripleSlut.currentSpin && newGameInTheSameSessionNewer) {
            console.log("new game in the same session")
            setResetButtonVisibilityNewer(true)
            setRollButtonVisibilityNewer(false)
            setDisableInputsNewer(false)

        }
        else if (tripleSlut && 
                tripleSlut.spinz === tripleSlut.currentSpin) {
            console.log("game finished third slut")
            // setResetButtonVisibilityNewer(true)
            setRollButtonVisibilityNewer(false)
            setSetButtonVisibilityNewer(true)
            setDisableInputsNewer(false)
            //make the currentAmount 0
            const updateBalanceFromInsideUseEffect = async () => {
                const {data:updateBalanceData, error:updateBalanceError} = await getAndSetBalance({balance:(parseFloat(profile?.balance || "0")+tripleSlut.currentAmount).toString()},profile?.id || "")
                if(!updateBalanceData || updateBalanceError || !profile?.balance){
                    console.log("error updating balance: ",updateBalanceError)
                    return;
                }
                dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)+tripleSlut.currentAmount).toString()}})

                const {data:updateTripleSlutData,error:updateTripleSlutError} = await updateTripleSlut({id:tripleSlut.id,currentAmount:0})
                if(updateTripleSlutError || !updateTripleSlutData){
                    console.log("error updating the emoji slot: ",updateTripleSlutError)
                    return;
                }
                dispatch({type:"UPDATE_TRIPLE_SLUT",payload:{...tripleSlut, currentAmount:0}})
                setLocalBalanceNewer("0")

            }
            if(tripleSlut.currentAmount>0){
                updateBalanceFromInsideUseEffect();
            }

        }
        else if(!tripleSlut){
            console.log("will set the default emoji values because the last game has been finished")
            setSetButtonVisibilityNewer(true)
            // setResetButtonVisibilityNewer(true)
            setRollButtonVisibilityNewer(false)
            setDisableInputsNewer(false)
            // setDisabled(false)
            // setReset(true)
        }
    },[tripleSlut])

    //space pressed
    // useEffect(() => {
    //     const handleKeyPress = (event: KeyboardEvent) => {
    //         if (event.key === ' ') { // Check if the pressed key is space
    //             event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
    //             if(totalSpinCountNewer && currentSpinCountNewer && totalSpinCountNewer>currentSpinCountNewer){
    //                 handleSpinNew(); // Call handleSpinNew function
    //             }
    //         }
    //     };

    //     // Add event listener for keydown event
    //     document.addEventListener('keydown', handleKeyPress);

    //     // Clean up event listener when component unmounts
    //     return () => {
    //         document.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, [tripleSlut,totalSpinCountNewer,currentSpinCountNewer]); // Empty dependency array to run this effect only once

    
  return (
    <div className='w-[90%] md:w-[50%] text-center'>
        {amountNotificationNew  && amountWonOrLostStateNewer && <AmountNotificationNew visible={amountNotificationNew} message={amountWonOrLostStateNewer.toString()}/>}
        {amountWonOrLostStateNewer===0 && amountNotificationNew && <AmountNotificationNew visible={amountNotificationNew} message={amountWonOrLostStateNewer.toString()}/>}
        {/* {amountNotificationNew && <p className='font-lg border border-yellow-500'>here it is: {amountNotificationNew} {amountWonOrLostStateNewer}</p>} */}
        {amountNotificationNew &&  <div>cocksycker</div>}
            {/* {
                !user &&
                <div className='tracking-tight text-center text-hotPink bg-black hover:bg-accent hover:text-accent-foreground rounded-xl' onClick={()=>{console.log("kenta")}}>
                    <Auth>LOG IN TO PLAY</Auth>
                </div>
            } */}
            <div className={`flex flex-col justify-center align-center border w-[100%] border-white rounded-lg gap-4 p-4 ${!profile ? 'blur-sm' : ""}`}>
                <div className='flex justify-center items-center'>
                    <p className='w-full text-center'>SLEM</p>
                    <div>{localBalanceNewer && <p>{localBalanceNewer}</p>}</div>
                </div>
                <div className='w-full flex flex-col items-center gap-y-6'> 
                    <div className='flex items-center gap-x-4 border border-white'>
                        <div className=''>
                            {amountPerSpinNewer && <div className="text-left">APS: {amountPerSpinNewer?.toFixed(3)}</div>}
                        </div>
                        <SlotCounter
                            startValue={currentEmojisNewer}
                            startValueOnce={true}
                            value={currentEmojisNewer}
                            charClassName='text-4xl'
                            animateUnchanged
                            autoAnimationStart={false}
                            dummyCharacters={emojis}
                            duration={0.5}
                            
                        />
                         {currentSpinCountNewer && totalSpinCountNewer && (
                            <div className="text-right">spinz: {currentSpinCountNewer}/{totalSpinCountNewer}</div>
                        )}
                    </div>
                    {/*  */}
                    <Form {...form}>
                        <form onSubmit={
                            form.handleSubmit(initializeGameNew)
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
                                    <CustomInputForEmojiSlots disabled={disableInputsNewer}  type='number' {...field} />
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
                                    <CustomInputForEmojiSlots disabled={disableInputsNewer} type='number' {...field} />
                            </FormControl>
                                <FormDescription>
                                    How many spinz you want
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button 
                            disabled={!setButtonVisibilityNewer} 
                            type="submit"
                            >set</Button>
                        </form>
                    </Form>
                    {/*  */}
                    {/* {!reset && <Button disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {handleSpinNew();}}>
                        SPIN
                    </Button>} */}
                    
                    <Button 
                    // disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} 
                    disabled={!rollButtonVisibilityNewer || disabledRollButtonNewer}
                    className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {handleSpinNew();}} onKeyDown={(e)=>{
                        // if(e.key===" "){
                        //     handleSpinNew();}
                        // }
                        console.log("key: ",e.key)
                        }}>
                        SPIN
                    </Button>
                    {/* {reset && <Button disabled={!amount} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {resetTheGameNew();}}>
                        RESET
                    </Button>} */}
                        <Button 
                        // disabled={!amount} 
                        disabled={!resetButtonVisibilityNewer}
                        className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                        onClick={() => {resetTheGameNew();}}>
                            RESET
                        </Button>

                        <Button 
                        // disabled={!amount} 
                        disabled={!resetRewardsButtonVisibilityNewer}
                        className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                        onClick={() => {reNewTheBalanceNew();}}>
                            RENEW BALANCE
                        </Button>
                        <Button 
                        // disabled={!amount} 
                        disabled={!airdropButtonVisibilityNewer}
                        className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                        onClick={() => {airdropAmountNew();}}>
                            AIRDROP 1000
                        </Button>

                        <Button 
                        // disabled={!amount} 
                        disabled={!autoSpinButtonVisibilityNewer}
                        className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                        onClick={() => {autoSpinNew();}}>
                            AUTOSPIN
                        </Button>
                </div>
            </div>
        </div>
    )
}

export default ThirdSlut;