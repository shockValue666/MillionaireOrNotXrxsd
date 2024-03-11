import { profiles } from "../../../migrations/schema";
import db from "./db";
import { Profile, Subscription } from "./supabase.types";


export const addProfile = async (profile:Profile) => {
    const response = await db.insert(profiles).values(profile)
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