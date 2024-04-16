// "use client";
// import { useAppState } from '@/lib/providers/state-provider';
// import SlotCounter from 'react-slot-counter';
// import React, { useEffect, useState } from 'react'
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { set, z } from 'zod';
// import { EmojiSlotSchema } from '@/lib/types';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { CustomInputForEmojiSlots } from '../ui/custom-input-for-emoji-slots';
// import { Button } from '../ui/button';
// import { useToast } from '../ui/use-toast';
// import { createDoubleSlut, createEmojiSlot, getAndSetBalance, getDoubleSlutById, getEmojiSlotById, getProfile, updateDoubleSlut, updateEmojiSlot } from '@/lib/supabase/queries';
// import { v4 } from 'uuid';
// import AmountNotificationForEachOneIg from './amount-notification';


// const emojis = ["😈", "💀", "💩", "💰","🤑"];

// const EmojiSlots = () => {
//     const {profile,doubleSlut:doubleSlutFromAppState,dispatch} = useAppState()

//     // const [createNewGame, setCreateNewGame] = useState(false)
//     const [totalBetAmountForDoubles, setTotalBetAmountForDoubles] = useState<number | null>(null)
//     const [currentBetAmount, setCurrentBetAmountForEachOneOfTheDoubles] = useState<number | null>(null)
    
//     const [totalSpinCountForBothIg, setTotalSpinCountForBothIg] = useState<number | null>(null)//delete
//     const [totalSpinCountForTheFirstOne, setTotalSpinCountForTheFirstOne] = useState<number | null>(null)
//     const [totalSpinCountForTheSecondOne, setTotalSpinCountForTheSecondOne] = useState<number | null>(null)

//     const [currentSpinCountForEachOneIg, setCurrentSpinCountForEachOneIg] = useState<number | null>(null)//delete
//     const [currentSpinCountForTheFirstOne, setCurrentSpinCountForTheFirstOne] = useState<number | null>(null)
//     const [currentSpinCountForTheSecondOne, setCurrentSpinCountForTheSecondOne] = useState<number | null>(null)

//     const [amountPerSpinForEachOneIg, setAmountPerSpinForEachOneIg] = useState<number | null>(null)//delete
//     const [amountPerSpinForTheFirstOne, setAmountPerSpinForTheFirstOne] = useState<number | null>(null)
//     const [amountPerSpinForTheSecondOne, setAmountPerSpinForTheSecondOne] = useState<number | null>(null)

//     const [currentEmojisForEachOneIg, setCurrentEmojisForEachOneIg] = useState<string[]>(['💰','💰','💰','💰','💰'])//delete
//     const [currentEmojisForTheFirstOne, setCurrentEmojisForTheFirstOne] = useState<string[]>(['💰','💰','💰','💰','💰'])
//     const [currentEmojisForTheSecondOne, setCurrentEmojisForTheSecondOne] = useState<string[]>(['💰','💰','💰','💰','💰'])
    
//     const [localBalanceForEachOneIg, setLocalBalanceForEachOneIg] = useState<string | null>("0")//delete
//     const [localBalanceForTheFirstOne, setLocalBalanceForTheFirstOne] = useState<string | null>("0")
//     const [localBalanceForTheSecondOne, setLocalBalanceForTheSecondOne] = useState<string | null>("0")

//     const [rollButtonVisibilityForEachOne, setRollButtonVisibilityForEachOne] = useState(false)//delete
//     const [rollButtonVisibilityForTheFirstOne, setRollButtonVisibilityForTheFirstOne] = useState(false) 
//     const [rollButtonVisibilityForTheSecondOne, setRollButtonVisibilityForTheSecondOne] = useState(false)

//     const [resetButtonVisibilityForEachOne, setResetButtonVisibilityForEachOne] = useState(false)//delete
//     const [resetButtonVisibilityForTheFirstOne, setResetButtonVisibilityForTheFirstOne] = useState(false)
//     const [resetButtonVisibilityForTheSecondOne, setResetButtonVisibilityForTheSecondOne] = useState(false)

//     const [setButtonVisibilityForEachOne, setSetButtonVisibilityForEachOne] = useState(false) //delete
//     const [setButtonVisibilityForTheFirstOne, setSetButtonVisibilityForTheFirstOne] = useState(false)
//     const [setButtonVisibilityForTheSecondOne, setSetButtonVisibilityForTheSecondOne] = useState(false)

//     const [newGameInTheSameSessionSignleGame, setNewGameInTheSameSessionSignleGame] = useState(false)
    
//     const [disabledRollButtonForEachOneIg,setDisabledRollButtonForEachOneIg] = useState(false) //delete
//     const [disabledRollButtonForTheFirstOne,setDisabledRollButtonForTheFirstOne] = useState(false)
//     const [disabledRollButtonForTheSecondOne,setDisabledRollButtonForTheSecondOne] = useState(false)

//     const [disableInputsForEachOne, setDisableInputsForEachOne] = useState(false)//delete
//     const [disableInputsForTheFirstOne, setDisableInputsForTheFirstOne] = useState(false)
//     const [disableInputsForTheSecondOne, setDisableInputsForTheSecondOne] = useState(false)

//     const [amountWonOrLostStateForEachOne, setAmountWonOrLostStateForEachOne] = useState<number | null>(null)//delete
//     const [amountWonOrLostStateForTheFirstOne, setAmountWonOrLostStateForTheFirstOne] = useState<number | null>(null)
    
//     const [resetRewardsButtonVisibilityForEachOne, setResetRewardsButtonVisibilityForEachOne] = useState(true)//delete
//     const [resetRewardsButtonVisibilityForTheFirstOne, setResetRewardsButtonVisibilityForTheFirstOne] = useState(true)
//     const [resetRewardsButtonVisibilityForTheSecondOne, setResetRewardsButtonVisibilityForTheSecondOne] = useState(true)
    

//     const [airdropButtonVisibilityForEachOne, setAirdropButtonVisibilityForEachOne] = useState(true)
    
