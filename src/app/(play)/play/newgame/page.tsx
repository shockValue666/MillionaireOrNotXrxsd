"use client";
import AmountNotification from '@/components/globals/amount-notification';
import ApsCurrentSpin from '@/components/globals/aps-current-spin';
import DevnetButtons from '@/components/globals/devnetButtons'
import LocalBalanceAndPoints from '@/components/globals/local-balance-and-points';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import SlotCounter from 'react-slot-counter';

const Page = () => {
    const [resetButtonVisibility, setResetButtonVisibility] = useState(false)
    const [setButtonVisibility, setSetButtonVisibility] = useState(false)
    const [resetRewardsButtonVisibility, setResetRewardsButtonVisibility] = useState(true)
    const [airdropButtonVisibility, setAirdropButtonVisibility] = useState(true)
    const [currentSpinCount, setCurrentSpinCount] = useState<number | null>(null)
    const [totalSpinCount, setTotalSpinCount] = useState<number | null>(null)
    const [amountPerSpin, setAmountPerSpin] = useState<number | null>(null)
    const [amountWonOrLostState, setAmountWonOrLostState] = useState<number | null>(null)
    const [pointsWonOrLostState, setPointsWonOrLostState] = useState<number | null>(null)
    const [amountNotification, setAmountNotification] = useState<boolean>(false)
    const [localBalance, setLocalBalance] = useState<string | null>("0")
    const [localPoints, setLocalPoints] = useState<number | null>(0)
    const [selected, setSelected] = useState<number | null>(null)

    const [value,setValue] = useState<number>(10000)
    const [beginGame, setBeginGame] = useState<boolean>(false)
    const [initializeVisibility, setInitializeVisibility] = useState<boolean>(false)

    const initializeGame = async () => {
        const response = await fetch("/api/generateGames",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                numberOfGames: 20,
                emojiArray: ["😈", "💀", "💩", "💰","🤑"]
            })
        })
        const res = await response.json()
        if(res.status===200){
            const games = res.games;
            console.log("games: ",games)
        }
        setBeginGame(true)
        setInitializeVisibility(false)
    }
    
  return (
    <div className='flex flex-col w-full items-center justify-center gap-y-8'>

        <div className='witems-center gap-x-4 text-[50px] md:text-[70px] lg:text-[100px]'>
            <div className='border border-white grid grid-cols-4'>
                <div className='border border-yellow-500'>
                    <DevnetButtons resetRewardsButtonVisibility={resetRewardsButtonVisibility} setButtonVisibility={setButtonVisibility} setResetRewardsButtonVisibility={setResetRewardsButtonVisibility} airdropButtonVisibility={airdropButtonVisibility} setAirdropButtonVisibility={setAirdropButtonVisibility} />
                </div>
                <div>
                    <ApsCurrentSpin currentSpin={currentSpinCount || 0} totalSpins={totalSpinCount || 0} aps={parseFloat(amountPerSpin?.toFixed(3) || "0") || 0}/>
                </div>
                <div className='border col-start-3 text-center border-yellow-500'>
                    <div>
                        <div>
                            {amountNotification  && amountWonOrLostState && <AmountNotification visible={amountNotification} message={amountWonOrLostState.toFixed(2).toString()}/>}
                            {amountWonOrLostState===0 && amountNotification && <AmountNotification visible={amountNotification} message={amountWonOrLostState.toString()}/>}
                        </div>
                        {/* <div className=''> Balance: {localBalance && <p>{parseFloat(localBalance).toFixed(2)}</p>}</div>
                        <div className=''> Points: {localPoints && <p>{localPoints.toFixed(2)}</p>}</div> */}

                        <LocalBalanceAndPoints localBalance={localBalance ? parseFloat(localBalance) : 0} localPoints={localPoints ? localPoints : 0}/>

                    </div>
                    <div>
                        {currentSpinCount && totalSpinCount && (<div className='py-4 '>
                            <Progress value={(currentSpinCount/totalSpinCount)*100} className='bg-[#3d4552]'/>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
        <div className='text-[50px] md:text-[70px] lg:text-[100px] w-[50%] flex justify-around'>
            <Button disabled={beginGame} onClick={() => {
                setSelected(1)
                setInitializeVisibility(true)
            }} className={cn('hover:bg-transparent',
                selected === 1 ? "bg-slate-600" : ""
            )}>0.5$ x 20 </Button>
            <Button disabled={beginGame} onClick={() => {
                setSelected(2)
                setInitializeVisibility(true)
            }} className={cn('hover:bg-transparent',
                selected === 2 ? "bg-slate-600" : ""
            )}>1.5$ x 20 </Button>
            <Button disabled={beginGame} onClick={() => {
                setSelected(3)
                setInitializeVisibility(true)
            }} className={cn('hover:bg-transparent',
                selected === 3 ? "bg-slate-600" : ""
            )}>2$ x 20 </Button>
        </div>
        <div className='text-[50px] md:text-[70px] lg:text-[100px]'>
            <SlotCounter
                startValue={"cock"}
                startValueOnce={true}
                value={value}
                charClassName='p-1'
                animateUnchanged
                autoAnimationStart={false}
                dummyCharacters={["3","3","3","3","3"]}
                duration={0.4}
                // separatorClassName='emojiSeparator'
                // valueClassName='text-4xl p-1'
                
            />
        </div>
        <div className='text-[50px] md:text-[70px] lg:text-[100px]'>
            {/* {beginGame ? (<Button onClick={
                () => {
                    const spin = Math.floor(Math.random() * 10000) + 1
                    setValue(spin)
                }
            }>
                Spin
            </Button>)
            :
            (<Button onClick={() => setBeginGame(true)}>
                Initialize game
            </Button>
            )
            } */}
            {
                initializeVisibility && (
                    <Button onClick={
                        initializeGame
                    }>
                        Initialize Game
                    </Button>
                )
            }
            {
                beginGame && (
                    <Button onClick={
                        async () => {
                            const spin = Math.floor(Math.random() * 10000) + 1
                            setValue(spin)
                            // const res = await 
                        }
                    }>
                        Spin
                    </Button>
                )
            }
        </div>
    </div>
  )
}

export default Page