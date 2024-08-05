"use server";
import { saveTransactionHook } from "@/lib/supabase/queries";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";
import { addTranny, add_server_transaction, fetch_user_from_public_key, findTransactionTypeNative, performBlockchainTransaction, signatureExists, swapToUsdcInsideSwapper, update_server_transactions, update_user_balance } from "./dbHelpers";

export async function GET() {
    return NextResponse.json({
        products:[
            {
                id:1,
                name:"Straw"
            }
        ]
    })
}

let i =0;

export async function POST(req:NextRequest, res:NextResponse) {
    // console.log("body: ", await req.json())
    const request = await req.json();
    i++;
    // if(req.body?){

    // }
    // console.log("request: ",request[0])
    console.log("iteration: ",i, " request body signature: ",request[0].description);
    //opou uparxei request.body[0] 
    //egw tha vazw to request[0] giati to request einai ena array

    //check if signature exists on the db
    const existsInTheDb = await signatureExists(request[0].signature);
    console.log("existsInTheDb: ",existsInTheDb, " for iteration: ",i)
    if(existsInTheDb){
        console.log("signature already exists for iteration : ",i)
        // res.status(200).send("Request received");
        return NextResponse.json({message:"some message"},{status:200})
    }
    if(!existsInTheDb){
        console.log("signature does not exist for iteration : ",i)

        const {data,error} = await addTranny(request[0].signature);
        if(error){
            console.log("error adding the transaction for iteration : ",i, " request[0].signature: ",request[0].signature)  
        }
    }

    const {transactionType,involvedAddress} = await findTransactionTypeNative(request[0].nativeTransfers)

    console.log("transactionTyp for iteration : ",i, ": ",transactionType)

    if(transactionType === "somethingElse"){
        console.log("WIP: handle somethingElse for iteration : ",i)
    }

    //fetch user
    const {data:userData,error:userError} = await fetch_user_from_public_key(involvedAddress);

    if(userError || userData.length===0){
        console.log("user not found for iteration : ",i)
        NextResponse.json({message:"error fetching the user lol"},{status:200})
        return;
    }


    if(transactionType==="deposit"){
        const {data:addServerTransData,error:addServerTransError} = await add_server_transaction({
            sent_to_swapper:false,
            type:"deposit",
            amount_sent_to_swapper_in_sol:0,
            swapped_to_usdc_in_swapper:false,
            usdc_amount:0,
            send_sol_to_swapper_signature:"",
            swap_sol_to_usdc_signature:"",
            user_id:userData[0].id,
            send_to_user_wallet_signature:request[0].signature
        })
        if(addServerTransError){
            console.log("error creating transaction in the database: ",addServerTransError)
            NextResponse.json({message:"error creating transaction in the database"},{status:200})
            return;
        }
        const server_trans_id = addServerTransData[0].id
        console.log("transaction added to the database: ",addServerTransData[0])
        //send from the random casino wallet to the swapper wallet
        const {signature, error, amountToSendToSwapper} = await performBlockchainTransaction(request.body[0],transactionType,involvedAddress);
        if(signature && amountToSendToSwapper){
            //update the server transaction with the signature
            const {data:updateServerTransData,error:updateServerTransError} = await update_server_transactions(server_trans_id,{send_sol_to_swapper_signature:signature,amount_sent_to_swapper_in_sol:amountToSendToSwapper});
            if(updateServerTransError){
                console.log("error updating transaction in the database: ",updateServerTransError)
                // response.status(200).send("Request received");
                NextResponse.json({message:"error updating transaction in the database"},{status:200})
                return;
            }


            //swap to USDC inside the swapper wallet
            //7% of the amount sent to swapper will remain there
            //the remaining 93% will be swapped for usdc
            // const {txid,error, minAmountOut, amountIn} = await swapToUsdcInsideSwapper(signature, amountToSendToSwapper)
            // if(error){
            //     console.log("failed to send money to the swapper, ",error);
            //     // response.status(200).send("Request received");
            //     NextResponse.json({message:"error swapping inside the swapper"},{status:200})
            //     return;
            // }

            // console.log('x sent the money to the swapper and swapped, txid: ',txid)
            // console.log("sent it to swapper and update the server tranny database, still haven't swapped to usdc, database id: ",updateServerTransData[0].id)

            // if(txid && minAmountOut){

            //     console.log("the amount of usdc i am gonna credit the users wallet with : ",minAmountOut)
            //     //update the server transaction with the signature
            //     const {data:updateServerTransData,error:updateServerTransError} = await update_server_transactions(server_trans_id,{swap_sol_to_usdc_signature:txid,usdc_amount:parseFloat(minAmountOut)});
            //     if(updateServerTransError){
            //         console.log("error updating transaction in the database: ",updateServerTransError)
            //         // response.status(200).send("Request received");
            //         NextResponse.json({message:"error updating transaction in the database"},{status:200})
            //         return;
            //     }
            //     //UPDATE user balance
            //     const {data:updateProfileBalanceData,error:updateProfileBalanceError} = await update_user_balance(userData[0].id,(parseFloat(userData[0].real_balance || 0)) + parseFloat(minAmountOut))
            //     console.log("userData[0].real_balance: ",parseFloat(userData[0].real_balance), " userData[0].real_balance || 0", (parseFloat(userData[0].real_balance || 0)), " total: ",(parseFloat(userData[0].real_balance || 0)) + minAmountOut)

            //     if(updateProfileBalanceError){
            //         console.log("error updating user balance in the database: ",updateProfileBalanceError)
            //         // response.status(200).send("Request received");
            //         NextResponse.json({message:"error updating user balance in the database"},{status:200})
            //         return;
            //     }

            //     console.log("updated the server transaction by adding the usdc amount to it: ",updateServerTransData[0], " and updated user's real_balance", updateProfileBalanceData[0].real_balance)
            // }
            // // response.status(200).send("Request received");
            // NextResponse.json({message:"Request received"},{status:200})
            // return;
        }else if (error){
            console.log("failed to send money to the swapper, ",error);
            // response.status(200).send("Request received");
            NextResponse.json({message:"error performing blockchain transaction"},{status:200})
            return;
        }
    }else{
        console.log("WIP: handle withdrawl for iteration : ",i)
        // response.status(200).send("Request received");
        NextResponse.json({message:"WIP: handle withdrawl for iteration : "+i},{status:200})
    }

    return NextResponse.json({message:"some message"},{status:200})
}




