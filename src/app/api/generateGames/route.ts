
import { promises } from "fs";
import { NextResponse } from "next/server";
import { cwd } from "process";

async function getNumberCombination() {
    const combinations = await promises.readFile(cwd() +"/src/app/api/generateGames/combinations/combinations.json","utf-8")
    const content = JSON.parse(combinations)
    // console.log("content: ",content.length);
    const randomIndex = Math.floor(Math.random()*content.length)
    // console.log("randomIndex: ",randomIndex);
    // console.log("randomNumber: ",content[randomIndex]);
    return content[randomIndex];
}
async function generateEmojiSequenceFromNumber(num:number,emojiArray:string[]){
    const numberString= num.toString();
    const numberArray = numberString.split("");
    const digits = numberArray.map(x=>parseInt(x,10))
    const newEmojiArray = digits.map(digit=>{
        // console.log("emojiArray[digit]: ",emojiArray[digit]);
        return emojiArray[digit]
    })
    return {digits,newEmojiArray};
}

async function getMultiplier(num:string): Promise<{multiplier:number,category:string}> {
    console.log("num: ",num);
    const categories = await promises.readFile(cwd() + "/src/app/api/generateGames/combinations/categories.json","utf-8")
    const content = JSON.parse(categories)
    // console.log("content: ",content);
    // const multiplier = content[num].mulitplier;
    // console.log("multiplier: ",multiplier);
    // return multiplier;
    for (const category in content){
        // console.log("category: ",category)
        if(content.hasOwnProperty(category)){
            const combinationsOfCategory = content[category].combinations
            if(combinationsOfCategory.includes(num)){
                // console.log("multiplier: ",content[category].mulitplier, "category: ",category);
                return {multiplier:content[category].mulitplier,category};
            }else{
                console.log("combination doesn't include num")
            }
        }else{
            return {multiplier:0,category};
        }
    }
    return {multiplier:0,category:"all different"};

}
async function getGame(emojiArray:string[]){
    const num = await getNumberCombination()
    const {multiplier,category} = await getMultiplier(num)
    // console.log("res: ",res)

    const {digits,newEmojiArray} = await generateEmojiSequenceFromNumber(num,emojiArray)

    return {digits,newEmojiArray,multiplier,category}
}

async function getGames(numberOfGames:number,emojiArray:string[]){
    const totalGames:{digits:number[],newEmojiArray:string[],multiplier:number,category:string}[]=[];
    for(let i=0;i<numberOfGames;i++){
        const {digits,newEmojiArray,multiplier,category} = await getGame(emojiArray)
        totalGames.push({digits,newEmojiArray,multiplier,category})
        console.log("digits: ",digits, "newEmojiArray: ",newEmojiArray, "multiplier: ",multiplier, " category: ",category);
    }
    return totalGames
}

export async function GET(req:Request) {
    return NextResponse.json({message:"Hello World"})
}

export async function POST(req:Request){
    const body = await req.json()
    console.log("body: ",body)

    if(body.numberOfGames && body.emojiArray){
        const games = await getGames(body.numberOfGames,body.emojiArray)
        return NextResponse.json({status:200,games,message:null})
    }else{
        return NextResponse.json({message:"Something went wrong",status:400,games:null})
    }
}

