import { NextRequest, NextResponse } from "next/server";
import { swap_from_sol_to_token } from "../stack/swap";
import { Wallet } from '@coral-xyz/anchor'
import * as dotenv from 'dotenv'
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

dotenv.config()

export async function POST(req:NextRequest, res:NextResponse) {
    const request = await req.json();
    console.log("request: ",request)

    const result = await swap_from_sol_to_token(request.privateKey,request.amount,request.tokenOrAddress);
    console.log("result: ",result)
    if(result){
        return NextResponse.json({message:result},{status:200})
    }else{
        return NextResponse.json({message:"error"},{status:200})
    }
}

export async function GET(req:NextRequest, res:NextResponse)  {

    return NextResponse.json({message:"get request or some shit"},{status:200})
}