//     const [autoSpinButtonVisibilityForEachOne, setAutoSpinButtonVisibilityForEachOne] = useState(true)//delete
//     const [autoSpinButtonVisibilityForTheFirstOne, setAutoSpinButtonVisibilityForTheFirstOne] = useState(true)
//     const [autoSpinButtonVisibilityForTheSecondOne, setAutoSpinButtonVisibilityForTheSecondOne] = useState(true)

//     const {toast} = useToast();
//     const [amountNotificationForEachOneIg, setAmountNotificationForEachOneIg] = useState<boolean>(false)
//     const [amountNotificationForTheFirstOne, setAmountNotificationForTheFirstOne] = useState<boolean>(false)
//     const [amountNotificationForTheSecondOne, setAmountNotificationForTheSecondOne] = useState<boolean>(false)

//     const firstSlutForm = useForm<z.infer<typeof EmojiSlotSchema>>({
//         mode:"onSubmit",
//         resolver:zodResolver(EmojiSlotSchema),
//         defaultValues:{amount:"1",spinz:"1"}
//     })
//     const secondSlutForm = useForm<z.infer<typeof EmojiSlotSchema>>({
//         mode:"onSubmit",
//         resolver:zodResolver(EmojiSlotSchema),
//         defaultValues:{amount:"1",spinz:"1"}
//     })

//     //initialize game
//     const initializeGame:SubmitHandler<z.infer<typeof EmojiSlotSchema>> = async (data) => {
//         console.log("data: ",data)
//         if(!profile || !data.amount || !data.spinz || !doubleSlutFromAppState){
//             console.log("no profile or data amount or data spinz");
//             toast({title:"Error",description:"Please fill all fields",variant:"destructive"})
//             return;
//         }
//         // setTotalBetAmountForDoubles(parseInt(data.amount));
//         setTotalSpinCountForTheFirstOne(parseInt(data.spinz));
//         setAmountPerSpinForTheFirstOne(parseInt(data.amount)/parseInt(data.spinz));

//         const res = await createDoubleSlut({
//             id:v4(),
//             amountFirst:parseFloat(data.amount),
//             amountSecond:null,
//             spinzFirst:parseInt(data.spinz),
//             spinzSecond:null,
//             createdAtFirst:new Date().toISOString(),
//             createdAtSecond:null,
//             profileId:profile?.id,
//             currentAmountFirst:parseFloat(data.amount),
//             currentAmountSecond:null,
//             currentSpinFirst:0,
//             currentSpinSecond:null,
//             currentEmojisFirst:['💰','💰','💰','💰','💰'].toString(),
//             currentEmojisSecond:null,
//             payPerSpinFirst:parseFloat(data.amount)/parseInt(data.spinz),
//             payPerSpinSecond:null,
//             entryAmountFirst:parseFloat(data.amount),
//             entryAmountSecond:null,
//             pnlFirst:0,
//             pnlSecond:null
//             })
//         if(res.data){
//             // setSavedEmojiSlot(true);
//             // toast({title:"Success",description:"Slot created successfully"})
//             console.log("created double emoji slot first: ",res.data[0])
//             dispatch({type:"SET_DOUBLE_SLUT",payload:res.data[0]})
//             if(profile?.balance){
//                 const {data:profileData,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)-parseFloat(data.amount)).toString()},profile.id);
//                 if(error){
//                     toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
//                     console.log("error updating balance: ",error)
//                 }
//                 if(profileData){
//                     console.log("successfully updated the balance: ",data)
//                     dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)-parseFloat(data.amount)).toString()}})
//                 }
//             }
//             if(!res.data[0].entryAmountFirst) return;
//             setLocalBalanceForTheFirstOne(res.data[0].entryAmountFirst.toString()) //here
//             // setRollButtonVisibilityForEachOne(true)
//             // setCreateNewGame(false);
//         }else{
//             toast({title:"Error",description:"Slot creation failed",variant:"destructive"})
//         }
//     }

//     const initializeSecondGame:SubmitHandler<z.infer<typeof EmojiSlotSchema>> = async (data) => {
//         console.log("data: ",data)
//         if(!profile || !data.amount || !data.spinz){
//             console.log("no profile or data amount or data spinz");
//             toast({title:"Error",description:"Please fill all fields",variant:"destructive"})
//             return;
//         }
//         // setTotalBetAmountForDoubles(parseInt(data.amount));
//         setTotalSpinCountForTheSecondOne(parseInt(data.spinz));
//         setAmountPerSpinForTheSecondOne(parseInt(data.amount)/parseInt(data.spinz));

//         // const res = await createDoubleSlut({
//         //     id:v4(),
//         //     amount:parseFloat(data.amount),
//         //     spinz:parseInt(data.spinz),
//         //     createdAt:new Date().toISOString(),
//         //     profileId:profile?.id,
//         //     currentAmount:parseFloat(data.amount),
//         //     currentSpin:0,
//         //     currentEmojis:['💰','💰','💰','💰','💰'].toString(),
//         //     payPerSpin:parseFloat(data.amount)/parseInt(data.spinz),
//         //     entryAmount:parseFloat(data.amount),
//         //     pnl:0
//         //     })
//         if(!doubleSlutFromAppState) return;
//         const res = await updateDoubleSlut({
//             id:doubleSlutFromAppState.id,
//         })
//         if(res.data){
//             // setSavedEmojiSlot(true);
//             // toast({title:"Success",description:"Slot created successfully"})
//             console.log("created double emoji slot: ",res.data[0])
//             //probably set the doubleSlut as an array of doublesluts
//             dispatch({type:"SET_DOUBLE_SLUT",payload:res.data[0]})
//             if(profile?.balance){
//                 const {data:profileData,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)-parseFloat(data.amount)).toString()},profile.id);
//                 if(error){
//                     toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
//                     console.log("error updating balance: ",error)
//                 }
//                 if(profileData){
//                     console.log("successfully updated the balance: ",data)
//                     dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)-parseFloat(data.amount)).toString()}})
//                 }
//             }
//             if(!res.data[0].entryAmountSecond) return;
//             setLocalBalanceForTheSecondOne(res.data[0].entryAmountSecond.toString()) //here
//             // setRollButtonVisibilityForEachOne(true)
//             // setCreateNewGame(false);
//         }else{
//             toast({title:"Error",description:"Slot creation failed",variant:"destructive"})
//         }
//     }

