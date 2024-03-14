"use client";
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import React, { useState } from 'react'
import Image from 'next/image'
import WalletAddress from '@/components/profile/WalletAddress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PnL from '@/components/profile/PnL';
import Loader from '@/components/globals/Loader';
import PlayButton from "../../../../../public/playbutton.png"
import PlayButton3 from "../../../../../public/playbutton3.jpg"

const Page = () => {
    const [newProfilePicture, setNewProfilePicture] = useState<string | null>(null);
    const [amountToSend, setAmountToSend] = useState('');
    const {userFromUsersTable,profile,user} = useSupabaseUser();

    // Function to handle profile picture upload
    const handleProfilePictureUpload = async () => {
        if (newProfilePicture) {
        // await updateUserProfilePicture(user.id, newProfilePicture);
        // Optionally, fetch updated user data after profile picture update
        // updateUserProfileData();
        }
    };

    // Function to handle money transfer
    const handleMoneyTransfer = async () => {
        // await sendMoney(user.address, amountToSend);
        // Optionally, display a success message or update user balance
    };
  return (
    <div className='flex justify-center items-center flex-col gap-y-16'>
      <h1>Welcome!</h1>
      <div>
        <div className="flex items-center gap-x-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`${userFromUsersTable?.avatarUrl}`} alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.username}</p>
            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
      </div>
      <div className='flex gap-x-8 w-[50%] items-center'>

        address:{!profile && <Loader/>} {profile?.address && <WalletAddress address={profile?.address}/>}
      </div>
      <div>
      <button className="relative overflow-hidden" onClick={()=>{console.log("yooo")}}>
        <Image src={PlayButton3} height={150} width={150} alt="Button Image" className="transition-transform duration-300 ease-in-out transform hover:scale-95" />
      </button>

      </div>
      <PnL/>
    </div>
  )
}

export default Page