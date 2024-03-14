import { NextRequest, NextResponse } from "next/server";

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



export async function POST(req:Request){
    console.log("body: ", await req.json())
        return NextResponse.json({
            message:"Hello World"
        })
}