//     //get winning emojis
//     const getWinner = async () => {
//         // setDisabled(true);
//         const drand = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5));
//         const winnerEmojis = drand.map(index => emojis[index])
//         setCurrentEmojisForEachOneIg(winnerEmojis)
//         // if(emojisArray === undefined || emojisArray===null) return;
//         return winnerEmojis;
//     }

//     const getAmountWonOrLost = async (winnerEmojis:string[]) => {
//         if(!amountPerSpinForEachOneIg) return;
//         const emojiCount:any = {}
//         winnerEmojis.forEach(emoji=>{
//             if(emojiCount[emoji]){
//                 emojiCount[emoji]++
//             }else{
//                 emojiCount[emoji] = 1
//             }
//         })

//         const uniqueEmojis = Object.keys(emojiCount).length;
//         console.log("emoji count: ",emojiCount)
//         if(uniqueEmojis === 1){
//             return amountPerSpinForEachOneIg*10;
//             // return amountPerSpinForEachOneIg*0.5;
//         }else if (uniqueEmojis === 2) {
//             if(Object.values(emojiCount).includes(3) && Object.values(emojiCount).includes(2)){
//                 return amountPerSpinForEachOneIg*5;
//                 // return amountPerSpinForEachOneIg*0.5;
//             }
//             if(Object.values(emojiCount).includes(4)){
//                 return amountPerSpinForEachOneIg*2
//                 // return amountPerSpinForEachOneIg*0.5;
//             }
//         }else if (uniqueEmojis === 3) {
//             if(Object.values(emojiCount).includes(3)){
//                 return amountPerSpinForEachOneIg;
//                 // return amountPerSpinForEachOneIg*0.5;
//             }
//             if(Object.values(emojiCount).includes(2)){
//                 return amountPerSpinForEachOneIg;
//                 // return amountPerSpinForEachOneIg*0.5;
//             }
//         }else if (uniqueEmojis === 4) {
//             return amountPerSpinForEachOneIg*0;
//             // return amountPerSpinForEachOneIg*0.5;
//         }else if (uniqueEmojis === 5) {
//             return 0;
//             // return amountPerSpinForEachOneIg*0.5;
//         }
//         console.log("emoji count: ",emojiCount)
//         return 1;
//     }

//     //handle spin
//     const handleSpin = async () => {
//         console.log("spin")
//         setDisabledRollButtonForEachOneIg(true)
//         if(currentSpinCountForEachOneIg===null || totalSpinCountForBothIg===null || !doubleSlutFromAppState || !amountPerSpinForEachOneIg || !localBalanceForEachOneIg) {
//             console.log("currentSpincountForEachOneIg or totalspincountForBothIg or emojistateformappstate doesn't exist");
//             console.log("currentSpinCountForEachOneIg: ",currentSpinCountForEachOneIg)
//             console.log("totalSpinCountForBothIg: ",totalSpinCountForBothIg)
//             console.log("doubleSlutFromAppState: ",doubleSlutFromAppState)
//             return;
//         };
//         setLocalBalanceForEachOneIg((parseFloat(localBalanceForEachOneIg)-amountPerSpinForEachOneIg).toString())
//         await new Promise(resolve => setTimeout(resolve, 500));
//         console.log("localBalanceForEachOneIg: ",localBalanceForEachOneIg, " amountPerSpinForEachOneIg: ",amountPerSpinForEachOneIg, "parceFloat(localBalanceForEachOneIg)-amountPerSpinForEachOneIg: ",(parseFloat(localBalanceForEachOneIg)-amountPerSpinForEachOneIg))
//         setCurrentSpinCountForEachOneIg(currentSpinCountForEachOneIg+1)
//         if(currentSpinCountForEachOneIg < totalSpinCountForBothIg){
//             setNewGameInTheSameSessionSignleGame(true)
//             const winnerEmojis = await getWinner()
//             const amountWonOrLost = await getAmountWonOrLost(winnerEmojis)
//             if(amountWonOrLost === undefined) return;
//             //alright i think the problem is with the amountWonOrLost when it's 0
//             console.log("amountWonOrLost from hadnel spin in order to check if the notification works with 0: ",amountWonOrLost)
//             setAmountWonOrLostStateForEachOne(amountWonOrLost)
//             setAmountNotificationForEachOneIg(true)
//             const newCurAmount = parseFloat(localBalanceForEachOneIg)-amountPerSpinForEachOneIg+amountWonOrLost;
//             if(!totalBetAmountForDoubles || !currentSpinCountForTheFirstOne) return;
//             dispatch({
//                 type:"UPDATE_DOUBLE_SLUT",
//                 payload:{
//                     ...doubleSlutFromAppState, 
//                     currentSpinFirst:currentSpinCountForTheFirstOne+1,
//                     currentEmojisFirst:winnerEmojis.toString(),
//                     currentAmountFirst:parseFloat(localBalanceForEachOneIg)-amountPerSpinForEachOneIg+amountWonOrLost,
//                     pnlFirst:totalBetAmountForDoubles-newCurAmount
//                 }
//             })
//             const {data,error} = await updateDoubleSlut({id:doubleSlutFromAppState.id,currentSpinFirst:currentSpinCountForEachOneIg+1,currentEmojisFirst:winnerEmojis.toString(),currentAmountFirst:(parseFloat(localBalanceForEachOneIg)-amountPerSpinForEachOneIg+amountWonOrLost),pnlFirst:totalBetAmountForDoubles-newCurAmount});
//             if(error){
//                 toast({title:"Error",description:"Failed to update double slut",variant:"destructive"})
//                 console.log("error updating double slut: ",error)
//             }
//             if(data){
//                 console.log("successfully updated the database: ",data)
//                 setDisabledRollButtonForEachOneIg(false)
//                 // setAmountWonOrLostStateForEachOne(null)
//                 // setAmountNotificationForEachOneIg(false)
//                 if(!localBalanceForTheFirstOne || !amountPerSpinForTheFirstOne) return;
//                 console.log("localBalanceForEachOneIg: ",localBalanceForTheFirstOne, "amountWonOrLost: ",amountWonOrLost, "amountPerSpinForEachOneIg: ",amountPerSpinForTheFirstOne, "parseFloat(localBalanceForEachOneIg)+amountWonOrLost-amountPerSpinForEachOneIg: ",(parseFloat(localBalanceForTheFirstOne)-amountPerSpinForTheFirstOne+amountWonOrLost))

