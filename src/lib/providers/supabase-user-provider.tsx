"use client";

import { AuthUser, createClient } from "@supabase/supabase-js";
import { Profile, Subscription, User } from "../supabase/supabase.types";
import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getProfile, getUserFromUsersTable, getUserSubscriptionStatus } from "../supabase/queries";
import { useToast } from "@/components/ui/use-toast";

type SupabaseUserContextType = {
    user: AuthUser | null;
    subscription:Subscription | null;
    userFromUsersTable:User | null;
    profile:Profile | null;
}

const SupabaseUserContext = createContext<SupabaseUserContextType>({
    user:null,
    subscription:null,
    userFromUsersTable:null,
    profile:null
})

export const useSupabaseUser = ()=>{
    return useContext(SupabaseUserContext);
}

interface SupabaseUserProviderProps{
    children:React.ReactNode
}

export const SupabaseUserProvider:React.FC<SupabaseUserProviderProps> = ({children}) =>{
    const [user,setUser] = useState<AuthUser | null>(null)
    const [userFromUsersTable,setUserFromUsersTable] = useState<User | null>(null)
    const [subscription,setSubscription] = useState<Subscription | null>(null)
    const [profile,setProfile] = useState<Profile | null>(null)
    const {toast} = useToast();
    const supabase = createClientComponentClient()
    //fetch user details
    useEffect(()=>{
        const getUser = async () => {
            const {data:{user}} = await supabase.auth.getUser();
            if(user) {
                // console.log("user from my cock provider ",user)
                setUser(user);
                const userFromUsersTable = await getUserFromUsersTable(user.id);
                if(userFromUsersTable){
                    setUserFromUsersTable(userFromUsersTable);
                }
                const profile = await getProfile(user.id);
                // console.log("profile: ",profile)
                if(profile?.data){
                    setProfile(profile.data)
                }
                // const {data,error} = await getUserSubscriptionStatus(user.id)
                // if(data){
                //     setSubscription(data)
                // }
                // if(error){
                //     toast({
                //         title:"Unexpected Error",
                //         description:"Unexpected error during the fetch of subscription status"
                //     })
                // }
            }

        }
        getUser();
    },[supabase])
    return (<SupabaseUserContext.Provider value={{user,subscription,userFromUsersTable,profile}}>
        {children}
    </SupabaseUserContext.Provider>)
}