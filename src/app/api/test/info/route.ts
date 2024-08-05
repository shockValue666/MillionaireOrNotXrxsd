import { NextRequest, NextResponse } from "next/server";
import { fetch_pool_file_and_add_it_to_the_local_file_if_not_there_already } from "../stack/swap";

export async function POST(req:NextRequest, res:NextResponse) {
    const request = await req.json();
    console.log("request: ",request)

    // const result = await swap_from_sol_to_token(request.privateKey,request.amount,request.tokenOrAddress);
    const result = await fetch_pool_file_and_add_it_to_the_local_file_if_not_there_already(request.address)
    console.log("result: ",result)
    if(result){
        return NextResponse.json({message:result},{status:200})
    }else{
        return NextResponse.json({message:"error"},{status:200})
    }
}