//                 setLocalBalanceForEachOneIg((parseFloat(localBalanceForTheFirstOne)-amountPerSpinForTheFirstOne+amountWonOrLost).toString())

//                 // await new Promise(resolve => setTimeout(resolve, 2500));
//                 setAmountNotificationForEachOneIg(false)
//                 setAmountWonOrLostStateForEachOne(null)
//                 //?
//                 // setAmountWonOrLostStateForEachOne(amountWonOrLost)
//                 console.log("amount notification is supposed to be set")
//             }

//             // if(!data || )
//         }else{
//             console.log("game finished")
//             setResetButtonVisibilityForEachOne(true)
//             setRollButtonVisibilityForEachOne(false)
//             // setReset(true)
//         }
//     }
//     //handle autospin
//     // const autoSpin = async () => {
//     //     if(!totalSpinCountForBothIg || !currentSpinCountForEachOneIg || !doubleSlutFromAppState) return;
//     //     const remainingSpins = totalSpinCountForBothIg-currentSpinCountForEachOneIg;
//     //     console.log("autospin remaining lol", remainingSpins)
//     //     setDisabledRollButtonForEachOneIg(true)
//     //     setAutoSpinButtonVisibilityForEachOne(false)

//     //     const asyncProcess = async (i:number,curBal:string,lcLocal:string) => {
//     //         let currentBalance = curBal;
//     //         const remSpins = i;
//     //         // console.log("remSpins: ",remSpins)
//     //         const curSpi = totalSpinCountForBothIg - remSpins + 1;
//     //         // console.log("curSpi: ",curSpi)
//     //         console.log("lc local: ",lcLocal)
//     //         if(curSpi===null || totalSpinCountForBothIg===null || !doubleSlutFromAppState) {
//     //             console.log("currentSpincountForEachOneIg or totalspincountForBothIg or emojistateformappstate doesn't exist");
//     //             console.log("currentSpinCountForEachOneIg: ",curSpi)
//     //             console.log("totalSpinCountForBothIg: ",totalSpinCountForBothIg)
//     //             console.log("doubleSlutFromAppState: ",doubleSlutFromAppState)
//     //             return;
//     //         };
//     //         if(!localBalanceForEachOneIg || !amountPerSpinForEachOneIg) return;

//     //         console.log("localBalanceForEachOneIg: ",localBalanceForEachOneIg, " amountPerSpinForEachOneIg: ",amountPerSpinForEachOneIg, "parceFloat(localBalanceForEachOneIg)-amountPerSpinForEachOneIg: ",(parseFloat(localBalanceForEachOneIg)-amountPerSpinForEachOneIg))
//     //         // setLocalBalanceForEachOneIg(lc=>{
//     //         //     if(!lc) return "0";
//     //         //     console.log("lc: ",lc)
//     //         //     return (parseFloat(lc)-amountPerSpinForEachOneIg).toString()
//     //         // })
//     //         setLocalBalanceForEachOneIg(lc=>(parseFloat(lcLocal)-amountPerSpinForEachOneIg).toString())
//     //         console.log("new localbalanceForEachOneIg: ",localBalanceForEachOneIg)
//     //         await new Promise(resolve => setTimeout(resolve, 500));

//     //         setCurrentSpinCountForEachOneIg(currentSpinCountForEachOneIg=>{
//     //             return curSpi;
//     //         })  
//     //         // console.log("here 3, currentSpin: ",curSpi, " totalSpin: ",totalSpinCountForBothIg, "updatedCount: ")

//     //         if(currentSpinCountForEachOneIg < totalSpinCountForBothIg){
//     //             setNewGameInTheSameSessionSignleGame(true)
//     //             const winnerEmojis = await getWinner()
//     //             // console.log("winnerEmojis: ",winnerEmojis)
//     //             const amountWonOrLost = await getAmountWonOrLost(winnerEmojis)
//     //             // console.log("amountWonOrLost: ",amountWonOrLost)
//     //             if(amountWonOrLost === undefined) {console.log("amountWinorLost undefined");return;};
//     //             setAmountWonOrLostStateForEachOne(amountWonOrLost)
//     //             setAmountNotificationForEachOneIg(true)
//     //             dispatch({
//     //                 type:"UPDATE_DOUBLE_SLUT",
//     //                 payload:{
//     //                     ...doubleSlutFromAppState, 
//     //                     currentSpin:curSpi,
//     //                     currentEmojis:winnerEmojis.toString(),
//     //                     currentAmount:parseFloat(lcLocal)-amountPerSpinForEachOneIg+amountWonOrLost
//     //                 }
//     //             })
//     //             const {data,error} = await updateDoubleSlut({id:doubleSlutFromAppState.id,currentSpin:curSpi,currentEmojis:winnerEmojis.toString(),currentAmount:(parseFloat(lcLocal)-amountPerSpinForEachOneIg+amountWonOrLost)});
//     //             if(error){
//     //                 toast({title:"Error",description:"Failed to update slot",variant:"destructive"})
//     //                 console.log("error updating slot: ",error)
//     //                 return;
//     //             }
//     //             if(data){
//     //                 // console.log("here 4 ")
//     //                 // console.log("successfully updated the database: ",data)

//     //                 // console.log("curBal: ",currentBalance)
//     //                 if(currentBalance && amountPerSpinForEachOneIg && profile?.id){
//     //                     // console.log("here c5")
//     //                     // const {data:profileData,error:profileError} = await getAndSetBalance({balance:(parseFloat(currentBalance)+amountWonOrLost).toString()},profile?.id);
//     //                     // if(profileError){
//     //                     //     toast({title:"Error",description:"Failed to update balance",variant:"destructive"})
//     //                     //     console.log("error updating balance: ",profileError)
//     //                     // }
                        
