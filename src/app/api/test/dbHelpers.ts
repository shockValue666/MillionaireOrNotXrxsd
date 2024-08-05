import * as dotenv from 'dotenv';;
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
import { createClient } from '@supabase/supabase-js';
import { v4 } from 'uuid';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { swap_from_sol_to_usdc } from './stack/swap';

const supabase = createClient(supabaseUrl, supabaseKey);

type ServerTransaction = {
    sent_to_swapper:boolean,
    amount_sent_to_swapper_in_sol:number,
    swapped_to_usdc_in_swapper:boolean,
    usdc_amount:number,
    user_id:string,
    send_sol_to_swapper_signature:string,
    swap_sol_to_usdc_signature:string,
    type:string,
    send_to_user_wallet_signature:string,

}

export const signatureExists = async (signature:string) => {
    // const supabase = createClient(supabaseUrl, supabaseKey);
    const {data,error} = await supabase.from("trannies").select("*").eq("signature", signature);
    if(error){
        console.log("error: ",error)
    }
    if(data && Array.isArray(data) && data.length>0){
        console.log("data from signature exists: ",data)
        return true
    }else{
        return false
    }
}

export const addTranny = async (signature:string) => {
    // const supabase = createClient(supabaseUrl, supabaseKey);
    const {data,error} = await supabase.from("trannies").insert({signature:signature, id:v4(), created_at: new Date().toISOString()}).returns();
    if(error){
        console.log("tranny couldn't be uploaded error: ",error)
        return {data:null, error}
    }
    if(data){
        console.log("tranny successfully inserted: ",data)
        return {data, error:null}
    }
    return {data:null, error:null}
}

export const findTransactionTypeNative = async (nativeTransfers:any):Promise<{transactionType:string, involvedAddress:any}> => {
    // const supabase = createClient(supabaseUrl, supabaseKey);
    const transaction = nativeTransfers[0]
    const from = transaction.fromUserAccount;
    const to = transaction.toUserAccount;

    const {data,error} = await supabase.from("profiles").select("*").in("address", [from, to]);
    if(error){
        console.log("error: ",error)
        return {transactionType:"erorr",involvedAddress:null};
    }
    if(data && Array.isArray(data) && data.length>0){

        const fromExists_withdraw = data.some(profile=>{
            return profile.address === from 
        })
        const toExists_deposit = data.some(profile=>{
            return profile.address===to
        })
        console.log("fromExists_withdraw: ",fromExists_withdraw,"toExists_deposit: ",toExists_deposit)
        if(fromExists_withdraw && toExists_deposit){
            return {transactionType:"internal",involvedAddress:null};
        }
        if(fromExists_withdraw && !toExists_deposit){
            return {transactionType:"withdrawal",involvedAddress:from};
        }
        if(!fromExists_withdraw && toExists_deposit){
            return {transactionType:"deposit",involvedAddress:to};
        }
        if(!fromExists_withdraw && !toExists_deposit){
            return {transactionType:"somethingElse",involvedAddress:null};
        }
    }
    return { transactionType: "unknown", involvedAddress: null };
    
}

export const fetch_user_from_public_key = async (publicKey: string) => {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const {data,error} = await supabase.from("profiles").select("*").eq('address',publicKey).select();
    if(error){
        console.log("error fetching user from public key: ",error)
        return {data:null, error};
    }else{
        return {data,error:null};
    }
    
}


export const add_server_transaction = async (
    instance:ServerTransaction
) => {
    const {data,error} = await supabase.from("server_transactions").insert({
        id:v4(),
        created_at:new Date().toISOString(),
        sent_to_swapper:instance.sent_to_swapper,
        amount_sent_to_swapper_in_sol:instance.amount_sent_to_swapper_in_sol,
        swapped_to_usdc_in_swapper:instance.swapped_to_usdc_in_swapper,
        usdc_amount:instance.usdc_amount,
        user_id:instance.user_id,
        send_sol_to_swapper_signature:instance.send_sol_to_swapper_signature,
        swap_sol_to_usdc_signature:instance.swap_sol_to_usdc_signature,
        type:instance.type,
        send_to_user_wallet_signature:instance.send_to_user_wallet_signature
    }).select();
    if(error){
        console.log("error creating transaction in the database: ",error)
        return {data:null, error};
    }
    // console.log("data returned from the database creation: ",data)
    return {data,error:null};
}


