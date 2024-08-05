import { NextRequest, NextResponse } from "next/server";
import { fetch_pool_file_and_add_it_to_the_local_file_if_not_there_already, getDexScreenerShit } from "../stack/swap";
import { DexScreenerPair as DexScreenerPairType } from '@/lib/supabase/supabase.types';
import { v4 } from "uuid";
import { getDexScreenerPairs, saveDexScreenerPair, updateDexScreenerPair } from "@/lib/supabase/queries";

export async function POST(req:NextRequest, res:NextResponse) {
    const request = await req.json();
    console.log("request: ",request)

    // const result = await swap_from_sol_to_token(request.privateKey,request.amount,request.tokenOrAddress);
    // const result = await fetch_pool_file_and_add_it_to_the_local_file_if_not_there_already(request.address)
    const result = await getDexScreenerShit(request.address)
    console.log("found result, this means that the pair exists in the database")
    // console.log("result: ",JSON.stringify(result,null,2))
    if(result?.pair){
        //try to see if the pair exists in the database
        const {data,error} = await getDexScreenerPairs(undefined,undefined,undefined,undefined,result.pair.pairAddress)
        if(data?.pairAddress){
            console.log("paur alrady exists no need to save it again, but we will update it")
            //probably return a repsonse? 

            let twitter = "";
            let telegram = "";
            let website
            if(result.pair.info.socials.length>0){
                result.pair.info.socials.forEach((social:any)=>{
                if(social.type==="telegram"){
                    telegram = social.url
                }else if(social.type==="twitter"){
                    twitter = social.url
                }
                })
            }
            if(result.pair.info.websites.length>0){
                website = result.pair.info.websites[0].url
            }
            console.log(JSON.stringify(result.pair.txns.h1),JSON.stringify(result.pair.txns.h6),JSON.stringify(result.pair.txns.h24),JSON.stringify(result.pair.txns.m5))
            const newDexScreenerPair: DexScreenerPairType = {
                id:data.id,
                createdAt:new Date().toISOString(),
                baseTokenAddress:result.pair.baseToken.address,
                baseTokenName:result.pair.baseToken.name,
                baseTokenSymbol:result.pair.baseToken.symbol,
                quoteTokenAddress:result.pair.quoteToken.address,
                quoteTokenName:result.pair.quoteToken.name,
                quoteTokenSymbol:result.pair.quoteToken.symbol,
                fdv: result.pair.fdv,
                imageUrl:result.pair.info.imageUrl,
                telegram:telegram,
                twitter:twitter,
                website:website,
                baseLiquidity:result.pair.liquidity.base,
                quoteLiquidity:result.pair.liquidity.quote,
                usdLiquidity:result.pair.liquidity.usd,
                pairAddress:result.pair.pairAddress,
                pairCreatedAt:new Date(result.pair.pairCreatedAt).toISOString(),
                priceChangeH1:result.pair.priceChange.h1,
                priceChangeH6:result.pair.priceChange.h6,
                priceChangeH24:result.pair.priceChange.h24,
                priceChange5m:result.pair.priceChange.m5,
                priceNative:parseFloat(result.pair.priceNative),
                priceUsd:parseFloat(result.pair.priceUsd),
                txnsH1:JSON.stringify(result.pair.txns.h1),
                txnsH6:JSON.stringify(result.pair.txns.h6),
                txnsH24:JSON.stringify(result.pair.txns.h24),
                txns5m:JSON.stringify(result.pair.txns.m5),
                volumeH1:result.pair.volume.h1,
                volumeH6:result.pair.volume.h6,
                volumeH24:result.pair.volume.h24,
                volume5m:result.pair.volume.m5

            }
            // console.log("newDexScreenerpair: ",newDexScreenerPair)
            const {data:updatedDexscreenerData,error:updatedDexscreenerError} = await updateDexScreenerPair(newDexScreenerPair)
            if(updatedDexscreenerError){
                console.log("error saving the pair in the database: ",error)
                return NextResponse.json({message:updatedDexscreenerError},{status:200})
            }
            if(updatedDexscreenerData){
                console.log("successfully updated the pair", updatedDexscreenerData[0].volume5m)
                return NextResponse.json({message:updatedDexscreenerData[0]},{status:200})
            }
            return NextResponse.json({message:updatedDexscreenerData},{status:200})
        }else{
            // console.log("secondResult pair: ",result.pair)
            console.log("pair doesn't exists anywhere so i will save it to the database")
            let twitter = "";
            let telegram = "";
            let website
            if(result.pair.info.socials.length>0){
                result.pair.info.socials.forEach((social:any)=>{
                if(social.type==="telegram"){
                    telegram = social.url
                }else if(social.type==="twitter"){
                    twitter = social.url
                }
                })
            }
            if(result.pair.info.websites.length>0){
                website = result.pair.info.websites[0].url
            }
            const newDexScreenerPair: DexScreenerPairType = {
                id:v4(),
                createdAt:new Date().toISOString(),
                baseTokenAddress:result.pair.baseToken.address,
                baseTokenName:result.pair.baseToken.name,
                baseTokenSymbol:result.pair.baseToken.symbol,
                quoteTokenAddress:result.pair.quoteToken.address,
                quoteTokenName:result.pair.quoteToken.name,
                quoteTokenSymbol:result.pair.quoteToken.symbol,
                fdv: result.pair.fdv,
                imageUrl:result.pair.info.imageUrl,
                telegram:telegram,
                twitter:twitter,
                website:website,
                baseLiquidity:result.pair.liquidity.base,
                quoteLiquidity:result.pair.liquidity.quote,
                usdLiquidity:result.pair.liquidity.usd,
                pairAddress:result.pair.pairAddress,
                pairCreatedAt:new Date(result.pair.pairCreatedAt).toISOString(),
                priceChangeH1:result.pair.priceChange.h1,
                priceChangeH6:result.pair.priceChange.h6,
                priceChangeH24:result.pair.priceChange.h24,
                priceChange5m:result.pair.priceChange.m5,
                priceNative:parseFloat(result.pair.priceNative),
                priceUsd:parseFloat(result.pair.priceUsd),
                txnsH1:JSON.stringify(result.pair.txns.h1),
                txnsH6:JSON.stringify(result.pair.txns.h6),
                txnsH24:JSON.stringify(result.pair.txns.h24),
                txns5m:JSON.stringify(result.pair.txns.m5),
                volumeH1:result.pair.volume.h1,
                volumeH6:result.pair.volume.h6,
                volumeH24:result.pair.volume.h24,
                volume5m:result.pair.volume.m5

            }
            // console.log("newDexScreenerpair: ",newDexScreenerPair)
            const {data,error} = await saveDexScreenerPair(newDexScreenerPair)
            if(error){
                console.log("error saving the pair in the database: ",error)
                return NextResponse.json({message:error},{status:200})
            }
            if(data){
                console.log("successfully save the pair")
                return NextResponse.json({message:data},{status:200})
            }
        }
        
    }
    return NextResponse.json({message:"error"},{status:200})
}