//     //                     // if([profileData]){
//     //                     //     // console.log("successfully updated the balance: ",profileData)
//     //                     //     // console.log("amount won or lost plus the balance: ",(parseFloat(userBalance)+amountWonOrLost), " amountWonOrLost: ",amountWonOrLost)
//     //                     //     // console.log("balance ", currentBalance, " + amountWonOrLost: ",amountWonOrLost, " = ", (parseFloat(currentBalance)+amountWonOrLost))
//     //                     //     //the problem is that the userBalance is not updated 
//     //                     //     //how can i solve it? 
//     //                     //     dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(currentBalance)+amountWonOrLost).toString()}})    
//     //                     // }
//     //                 }
//     //                 setDisabledRollButtonForEachOneIg(false)
//     //                 setAmountWonOrLostStateForEachOne(null)
//     //                 setAmountNotificationForEachOneIg(false)
//     //                 // setAmountNotificationForEachOneIg(true)
//     //                 console.log("here 6 6 6 ")
//     //                 console.log("localBalanceForEachOneIg: ",lcLocal, "amountWonOrLost: ",amountWonOrLost, "amountPerSpinForEachOneIg: ",amountPerSpinForEachOneIg, "parseFloat(lcLocal)+amountWonOrLost-amountPerSpinForEachOneIg: ",(parseFloat(lcLocal)-amountPerSpinForEachOneIg+amountWonOrLost), " ||||||    parseFloat(localBalanceForEachOneIg) + amountWonOrLost", parseFloat(lcLocal)+amountWonOrLost)
//     //                 setLocalBalanceForEachOneIg((parseFloat(lcLocal)-amountPerSpinForEachOneIg+amountWonOrLost).toString())
//     //                 return;
//     //             }
    
//     //             // if(!data || )
//     //         }else{
//     //             console.log("game finished")
//     //             setResetButtonVisibilityForEachOne(true)
//     //             setRollButtonVisibilityForEachOne(false)
//     //             // setReset(true)
//     //             return;
//     //         }
//     //     }
//     //     //spin twice 
//     //     for (let i = 0; i < remainingSpins; i++) {
//     //         // console.log("here: lol lol oll")
//     //         if(!profile || !profile.balance || !doubleSlutFromAppState) return;
//     //         const curProf = await getProfile(profile.id);
//     //         const curEmojiSlot = await getDoubleSlutById(doubleSlutFromAppState.id);
//     //         if(curProf.data){
//     //             await asyncProcess(remainingSpins-i, curProf.data.balance || "", curEmojiSlot.data?.currentAmount.toString() || "0");
//     //         }
//     //         await new Promise(resolve => setTimeout(resolve, 2000));
//     //     }
//     //     //alternative approach
//     //     // const executeSequentially = async (n:number) => {
//     //     // if (n <= 0) {
//     //     //         // Base case: all iterations completed
//     //     //         setAutoSpinButtonVisibilityForEachOne(true);
//     //     //         return;
//     //     //     }

//     //     //     // Execute asyncProcess and wait for it to complete
//     //     //     await asyncProcess();

//     //     //     // Wait for 1 second before starting the next iteration
//     //     //     await new Promise(resolve => setTimeout(resolve, 1000));

//     //     //     // Call executeSequentially recursively with n-1
//     //     //     await executeSequentially(n - 1);
//     //     // };
//     //     // await executeSequentially(3);
//     //     setAutoSpinButtonVisibilityForEachOne(true)
//     //     setRollButtonVisibilityForEachOne(true)
//     // }
    
//     //reset 
//     const resetTheGameForTheFirstOne = async () => {
//         setResetButtonVisibilityForTheFirstOne(false)
//         setDisableInputsForTheFirstOne(false)
//         const finishedGame = doubleSlutFromAppState;
//         if(!profile || !profile?.balance || !finishedGame || !doubleSlutFromAppState?.currentAmountFirst || finishedGame.currentAmountFirst===null) {
//             console.log("profile or localbalanceForEachOneIg don't exist")
//             return;
//         }
//         console.log("doubleSlutFromAppState?.currentAmountFirst: ",finishedGame?.currentAmountFirst, "parseFloat(profile?.balance): ",parseFloat(profile?.balance), "(doubleSlutFromAppState?.currentAmountFirst+parseFloat(profile?.balance)).toString(): ",(doubleSlutFromAppState?.currentAmountFirst+parseFloat(profile?.balance)).toString())
//         const {data,error} = await getAndSetBalance({balance:(finishedGame?.currentAmountFirst+parseFloat(profile?.balance)).toString()},profile?.id || "")
//         if(error || !data || !data[0] || !data[0].balance){
//             console.log("error at updating the balance at reseting, ",error)
//             return;
//         }
//         dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile?.balance)+finishedGame?.currentAmountFirst).toString()}})
//         dispatch({type:"UPDATE_DOUBLE_SLUT",payload:{...finishedGame, currentAmountFirst:0}})
//         const {data:updateDoubleSlutData,error:updateDoubleSlutError} = await updateEmojiSlot({id:finishedGame.id,currentAmount:0})
//         if(updateDoubleSlutError || !updateDoubleSlutData){
//             console.log("error at updating the emoji slot at reseting, ",updateDoubleSlutError)
//             return;
//         }
//         setLocalBalanceForEachOneIg("0")

//         console.log("reset")
//         dispatch({
//             type:"DELETE_DOUBLE_SLUT",
//             payload:null
//         })
//     }

