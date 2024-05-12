import { useAppState } from '@/lib/providers/state-provider';
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation';

const Points: React.FC = () => {
    const [points, setPoints] = React.useState<string>("0");
    const [visible, setVisible] = React.useState<boolean>(false);
    const {profile} = useAppState();

    const pathname = usePathname();

    // console.log("serach params from points: ",pathname)
    useEffect(()=>{
        // console.log("profile from points: ",profile)
        // console.log("profile points: ",profile?.points)
        if(profile && profile.points!==null){
            const bal = profile.points.toFixed(2)
            setPoints(bal)
        }
    },[profile])

    useEffect(()=>{
        if(pathname !== '/play'){
            setVisible(true)
        }else{
            setVisible(false)
        }
    },[pathname])
  

    return (
    <>
        {visible && <div className='relative'>
            <div className="md:top-15 left-4 top-0 md:left-10 bg-black text-hotPink py-2 px-4 rounded-lg shadow-xl flex items-center text-sm md:text-base">
                <span className="font-bold">Points: </span>
                <span className="ml-2 font-semibold">{points}</span>
            </div>
        </div>}
    </>
  )
}

export default Points