// export async function POST(req:Request){
//     console.log("body: ", await req.json())
//     // console.log("type of req.body: ",typeof JSON.stringify(req.body))
//     // console.log("stringified req.body: ",JSON.stringify(req.body)); 
//     // console.log("plain req.body: ",req.body)
//     // console.log("stringified req.json: ",JSON.stringify(await req.json()))
//     // console.log("plain req.json: ",await req.json())
//     // if(!req.body) return;
//     // console.log("req.body: ",req.body)
//     const result = await saveTransactionHook({content:JSON.stringify(req.body),id:v4(),createdAt:new Date().toISOString()})
//     // if(result){
//     //     console.log("result: ",result)
//     // }

//         return NextResponse.json({
//             message:"Hello cock"
//         })
// }


// export async function POST(req:Request){
//     console.log("body: ", await req.json())
//         return NextResponse.json({message:"some message"})
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
// }



// app.post("/",async (request: Request, response: Response) => {
//     //blockchain part
//     i++;
//     console.log("iteration: ",i, " request body signature: ",request.body[0].signature);
//     //check if signature exists on the db
//     const existsInTheDb = await signatureExists(request.body[0].signature);
//     console.log("existsInTheDb: ",existsInTheDb, " for iteration: ",i)
//     if(existsInTheDb){
//         console.log("signature already exists for iteration : ",i)
//         response.status(200).send("Request received");
//         return;
//     }
//     if(!existsInTheDb){
//         await addTranny(request.body[0].signature);
//     }
//     //save the transaction
//     // console.log("request body: ",request.body[0]);
//     const {transactionType,involvedAddress} = await findTransactionTypeNative(request.body[0].nativeTransfers)
//     console.log("transactionTyp for iteration : ",i, ": ",transactionType)

