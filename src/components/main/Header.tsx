"use client";
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Logo from '../../../public/logo.png'
import { Auth } from '../auth/auth'
import { Button } from '../ui/button'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { useAppState } from '@/lib/providers/state-provider';
import Adapter from '@/lib/wallet/adapter';
import WalletContextProvider from '@/lib/providers/wallet-context-provider';


const Header = () => {
    const [username,setUsername] = useState<string | null>(null);
    const [userId,setUserId] = useState<string | null>(null);
    const {user} = useSupabaseUser();
    const {userId:userIdAppState} = useAppState();
    useEffect(()=>{
        // console.log("user: ",user)
        if(user?.user_metadata?.email){
            setUsername(user.user_metadata.email.split("@")[0])
            setUserId(user.id)
        }
    },[user,userIdAppState])
  return (
    <div className="hidden md:flex justify-center items-center border border-b-white">
        <Link href="/" className=' flex gap-2 justify-left items-center hover:bg-accent hover:text-accent-foreground rounded-xl'>
            <div className='flex items-center p-4'>
                <Image src={Logo} alt="logo" height={70} width={70} className='rounded-full'/>
                {/* <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">Gamba Stonks</p> */}
                <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">hella rax</p>
            </div>
        </Link>

        <div className='hidden md:block w-full'>
            <ul className='flex justify-around w-full gap-8'>
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
                <Link href="/play" className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                        <div className='flex items-center p-4'>
                            <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">playc</p>
                        </div>
                    </Link>
                </li>
                <li>

                    <div className='bg-black flex items-center p-4 text-xl font-extrabold tracking-tight text-center text-hotPink uppercase'>
                        <WalletContextProvider>
                            <Adapter/>
                        </WalletContextProvider>
                    </div>

                </li>
                <li>
                    {username && (
                        <Link href={`/profile/${userId}`} className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                            <div className='flex items-center p-4'>
                                <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">{username}</p>
                            </div>
                        </Link>
                    )}
                    {!username && <Link href="" className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                        <div className='flex items-center p-4 text-xl font-extrabold tracking-tight text-center text-hotPink uppercase'>
                            <Auth>Login/signup</Auth>
                        </div>
                    </Link>}
                </li>
            </ul>
        </div>

    </div>
  )
}

export default Header