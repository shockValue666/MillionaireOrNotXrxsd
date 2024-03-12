"use server";
import { gamble, privateTab, profiles } from "../../../migrations/schema";
import db from "./db";
import { Gamble, PrivInfo, Profile, Subscription } from "./supabase.types";


export const addProfile = async (profile:Profile) => {
    const response = await db.insert(profiles).values(profile)
    return response;
}

export const getProfile = async (userId:string) => { 
    const response = await db.query.profiles.findFirst({
        where:((profile,{eq})=> eq(profile.id,userId))
    })
    return response;
}

export const getUserSubscriptionStatus = async (userId:string) =>{

    try {
        const data = await db.query.subscriptions.findFirst({
            where:((subscription,{eq})=> eq(subscription.userId,userId))
        })
        if(data){
            return {
                data:data as Subscription,
                error:null
            }
        }else{
            return {
                data:null,
                error:null
            }
        }
    } catch (error) {
        console.log("error: ",error)
        return {
            data:null,
            error:`Error: ${error}`
        }
    }
}

export const addGamble = async (_gamble:Gamble) => {
    try
    {
        const response = await db.insert(gamble).values(_gamble)
        console.log("successfully created gamble: ",response)   
        return {data:response,error:null}
    }
    catch(err){
        console.log("error at creating gamble: ",err)
        return {data:null,error:err}
    }
}

export const addNewPrivInfo = async (priv:PrivInfo) => {
    try {
        const response = await db.insert(privateTab).values(priv)
        console.log("successfully created privInfo: ",response)   
        return {data:response,error:null}
    } catch (error) {
        console.log("error at creating privInfo: ",error)
        return {data:null,error:error}
    }
}

export const getUserFromUsersTable = async (userId:string) => {
    const response = await db.query.users.findFirst({
        where:((user,{eq})=> eq(user.id,userId))
    })
    return response;
}