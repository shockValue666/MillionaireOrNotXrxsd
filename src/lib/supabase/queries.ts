"use server";
import { gamble, hookTransactions, privateTab, profiles } from "../../../migrations/schema";
import db from "./db";
import { Gamble, HookTransaction, PrivInfo, Profile, Subscription } from "./supabase.types";


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

export const calculatePNLForUser = async (userId: string) => {
    // Fetch all gambles for the specific user
    // const userGambles = await gamble.find({ userId });
    const userGambles = await db.query.gamble.findMany({
        where: ((g, { eq }) => eq(g.userId, userId))
    })

    // Separate gambles based on status (true or false)
    const winningGambles = userGambles.filter(g => g.status === true);
    const losingGambles = userGambles.filter(g => g.status === false);

    // Calculate profit and loss
    const profit = winningGambles.reduce((acc, g) => acc + parseFloat(g.amount), 0);
    const loss = losingGambles.reduce((acc, g) => acc + parseFloat(g.amount), 0);

    // Calculate PNL
    const pnl = profit - loss;

    return pnl;
}

export const getGamesPlayed = async (userId: string) => {
    const gamesPlayed = await db.query.gamble.findMany({
        where: ((g, { eq }) => eq(g.userId, userId))
    })
    return gamesPlayed.length;
}

export const saveTransactionHook = async (transactionHook:HookTransaction) => {
    try {
        const response = await db.insert(hookTransactions).values(transactionHook)
        console.log("successfully created transactionHook: ",response)
        return {data:response,error:null}
    } catch (error) {
        console.log("error at creating transactionHook: ",error)
        return {data:null,error:error}
    }
}