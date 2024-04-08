import { Connection, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:Request) {
    console.log("req: ",req.body)
    try {
        const connection = new Connection('https://frosty-omniscient-sailboat.solana-mainnet.quiknode.pro/888caf079f94124d361bdf81b55dfa2c025534eb/');
        const publicKeyString = 'BYM7pC22vUBSVuFPpTdoaH8RqZqr7SH3F2fxYXQ4sbMS';
        const publicKey = new PublicKey(publicKeyString);
        console.log("publicKey: ",  publicKey.toString())
        const balance = await connection.getBalance(publicKey);
        console.log("balance: ",balance)

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