"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import TokenInfo from './token-info'
import solanasvg from '../../../public/solana-sol-logo.svg'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HandCoinsIcon, LucideHandCoins, Settings2 } from 'lucide-react'
import { DexScreenerPair as DexScreenerPairType } from '@/lib/supabase/supabase.types';

const BUY_BUTTONS = [
    { id: 1, value: 0.25 },
    { id: 2, value: 0.5 },
    { id: 3, value: 1 },
    { id: 4, value: 2 },
    { id: 5, value: 5 },
    { id: 6, value: 10 },
]

const SELL_BUTTONS = [
    { id: 1, value: 25 },
    { id: 2, value: 33 },
    { id: 3, value: 50 },
    { id: 4, value: 66 },
    { id: 5, value: 75 },
    { id: 6, value: 100 },
]

interface Props {
    poolInfo?:DexScreenerPairType
}

const NewTradeForm:React.FC<Props> = ({
    poolInfo
}) => {
    const [buy,setBuy] = useState(true)
    const [loading,setLoading] = useState(false)
    const [amountBuyClicked, setAmountBuyClicked] = useState<number | null>(null)
    const [amountSellClicked, setAmountSellClicked] = useState<number | null>(null)
    const [customBuyAmount, setCustomBuyAmount] = useState<number | null>(null)
    const [customSellAmount, setCustomSellAmount] = useState<number | null>(null)
    const [slippageBuy,setSlippageBuy] = useState<number>(30)
    const [slippageSell,setSlippageSell] = useState<number>(30)
    const [priorityFeeBuy,setPriorityFeeBuy] = useState<number>(0.0015)
    const [priorityFeeSell,setPriorityFeeSell] = useState<number>(0.0015)


    const handleBuy = async () => {
        console.log("some bullshit idek")
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("soem more shit ")
        const buyOrder = {
            amount: amountBuyClicked ? amountBuyClicked : customBuyAmount,
            slippage: slippageBuy,
            priorityFee: priorityFeeBuy,
            buy: true,
            sell: false
        }
        console.log("buy order",buyOrder)
    }
    const handleSell = async () => {
        
    }
  return (
    <div className=' flex flex-col md:flex-row gap-y-16 md:gap-y-0 justify-around '>
        <TokenInfo poolInfo={poolInfo}/>
        <Tabs defaultValue="buy" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">buy</TabsTrigger>
                <TabsTrigger value="sell">sell</TabsTrigger>
            </TabsList>
            <TabsContent value="buy">
                <Card>
                {/* <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                    Make changes to your account here. Click save when you're done.
                    </CardDescription>
                </CardHeader> */}
                <CardContent>
                    <div className='flex flex-wrap gap-4 justify-center items-center p-4'>
                        {BUY_BUTTONS.map(button=>(
                            <div key={button.id}>  
                                <Button className={cn('flex items-center justify-center w-24 h-12 border border-gray-600 rounded-full text-white bg-gray-900 hover:bg-gray-700 transition-colors duration-300',
                                    button.id === amountBuyClicked && 'bg-gray-700'
                                )}
                                onClick={()=>{
                                    setAmountBuyClicked(button.id)
                                    setCustomBuyAmount(null)
                                }}
                                >
                                    <Image src={solanasvg} alt="sol logo" className='w-4 h-4 mr-2'/> 
                                    {button.value}
                                </Button>
                            </div>
                        ))}
                        <div className='flex items-center w-full'>
                            <Image src={solanasvg} alt="solana logo" className='w-4 h-4 mr-2' />
                            <Input value={customBuyAmount ? customBuyAmount : ''} onChange={(e)=>{setCustomBuyAmount(parseFloat(e.target.value));setAmountBuyClicked(null)}} type="number" placeholder='Amount to buy in SOL'/>
                        </div>
                    </div>
                </CardContent>
                  <hr className="border-t-1 text-center w-[75%] mx-auto border-gray-300 my-4"/>
                <CardContent>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                        <AccordionTrigger><Settings2/>Advanced Settings</AccordionTrigger>
                        <AccordionContent>
                            <div className='flex flex-col w-full px-1'>
                                <div className='flex w-[100%] gap-x-2'>
                                    <div className='flex flex-col justify-cetner gap-y-2'>
                                        <Label htmlFor='slippage'>slippage(%)</Label>
                                        <Input placeholder={slippageBuy.toString() + "%"} onChange={(e)=>{setSlippageBuy(e.target.valueAsNumber)}} id="slippage" type="number"></Input>
                                    </div>
                                    <div className='flex flex-col justify-cetner gap-y-2'>
                                        <Label htmlFor='slippage'>max fee(SOL)</Label>
                                        <Input placeholder={priorityFeeBuy.toString() + " SOL"} onChange={(e)=>{setPriorityFeeBuy(e.target.valueAsNumber)}} id="slippage" type="number"></Input>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
                <CardFooter className=''>
                    <Button onClick={()=>{handleBuy()}} className='w-full rounded-md'><LucideHandCoins className='mr-2'/> Quick Buy</Button>
                </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="sell">
                <Card>
                {/* <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                    Make changes to your account here. Click save when you're done.
                    </CardDescription>
                </CardHeader> */}
                <CardContent>
                    <div className='flex flex-wrap gap-4 justify-center items-center p-4'>
                        {SELL_BUTTONS.map(button=>(
                            <div key={button.id}>  
                                <Button className={cn('flex items-center justify-center w-24 h-12 border border-gray-600 rounded-full text-white bg-gray-900 hover:bg-gray-700 transition-colors duration-300',
                                    button.id === amountSellClicked && 'bg-gray-700'
                                )}
                                onClick={()=>{
                                    setAmountSellClicked(button.id)
                                    setCustomSellAmount(null)
                                }}
                                >
                                    {/* <Image src={solanasvg} alt="sol logo" className='w-4 h-4 mr-2'/>  */}
                                    {button.value}%
                                </Button>
                            </div>
                        ))}
                        <div className='flex items-center w-full'>
                            <Image src={solanasvg} alt="solana logo" className='w-4 h-4 mr-2' />
                            <Input value={customSellAmount ? customSellAmount : ''} onChange={(e)=>{setCustomSellAmount(parseFloat(e.target.value));setAmountSellClicked(null)}} type="number" placeholder='Amount to buy in SOL'/>
                        </div>
                    </div>
                </CardContent>
                  {/* <hr className="border-t-1 text-center w-[75%] mx-auto border-gray-300 my-4"/> */}
                <CardContent>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                        <AccordionTrigger><Settings2/>Advanced Settings</AccordionTrigger>
                        <AccordionContent>
                            <div className='flex flex-col w-full px-1'>
                                <div className='flex w-[100%] gap-x-2'>
                                    <div className='flex flex-col justify-cetner gap-y-2'>
                                        <Label htmlFor='slippage'>slippage(%)</Label>
                                        <Input placeholder={slippageSell.toString() + "%"} onChange={(e)=>{setSlippageSell(e.target.valueAsNumber)}} id="slippage" type="number"></Input>
                                    </div>
                                    <div className='flex flex-col justify-cetner gap-y-2'>
                                        <Label htmlFor='slippage'>max fee(SOL)</Label>
                                        <Input placeholder={priorityFeeSell.toString() + " SOL"} onChange={(e)=>{setPriorityFeeSell(e.target.valueAsNumber)}} id="slippage" type="number"></Input>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
                <CardFooter className=''>
                    <Button onClick={()=>{handleSell()}} className='w-full rounded-md'><HandCoinsIcon className='mr-2'/> Quick Sell</Button>
                </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default NewTradeForm