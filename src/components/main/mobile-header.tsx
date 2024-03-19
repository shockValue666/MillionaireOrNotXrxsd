"use client";
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Logo from '../../../public/logo.png'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { CgMenuRound } from "react-icons/cg";
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { Auth } from '../auth/auth'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAppState } from '@/lib/providers/state-provider';
import { getProfile } from '@/lib/supabase/queries';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/supabase/supabase.types';


const SHEET_SIDES = ["top", "right", "bottom", "left"] as const
 
type SheetSide = (typeof SHEET_SIDES)[number]
 

const MobileHeader = () => {
    const [username,setUsername] = useState<string | null>(null);
    const [userId,setUserId] = useState<string | null>(null);
    const [proprof,setProprof] = useState<Profile | null>(null);
    const supabase = createClientComponentClient()
    const {user} = useSupabaseUser();
    const {userId:userIdFromAppState} = useAppState()
    const router = useRouter();
    const {dispatch} = useAppState();
    useEffect(()=>{
        
        if(userIdFromAppState){
            const getProfileFromDatabase = async ()=>{
                const pro = await getProfile(userIdFromAppState);
                if(pro.data){
                    setUsername(pro.data?.email.split("@")[0])
                    setProprof(pro.data)
                }
            }
            getProfileFromDatabase();
        }else{
            setUsername(null);
        }

    },[userIdFromAppState])
  return (
    <div className='flex md:hidden justify-between w-full items-center'>
        <Link href="/" className=' flex gap-2 justify-left items-center hover:bg-accent hover:text-accent-foreground rounded-xl'>
            <div className='flex items-center p-4'>
                <Image src={Logo} alt="logo" height={70} width={70} className='rounded-full'/>
                {/* <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">Gamba Stonks</p> */}
                <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">hella rax</p>
            </div>
        </Link>
        <div className="grid grid-cols-1 gap-2">
            {/* {SHEET_SIDES.map((side) => ( */}
                <Sheet>
                <SheetTrigger asChild className=''>
                    <Button variant="outline"><CgMenuRound color='pink' fontSize={'50px'} /></Button>
                </SheetTrigger>
                <SheetContent side={"bottom"}>
                    <div className='flex flex-col w-full items-center gap-y-8'>
                        <ul>
                            <li>
                                <Link href="/trading" className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                                    <div className='flex items-center p-4'>
                                        <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">Trading</p>
                                    </div>
                                </Link>
                            </li>
                            <li>
                            <Link href="/leaderboard" className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                                    <div className='flex items-center p-4'>
                                        <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">leaderboard</p>
                                    </div>
                                </Link>
                            </li>
                            <li>
                            <Link href="/buy" className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                                    <div className='flex items-center p-4'>
                                        <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">buy</p>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                {username && (
                                    <Link href={`/profile/${userId}`} className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                                        <div className='flex items-center p-4'>
                                            <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">{username}</p>
                                        </div>
                                    </Link>
                                )}
                                {username ? 
                                <Link href="" className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>

                                    <Button
                                    onClick={async ()=>{
                                        await supabase.auth.signOut();
                                        if(!proprof) return;
                                        dispatch({type:"DELETE_USER",payload:proprof})
                                        router.replace('/profile');
                                    }}
                                    className='flex hover:bg-accent hover:text-accent-foreground rounded-xl items-center p-4 text-xl font-extrabold tracking-tight text-center text-hotPink uppercase bg-black'>
                                        Logout
                                    </Button>
                                </Link>
                                :
                                <Link href="" className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                                    <div className='flex items-center p-4 text-xl font-extrabold tracking-tight text-center text-hotPink uppercase'>
                                        <Auth>Login/signup</Auth>
                                    </div>
                                </Link>
                                
                                }
                            </li>
                        </ul>
                    </div>
                </SheetContent>
                </Sheet>
            {/* ))} */}
        </div>
    </div>
  )
}

export default MobileHeader