//     //renew the balance
//     // const reNewTheBalance = async () => {
//     //     setResetRewardsButtonVisibilityForEachOne(false)
//     //     if(!profile) return;
//     //     const {data,error} = await getAndSetBalance({balance:"0"},profile.id);
//     //     dispatch({type:"UPDATE_USER",payload:{...profile, balance:"0"}})
//     //     setResetRewardsButtonVisibilityForEachOne(true)
//     // }
//     // //airdrop amount
//     // const airdropAmount = async () => {
//     //     setAirdropButtonVisibilityForEachOne(false)
//     //     if(!profile || !profile.balance) return;
//     //     const {data,error} = await getAndSetBalance({balance:(parseFloat(profile.balance)+1000).toString()},profile.id);
//     //     dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)+1000).toString()}})
//     //     setAirdropButtonVisibilityForEachOne(true)
//     // }
//     //check if there is a saved Emoji slot game and either set it to the saved game or a new game
//     useEffect(()=>{
//         // console.log("doubleSlutFromAppState: ",doubleSlutFromAppState)
//         //set first
//         if(!doubleSlutFromAppState?.spinzFirst || !doubleSlutFromAppState?.currentSpinFirst || !doubleSlutFromAppState?.entryAmountFirst || !doubleSlutFromAppState?.amountFirst || !doubleSlutFromAppState?.currentEmojisFirst || !doubleSlutFromAppState.currentAmountFirst) return;
//         if(doubleSlutFromAppState &&  doubleSlutFromAppState.spinzFirst > doubleSlutFromAppState.currentSpinFirst){
//             console.log("emoji slot exists and the game hasn't been finished: ", doubleSlutFromAppState)
//             setSetButtonVisibilityForTheFirstOne(false)
//             setResetButtonVisibilityForTheFirstOne(false)
//             setTotalBetAmountForDoubles(parseInt(doubleSlutFromAppState.entryAmountFirst.toString()));//here
//             setTotalSpinCountForTheFirstOne(parseInt(doubleSlutFromAppState.spinzFirst.toString()));
//             setAmountPerSpinForTheFirstOne(parseInt(doubleSlutFromAppState.amountFirst.toString())/parseInt(doubleSlutFromAppState.spinzFirst.toString()));
//             setCurrentEmojisForTheFirstOne(doubleSlutFromAppState.currentEmojisFirst.split(",")); 
//             setCurrentBetAmountForEachOneOfTheDoubles(parseInt(doubleSlutFromAppState.currentAmountFirst.toString()));//here
//             setCurrentSpinCountForTheFirstOne(parseInt(doubleSlutFromAppState.currentSpinFirst.toString()));
//             setRollButtonVisibilityForTheFirstOne(true)
//             setDisableInputsForTheFirstOne(true)
//             setLocalBalanceForTheFirstOne(doubleSlutFromAppState.currentAmountFirst.toString())
//             // setLocalBalanceForEachOneIg(doubleSlutFromAppState.currentAmount.toString())
//             // setAmount(doubleSlutFromAppState.amount);
//             // setSpinz(doubleSlutFromAppState.spinz);
//             // const emAr = doubleSlutFromAppState.currentEmojis.split(",");
//             // console.log("will set the emojis because the game of slot hasn't been finished: ",emAr)
//             // setEmojisArray(emAr);
//             // setReset(false)
//             // setSavedEmojiSlot(true)
//             // setCurrentSpinCountForEachOneIg(doubleSlutFromAppState.currentSpin)
//             // setDisabled(true);
//         }
//         else if (doubleSlutFromAppState && doubleSlutFromAppState.spinz === doubleSlutFromAppState.currentSpin && newGameInTheSameSessionSignleGame) {
//             console.log("new game in the same session")
//             setResetButtonVisibilityForEachOne(true)
//             setRollButtonVisibilityForEachOne(false)
//             setDisableInputsForEachOne(false)

//         }
//         else if (doubleSlutFromAppState && 
//                 doubleSlutFromAppState.spinz === doubleSlutFromAppState.currentSpin) {
//             console.log("game finished")
//             // setResetButtonVisibilityForEachOne(true)
//             setRollButtonVisibilityForEachOne(false)
//             setSetButtonVisibilityForEachOne(true)
//             setDisableInputsForEachOne(false)
//             //make the currentAmount 0
//             const updateBalanceFromInsideUseEffect = async () => {
//                 const {data:updateBalanceData, error:updateBalanceError} = await getAndSetBalance({balance:(parseFloat(profile?.balance || "0")+doubleSlutFromAppState.currentAmount).toString()},profile?.id || "")
//                 if(!updateBalanceData || updateBalanceError || !profile?.balance){
//                     console.log("error updating balance: ",updateBalanceError)
//                     return;
//                 }
//                 dispatch({type:"UPDATE_USER",payload:{...profile, balance:(parseFloat(profile.balance)+doubleSlutFromAppState.currentAmount).toString()}})

//                 const {data:updateDoubleSlutData,error:updateDoubleSlutError} = await updateDoubleSlut({id:doubleSlutFromAppState.id,currentAmount:0})
//                 if(updateDoubleSlutError || !updateDoubleSlutData){
//                     console.log("error updating the emoji slot: ",updateDoubleSlutError)
//                     return;
//                 }
//                 dispatch({type:"UPDATE_DOUBLE_SLUT",payload:{...doubleSlutFromAppState, currentAmount:0}})
//                 setLocalBalanceForEachOneIg("0")

//             }
//             if(doubleSlutFromAppState.currentAmount>0){
//                 updateBalanceFromInsideUseEffect();
//             }

//         }
//         else if(!doubleSlutFromAppState){
//             console.log("will set the default emoji values because the last game has been finished")
//             setSetButtonVisibilityForEachOne(true)
//             // setResetButtonVisibilityForEachOne(true)
//             setRollButtonVisibilityForEachOne(false)
//             setDisableInputsForEachOne(false)
//             // setDisabled(false)
//             // setReset(true)
//         }
//     },[doubleSlutFromAppState])

//     //space pressed
//     // useEffect(() => {
//     //     const handleKeyPress = (event: KeyboardEvent) => {
//     //         if (event.key === ' ') { // Check if the pressed key is space
//     //             event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
//     //             if(totalSpinCountForBothIg && currentSpinCountForEachOneIg && totalSpinCountForBothIg>currentSpinCountForEachOneIg){
//     //                 handleSpin(); // Call handleSpin function
//     //             }
//     //         }
//     //     };

//     //     // Add event listener for keydown event
//     //     document.addEventListener('keydown', handleKeyPress);

