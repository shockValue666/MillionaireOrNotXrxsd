"use server";

import { v4 } from "uuid";

export const generateNumber = async (numberOfGames:number, amountPerSpin:number) => {
    return Math.floor(Math.random() * 100)
}

const getRandomEmojis = () => {
    const emojis = ["😈", "💀", "💩", "💰","🤑"];
    const firstPosition = Math.floor(Math.random() * 5);
    const secondPosition = Math.floor(Math.random() * 5);
    const thirdPosition = Math.floor(Math.random() * 5);
    const fourthPosition = Math.floor(Math.random() * 5);
    const fifthPosition = Math.floor(Math.random() * 5);
    const emojiArray = [emojis[firstPosition],emojis[secondPosition],emojis[thirdPosition],emojis[fourthPosition],emojis[fifthPosition]]
    return emojiArray

}

type Game ={
    emojis:string[]
    payOuts:{[key:string]:{timesAppeared:number,positions:number[]}}
}

export const initializeGame = async (numberOfGames:number, amountPerSpin:number, profileId:string) => {
    // const newEmojiSlotInstance = {
    //     id:v4(),
    //     amount:amountPerSpin*numberOfGames, //total amount of current emoji slot bet
    //     spinz:numberOfGames,//total spins for the current emoji slot
    //     createdAt:new Date().toISOString(),
    //     profileId:profileId,
    //     currentAmount:parseFloat(data.amount), //amount of local balance at the current emoji slot game
    //     currentSpin:0, //current spin index
    //     currentEmojis:['💰','💰','💰','💰','💰'].toString(),
    //     payPerSpin:parseFloat(data.amount)/parseInt(data.spinz), // = (amount/spins)
    //     entryAmount:parseFloat(data.amount), //same as amount i think
    //     pnl:0,
    //     points:parseFloat(data.amount)/10 //local points of emoji slot
    // }
    let games:Game[] = []
    for(let i=0;i<numberOfGames;i++){
        const randomEmojis = getRandomEmojis();
        const payouts = await getPayOutForEmojis(randomEmojis)
        games.push({emojis:randomEmojis, payOuts:payouts})
    }
    return games
}


const getPayOutForEmojis = async (emojiArray:string[]) => {
    //transform the emoji array to an object, with keys the position and values the emoji
    let emojiObject:{[key:number]:string} = {}
    emojiArray.forEach((emoji,index)=>{
        emojiObject[index] = emoji;
    })
    // console.log("emojiObject: ",emojiObject)


    let frequencyCounter:{[key:string]:{timesAppeared:number,positions:number[]}} = {}

    for(let key in emojiObject){
        const emoji = emojiObject[key];

        if(frequencyCounter[emoji]){
            frequencyCounter[emoji].timesAppeared++
            frequencyCounter[emoji].positions.push(parseInt(key))

        }else{
            frequencyCounter[emoji] = {timesAppeared:1, positions:[parseInt(key)]}
        }
    }
    // console.log("frequenceyCounter: ",frequencyCounter)

    
    return frequencyCounter
}