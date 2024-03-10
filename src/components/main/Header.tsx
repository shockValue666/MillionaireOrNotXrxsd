import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import Logo from '../../../public/logo.png'


const Header = () => {
  return (
    <div className="flex justify-center items-center border border-b-white">
        <Link href="/" className=' flex gap-2 justify-left items-center hover:bg-accent hover:text-accent-foreground rounded-xl'>
            <div className='flex items-center p-4'>
                <Image src={Logo} alt="logo" height={70} width={70} className='rounded-full'/>
                <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">Gamba Stonks</p>
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
            </ul>
        </div>

    </div>
  )
}

export default Header