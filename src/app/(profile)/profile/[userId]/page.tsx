"use client";
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import WalletAddress from '@/components/profile/WalletAddress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PnL from '@/components/profile/PnL';
import Loader from '@/components/globals/Loader';
import PlayButton from "../../../../../public/playbutton.png"
import PlayButton3 from "../../../../../public/playbutton3.jpg"
import { useAppState } from '@/lib/providers/state-provider';
import { getAndSetBalance, getProfile } from '@/lib/supabase/queries';
import {GamesPlayed} from '@/components/profile/GamesPlayed';
import DemoPage from '@/components/profile/gametable/page';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import InputFile from '@/components/globals/input-file';
import EditProfileDialog from '@/components/profile/edit-profile-dialog';
import { Button } from '@/components/ui/button';
import AdCreationDialog from '@/components/profile/create-ad-dialog';
import { fetchAndRefreshBalance } from '@/lib/server-actions/auth-actions';

//wip create notification after proifle update and ad creation


const Page = () => {
    const [newProfilePicture, setNewProfilePicture] = useState<string | null>(null);
    const [amountToSend, setAmountToSend] = useState('');
    const {userFromUsersTable,profile,user} = useSupabaseUser();
    const [address,setAddress] = useState<string | null>(null)
    const {userId,profile:appStateProfile} = useAppState();
    const [amountInDollars,setAmountInDollars] = useState<string>("0");
    const supabase = createClientComponentClient();

    const [isCooldown, setIsCooldown] = useState(false);



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
    // useEffect(()=>{
    //     if(profile?.address){
    //         setAddress(profile?.address)
    //     }
    // },[profile])
    
    //transform SOL to USDT
    const solToDollars = async (amount:string):Promise<string> => {
      return "2";
    }

    useEffect(()=>{
      console.log("appstateprofile: ",appStateProfile)
      if(appStateProfile){
        console.log("appStateProfile?.address: ",appStateProfile?.address)
        setAddress(appStateProfile?.address)
      }
    },[appStateProfile])

    useEffect(()=>{
      if(profile?.balance){
        solToDollars(profile.balance).then((res)=>{
          setAmountInDollars(res)
        })
      }
      const getAvatar = async () => {
        if(profile && profile?.avatar){
          setNewProfilePicture(profile.avatar)
          console.log("profile.avatar: ",profile.avatar)
          // const {data,error} = await supabase.storage.from('avatars').upload(`${user?.id}.png`,eve/nt.target.files?.[0] as File,{upsert:true});
          // const getIt = supabase.storage.from('avatars').getPublicUrl(response.avatarUrl).data.publicUrl : ""
          // const getIt = supabase.storage.from('avatars').getPublicUrl()
        }
      } 
      getAvatar();
    },[profile])


    const handleRefresh = async () => {
      setIsCooldown(true);
      console.log("refreshing balance");
      if(!userId || !address) return;
      const updatedBalance = await fetchAndRefreshBalance({userId:userId,address:address})
      console.log("updatedBalance: ",updatedBalance)


      setTimeout(() => {
        setIsCooldown(false);
      }, 5000);

    }
  return (
    <div className='flex justify-center items-center flex-col gap-y-16'>
      <h1>Welcome!</h1>
      <div>
        <div className="flex items-center gap-x-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://ytrtdcbrzjpyjpjqmhub.supabase.co/storage/v1/object/public/prof_pics/${profile?.avatar}`} alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.username}</p>
            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
          {/* <div className="ml-auto font-medium">+${amountInDollars}</div> */}
        </div>
        {/* <InputFile/> */}
        <div className='m-4 flex items-center  justify-center'>
            <EditProfileDialog>
              <div className="text-hotPink bg-black text-md hover:bg-accent p-4 rounded-lg">
                  EDIT PROFILE
              </div>
            </EditProfileDialog>
        </div>
        <div className='m-4 flex items-center justify-center'>
            <AdCreationDialog>
              <div className="text-hotPink bg-black text-md hover:bg-accent p-4 rounded-lg">
                  CREATE AD
              </div>
            </AdCreationDialog>
        </div>
      </div>
      <div className='flex gap-x-8 w-[100%] justify-center items-center'>

        address:{!address && <Loader/>} {address && <WalletAddress address={address}/>}
        <Button 
        onClick={handleRefresh}
        disabled={isCooldown}
        className="bg-black text-hotPink hover:bg-accent hover:text-accent-foreground py-2 px-4 rounded-md text-xl" >
          Refresh Balance
        </Button>
      </div>
      {/* <div>
      <button className="relative overflow-hidden" onClick={()=>{console.log("yooo")}}>
        <Image src={PlayButton3} height={150} width={150} alt="Button Image" className="transition-transform duration-300 ease-in-out transform hover:scale-95" />
      </button>

      </div> */}
      <PnL/>
      {/* <GamesPlayed/> */}
      <DemoPage/>
    </div>
  )
}

export default Page