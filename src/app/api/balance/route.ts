import { Connection, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:Request) {
    console.log("req: ",req.body)
    try {
        const connection = new Connection('https://devnet.helius-rpc.com/?api-key=216aa485-33ec-4ac3-a683-7813780e07e9');
        const publicKeyString = 'BYM7pC22vUBSVuFPpTdoaH8RqZqr7SH3F2fxYXQ4sbMS';
        const publicKey = new PublicKey(publicKeyString);
        const balance = await connection.getBalance(publicKey);

        return NextResponse.json({ balance });

    } catch (error) {
        console.error("error: ",error); 
    }
    // return NextResponse.json({
    //     products:[
    //         {
    //             id:1,
    //             name:"Straw"
    //         }
    //     ]
    // })
}



export async function POST(req:Request){
    console.log("body: ", await req.json())
        return NextResponse.json({
            message:"Hello World"
        })
}