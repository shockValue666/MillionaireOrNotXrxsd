import Link from 'next/link';
import React from 'react'
import Image from 'next/image'
import Logo from '../../../public/logo.png'

interface ConcurrentGamesNavProps {
    setNumberOfGames: React.Dispatch<React.SetStateAction<number>>
}

const ConcurrentGamesNav:React.FC<ConcurrentGamesNavProps> = ({setNumberOfGames}) => {
  return (
    <div className="flex justify-center  items-center border border-b-white">
        <button onClick={()=>{setNumberOfGames(1)}} className=' flex gap-2 justify-left items-center hover:bg-accent hover:text-accent-foreground rounded-xl'>
            <div className='flex items-center p-4'>
                {/* <Image src={Logo} alt="logo" height={70} width={70} className='rounded-full'/> */}
                {/* <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">Gamba Stonks</p> */}
                <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">1 Slut</p>
            </div>
        </button>
        <button onClick={()=>{setNumberOfGames(2)}} className=' flex gap-2 justify-left items-center hover:bg-accent hover:text-accent-foreground rounded-xl'>
            <div className='flex items-center p-4'>
                {/* <Image src={Logo} alt="logo" height={70} width={70} className='rounded-full'/> */}
                {/* <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">Gamba Stonks</p> */}
                <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">2 Sluts</p>
            </div>
        </button>
        <button onClick={()=>{setNumberOfGames(3)}} className=' flex gap-2 justify-left items-center hover:bg-accent hover:text-accent-foreground rounded-xl'>
            <div className='flex items-center p-4'>
                {/* <Image src={Logo} alt="logo" height={70} width={70} className='rounded-full'/> */}
                {/* <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">Gamba Stonks</p> */}
                <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">3 sluts</p>
            </div>
        </button>

        {/* <div className='hidden md:block w-full'>
            <ul className='flex justify-around w-full gap-8'>
                <li>
                    <Link href="/play" className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                        <div className='flex items-center p-4'>
                            <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">playc</p>
                        </div>
                    </Link>
                </li>
                <li>
                    <div className='bg-black flex items-center p-4 text-xl font-extrabold tracking-tight text-center text-hotPink uppercase'>
                            <Link href="" className='flex hover:bg-accent hover:text-accent-foreground rounded-xl'>
                                <div className='flex items-center p-4'>
                                    <p className="text-xl font-extrabold tracking-tight text-center text-hotPink uppercase">more</p>
                                </div>
                            </Link>
                    </div>

                </li>
            </ul>
        </div> */}

    </div>
  )
}

export default ConcurrentGamesNav