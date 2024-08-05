"use client";
import { useAppState } from '@/lib/providers/state-provider';
import SlotCounter from 'react-slot-counter';
import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { promise, set, z } from 'zod';
import { EmojiSlotSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInputForEmojiSlots } from '../ui/custom-input-for-emoji-slots';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { createEmojiSlot, getAndSetBalance, getAndSetPoints, getEmojiSlotById, getLatestSlots, getProfile, updateEmojiSlot, updateProfile } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import AmountNotification from './amount-notification';
import { Progress } from '../ui/progress';
import LocalStats from './local-stats';
import LocalBalanceAndPoints from './local-balance-and-points';
import ApsCurrentSpin from './aps-current-spin';
import JackPot from './jackpot';
import { cn } from '@/lib/utils';
import DevnetButtons from './devnetButtons';


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
    const [emojiCountLocal, setEmojiCountLocal] = useState<number>(0);
    
    const [localBalance, setLocalBalance] = useState<string | null>("0")
    const [localPoints, setLocalPoints] = useState<number | null>(0);
    const [autoRoll,setAutoRoll] = useState(false)

    const [rollButtonVisibility, setRollButtonVisibility] = useState(false)
    const [resetButtonVisibility, setResetButtonVisibility] = useState(false)
    const [setButtonVisibility, setSetButtonVisibility] = useState(false)
    const [newGameInTheSameSession, setNewGameInTheSameSession] = useState(false)
    const [disabledRollButton,setDisabledRollButton] = useState(false)
    const [disableInputs, setDisableInputs] = useState(false)
    const [amountWonOrLostState, setAmountWonOrLostState] = useState<number | null>(null)
    const [pointsWonOrLostState, setPointsWonOrLostState] = useState<number | null>(null)
    const [resetRewardsButtonVisibility, setResetRewardsButtonVisibility] = useState(true)
    const [airdropButtonVisibility, setAirdropButtonVisibility] = useState(true)
    const [autoSpinButtonVisibility, setAutoSpinButtonVisibility] = useState(true)

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
        if(!profile || !data.amount || !data.spinz || data.amount==="0" || data.spinz==="0"){
            console.log("no profile or data amount or data spinz");
            toast({title:"Error",description:"Please fill all fields",variant:"destructive"})
            return;
        }
        setTotalBetAmount(parseInt(data.amount));
        setTotalSpinCount(parseInt(data.spinz));
        setAmountPerSpin(parseInt(data.amount)/parseInt(data.spinz));

        const res = await createEmojiSlot({
            id:v4(),
            amount:parseFloat(data.amount), //total amount of current emoji slot bet
            spinz:parseInt(data.spinz),//total spins for the current emoji slot
            createdAt:new Date().toISOString(),
            profileId:profile?.id,
            currentAmount:parseFloat(data.amount), //amount of local balance at the current emoji slot game
            currentSpin:0, //current spin index
            currentEmojis:['💰','💰','💰','💰','💰'].toString(),
            payPerSpin:parseFloat(data.amount)/parseInt(data.spinz), // = (amount/spins)
            entryAmount:parseFloat(data.amount), //same as amount i think
            pnl:0,
            points:parseFloat(data.amount)/10 //local points of emoji slot
            })
        if(res.data){
            // setSavedEmojiSlot(true);
            // toast({title:"Success",description:"Slot created successfully"})
            console.log("created emoji slot: ",res.data[0])
            console.log("red.data[0]: ",res.data[0])
            dispatch({type:"SET_EMOJI_SLOT",payload:res.data[0]})
            if(profile?.balance){
                const {data:profileData,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)-parseFloat(data.amount)).toString()},profile.id);
                const {data:getAndSetPointsDataGlobal, error: getAndSetPointsErrorErrorGlobal} = await getAndSetPoints({points:parseFloat(data.amount)/10},profile.id)
                if(error || getAndSetPointsErrorErrorGlobal){
                    toast({title:"Error",description:"Failed to update balance or points",variant:"destructive"})
                    console.log("error updating  or points: ",error && getAndSetPointsErrorErrorGlobal)
                }
                if(profileData && getAndSetPointsDataGlobal){
                    console.log("successfully updated the balance and the points: ",data)
                    dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)-parseFloat(data.amount)).toString(),points:profile.points + parseFloat(data.amount)/10}})
                }
            }
            setLocalBalance(res.data[0].entryAmount.toString()) //here
            console.log("line 101 res.data[0].points: ",res.data[0].points)
            setLocalPoints(res.data[0].points)
            // setRollButtonVisibility(true)
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
        // setEmojiCountLocal(emojiCount)
        if(uniqueEmojis === 1){
            return amountPerSpin*10;
            // return amountPerSpin*0.5;
        }else if (uniqueEmojis === 2) {
            if(Object.values(emojiCount).includes(3) && Object.values(emojiCount).includes(2)){
                return amountPerSpin*5;
                // return amountPerSpin*0.5;
            }
            if(Object.values(emojiCount).includes(4)){
                return amountPerSpin*2
                // return amountPerSpin*0.5;
            }
        }else if (uniqueEmojis === 3) {
            if(Object.values(emojiCount).includes(3)){
                return amountPerSpin;
                // return amountPerSpin*0.5;
            }
            if(Object.values(emojiCount).includes(2)){
                return amountPerSpin;
                // return amountPerSpin*0.5;
            }
        }else if (uniqueEmojis === 4) {
            return amountPerSpin*0.5;
            // return amountPerSpin*0.5;
        }else if (uniqueEmojis === 5) {
            return 0;
            // return amountPerSpin*0.5;
        }
        console.log("emoji count: ",emojiCount)
        return 1;
    }

    const getPointstWonOrLost = async (winnerEmojis:string[]) => {
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
            return amountPerSpin*1;
            // return amountPerSpin*0.5;
        }else if (uniqueEmojis === 2) {
            if(Object.values(emojiCount).includes(3) && Object.values(emojiCount).includes(2)){
                return amountPerSpin*0.5;
                // return amountPerSpin*0.5;
            }
            if(Object.values(emojiCount).includes(4)){
                return amountPerSpin*0.22
                // return amountPerSpin*0.5;
            }
        }else if (uniqueEmojis === 3) {
            if(Object.values(emojiCount).includes(3)){
                return amountPerSpin*0.1;
                // return amountPerSpin*0.5;
            }
            if(Object.values(emojiCount).includes(2)){
                return amountPerSpin*0.1;
                // return amountPerSpin*0.5;
            }
        }else if (uniqueEmojis === 4) {
            return amountPerSpin*0;
            // return amountPerSpin*0.5;
        }else if (uniqueEmojis === 5) {
            return 0;
            // return amountPerSpin*0.5;
        }
        console.log("emoji count: ",emojiCount)
        return 1;
    }

    //handle spin
    const handleSpin = async () => {
        console.log("spin")
        setDisabledRollButton(true)
        if(currentSpinCount===null || totalSpinCount===null || !emojiSlotFromAppState || !amountPerSpin || !localBalance || localPoints===null) {
            console.log("currentSpincount or totalspincount or emojistateformappstate doesn't exist");
            console.log("currentSpinCount: ",currentSpinCount)
            console.log("totalSpinCount: ",totalSpinCount)
            console.log("emojiSlotFromAppState: ",emojiSlotFromAppState)
            console.log("amountPerSpin: ",amountPerSpin)
            console.log("localbalance: ",localBalance)
            console.log("localPoints: ",localPoints)
            toast({
                title:"something is missing",
                description:"we will see",
                variant:"destructive"
            })
            // setSetButtonVisibility(true)

            return;
        };
        setLocalBalance((parseFloat(localBalance)-amountPerSpin).toString())
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("localBalance: ",localBalance, " amountPerSpin: ",amountPerSpin, "parceFloat(localBalance)-amountPerSpin: ",(parseFloat(localBalance)-amountPerSpin))
        setCurrentSpinCount(currentSpinCount+1)
        if(currentSpinCount < totalSpinCount){
            setNewGameInTheSameSession(true)
            const winnerEmojis = await getWinner()
            const amountWonOrLost = await getAmountWonOrLost(winnerEmojis)
            const pointsWonOrLost = await getPointstWonOrLost(winnerEmojis)
            if(amountWonOrLost === undefined || pointsWonOrLost === undefined) return;
            //alright i think the problem is with the amountWonOrLost when it's 0
            console.log("amountWonOrLost from hadnel spin in order to check if the notification works with 0: ",amountWonOrLost)
            setAmountWonOrLostState(amountWonOrLost)
            setPointsWonOrLostState(pointsWonOrLost)
            // setTimeout(()=>{
            //     console.log("something here?")
            // },1000)
            //time difference between emoji result and balance update
            await new Promise(resolve => setTimeout(resolve, 1000));
            setTimeout(()=>{
                setAmountNotification(true)
                console.log("inside the first", " amountWonOrLostState: ",amountWonOrLostState)
                    setTimeout(()=>{
                        console.log("inside the second", " amountWonOrLostState: ",amountWonOrLostState)
                        setAmountNotification(false)
                        setAmountWonOrLostState(null) // here 4:20AM
                        setPointsWonOrLostState(null)
                    },1000)
                },1000)
            await new Promise(resolve => setTimeout(resolve, 1500));
            const newCurAmount = parseFloat(localBalance)-amountPerSpin+amountWonOrLost; //still local balance
            const newCurPoints = localPoints + pointsWonOrLost; //still localpoints (by local i mean emojislot's points not user's)
            if(!totalBetAmount) return;
            console.log("here prepei na katalavw pws douleve ito emojislot")
            dispatch({
                type:"UPDATE_EMOJI_SLOT",
                payload:{
                    ...emojiSlotFromAppState, 
                    currentSpin:currentSpinCount+1,
                    currentEmojis:winnerEmojis.toString(),
                    currentAmount:newCurAmount,
                    pnl:emojiSlotFromAppState.pnl + parseFloat(localBalance)-newCurAmount, //i will change totalBetAmount to parseFloat(localBalance)
                    points:newCurPoints
                }
            })
            const {data,error} = await updateEmojiSlot({id:emojiSlotFromAppState.id,currentSpin:currentSpinCount+1,currentEmojis:winnerEmojis.toString(),currentAmount:newCurAmount,pnl:emojiSlotFromAppState?.pnl + parseFloat(localBalance)-newCurAmount, points:newCurPoints});//i will change totalBetAmount to parseFloat(localBalance)

            if(error){
                toast({title:"Error",description:"Failed to update slot",variant:"destructive"})
                console.log("error updating slot: ",error)
            }
            if(data){
                console.log("successfully updated the database: ",data)
                setDisabledRollButton(false)

                console.log("localBalance: ",localBalance, "amountWonOrLost: ",amountWonOrLost, "amountPerSpin: ",amountPerSpin, "parseFloat(localBalance)+amountWonOrLost-amountPerSpin: ",(parseFloat(localBalance)-amountPerSpin+amountWonOrLost), "localPoints: ",localPoints)

                // await new Promise(resolve => setTimeout(resolve, 1000));
                setLocalBalance((newCurAmount).toString())
                //todo: make it more secure by error checking for the lasck of localpoints
                setLocalPoints(newCurPoints)

                // await new Promise(resolve => setTimeout(resolve, 2500));
                setAmountNotification(false)
                // setAmountWonOrLostState(null) // here 6:19PM
                //?
                // setAmountWonOrLostState(amountWonOrLost)
                console.log("amount notification is supposed to be set")
            }

        }else{
            console.log("game finished")
            setResetButtonVisibility(true)
            setRollButtonVisibility(false)
        }
    }
    useEffect(()=>{
        const fetchSlots = async () => {
            const latestEmojiSlots = await getLatestSlots()
            console.log("latestEmojiSlots: ",latestEmojiSlots)
        }
        fetchSlots()
    })
    //handle autospin
    const autoSpin = async () => {
        if(!totalSpinCount || currentSpinCount===null || !emojiSlotFromAppState) {
            console.log("currentSpincount or totalspincount or emojistateformappstate doesn't exist");
            console.log("currentSpinCount: ",currentSpinCount)
            console.log("totalSpinCount: ",totalSpinCount)
            console.log("emojiSlotFromAppState: ",emojiSlotFromAppState)
            return;
        };
        const remainingSpins = totalSpinCount-currentSpinCount;
        console.log("autospin remaining lol", remainingSpins)
        // setDisabledRollButton(true)
        setRollButtonVisibility(false)
        setAutoSpinButtonVisibility(false)

        const asyncProcess = async (i:number,curBal:string,lcLocal:string) => {
            let currentBalance = curBal;
            const remSpins = i;
            // console.log("remSpins: ",remSpins)
            const curSpi = totalSpinCount - remSpins + 1;
            // console.log("curSpi: ",curSpi)
            console.log("lc local: ",lcLocal)
            if(curSpi===null || totalSpinCount===null || !emojiSlotFromAppState) {
                console.log("currentSpincount or totalspincount or emojistateformappstate doesn't exist");
                console.log("currentSpinCount: ",curSpi)
                console.log("totalSpinCount: ",totalSpinCount)
                console.log("emojiSlotFromAppState: ",emojiSlotFromAppState)
                return;
            };
            if(!localBalance || !amountPerSpin) return;

            console.log("localBalance: ",localBalance, " amountPerSpin: ",amountPerSpin, "parceFloat(localBalance)-amountPerSpin: ",(parseFloat(localBalance)-amountPerSpin))
            // setLocalBalance(lc=>{
            //     if(!lc) return "0";
            //     console.log("lc: ",lc)
            //     return (parseFloat(lc)-amountPerSpin).toString()
            // })
            setLocalBalance(lc=>(parseFloat(lcLocal)-amountPerSpin).toString())
            console.log(" localbalance: ",localBalance)
            await new Promise(resolve => setTimeout(resolve, 500));

            setCurrentSpinCount(currentSpinCount=>{
                return curSpi;
            })  
            // console.log("here 3, currentSpin: ",curSpi, " totalSpin: ",totalSpinCount, "updatedCount: ")

            if(currentSpinCount < totalSpinCount){
                setAutoRoll(true)
                setNewGameInTheSameSession(true)
                const winnerEmojis = await getWinner()
                await new Promise(resolve => setTimeout(resolve, 1500));
                // console.log("winnerEmojis: ",winnerEmojis)
                const amountWonOrLost = await getAmountWonOrLost(winnerEmojis)
                // console.log("amountWonOrLost: ",amountWonOrLost)
                if(amountWonOrLost === undefined) {console.log("amountWinorLost undefined");return;};
                setAmountWonOrLostState(amountWonOrLost)
                setAmountNotification(true)
                //here it's now 29 april

                // setTimeout(()=>{
                // // setAmountNotification(true)
                // console.log("inside the first", " amountWonOrLostState: ",amountWonOrLostState)
                //     setTimeout(()=>{
                //         console.log("inside the second", " amountWonOrLostState: ",amountWonOrLostState)
                //         setAmountNotification(false)
                //         setAmountWonOrLostState(null) // here 4:20AM
                //         setPointsWonOrLostState(null)
                //     },1000)
                // },1000)

                dispatch({
                    type:"UPDATE_EMOJI_SLOT",
                    payload:{
                        ...emojiSlotFromAppState, 
                        currentSpin:curSpi,
                        currentEmojis:winnerEmojis.toString(),
                        currentAmount:parseFloat(lcLocal)-amountPerSpin+amountWonOrLost
                    }
                })
                const {data,error} = await updateEmojiSlot({id:emojiSlotFromAppState.id,currentSpin:curSpi,currentEmojis:winnerEmojis.toString(),currentAmount:(parseFloat(lcLocal)-amountPerSpin+amountWonOrLost)});
                if(error){
                    toast({title:"Error",description:"Failed to update slot",variant:"destructive"})
                    console.log("error updating slot: ",error)
                    return;
                }
                if(data){
                    // console.log("here 4 ")
                    // console.log("successfully updated the database: ",data)

                    // console.log("curBal: ",currentBalance)
                    if(currentBalance && amountPerSpin && profile?.id){
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
                    setAmountWonOrLostState(null)
                    setAmountNotification(false)
                    // setAmountNotification(true)
                    console.log("here 6 6 6 ")
                    console.log("localBalance: ",lcLocal, "amountWonOrLost: ",amountWonOrLost, "amountPerSpin: ",amountPerSpin, "parseFloat(lcLocal)+amountWonOrLost-amountPerSpin: ",(parseFloat(lcLocal)-amountPerSpin+amountWonOrLost), " ||||||    parseFloat(localBalance) + amountWonOrLost", parseFloat(lcLocal)+amountWonOrLost)
                    setLocalBalance((parseFloat(lcLocal)-amountPerSpin+amountWonOrLost).toString())
                    return;
                }
    
                // if(!data || )
            }else{
                console.log("game finished double slut")
                setResetButtonVisibility(true)
                setRollButtonVisibility(false)
                setAutoRoll(false)
                // setReset(true)
                return;
            }
        }
        //spin twice 
        for (let i = 0; i < remainingSpins; i++) {
            // console.log("here: lol lol oll")
            if(!profile || !profile.balance || !emojiSlotFromAppState) {
                console.log("no profile: ",profile, " or profile.balance: ",profile?.balance, " or emojiSlotFromAppState: ",emojiSlotFromAppState)
                return;
            };
            const curProf = await getProfile(profile.id);
            const curEmojiSlot = await getEmojiSlotById(emojiSlotFromAppState.id);
            if(curProf.data){
                await asyncProcess(remainingSpins-i, curProf.data.balance || "", curEmojiSlot.data?.currentAmount.toString() || "0");
            }else{
                console.log("no curProf.data: ")
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
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
        setAutoSpinButtonVisibility(true)
        setRollButtonVisibility(true)
        setAutoRoll(false)
    }
    
    //reset 
    const resetTheGame = async () => {
        setResetButtonVisibility(false)
        setDisableInputs(false)
        const finishedGame = emojiSlotFromAppState;
        if(!profile || !profile?.balance || !finishedGame) {
            console.log("profile or localbalance don't exist")
            return;
        }
        console.log("emojiSlotFromAppState?.currentAmount: ",finishedGame?.currentAmount, "parseFloat(profile?.balance): ",parseFloat(profile?.balance), "(emojiSlotFromAppState?.currentAmount+parseFloat(profile?.balance)).toString(): ",(emojiSlotFromAppState?.currentAmount+parseFloat(profile?.balance)).toString())
        //set points and current amount to users
        const {data,error} = await getAndSetBalance({balance:(finishedGame?.currentAmount+parseFloat(profile?.balance)).toString()},profile?.id || "")
        const {data:getAndSetPointsDataGlobal, error:getAndSetPointsErrorErrorGlobal} = await getAndSetPoints({points:finishedGame?.points+profile?.points},profile?.id || "")
        const {data:updateProfilePnlData, error:updateProfilePnlError} = await updateProfile({pnl:profile.pnl-finishedGame.pnl},profile.id)
        if(error || !data || !data[0] || !data[0].balance || !getAndSetPointsDataGlobal || getAndSetPointsErrorErrorGlobal || !updateProfilePnlData || updateProfilePnlError){
            console.log("error at updating the balance at reseting, ",error)
            return;
        }
        dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile?.balance)+finishedGame?.currentAmount).toString(),points:finishedGame.points+profile?.points}})
        dispatch({type:"UPDATE_EMOJI_SLOT",payload:{...finishedGame, currentAmount:0,}})
        const {data:updateEmojiSlotData,error:updateEmojiSlotError} = await updateEmojiSlot({id:finishedGame.id,currentAmount:0})
        if(updateEmojiSlotError || !updateEmojiSlotData){
            console.log("error at updating the emoji slot at reseting, ",updateEmojiSlotError)
            return;
        }
        setLocalBalance("0")
        setCurrentSpinCount(0)
        setLocalPoints(0)

        console.log("reset")
        dispatch({
            type:"DELETE_EMOJI_SLOT",
            payload:null
        })
    }

    const handleHalfBalance = async () => {

        if(!profile || !profile?.balance || profile.balance==="0"){
            console.log("no profile");
            toast({title:"Error",description:"Please fill all fields",variant:"destructive"})
            return;
        }
        setTotalBetAmount(parseFloat(profile?.balance)/2);
        setTotalSpinCount(10);
        setAmountPerSpin(parseFloat(profile?.balance)/(2*10));

        const res = await createEmojiSlot({
            id:v4(),
            amount:parseFloat(profile?.balance)/2,
            spinz:10,
            createdAt:new Date().toISOString(),
            profileId:profile?.id,
            currentAmount:parseFloat(profile?.balance)/2,
            currentSpin:0,
            currentEmojis:['💰','💰','💰','💰','💰'].toString(),
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
            dispatch({type:"SET_EMOJI_SLOT",payload:res.data[0]})
            if(profile?.balance){
                const {data:profileData,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)-(parseFloat(profile?.balance)/2)).toString()},profile.id);
                const {data:getAndSetPointsDataGlobal, error:getAndSetPointsErrorErrorGlobal} = await getAndSetPoints({points:parseFloat(profile.balance)/2},profile.id)
                if(error || getAndSetPointsErrorErrorGlobal){
                    toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
                    console.log("error updating balance: ",error && getAndSetPointsErrorErrorGlobal)
                }
                if(profileData && getAndSetPointsDataGlobal){
                    console.log("successfully updated the balance: ",profileData)
                    console.log("(parseFloat(profile.balance)-(parseFloat(profile?.balance)/2)).toString(): ",(parseFloat(profile.balance)-(parseFloat(profile?.balance)/2)).toString())
                    dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)-(parseFloat(profile?.balance)/2)).toString()}})
                    dispatch({type: "UPDATE_USER",payload:{...profile, points:parseFloat(profile.balance)/2}})
                }
            }
            setLocalBalance(res.data[0].entryAmount.toString()) //here
            // setRollButtonVisibility(true)
            setCreateNewGame(false);
        }else{
            toast({title:"Error",description:"Slot creation failed",variant:"destructive"})
        }

    }


   
    //check if there is a saved Emoji slot game and either set it to the saved game or a new game
    useEffect(()=>{
        // console.log("emojiSlotFromAppState inside the fucking shit: ",emojiSlotFromAppState)

        if(emojiSlotFromAppState && autoRoll && emojiSlotFromAppState.spinz>emojiSlotFromAppState?.currentSpin) {
            console.log("emojislot exists and autorll too and the game hasn't been finished: ", emojiSlotFromAppState)
            setRollButtonVisibility(false)
        }
        else if(emojiSlotFromAppState &&  emojiSlotFromAppState.spinz > emojiSlotFromAppState.currentSpin){
            console.log("emoji slot exists and the game hasn't been finished: ", emojiSlotFromAppState)
            setSetButtonVisibility(false)
            setResetButtonVisibility(false)
            setTotalBetAmount(parseInt(emojiSlotFromAppState.entryAmount.toString()));
            setTotalSpinCount(parseInt(emojiSlotFromAppState.spinz.toString()));
            setAmountPerSpin(parseInt(emojiSlotFromAppState.amount.toString())/parseInt(emojiSlotFromAppState.spinz.toString()));
            setCurrentEmojis(emojiSlotFromAppState.currentEmojis.split(","));
            setCurrentBetAmount(parseInt(emojiSlotFromAppState.currentAmount.toString()));
            setCurrentSpinCount(parseInt(emojiSlotFromAppState.currentSpin.toString()));
            setRollButtonVisibility(true)
            setDisableInputs(true)
            setLocalBalance(emojiSlotFromAppState.currentAmount.toString())
            // setLocalBalance(emojiSlotFromAppState.currentAmount.toString())
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
                emojiSlotFromAppState.spinz === emojiSlotFromAppState.currentSpin && emojiSlotFromAppState.currentAmount!==0) {
            console.log("game finished and the current amount is differnt than 0")
            // setResetButtonVisibility(true)
            setRollButtonVisibility(false)
            setSetButtonVisibility(true)
            setDisableInputs(false)
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
                console.log("1 slut profile?.balance || 0", profileDataFromProfile.balance || "0", "emojiSlotFromAppState.currentAmount: ",emojiSlotFromAppState.currentAmount)
                const {data:updateBalanceData, error:updateBalanceError} = await getAndSetBalance({balance:(parseFloat(profile?.balance || "0")+emojiSlotFromAppState.currentAmount).toString()},profile?.id || "")
                if(!updateBalanceData || updateBalanceError || !profile?.balance || !updateBalanceData[0].balance){
                    console.log("error updating balance: ",updateBalanceError)
                    return;
                }
                
                console.log("updateBalanceData[0].balance", updateBalanceData[0].balance, "emojiSlutFromAppState.currentAmount: ",emojiSlotFromAppState.currentAmount, " sum: ",(parseFloat(updateBalanceData[0].balance)+emojiSlotFromAppState.currentAmount).toString())
                dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(updateBalanceData[0].balance)).toString()}})

                const {data:updateEmojiSlotData,error:updateEmojiSlotError} = await updateEmojiSlot({id:emojiSlotFromAppState.id,currentAmount:0})
                if(updateEmojiSlotError || !updateEmojiSlotData){
                    console.log("error updating the emoji slot: ",updateEmojiSlotError)
                    return;
                }
                dispatch({type:"UPDATE_EMOJI_SLOT",payload:{...emojiSlotFromAppState, currentAmount:0}})
                setLocalBalance("0")

            }
            if(emojiSlotFromAppState.currentAmount>0){
                updateBalanceFromInsideUseEffect();
            }

        }
        else if(!emojiSlotFromAppState){
            console.log("will set the default emoji values because the last game has been finished")
            setSetButtonVisibility(true)
            // setResetButtonVisibility(true)
            setRollButtonVisibility(false)
            setDisableInputs(false)
            // setDisabled(false)
            // setReset(true)
        }else if (emojiSlotFromAppState && emojiSlotFromAppState.spinz === emojiSlotFromAppState.currentSpin && emojiSlotFromAppState.currentAmount===0) {
            
            console.log("game finished and the payouts have been settled and we have to create a new game")
            setSetButtonVisibility(true)
            setRollButtonVisibility(false)
            setDisableInputs(false)

        }
    },[emojiSlotFromAppState])

    //WIP handle space press event for slot spin

    
  return (
    <div className='w-[90%] md:w-[50%] text-center'>
        <DevnetButtons resetRewardsButtonVisibility={resetRewardsButtonVisibility} setButtonVisibility={setButtonVisibility} setResetRewardsButtonVisibility={setResetRewardsButtonVisibility} airdropButtonVisibility={airdropButtonVisibility} setAirdropButtonVisibility={setAirdropButtonVisibility} />
        {/* {amountNotification && <p className='font-lg border border-yellow-500'>here it is: {amountNotification} {amountWonOrLostState}</p>} */}
        {/* {amountNotification &&  <div>cocksycker {emojiSlotFromAppState?.pnl} amountWonrOrLost: {amountWonOrLostState}</div>} */}
        {currentSpinCount && totalSpinCount && (<div className='py-4 '>
            <Progress value={(currentSpinCount/totalSpinCount)*100} className='bg-[#3d4552]'/>
        </div>)}
        
            <div className='flex justify-center items-center gap-x-6 w-full'>
                {/* jackpot: <Progress value={30/100} className='bg-[#3d4552]'/> */}
                {/* i am creating a casino slots app on solana. currently i only need the component which will showcase the jackpot as it's increased in real time. i want it to be fancy inspired by 2017 fortnite and 2017 lil pump blowup */}
            </div>
        {/* {amountWonOrLostState && (<div> HERE'S THE COCK {amountWonOrLostState}</div>)} */}
            {/* {
                !user &&
                <div className='tracking-tight text-center text-hotPink bg-black hover:bg-accent hover:text-accent-foreground rounded-xl' onClick={()=>{console.log("kenta")}}>
                    <Auth>LOG IN TO PLAY</Auth>
                </div>
            } */}
            <div>
                here
                {emojiCountLocal!==0 && (<div>
                    some shit {emojiCountLocal}
                </div>)}
            </div>
            <div className={`flex flex-col justify-center align-center border w-[100%] border-white rounded-lg gap-4 p-4 ${!profile ? 'blur-sm' : ""}`}>
                <div className='flex justify-center items-center'>
                    <ApsCurrentSpin currentSpin={currentSpinCount || 0} totalSpins={totalSpinCount || 0} aps={parseFloat(amountPerSpin?.toFixed(3) || "0") || 0}/>
                    <p className='w-full text-center'>SLEM</p>
                    <div>
                        <div>
                            {amountNotification  && amountWonOrLostState && <AmountNotification visible={amountNotification} message={amountWonOrLostState.toFixed(2).toString()}/>}
                            {amountWonOrLostState===0 && amountNotification && <AmountNotification visible={amountNotification} message={amountWonOrLostState.toString()}/>}
                        </div>
                        {/* <div className=''> Balance: {localBalance && <p>{parseFloat(localBalance).toFixed(2)}</p>}</div>
                        <div className=''> Points: {localPoints && <p>{localPoints.toFixed(2)}</p>}</div> */}

                        <LocalBalanceAndPoints localBalance={localBalance ? parseFloat(localBalance) : 0} localPoints={localPoints ? localPoints : 0}/>

                    </div>
                </div>
                <div className='w-full border flex flex-col items-center gap-y-2'> 
                {/* <div className='module-border-wrap'> */}
                    {/* <div className='module'> */}
                        <div className='flex items-center gap-x-4 text-[50px] md:text-[70px] lg:text-[100px]'>
                            {/* <div className=''>
                                {amountPerSpin && <div className="text-left">APS: {amountPerSpin?.toFixed(3)}</div>}
                            </div> */}
                            <SlotCounter
                                startValue={currentEmojis}
                                startValueOnce={true}
                                value={currentEmojis}
                                charClassName='p-1'
                                animateUnchanged
                                autoAnimationStart={false}
                                dummyCharacters={emojis}
                                duration={0.4}
                                // separatorClassName='emojiSeparator'
                                // valueClassName='text-4xl p-1'
                                
                            />
                            {/* {currentSpinCount && totalSpinCount && (
                                <div className="text-right">spinz: {currentSpinCount}/{totalSpinCount}</div>
                            )} */}
                        </div>

                    {/* </div> */}
                {/* </div> */}
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
                    {/* {!reset && <Button disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl'
                    onClick={() => {handleSpin();}}>
                        SPIN
                    </Button>} */}
                    <div className='grid grid-cols-2 lg:grid-cols-1 gap-4 items-center justify-items-center'>
                        {/* <Button 
                        disabled={!setButtonVisibility} 
                        className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
                        onClick={() => {handleHalfBalance();}}>
                            <p className='hidden lg:block'>$1/2*BLNC  10SPINZ</p>
                            <p className='block lg:hidden' >1/2</p>
                        </Button> */}
                        
                        <Button 
                        // disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} 
                        disabled={!rollButtonVisibility || disabledRollButton || setButtonVisibility}
                        className={cn('rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl',
                            disabledRollButton && "hidden"
                        )}
                        onClick={() => {handleSpin();}} onKeyDown={(e)=>{
                            // if(e.key===" "){
                            //     handleSpin();}
                            // }
                            console.log("key: ",e.key)
                            }}>
                            SPIN
                        </Button>
                        {/* {reset && <Button disabled={!amount} className='rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl'
                        onClick={() => {resetTheGame();}}>
                            RESET
                        </Button>} */}
                        <Button 
                        // disabled={!amount} 
                        disabled={!resetButtonVisibility}
                        className={cn('rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl',
                            setButtonVisibility && 'hidden',
                        )}
                        onClick={() => {resetTheGame();}}>
                            RESET
                        </Button>


                        <Button 
                        // disabled={!amount} 
                        disabled={!autoSpinButtonVisibility}
                        className={cn('rounded-full border border-hotPink w-full bg-black hover:bg-accent hover:text-accent-foreground text-hotPink text-2xl',
                            setButtonVisibility && 'hidden',
                            disabledRollButton && 'hidden',
                        )}
                        onClick={() => {autoSpin();}}>
                            AUTOSPIN
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmojiSlots