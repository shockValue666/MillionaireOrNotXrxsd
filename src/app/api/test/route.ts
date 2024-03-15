import { saveTransactionHook } from "@/lib/supabase/queries";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

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


export async function POST(req:Request){
    console.log("body: ", await req.json())
        return NextResponse.json({message:"some message"})
}
export const config = {
    api: {
      bodyParser: true,
    },
  }
  