//     //     // Clean up event listener when component unmounts
//     //     return () => {
//     //         document.removeEventListener('keydown', handleKeyPress);
//     //     };
//     // }, [doubleSlutFromAppState,totalSpinCountForBothIg,currentSpinCountForEachOneIg]); // Empty dependency array to run this effect only once

    
//   return (
//     <div className='w-[90%] md:w-[50%] text-center flex flex-col md:flex-row'>
//         <div>
//             {amountNotificationForTheFirstOne  && amountWonOrLostStateForTheFirstOne && <AmountNotificationForEachOneIg visible={amountNotificationForTheFirstOne} message={amountWonOrLostStateForTheFirstOne.toString()}/>}
//         {amountWonOrLostStateForTheFirstOne===0 && amountNotificationForTheFirstOne && <AmountNotificationForEachOneIg visible={amountNotificationForTheFirstOne} message={amountWonOrLostStateForTheFirstOne.toString()}/>}

//         {amountNotificationForTheFirstOne &&  <div>cocksycker</div>}
//             {/* {
//                 !user &&
//                 <div className='tracking-tight text-center text-hotPink bg-black hover:bg-accent hover:text-accent-foreground rounded-xl' onClick={()=>{console.log("kenta")}}>
//                     <Auth>LOG IN TO PLAY</Auth>
//                 </div>
//             } */}
//             <div className={`flex flex-col justify-center align-center border w-[100%] border-white rounded-lg gap-4 p-4 ${!profile ? 'blur-sm' : ""}`}>
//                 <div className='flex justify-center items-center'>
//                     <p className='w-full text-center'>double SLEM 1st</p>
//                     <div>{localBalanceForTheFirstOne && <p>{localBalanceForTheFirstOne}</p>}</div>
//                 </div>
//                 <div className='w-full flex flex-col items-center gap-y-6'> 
//                     <div className='flex items-center gap-x-4 border border-white'>
//                         <div className=''>
//                             {amountPerSpinForTheFirstOne && <div className="text-left">APS: {amountPerSpinForTheFirstOne?.toFixed(3)}</div>}
//                         </div>
//                         <SlotCounter
//                             startValue={currentEmojisForTheFirstOne}
//                             startValueOnce={true}
//                             value={currentEmojisForTheFirstOne}
//                             charClassName='text-4xl'
//                             animateUnchanged
//                             autoAnimationStart={false}
//                             dummyCharacters={emojis}
//                             duration={0.5}
                            
//                         />
//                          {currentSpinCountForTheFirstOne && totalSpinCountForTheFirstOne && (
//                             <div className="text-right">spinz: {currentSpinCountForTheFirstOne}/{totalSpinCountForTheFirstOne}</div>
//                         )}
//                     </div>
//                     {/*  */}
//                     <Form {...firstSlutForm}>
//                         <form onSubmit={
//                             firstSlutForm.handleSubmit(initializeGame)
//                             // (e)=>{
//                             //     e.preventDefault();
//                             //     console.log("here");
//                             //     form.handleSubmit(onSubmit)
//                             // }
//                         } className="space-x-8 flex items-center">
//                             <FormField
//                             // disabled = {disabled}
//                             control={firstSlutForm.control}
//                             name="amount"
//                             render={({ field }) =>  (
//                                 <FormItem>
//                                 <FormLabel>Amount</FormLabel>
//                                 <FormControl>
//                                     <CustomInputForEmojiSlots disabled={disableInputsForTheFirstOne}  type='number' {...field} />
//                                 </FormControl>
//                                 <FormDescription>
//                                     Bet amount in $$$
//                                 </FormDescription>
//                                 <FormMessage />
//                                 </FormItem>
//                             )}
//                             />
//                             <FormField
//                             // disabled = {disabled}
//                             control={firstSlutForm.control}
//                             name="spinz"
//                             render={({ field }) => (
//                                 <FormItem>
//                                 <FormLabel>spinz</FormLabel>
//                                 <FormControl>
//                                     <CustomInputForEmojiSlots disabled={disableInputsForTheFirstOne} type='number' {...field} />
//                             </FormControl>
//                                 <FormDescription>
//                                     How many spinz you want
//                                 </FormDescription>
//                                 <FormMessage />
//                                 </FormItem>
//                             )}
//                             />
//                             <Button 
//                             disabled={!setButtonVisibilityForTheFirstOne} 
//                             type="submit"
//                             >set</Button>
//                         </form>
//                     </Form>
//                     {/*  */}
//                     {/* {!reset && <Button disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                     onClick={() => {handleSpin();}}>
//                         SPIN
//                     </Button>} */}
                    
//                     <Button 
//                     // disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} 
//                     disabled={!rollButtonVisibilityForTheFirstOne || disabledRollButtonForTheFirstOne}
//                     className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                     onClick={() => {handleSpin();}} onKeyDown={(e)=>{
//                         // if(e.key===" "){
//                         //     handleSpin();}
//                         // }
//                         console.log("key: ",e.key)
//                         }}>
//                         SPIN
//                     </Button>
//                     {/* {reset && <Button disabled={!amount} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                     onClick={() => {resetTheGame();}}>
//                         RESET
//                     </Button>} */}
//                         <Button 
//                         // disabled={!amount} 
//                         disabled={!resetButtonVisibilityForTheFirstOne}
//                         className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                         onClick={() => {resetTheGameForTheFirstOne();}}>
//                             RESET
//                         </Button>

//                         {/* <Button 
//                         // disabled={!amount} 
//                         disabled={!resetRewardsButtonVisibilityForEachOne}
//                         className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                         onClick={() => {reNewTheBalance();}}>
//                             RENEW BALANCE
//                         </Button>
//                         <Button 
//                         // disabled={!amount} 
//                         disabled={!airdropButtonVisibilityForEachOne}
//                         className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                         onClick={() => {airdropAmount();}}>
//                             AIRDROP 1000
//                         </Button> */}

//                         {/* <Button 
//                         // disabled={!amount} 
//                         disabled={!autoSpinButtonVisibilityForTheFirstOne}
//                         className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                         onClick={() => {autoSpin();}}>
//                             AUTOSPIN
//                         </Button> */}
//                 </div>
//             </div>
//         </div>
//         <div>
//             {amountNotificationForTheSecondOne  && amountWonOrLostStateForEachOne && <AmountNotificationForEachOneIg visible={amountNotificationForTheSecondOne} message={amountWonOrLostStateForEachOne.toString()}/>}
//         {amountWonOrLostStateForEachOne===0 && amountNotificationForTheSecondOne && <AmountNotificationForEachOneIg visible={amountNotificationForTheSecondOne} message={amountWonOrLostStateForEachOne.toString()}/>}

//         {amountNotificationForTheSecondOne &&  <div>cocksycker</div>}
//             {/* {
//                 !user &&
//                 <div className='tracking-tight text-center text-hotPink bg-black hover:bg-accent hover:text-accent-foreground rounded-xl' onClick={()=>{console.log("kenta")}}>
//                     <Auth>LOG IN TO PLAY</Auth>
//                 </div>
//             } */}
//             <div className={`flex flex-col justify-center align-center border w-[100%] border-white rounded-lg gap-4 p-4 ${!profile ? 'blur-sm' : ""}`}>
//                 <div className='flex justify-center items-center'>
//                     <p className='w-full text-center'>double SLEM</p>
//                     <div>{localBalanceForTheSecondOne && <p>{localBalanceForTheSecondOne}</p>}</div>
//                 </div>
//                 <div className='w-full flex flex-col items-center gap-y-6'> 
//                     <div className='flex items-center gap-x-4 border border-white'>
//                         <div className=''>
//                             {amountPerSpinForTheSecondOne && <div className="text-left">APS: {amountPerSpinForTheSecondOne?.toFixed(3)}</div>}
//                         </div>
//                         <SlotCounter
//                             startValue={currentEmojisForTheSecondOne}
//                             startValueOnce={true}
//                             value={currentEmojisForTheSecondOne}
//                             charClassName='text-4xl'
//                             animateUnchanged
//                             autoAnimationStart={false}
//                             dummyCharacters={emojis}
//                             duration={0.5}
                            
//                         />
//                          {currentSpinCountForTheSecondOne && totalSpinCountForTheSecondOne && (
//                             <div className="text-right">spinz: {currentSpinCountForTheSecondOne}/{totalSpinCountForTheSecondOne}</div>
//                         )}
//                     </div>
//                     {/*  */}
//                     <Form {...secondSlutForm}>
//                         <form onSubmit={
//                             secondSlutForm.handleSubmit(initializeSecondGame)
//                             // (e)=>{
//                             //     e.preventDefault();
//                             //     console.log("here");
//                             //     form.handleSubmit(onSubmit)
//                             // }
//                         } className="space-x-8 flex items-center">
//                             <FormField
//                             // disabled = {disabled}
//                             control={secondSlutForm.control}
//                             name="amount"
//                             render={({ field }) =>  (
//                                 <FormItem>
//                                 <FormLabel>Amount</FormLabel>
//                                 <FormControl>
//                                     <CustomInputForEmojiSlots disabled={disableInputsForTheSecondOne}  type='number' {...field} />
//                                 </FormControl>
//                                 <FormDescription>
//                                     Bet amount in $$$
//                                 </FormDescription>
//                                 <FormMessage />
//                                 </FormItem>
//                             )}
//                             />
//                             <FormField
//                             // disabled = {disabled}
//                             control={secondSlutForm.control}
//                             name="spinz"
//                             render={({ field }) => (
//                                 <FormItem>
//                                 <FormLabel>spinz</FormLabel>
//                                 <FormControl>
//                                     <CustomInputForEmojiSlots disabled={disableInputsForTheSecondOne} type='number' {...field} />
//                             </FormControl>
//                                 <FormDescription>
//                                     How many spinz you want
//                                 </FormDescription>
//                                 <FormMessage />
//                                 </FormItem>
//                             )}
//                             />
//                             <Button 
//                             disabled={!setButtonVisibilityForTheSecondOne} 
//                             type="submit"
//                             >set</Button>
//                         </form>
//                     </Form>
//                     {/*  */}
//                     {/* {!reset && <Button disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                     onClick={() => {handleSpin();}}>
//                         SPIN
//                     </Button>} */}
                    
//                     <Button 
//                     // disabled={!amount || !spinz || !savedEmojiSlot || spinButtonCooldown} 
//                     disabled={!rollButtonVisibilityForTheSecondOne || disabledRollButtonForTheSecondOne}
//                     className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                     onClick={() => {handleSpin();}} onKeyDown={(e)=>{
//                         // if(e.key===" "){
//                         //     handleSpin();}
//                         // }
//                         console.log("key: ",e.key)
//                         }}>
//                         SPIN
//                     </Button>
//                     {/* {reset && <Button disabled={!amount} className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                     onClick={() => {resetTheGame();}}>
//                         RESET
//                     </Button>} */}
//                         <Button 
//                         // disabled={!amount} 
//                         disabled={!resetButtonVisibilityForTheSecondOne}
//                         className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                         onClick={() => {resetTheGame();}}>
//                             RESET
//                         </Button>

//                         {/* <Button 
//                         // disabled={!amount} 
//                         disabled={!resetRewardsButtonVisibilityForEachOne}
//                         className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                         onClick={() => {reNewTheBalance();}}>
//                             RENEW BALANCE
//                         </Button>
//                         <Button 
//                         // disabled={!amount} 
//                         disabled={!airdropButtonVisibilityForEachOne}
//                         className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                         onClick={() => {airdropAmount();}}>
//                             AIRDROP 1000
//                         </Button>

//                         <Button 
//                         // disabled={!amount} 
//                         disabled={!autoSpinButtonVisibilityForTheSecondOne}
//                         className='rounded-full border border-hotPink w-[50%] bg-black hover:bg-accent hover:text-accent-foreground hover:text-hotPink text-hotPink text-2xl' 
//                         onClick={() => {autoSpin();}}>
//                             AUTOSPIN
//                         </Button> */}
//                 </div>
//             </div>
//         </div>
//     </div>
//     )
// }

// export default EmojiSlots