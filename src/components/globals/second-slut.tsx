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
import { createDoubleSlut, getAndSetBalance, getDoubleEmojiSlotById, getProfile,  updateDoubleSlut } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import AmountNotificationNew from './amount-notification';
import { Progress } from '../ui/progress';


const emojis = ["😈", "💀", "💩", "💰","🤑"];

const SecondSlut = () => {
    const {profile,doubleSlut,dispatch} = useAppState()

    const [createNewGameNew, setCreateNewGameNew] = useState(false)
    const [totalBetAmountNew, setTotalBetAmountNew] = useState<number | null>(null)
    const [currentBetAmountNew, setCurrentBetAmountNew] = useState<number | null>(null)
    const [totalSpinCountNew, setTotalSpinCountNew] = useState<number | null>(null)
    const [currentSpinCountNew, setCurrentSpinCountNew] = useState<number | null>(null)
    const [amountPerSpinNew, setAmountPerSpinNew] = useState<number | null>(null)
    const [currentEmojisNew, setCurrentEmojisNew] = useState<string[]>(['💰','💰','💰','💰','💰'])
    
    const [localBalanceNew, setLocalBalanceNew] = useState<string | null>("0")

    const [rollButtonVisibilityNew, setRollButtonVisibilityNew] = useState(false)
    const [resetButtonVisibilityNew, setResetButtonVisibilityNew] = useState(false)
    const [setButtonVisibilityNew, setSetButtonVisibilityNew] = useState(false)
    const [newGameInTheSameSessionNew, setNewGameInTheSameSessionNew] = useState(false)
    const [disabledRollButtonNew,setDisabledRollButtonNew] = useState(false)
    const [disableInputsNew, setDisableInputsNew] = useState(false)
    const [amountWonOrLostStateNew, setAmountWonOrLostStateNew] = useState<number | null>(null)
    const [resetRewardsButtonVisibilityNew, setResetRewardsButtonVisibilityNew] = useState(true)
    const [airdropButtonVisibilityNew, setAirdropButtonVisibilityNew] = useState(true)
    const [autoSpinButtonVisibilityNew, setAutoSpinButtonVisibilityNew] = useState(true)

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
        if(!profile || !data.amount || !data.spinz || data.amount==="0" || data.spinz==="9"){
            console.log("no profile or data amount or data spinz");
            toast({title:"Error",description:"Please fill all fields",variant:"destructive"})
            return;
        }
        setTotalBetAmountNew(parseInt(data.amount));
        setTotalSpinCountNew(parseInt(data.spinz));
        setAmountPerSpinNew(parseInt(data.amount)/parseInt(data.spinz));

        const res = await createDoubleSlut({
            id:v4(),
            amount:parseFloat(data.amount),
            spinz:parseInt(data.spinz),
            createdAt:new Date().toISOString(),
            profileId:profile?.id,
            currentAmount:parseFloat(data.amount),
            currentSpin:0,
            currentEmojisNew:['💰','💰','💰','💰','💰'].toString(),
            payPerSpin:parseFloat(data.amount)/parseInt(data.spinz),
            entryAmount:parseFloat(data.amount),
            pnl:0,
            points:0
            })
        if(res.data){
            // setSavedEmojiSlot(true);
            // toast({title:"Success",description:"Slot created successfully"})
            console.log("created emoji slot: ",res.data[0])
            console.log("red.data[0]: ",res.data[0])
            dispatch({type:"SET_DOUBLE_SLUT",payload:res.data[0]})
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
            setLocalBalanceNew(res.data[0].entryAmount.toString()) //here
            // setRollButtonVisibilityNew(true)
            setCreateNewGameNew(false);
        }else{
            toast({title:"Error",description:"Slot creation failed",variant:"destructive"})
        }
    }

    //get winning emojis
    const getWinnerNew = async () => {
        // setDisabled(true);
        const drand = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5));
        const winnerEmojis = drand.map(index => emojis[index])
        setCurrentEmojisNew(winnerEmojis)
        // if(emojisArray === undefined || emojisArray===null) return;
        return winnerEmojis;
    }

    const getAmountWonOrLostNew = async (winnerEmojis:string[]) => {
        if(!amountPerSpinNew) return;
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
            return amountPerSpinNew*10;
            // return amountPerSpinNew*0.5;
        }else if (uniqueEmojis === 2) {
            if(Object.values(emojiCount).includes(3) && Object.values(emojiCount).includes(2)){
                return amountPerSpinNew*5;
                // return amountPerSpinNew*0.5;
            }
            if(Object.values(emojiCount).includes(4)){
                return amountPerSpinNew*2
                // return amountPerSpinNew*0.5;
            }
        }else if (uniqueEmojis === 3) {
            if(Object.values(emojiCount).includes(3)){
                return amountPerSpinNew;
                // return amountPerSpinNew*0.5;
            }
            if(Object.values(emojiCount).includes(2)){
                return amountPerSpinNew;
                // return amountPerSpinNew*0.5;
            }
        }else if (uniqueEmojis === 4) {
            return amountPerSpinNew*0;
            // return amountPerSpinNew*0.5;
        }else if (uniqueEmojis === 5) {
            return 0;
            // return amountPerSpinNew*0.5;
        }
        console.log("emoji count: ",emojiCount)
        return 1;
    }

    //handle spin
    const handleSpinNew = async () => {
        console.log("spin")
        setDisabledRollButtonNew(true)
        if(currentSpinCountNew===null || totalSpinCountNew===null || !doubleSlut || !amountPerSpinNew || !localBalanceNew) {
            console.log("currentSpincountNew or totalspincountNew or emojistateformappstate doesn't exist");
            console.log("currentSpinCountNew: ",currentSpinCountNew)
            console.log("totalSpinCountNew: ",totalSpinCountNew)
            console.log("doubleSlut: ",doubleSlut)
            toast({
                title:"something is missing",
                description:"we will see",
                variant:"destructive"
            })
            return;
        };
        setLocalBalanceNew((parseFloat(localBalanceNew)-amountPerSpinNew).toString())
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("localBalanceNew: ",localBalanceNew, " amountPerSpinNew: ",amountPerSpinNew, "parceFloat(localBalanceNew)-amountPerSpinNew: ",(parseFloat(localBalanceNew)-amountPerSpinNew))
        setCurrentSpinCountNew(currentSpinCountNew+1)
        if(currentSpinCountNew < totalSpinCountNew){
            setNewGameInTheSameSessionNew(true)
            const winnerEmojis = await getWinnerNew()
            const amountWonOrLost = await getAmountWonOrLostNew(winnerEmojis)
            if(amountWonOrLost === undefined) return;
            //alright i think the problem is with the amountWonOrLost when it's 0
            console.log("amountWonOrLost from hadnel spin in order to check if the notification works with 0: ",amountWonOrLost)

            setAmountWonOrLostStateNew(amountWonOrLost)
            setTimeout(()=>{
                setAmountNotificationNew(true)
                console.log("inside the first", " amountWonOrLostState: ",amountWonOrLostStateNew)
                    setTimeout(()=>{
                        console.log("inside the second", " amountWonOrLostStateNew: ",amountWonOrLostStateNew)
                        setAmountNotificationNew(false)
                        setAmountWonOrLostStateNew(null) // here 4:20AM
                    },1000)
                },1000)
            // setAmountNotificationNew(true)
            const newCurAmount = parseFloat(localBalanceNew)-amountPerSpinNew+amountWonOrLost;
            if(!totalBetAmountNew) return;
            dispatch({
                type:"UPDATE_DOUBLE_SLUT",
                payload:{
                    ...doubleSlut, 
                    currentSpin:currentSpinCountNew+1,
                    currentEmojisNew:winnerEmojis.toString(),
                    currentAmount:parseFloat(localBalanceNew)-amountPerSpinNew+amountWonOrLost,
                    pnl:totalBetAmountNew-newCurAmount
                }
            })
            const {data,error} = await updateDoubleSlut({id:doubleSlut.id,currentSpin:currentSpinCountNew+1,currentEmojisNew:winnerEmojis.toString(),currentAmount:(parseFloat(localBalanceNew)-amountPerSpinNew+amountWonOrLost),pnl:totalBetAmountNew-newCurAmount});
            if(error){
                toast({title:"Error",description:"Failed to update slot",variant:"destructive"})
                console.log("error updating slot: ",error)
            }
            if(data){
                console.log("successfully updated the database: ",data)
                // let userBalance = profile?.balance;
                // if(userBalance && amountPerSpinNew && profile?.id){
                //     const {data:profileData,error:profileError} = await getAndSetBalance({balance:(parseFloat(userBalance)+amountWonOrLost).toString()},profile?.id);
                //     if(profileError){
                //         toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
                //         console.log("error updating balance: ",profileError)
                //     }
                //     if([profileData]){
                //         // console.log("successfully updated the balance: ",profileData)
                //         console.log("amount won or lost plus the balance: ",(parseFloat(userBalance)+(amountPerSpinNew+amountWonOrLost)), " amountWonOrLost: ",amountWonOrLost)
                //         dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(userBalance)+amountWonOrLost).toString()}})    
                //     }
                // }
                setDisabledRollButtonNew(false)
                // setAmountWonOrLostStateNew(null)
                // setAmountNotificationNew(false)

                console.log("localBalanceNew: ",localBalanceNew, "amountWonOrLost: ",amountWonOrLost, "amountPerSpinNew: ",amountPerSpinNew, "parseFloat(localBalanceNew)+amountWonOrLost-amountPerSpinNew: ",(parseFloat(localBalanceNew)-amountPerSpinNew+amountWonOrLost))

                setLocalBalanceNew((parseFloat(localBalanceNew)-amountPerSpinNew+amountWonOrLost).toString())

                // await new Promise(resolve => setTimeout(resolve, 2500));
                setAmountNotificationNew(false)
                // setAmountWonOrLostStateNew(null)
                //?
                // setAmountWonOrLostStateNew(amountWonOrLost)
                console.log("amount notification is supposed to be set")
            }

            // if(!data || )
        }else{
            console.log("game finished double slut")
            setResetButtonVisibilityNew(true)
            setRollButtonVisibilityNew(false)
            // setReset(true)
        }
    }
    //handle autospin
    const autoSpinNew = async () => {
        if(!totalSpinCountNew || !currentSpinCountNew || !doubleSlut) return;
        const remainingSpins = totalSpinCountNew-currentSpinCountNew;
        console.log("autospin remaining lol", remainingSpins)
        setDisabledRollButtonNew(true)
        setAutoSpinButtonVisibilityNew(false)

        const asyncProcess = async (i:number,curBal:string,lcLocal:string) => {
            let currentBalance = curBal;
            const remSpins = i;
            // console.log("remSpins: ",remSpins)
            const curSpi = totalSpinCountNew - remSpins + 1;
            // console.log("curSpi: ",curSpi)
            console.log("lc local: ",lcLocal)
            if(curSpi===null || totalSpinCountNew===null || !doubleSlut) {
                console.log("currentSpincountNew or totalspincountNew or emojistateformappstate doesn't exist");
                console.log("currentSpinCountNew: ",curSpi)
                console.log("totalSpinCountNew: ",totalSpinCountNew)
                console.log("doubleSlut: ",doubleSlut)
                return;
            };
            if(!localBalanceNew || !amountPerSpinNew) return;

            console.log("localBalanceNew: ",localBalanceNew, " amountPerSpinNew: ",amountPerSpinNew, "parceFloat(localBalanceNew)-amountPerSpinNew: ",(parseFloat(localBalanceNew)-amountPerSpinNew))
            // setLocalBalanceNew(lc=>{
            //     if(!lc) return "0";
            //     console.log("lc: ",lc)
            //     return (parseFloat(lc)-amountPerSpinNew).toString()
            // })
            setLocalBalanceNew(lc=>(parseFloat(lcLocal)-amountPerSpinNew).toString())
            console.log("new localbalanceNew: ",localBalanceNew)
            await new Promise(resolve => setTimeout(resolve, 500));

            setCurrentSpinCountNew(currentSpinCountNew=>{
                return curSpi;
            })  
            // console.log("here 3, currentSpin: ",curSpi, " totalSpin: ",totalSpinCountNew, "updatedCount: ")

            if(currentSpinCountNew < totalSpinCountNew){
                setNewGameInTheSameSessionNew(true)
                const winnerEmojis = await getWinnerNew()
                // console.log("winnerEmojis: ",winnerEmojis)
                const amountWonOrLost = await getAmountWonOrLostNew(winnerEmojis)
                // console.log("amountWonOrLost: ",amountWonOrLost)
                if(amountWonOrLost === undefined) {console.log("amountWinorLost undefined");return;};
                setAmountWonOrLostStateNew(amountWonOrLost)
                setAmountNotificationNew(true)
                dispatch({
                    type:"UPDATE_DOUBLE_SLUT",
                    payload:{
                        ...doubleSlut, 
                        currentSpin:curSpi,
                        currentEmojisNew:winnerEmojis.toString(),
                        currentAmount:parseFloat(lcLocal)-amountPerSpinNew+amountWonOrLost
                    }
                })
                const {data,error} = await updateDoubleSlut({id:doubleSlut.id,currentSpin:curSpi,currentEmojisNew:winnerEmojis.toString(),currentAmount:(parseFloat(lcLocal)-amountPerSpinNew+amountWonOrLost)});
                if(error){
                    toast({title:"Error",description:"Failed to update slot",variant:"destructive"})
                    console.log("error updating slot: ",error)
                    return;
                }
                if(data){
                    // console.log("here 4 ")
                    // console.log("successfully updated the database: ",data)

                    // console.log("curBal: ",currentBalance)
                    if(currentBalance && amountPerSpinNew && profile?.id){
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
                    setDisabledRollButtonNew(false)
                    setAmountWonOrLostStateNew(null)
                    setAmountNotificationNew(false)
                    // setAmountNotificationNew(true)
                    console.log("here 6 6 6 ")
                    console.log("localBalanceNew: ",lcLocal, "amountWonOrLost: ",amountWonOrLost, "amountPerSpinNew: ",amountPerSpinNew, "parseFloat(lcLocal)+amountWonOrLost-amountPerSpinNew: ",(parseFloat(lcLocal)-amountPerSpinNew+amountWonOrLost), " ||||||    parseFloat(localBalanceNew) + amountWonOrLost", parseFloat(lcLocal)+amountWonOrLost)
                    setLocalBalanceNew((parseFloat(lcLocal)-amountPerSpinNew+amountWonOrLost).toString())
                    return;
                }
    
                // if(!data || )
            }else{
                console.log("game finished double slut")
                setResetButtonVisibilityNew(true)
                setRollButtonVisibilityNew(false)
                // setReset(true)
                return;
            }
        }
        //spin twice 
        for (let i = 0; i < remainingSpins; i++) {
            // console.log("here: lol lol oll")
            if(!profile || !profile.balance || !doubleSlut) return;
            const curProf = await getProfile(profile.id);
            const curEmojiSlot = await getDoubleEmojiSlotById(doubleSlut.id);
            if(curProf.data){
                await asyncProcess(remainingSpins-i, curProf.data.balance || "", curEmojiSlot.data?.currentAmount.toString() || "0");
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        //alternative approach
        // const executeSequentially = async (n:number) => {
        // if (n <= 0) {
        //         // Base case: all iterations completed
        //         setAutoSpinButtonVisibilityNew(true);
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
        setAutoSpinButtonVisibilityNew(true)
        setRollButtonVisibilityNew(true)
    }
    
    //reset 
    const resetTheGameNew = async () => {
        setResetButtonVisibilityNew(false)
        setDisableInputsNew(false)
        const finishedGame = doubleSlut;
        if(!profile || !profile?.balance || !finishedGame) {
            console.log("profile or localbalanceNew don't exist")
            return;
        }
        console.log("doubleSlut?.currentAmount: ",finishedGame?.currentAmount, "parseFloat(profile?.balance): ",parseFloat(profile?.balance), "(doubleSlut?.currentAmount+parseFloat(profile?.balance)).toString(): ",(doubleSlut?.currentAmount+parseFloat(profile?.balance)).toString())
        const {data,error} = await getAndSetBalance({balance:(finishedGame?.currentAmount+parseFloat(profile?.balance)).toString()},profile?.id || "")
        if(error || !data || !data[0] || !data[0].balance){
            console.log("error at updating the balance at reseting, ",error)
            return;
        }
        dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile?.balance)+finishedGame?.currentAmount).toString()}})
        dispatch({type:"UPDATE_DOUBLE_SLUT",payload:{...finishedGame, currentAmount:0}})
        const {data:updateDoubleSlutData,error:updateDoubleSlutError} = await updateDoubleSlut({id:finishedGame.id,currentAmount:0})
        if(updateDoubleSlutError || !updateDoubleSlutData){
            console.log("error at updating the emoji slot at reseting, ",updateDoubleSlutError)
            return;
        }
        setLocalBalanceNew("0");
        setCurrentSpinCountNew(0);
        console.log("reset")
        dispatch({
            type:"DELETE_DOUBLE_SLUT",
            payload:null
        })
    }
    //handle half balance
    const handleHalfBalance = async () => {

        if(!profile || !profile?.balance || profile.balance==="0"){
            console.log("no profile");
            toast({title:"Error",description:"your balance is 0",variant:"destructive"})
            return;
        }
        setTotalBetAmountNew(parseFloat(profile?.balance)/2);
        setTotalSpinCountNew(10);
        setAmountPerSpinNew(parseFloat(profile?.balance)/(2*10));

        const res = await createDoubleSlut({
            id:v4(),
            amount:parseFloat(profile?.balance)/2,
            spinz:10,
            createdAt:new Date().toISOString(),
            profileId:profile?.id,
            currentAmount:parseFloat(profile?.balance)/2,
            currentSpin:0,
            currentEmojisNew:['💰','💰','💰','💰','💰'].toString(),
            payPerSpin:parseFloat(profile?.balance)/(2*10),
            entryAmount:parseFloat(profile?.balance)/2,
            pnl:0,
            points:0
            })
        if(res.data){
            // setSavedEmojiSlot(true);
            // toast({title:"Success",description:"Slot created successfully"})
            console.log("created emoji slot: ",res.data[0])
            console.log("red.data[0]: ",res.data[0])
            dispatch({type:"SET_DOUBLE_SLUT",payload:res.data[0]})
            if(profile?.balance){
                const {data:profileData,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)-(parseFloat(profile?.balance)/2)).toString()},profile.id);
                if(error){
                    toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
                    console.log("error updating balance: ",error)
                }
                if(profileData){
                    console.log("successfully updated the balance: ",profileData)
                    dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)-(parseFloat(profile?.balance)/2)).toString()}})
                }
            }
            setLocalBalanceNew(res.data[0].entryAmount.toString()) //here
            // setRollButtonVisibilityNewer(true)
            setCreateNewGameNew(false);
        }else{
            toast({title:"Error",description:"Slot creation failed",variant:"destructive"})
        }

    }

    //renew the balance
    const reNewTheBalanceNew = async () => {
        setResetRewardsButtonVisibilityNew(false)
        if(!profile) return;
        const {data,error} = await getAndSetBalance({balance:"0"},profile.id);
        dispatch({type:"UPDATE_USER",payload:{...profile, balance:"0"}})
        setResetRewardsButtonVisibilityNew(true)
    }
    //airdrop amount
    const airdropAmountNew = async () => {
        setAirdropButtonVisibilityNew(false)
        if(!profile || !profile.balance) return;
        const {data,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)+1000).toString()},profile.id);
        dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)+1000).toString()}})
        setAirdropButtonVisibilityNew(true)
    }
    //check if there is a saved Emoji slot game and either set it to the saved game or a new game
    useEffect(()=>{
        // console.log("doubleSlut: ",doubleSlut)
        if(doubleSlut &&  doubleSlut.spinz > doubleSlut.currentSpin){
            console.log("emoji slot exists and the game hasn't been finished: ", doubleSlut)
            setSetButtonVisibilityNew(false)
            setResetButtonVisibilityNew(false)
            setTotalBetAmountNew(parseInt(doubleSlut.entryAmount.toString()));
            setTotalSpinCountNew(parseInt(doubleSlut.spinz.toString()));
            setAmountPerSpinNew(parseInt(doubleSlut.amount.toString())/parseInt(doubleSlut.spinz.toString()));
            setCurrentEmojisNew(doubleSlut.currentEmojisNew.split(","));
            setCurrentBetAmountNew(parseInt(doubleSlut.currentAmount.toString()));
            setCurrentSpinCountNew(parseInt(doubleSlut.currentSpin.toString()));
            setRollButtonVisibilityNew(true)
            setDisableInputsNew(true)
            setLocalBalanceNew(doubleSlut.currentAmount.toString())
            // setLocalBalanceNew(doubleSlut.currentAmount.toString())
            // setAmount(doubleSlut.amount);
            // setSpinz(doubleSlut.spinz);
            // const emAr = doubleSlut.currentEmojisNew.split(",");
            // console.log("will set the emojis because the game of slot hasn't been finished: ",emAr)
            // setEmojisArray(emAr);
            // setReset(false)
            // setSavedEmojiSlot(true)
            // setCurrentSpinCountNew(doubleSlut.currentSpin)
            // setDisabled(true);
        }
        else if (doubleSlut && doubleSlut.spinz === doubleSlut.currentSpin && newGameInTheSameSessionNew) {
            console.log("new game in the same session")
            setResetButtonVisibilityNew(true)
            setRollButtonVisibilityNew(false)
            setDisableInputsNew(false)

        }
        else if (doubleSlut && 
                doubleSlut.spinz === doubleSlut.currentSpin) {
            console.log("game finished double slut double sluts")
            // setResetButtonVisibilityNew(true)
            setRollButtonVisibilityNew(false)
            setSetButtonVisibilityNew(true)
            setDisableInputsNew(false)
            //make the currentAmount 0
            const updateBalanceFromInsideUseEffect = async () => {
                if(!profile?.id){
                    console.log("no profile id")
                    return;
                }
                const {data:profileDataFromProfile, error:profileErrorFromProfile} = await getProfile(profile?.id)
                if(!profileDataFromProfile || profileErrorFromProfile || profileDataFromProfile.balance===null){
                    console.log("error no user found or balance not found");
                    return;
                }
                console.log("2 sluts profile?.balance || 0", profileDataFromProfile.balance || "0", "doubleSlut.currentAmount: ",doubleSlut.currentAmount)
                const {data:updateBalanceData, error:updateBalanceError} = await getAndSetBalance({balance:(parseFloat(profileDataFromProfile.balance)+doubleSlut.currentAmount).toString()},profile?.id || "")
                if(!updateBalanceData || updateBalanceError || !profile?.balance || !updateBalanceData[0].balance){
                    console.log("error updating balance: ",updateBalanceError)
                    return;
                }
                console.log("update balance data from inside the second slut: ",updateBalanceData)
                dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(updateBalanceData[0].balance)).toString()}})

                const {data:updateDoubleSlutData,error:updateDoubleSlutError} = await updateDoubleSlut({id:doubleSlut.id,currentAmount:0})
                if(updateDoubleSlutError || !updateDoubleSlutData){
                    console.log("error updating the emoji slot: ",updateDoubleSlutError)
                    return;
                }
                dispatch({type:"UPDATE_DOUBLE_SLUT",payload:{...doubleSlut, currentAmount:0}})
                setLocalBalanceNew("0")

            }
            if(doubleSlut.currentAmount>0){
                updateBalanceFromInsideUseEffect();
            }

        }
        else if(!doubleSlut){
            console.log("will set the default emoji values because the last game has been finished")
            setSetButtonVisibilityNew(true)
            // setResetButtonVisibilityNew(true)
            setRollButtonVisibilityNew(false)
            setDisableInputsNew(false)
            // setDisabled(false)
            // setReset(true)
        }
    },[doubleSlut])

    //space pressed
    // useEffect(() => {
    //     const handleKeyPress = (event: KeyboardEvent) => {
    //         if (event.key === ' ') { // Check if the pressed key is space
    //             event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
    //             if(totalSpinCountNew && currentSpinCountNew && totalSpinCountNew>currentSpinCountNew){
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
    // }, [doubleSlut,totalSpinCountNew,currentSpinCountNew]); // Empty dependency array to run this effect only once

    
  return (
    <div className='w-[90%] md:w-[50%] text-center'>
        {amountNotificationNew  && amountWonOrLostStateNew && <AmountNotificationNew visible={amountNotificationNew} message={amountWonOrLostStateNew.toString()}/>}
        {amountWonOrLostStateNew===0 && amountNotificationNew && <AmountNotificationNew visible={amountNotificationNew} message={amountWonOrLostStateNew.toString()}/>}
        {/* {amountNotificationNew && <p className='font-lg border border-yellow-500'>here it is: {amountNotificationNew} {amountWonOrLostStateNew}</p>} */}
        {amountNotificationNew &&  <div>cocksycker</div>}

        {currentSpinCountNew && totalSpinCountNew && (<div className='py-4 '>
            <Progress value={(currentSpinCountNew/totalSpinCountNew)*100} className='bg-[#3d4552]'/>
        </div>)}
            {/* {
                !user &&
                <div className='tracking-tight text-center text-hotPink bg-black hover:bg-accent hover:text-accent-foreground rounded-xl' onClick={()=>{console.log("kenta")}}>
                    <Auth>LOG IN TO PLAY</Auth>
                </div>
            } */}
            <div className={`flex flex-col justify-center align-center border w-[100%] border-white rounded-lg gap-4 p-4 ${!profile ? 'blur-sm' : ""}`}>
                <div className='flex justify-center items-center'>
                    <p className='w-full text-center'>SLEM</p>
                    <div>{localBalanceNew && <p>{localBalanceNew}</p>}</div>
                </div>
                <div className='w-full flex flex-col items-center gap-y-6'> 
                    <div className='flex items-center gap-x-4 border border-white'>
                        <div className=''>
                            {amountPerSpinNew && <div className="text-left">APS: {amountPerSpinNew?.toFixed(3)}</div>}
                        </div>
                        <SlotCounter
                            startValue={currentEmojisNew}
                            startValueOnce={true}
                            value={currentEmojisNew}
                            charClassName='text-4xl'
                            animateUnchanged
                            autoAnimationStart={false}
                            dummyCharacters={emojis}
                            duration={0.5}
                            
                        />
                         {currentSpinCountNew && totalSpinCountNew && (
                            <div className="text-right">spinz: {currentSpinCountNew}/{totalSpinCountNew}</div>
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
                                    <CustomInputForEmojiSlots disabled={disableInputsNew}  type='number' {...field} />
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
                                    <CustomInputForEmojiSlots disabled={disableInputsNew} type='number' {...field} />
                            </FormControl>
                                <FormDescription>
                                    How many spinz you want
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button 
                            disabled={!setButtonVisibilityNew} 
                            type="submit"
                            >set</Button>
                        </form>
                    </Form>
                    {/*  */}
                    {/* {!reset && <Button disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
                    onClick={() => {handleSpinNew();}}>
                        SPIN
                    </Button>} */}
                    <div className='grid grid-cols-2 lg:grid-cols-1 gap-4 items-center justify-items-center'>
                        <Button 
                        disabled={!setButtonVisibilityNew} 
                        //disabled={!rollButtonVisibilityNewer || disabledRollButtonNewer}
                        className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
                        onClick={() => {handleHalfBalance();}}>
                            <p className='hidden lg:block'>$1/2*BLNC  10SPINZ</p>
                            <p className='block lg:hidden' >1/2</p>
                        </Button>
                        
                        <Button 
                        // disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} 
                        disabled={!rollButtonVisibilityNew || disabledRollButtonNew}
                        className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
                        onClick={() => {handleSpinNew();}} onKeyDown={(e)=>{
                            // if(e.key===" "){
                            //     handleSpinNew();}
                            // }
                            console.log("key: ",e.key)
                            }}>
                            SPIN
                        </Button>
                        {/* {reset && <Button disabled={!amount} className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
                        onClick={() => {resetTheGameNew();}}>
                            RESET
                        </Button>} */}
                        <Button 
                        // disabled={!amount} 
                        disabled={!resetButtonVisibilityNew}
                        className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
                        onClick={() => {resetTheGameNew();}}>
                            RESET
                        </Button>

                        <Button 
                        // disabled={!amount} 
                        disabled={!resetRewardsButtonVisibilityNew}
                        className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
                        onClick={() => {reNewTheBalanceNew();}}>
                            <p className='hidden lg:block'>RENEW BALANCE</p>
                            <p className='block lg:hidden'>0</p>
                        </Button>
                        <Button 
                        // disabled={!amount} 
                        disabled={!airdropButtonVisibilityNew}
                        className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
                        onClick={() => {airdropAmountNew();}}>
                            <p className='hidden lg:block'>AIRDROP</p> 1000
                        </Button>

                        <Button 
                        // disabled={!amount} 
                        disabled={!autoSpinButtonVisibilityNew}
                        className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
                        onClick={() => {autoSpinNew();}}>
                            AUTOSPIN
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecondSlut;