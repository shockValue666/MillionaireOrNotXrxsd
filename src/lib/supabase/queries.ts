"use server";
import { profile } from "console";
import { emojiSlot, gamble, hookTransactions, privateTab, profiles, tripleEmojiSlots } from "../../../migrations/schema";
import db from "./db";
import { DoubleSlut, EmojiSlot, Gamble, HookTransaction, PrivInfo, Profile, Subscription, TripleSlut } from "./supabase.types";
import { desc, eq } from "drizzle-orm";
import { doubleEmojiSlots } from "./schema";


export const addProfile = async (profile:Profile) => {
    const response = await db.insert(profiles).values(profile)
    return response;
}

export const getProfile = async (userId:string) => { 
    try {
        const response = await db.query.profiles.findFirst({
            where:((profile,{eq})=> eq(profile.id,userId))
        })
        return {data:response,error:null}
    } catch (error) {
        console.log('error at getting the profile: ',error);
        return {data:null,error:error}
    }
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
        const response = await db.insert(gamble).values(_gamble).returning()
        return {data:response,error:null}
    }
    catch(err){
        console.log("error at creating gamble: ",err)
        return {data:null,error:err}
    }
}

export const updateGamble = async (gambleInstance:Partial<Gamble>,gambleId:string) => {
    try {
        const response = await db.update(gamble).set(gambleInstance).where(eq(gamble.id,gambleId)).returning();
        return {data:response,error:null}
    } catch (error) {
        console.log("error at updating gamble: ",error)
        return {data:null,error:error}
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

export const getLatestGamble = async (userId: string) => {
    try{
        const latestGamble: Gamble | undefined = await db.query.gamble.findFirst({
            where: ((g, { eq }) => eq(g.userId, userId)),
            orderBy: desc(gamble.createdAt)
        })
        if(latestGamble){
            return {data:latestGamble,error:null}
        }else{
            return {data:null,error:"No data found"}
        }
    }catch(err){
        return {data:null,error:err}
    }
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

export const getAndSetBalance = async (profile:Partial<Profile>,profileId:string) => {
    try {
        const result = await db.update(profiles).set(profile).where(eq(profiles.id,profileId)).returning();
        return {data:result,error:null}   
    } catch (error) {
        console.log("error at updating balance: ",error)
        return {data:null,error:error}
    }
}

export const getEmojiSlot = async (profileId:string) => {
    try {
        const result = await db.query.emojiSlot.findFirst({
            where:((emojiSlot,{eq})=> eq(emojiSlot.profileId,profileId))
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const getEmojiSlotById = async (id:string) => {
    try {
        const result = await db.query.emojiSlot.findFirst({
            where:((emojiSlot,{eq})=> eq(emojiSlot.id,id))
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting emoji slot: ",error)
        return {data:null,error:error}
    }

}

export const getDoubleEmojiSlotById = async (id:string) => {

    try {
        const result = await db.query.doubleEmojiSlots.findFirst({
            where:((doubleSlut,{eq})=> eq(doubleSlut.id,id))
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const getTripleEmojiSlotById = async (id:string) => {
    try {
        const result = await db.query.tripleEmojiSlots.findFirst({
            where:((tripleSlut,{eq})=> eq(tripleSlut.id,id))
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const createEmojiSlot = async (emojiSlotInstance:EmojiSlot) => {
    try {
        const result = await db.insert(emojiSlot).values(emojiSlotInstance).returning();
        return {data:result,error:null}
    } catch (error) {
        console.log("error at setting emoji slot: ",error)
        return {data:null,error:error}
    }
}


export const updateEmojiSlot = async (emojiSlotInstance:Partial<EmojiSlot>) => {
    if(emojiSlotInstance.id === undefined) return {data:null,error:"id is required"}
    console.log("emojiSlotInstance: ",emojiSlotInstance)
    try {
        const result = await db.update(emojiSlot).set(emojiSlotInstance).where(eq(emojiSlot.id,emojiSlotInstance.id));
        return {data:result,error:null}
    } catch (error) {
        console.log("error at updating emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const getSlotsForUser = async (userId:string) => {
    try {
        const result = await db.query.emojiSlot.findMany({
            where:((emojiSlot,{eq})=> eq(emojiSlot.profileId,userId))
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting slots for user: ",error)
        return {data:null,error:error}
    }
}

export const getTotalSlotCount = async (userId:string) => {
    try {
        const result = await db.query.emojiSlot.findMany({
            where:((emojiSlot,{eq})=> eq(emojiSlot.profileId,userId))
        })
        if(result){
            const slotCount = result.length;
            return {data:slotCount,error:null}
        }
    } catch (error) {
        console.log("error at getting total slot count: ",error)
        return {data:null,error:error}
    }
}

export const getSlotPnl = async (userId:string) => {
    try {
        const result = await db.query.emojiSlot.findMany({
            where:((emojiSlot,{eq})=> eq(emojiSlot.profileId,userId))
        })
        if(result){
            const pnl = result.reduce((acc,slot)=>acc+slot.pnl,0)
            return {data:pnl,error:null}
        }
    } catch (error) {
        console.log("error at getting slot pnl: ",error)
        return {data:null,error:error}
    }
}

export const updateProfile = async (profileInstance:Partial<Profile>,profileId:string) => {
    try {
        const result = await db.update(profiles).set(profileInstance).where(eq(profiles.id,profileId)).returning();
        return {data:result,error:null}
    } catch (error) {
        console.log("error at updating profile: ",error)
        return {data:null,error:error}
    }
}

export const getEmojiSlotLatest = async (profileId:string) => {
    console.log("here trying to get latest emoji slot")
    try {
        const result: EmojiSlot | undefined = await db.query.emojiSlot.findFirst({
            where:((emojiSlot,{eq})=> eq(emojiSlot.profileId,profileId)),
            orderBy: desc(emojiSlot.createdAt)
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting emoji slot: ",error)
        return {data:null,error:error}
    }
}


export const getDoubleSlutLatest = async (profileId:string) => {
    console.log("here trying to get latest double slut")
    try {
        const result: DoubleSlut | undefined = await db.query.doubleEmojiSlots.findFirst({
            where:((doubleSluttt,{eq})=> eq(doubleSluttt.profileId,profileId)),
            //idk if this is correct
            orderBy: desc(doubleEmojiSlots.createdAt)
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const getTripleSlutLatest = async (profileId:string) => {
    console.log("here trying to get trirple slut")
    try {
        const result: TripleSlut | undefined = await db.query.tripleEmojiSlots.findFirst({
            where:((tripleSlut,{eq})=> eq(tripleSlut.profileId,profileId)),
            orderBy: desc(tripleEmojiSlots.createdAt)
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const createDoubleSlut = async (doubleSlutInstance:DoubleSlut) => {
    try {
        const result = await db.insert(doubleEmojiSlots).values(doubleSlutInstance).returning();
        return {data:result,error:null}
    } catch (error) {
        console.log("error at setting emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const createTripleSlut = async (tripleSlutInstance:TripleSlut) => {
    try {
        const result = await db.insert(tripleEmojiSlots).values(tripleSlutInstance).returning();
        return {data:result,error:null}
    } catch (error) {
        console.log("error at setting emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const updateDoubleSlut = async (doubleSlutInstance:Partial<DoubleSlut>) => {
    if(doubleSlutInstance.id === undefined) return {data:null,error:"id is required"}
    try {
        const result = await db.update(doubleEmojiSlots).set(doubleSlutInstance).where(eq(doubleEmojiSlots.id,doubleSlutInstance.id)).returning();
        return {data:result,error:null}
    } catch (error) {
        console.log("error at updating emoji slot: ",error)
        return {data:null,error:error}
    }

}

export const updateTripleSlut = async (tripleSlutInstance:Partial<TripleSlut>) => {
    if(tripleSlutInstance.id === undefined) return {data:null,error:"id is required"}
    try {
        const result = await db.update(tripleEmojiSlots).set(tripleSlutInstance).where(eq(tripleEmojiSlots.id,tripleSlutInstance.id)).returning();
        return {data:result,error:null}
    } catch (error) {
        console.log("error at updating emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const getDoubleSlutById = async (id:string) => {
    try {
        const result = await db.query.doubleEmojiSlots.findFirst({
            where:((doubleSlut,{eq})=> eq(doubleSlut.id,id))
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting emoji slot: ",error)
        return {data:null,error:error}
    }
}

export const getTripleSlutById = async (id:string) => {
    try {
        const result = await db.query.tripleEmojiSlots.findFirst({
            where:((tripleSlut,{eq})=> eq(tripleSlut.id,id))
        })
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getting emoji slot: ",error)
        return {data:null,error:error}
    }
}


export const getTotalPnlAndPointsForUser = async (id:string) => {
    const {data,error} = await getSlotsForUser(id);
    if(error || !data){
        console.log("error at getting slots for user: ",error)
        return {data:null, error:error}
    }
    //get the sum of points and pnl from each slot and return it after iterating through the data array
    let totalPnl = 0;
    let totalPoints = 0;
    data.forEach((slot)=>{
        totalPnl += slot.pnl;
        totalPoints += slot.points;
    })
    console.log("totalPoints: ",totalPoints, " totalPnl: ",totalPnl)
    return {
        data:{
            totalPoints,
            totalPnl
        },
        error:null
    }
}

export const getTotalPnlAndPointsForAllUsers = async () => {
    const usersTotal = await db.query.profiles.findMany();
    if(usersTotal){
        const totalPnlAndPoints = usersTotal.map(async (profile)=>{
        const {data,error} = await getTotalPnlAndPointsForUser(profile.id);
            if(error || !data){
                console.log("error at getting total pnl and points for user: ",error)
                return {data:null,error:error}
            }
            return {data};
        })
        return {data:totalPnlAndPoints, error:null};
    }
    return {data:null, error:"No data found"}
}

export const getUsersWithHighestPoints = async () => {
    const usersTotal = await db.query.profiles.findMany({
        orderBy:desc(profiles.points),
        limit:200
    });
    if(usersTotal){
        console.log("users total: ",usersTotal)
        return {data:usersTotal, error:null};
    }
    return {data:null, error:"No data found"}
}


// export const getAndSetBalance = async (profile:Partial<Profile>,profileId:string) => {
//     try {
//         const result = await db.update(profiles).set(profile).where(eq(profiles.id,profileId)).returning();
//         return {data:result,error:null}   
//     } catch (error) {
//         console.log("error at updating balance: ",error)
//         return {data:null,error:error}
//     }
// }


export const getAndSetPoints = async (profile:Partial<Profile>, profileId:string) => {
    try {
        const result = await db.update(profiles).set(profile).where(eq(profiles.id,profileId)).returning()
        return {data:result, error:null}
    }catch(err){
        console.log("error at getting and setting points: ",err)
        return {data:null, error:err}
    }
}