const checkBalanceWithRetry = async (publicKey: PublicKey, retries: number, delay: number, comparingValue:number,network:string="mainnet"): Promise<number> => {
    console.log("checking balance...")
    let connection;
    if(network==="mainnet"){
        connection = new Connection(process.env.HELIUS_API_URL_MAINNET || "");   
    }else if(network==="devnet"){
        connection = new Connection(process.env.HELIUS_API_URL || "");
    }
    if(!connection){
        return 0;
    }

    // console.log("connection.getSlot(): ", await connection.getSlot());
    for (let i = 0; i < retries; i++) {
        const balance = await connection.getBalance(publicKey);
        const balanceInSOL = balance / 1000000000;

        console.log("balanceinSol: ",balanceInSOL, "comparingValue: ",comparingValue)
        if (balanceInSOL >= comparingValue/1000000000) { //remove the = 
            return balanceInSOL;
        }

        console.log(`Balance is still smaller or equal to ${comparingValue}, retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    return 0;
};

export const stringToUint8Array = (str:string) => {
    // console.log("str: ",str)
    let strArray = str.split(",");
    //convert the array of string to an array of numbers
    let numArray = strArray.map(Number);

    let uint8Array = new Uint8Array(numArray);
    return uint8Array;

}

export const sendMaxSol = async (from: Keypair, to: PublicKey, network:string="mainnet") => {
    console.log("starting to send max sol to swapper")
    let connection:Connection;
    if(network==="mainnet"){
        connection = new Connection(process.env.HELIUS_API_URL_MAINNET || "");        
    }else{
        connection = new Connection(process.env.HELIUS_API_URL || "");
    }

    let balance;
    let feeBuffer = 1000
    let transaction, fee;
    console.log(connection)
    while(true){

        try {

            balance = await connection.getBalance(from.publicKey);
            // console.log("balance: ",balance/1000000000, "about to receive: ",(balance-feeBuffer)/1000000000)
            const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
            console.log("blockhash: ",blockhash, "lastValidBlockHeight: ",lastValidBlockHeight)
            transaction = new Transaction({
                blockhash: blockhash,
                feePayer: from.publicKey,
                lastValidBlockHeight: lastValidBlockHeight
                })
                .add(
                    SystemProgram.transfer({
                        fromPubkey:from.publicKey,
                        toPubkey:to,
                        lamports:balance-feeBuffer
                    })
                )

            const message = await transaction.compileMessage();
            fee = await connection.getFeeForMessage(message)
            console.log("balance: ",balance, " fee.value: ",fee.value, " feeBuffer: ",feeBuffer)
            if(fee.value===undefined || !fee.value){
                return {error:"undefined fee", signature:null, amount:null}
            }
            console.log("balance > fee.value + feeBuffer: ",(balance>fee.value+feeBuffer))
            if(balance > fee.value+feeBuffer){
                break;
            }else{
                console.log(feeBuffer," lamports wasn't enough to pay for the transaction, trying again with ",feeBuffer+1000)
                feeBuffer += 1000;
            }   
        } catch (error) {
            console.log("error at sendMaxsol idk probably blockhash: ",error)
        }
    }


    if(balance<fee.value){
        return {error:"insufficient balance", signature:null, amount:null}
        // throw new Error("Insufficient balance") 
    }
    console.log("new quote: ",(balance-fee.value)/1000000000)

    try {
        transaction.instructions[0].data = SystemProgram.transfer({
            fromPubkey:from.publicKey,
            toPubkey:to,
            lamports:balance-fee.value
        }).data

        const signature = await sendAndConfirmTransaction(connection,transaction, [from]);

        if(signature){
            console.log("finished sending to swapper, sent ", (balance-fee.value)/1000000000, "signature: ",signature)
            return {signature,error:null, amount: (balance-fee.value)/1000000000};
        }else{
            return {error:"signature not found", signature:null, amount:null}
        }   
    } catch (error) {
        console.log("error sending max transaction: ",error)
        return {error:error, signature:null, amount:null}
    }

}

export const performBlockchainTransaction = async (reqBody:any, transactionType:string, involvedAddress:string):Promise<{signature:string|null, error:string|null, amountToSendToSwapper:number|null}> => {
    console.log("initializing process to send ",reqBody.nativeTransfers[0].amount/1000000000," to swapper");
    const balance = await checkBalanceWithRetry(new PublicKey(involvedAddress),10,3000,reqBody.nativeTransfers[0].amount,"mainnet");
    console.log("balance of involved address after the retry check: ",balance)

    console.log("------------------")
    console.log("gonna try to find the private key of ",involvedAddress)

    const supabase = createClient(supabaseUrl, supabaseKey);
    const connection = new Connection(process.env.HELIUS_API_URL_MAINNET || "");
    const {data,error} = await supabase.from("private_tab").select("*").eq("public_key", involvedAddress);

    if(error){
        console.log("faioled to fetch the private key: ",error)
        return {signature:null, error:"failed to fetch the private key", amountToSendToSwapper:null};
    }
    if(data && Array.isArray(data) && data.length>0){
        console.log("successfully fetched the private key for ", involvedAddress);
        const privateKey = data[0].private_key;
        let pk = stringToUint8Array(privateKey)
        const keypair = Keypair.fromSecretKey(pk);
        const amount = reqBody.nativeTransfers[0].amount
        const amountToSendToSwapper = amount*0.95
        console.log("amount about to send to swapper: ",Math.floor(amountToSendToSwapper)/1000000000, " total amount received: ",amount/1000000000);



        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey:new PublicKey("43F5oAQ3DNe3NyDwc6S2ToH8dqbVsuUJBatEHxovyemE"), //swapper
                lamports: Math.floor(amountToSendToSwapper)
            })
        )

        // const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);

        // console.log("finished sending to swapper, sent ", Math.floor(amountToSendToSwapper)/1000000000, "signature: ",signature)

        const {signature,amount:maxSolSentAmount} = await sendMaxSol(keypair, new PublicKey("43F5oAQ3DNe3NyDwc6S2ToH8dqbVsuUJBatEHxovyemE"));
        return {signature,amountToSendToSwapper:maxSolSentAmount,error:null};
    }

    return {signature:null, error:"failed to fetch the private key", amountToSendToSwapper:null};

}


export const update_server_transactions = async (id:string, instance: Partial<ServerTransaction>) => {
    const {data,error} = await supabase.from("server_transactions").update({
        ...instance
    }).eq("id",id).select();

    if(error){
        console.log("error updating transaction in the database: ",error)
        return {data:null, error};
    }else{
        return {data,error};
    }
}

export const swapToUsdcInsideSwapper = async (signature: string, amount: number):Promise<{txid:string|null, error:string|null, minAmountOut:string|null, amountIn:string|null}> => {
    console.log("initiating swapToUsdcInsideSwapper function")
    const swapperPrivateKey = process.env.SWAPPER_PRIVATE_KEY || "";

    //from the signature fetch the amount to swap, actually i don't need to i already have the amount

    const balance = await checkBalanceWithRetry(new PublicKey("43F5oAQ3DNe3NyDwc6S2ToH8dqbVsuUJBatEHxovyemE"),10,3000,amount);

    console.log("balance of swapper: ",balance, " is bigger than the amount received");

    // const swapResult = await newSwap(swapperPrivateKey,amount);
    console.log("amount to swap in swap_from_sol_to_usdc: ",(amount*0.93))
    const swapResult = await swap_from_sol_to_usdc(swapperPrivateKey,(amount*0.93));
    if(!swapResult) return {txid:null,error:"failed to swap", minAmountOut:null, amountIn:null};
    if (swapResult.error) {
        console.error("Swap error: ", swapResult.error);
        return {txid:null,error:swapResult.error, minAmountOut:null, amountIn:null};
    }
    // const txId = await newSwap(process.env.WALLET_PRIVATE_KEY,0.005);
    console.log("finished transaction, with txId inside trackPaymentshELPERS: ",swapResult.txid)
    
    return {txid:swapResult.txid,error:null, minAmountOut:swapResult.minAmountOut, amountIn:swapResult.amountIn};

}



export const update_user_balance = async (id:string, balance:number) => {
    const {data,error} = await supabase.from("profiles").update({
        real_balance:balance
    }).eq("id",id).select();
    if(error){
        console.log("error updating balance in the database: ",error)
        return {data:null, error};
    }else{
        return {data,error};
    }
}