//     if(transactionType === "somethingElse"){
//         console.log("WIP: handle somethingElse for iteration : ",i)
//     }

//     //fetch user
//     const {data:userData,error:userError} = await fetch_user_from_public_key(involvedAddress);

//     if(transactionType==="deposit"){
//         const {data:addServerTransData,error:addServerTransError} = await add_server_transaction({
//             sent_to_swapper:false,
//             type:"deposit",
//             amount_sent_to_swapper_in_sol:0,
//             swapped_to_usdc_in_swapper:false,
//             usdc_amount:0,
//             send_sol_to_swapper_signature:"",
//             swap_sol_to_usdc_signature:"",
//             user_id:userData[0].id,
//             send_to_user_wallet_signature:request.body[0].signature
//         })
//         if(addServerTransError){
//             console.log("error creating transaction in the database: ",addServerTransError)
//             response.status(200).send("Request received");
//             return;
//         }
//         const server_trans_id = addServerTransData[0].id
//         console.log("transaction added to the database: ",addServerTransData[0])
//         //send from the random casino wallet to the swapper wallet
//         const {signature, error, amountToSendToSwapper} = await performBlockchainTransaction(request.body[0],transactionType,involvedAddress);
//         if(signature && amountToSendToSwapper){
//             //update the server transaction with the signature
//             const {data:updateServerTransData,error:updateServerTransError} = await update_server_transactions(server_trans_id,{send_sol_to_swapper_signature:signature,amount_sent_to_swapper_in_sol:amountToSendToSwapper});
//             if(updateServerTransError){
//                 console.log("error updating transaction in the database: ",updateServerTransError)
//                 response.status(200).send("Request received");
//                 return;
//             }

//             //for the showcase in casino only: 

//             //swap to USDC inside the swapper wallet
//             //7% of the amount sent to swapper will remain there
//             //the remaining 93% will be swapped for usdc
//             // const {txid,error, minAmountOut, amountIn} = await swapToUsdcInsideSwapper(signature, amountToSendToSwapper)
//             // if(error){
//             //     console.log("failed to send money to the swapper, ",error);
//             //     response.status(200).send("Request received");
//             //     return;
//             // }

//             // console.log('x sent the money to the swapper and swapped, txid: ',txid)
//             // console.log("sent it to swapper and update the server tranny database, still haven't swapped to usdc, database id: ",updateServerTransData[0].id)

//             // if(txid && minAmountOut){

//             //     console.log("the amount of usdc i am gonna credit the users wallet with : ",minAmountOut)
//             //     //update the server transaction with the signature
//             //     const {data:updateServerTransData,error:updateServerTransError} = await update_server_transactions(server_trans_id,{swap_sol_to_usdc_signature:txid,usdc_amount:minAmountOut});
//             //     if(updateServerTransError){
//             //         console.log("error updating transaction in the database: ",updateServerTransError)
//             //         response.status(200).send("Request received");
//             //         return;
//             //     }
//             //     //UPDATE user balance
//             //     const {data:updateProfileBalanceData,error:updateProfileBalanceError} = await update_user_balance(userData[0].id,(parseFloat(userData[0].real_balance || 0)) + minAmountOut)
//             //     console.log("userData[0].real_balance: ",parseFloat(userData[0].real_balance), " userData[0].real_balance || 0", (parseFloat(userData[0].real_balance || 0)), " total: ",(parseFloat(userData[0].real_balance || 0)) + minAmountOut)

//             //     if(updateProfileBalanceError){
//             //         console.log("error updating user balance in the database: ",updateProfileBalanceError)
//             //         response.status(200).send("Request received");
//             //         return;
//             //     }

//             //     console.log("updated the server transaction by adding the usdc amount to it: ",updateServerTransData[0], " and updated user's real_balance", updateProfileBalanceData[0].real_balance)
//             // }
//             response.status(200).send("Request received");
//             return;
//         }else if (error){
//             console.log("failed to send money to the swapper, ",error);
//             response.status(200).send("Request received");
//             return;
//         }
//     }else{
//         console.log("WIP: handle withdrawl for iteration : ",i)
//         response.status(200).send("Request received");
//     }
// })
