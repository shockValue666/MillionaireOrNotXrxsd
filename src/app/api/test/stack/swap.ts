import {promises} from 'fs'
import RaydiumSwap from './RaydiumSwap';
import * as dotenv from 'dotenv';import { Keypair, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import path from 'path';
dotenv.config();
import pools from './pools.json'

export const pool_exists_in_pools_file = async (tokenAMint:string,tokenBMint:string) => {
    let fileContent = await promises.readFile(process.cwd() + "/src/app/api/test/stack/pools.json","utf-8");
    const pools = JSON.parse(fileContent)
    for(const pool of pools) {
        if((pool.baseMint === tokenAMint || pool.quoteMint === tokenAMint) && (pool.baseMint === tokenBMint || pool.quoteMint === tokenBMint)){
            console.log("pool found in pools file: ", pool);
            return {exists:true,pool:pool};
        }
    }

    console.log("pool doesn't exist in pools file");

    return {exists:false, pool:null};
}

export const find_pool_info = async (tokenMint:string) => {
    const res = await fetch("https://api.raydium.io/v2/sdk/liquidity/mainnet.json")
    let tokenAMint="So11111111111111111111111111111111111111112";
    let tokenBMint = tokenMint;


    const json = await res.json()
    const allPools = [...(json.official ?? []), ...(json.unOfficial ?? [])];
    const poolInfo = allPools.find(pool => 
        
        {
            // console.log("pool.basemint: ",pool.baseMint, "pool.quoteMint: ",pool.quoteMint, "tokenMint: ",tokenMint);
            return (pool.baseMint === tokenAMint || pool.quoteMint === tokenAMint) && (pool.baseMint === tokenBMint || pool.quoteMint === tokenBMint)
        }
    );
    // console.log("poolInfo: ",poolInfo);
    return poolInfo;
}

export const fetch_pool_file_and_add_it_to_the_local_file_if_not_there_already = async (tokenMint:string,secondTokenMint="So11111111111111111111111111111111111111112") => {
    console.log("tokenMint: ",tokenMint);
    const {exists,pool} = await pool_exists_in_pools_file(tokenMint,secondTokenMint);
    if(exists){
        console.log("pool already exists in the pools file");
        return {saved:true,error:null,pool:pool};
    }
    console.log("pool doesn't exist")

    const poolInfo = await find_pool_info(tokenMint);
    if(!poolInfo){
        console.log("poolInfo not found even in raydium api");
        return {saved:false,error:"poolInfo not found", pool:null};
    }

    let _data;
    
    let fileContent = await promises.readFile(process.cwd() + "/src/app/api/test/stack/pools.json","utf-8");
    if(fileContent){
        // fileContent = JSON.parse(fileContent);
        _data = JSON.parse(fileContent);
    }else{
        _data = [];
    }

    _data.push(poolInfo);

    await promises.writeFile(process.cwd()+"/src/app/api/test/stack/pools.json", JSON.stringify(_data,null,2));
    console.log("pool added to file, ",poolInfo);
    return {saved:true,error:null,pool:poolInfo};
}

export const swap_from_sol_to_usdc = async (pk:string,amount:number) => {

    const {error,saved,pool} = await fetch_pool_file_and_add_it_to_the_local_file_if_not_there_already("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

    if(error){
        return {error:'pool not found, couldnt be fetched or added '+error, txid:null, amountIn:null, minAmountOut:null};
    }
    if(saved && pool){
        // const connection = new Connection(process.env.HELIUS_API_URL_MAINNET || "");
        const raydiumSwap = new RaydiumSwap
        (process.env.HELIUS_API_URL_MAINNET || "", pk);

        await raydiumSwap.loadPoolKeys("/pools.json");
        console.log("Loaded pool keys");

        const poolInfo = raydiumSwap.findPoolInfoForTokens("So11111111111111111111111111111111111111112","EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

        if (!poolInfo) {
            console.error('Pool info not found');
            return {error:'Pool info not found',txid:null, amountIn:null, minAmountOut:null};
        } else {
            console.log('Found pool info: ');
        }

        console.log("about to make the transaction, amount: ",amount)
        const tx = await raydiumSwap.getSwapTransaction(
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            amount,
            poolInfo,
            15000000,
            true,
            "in" as "in" | "out"
        )

        if(!tx){
            console.error("tx not found");
            return {error:"tx not found",txid:null, amountIn:null, minAmountOut:null}
        }
        console.log("tx found, prepared swap tx: ",tx);

        const {txid} = await raydiumSwap.sendVersionedTransaction(tx.versionedTransaction as VersionedTransaction, 20);

        if(!txid){
            console.log("couldn't use sendVersionedTransaction");
            return {txid:null,error:"couldn't use sendVersionedTransaction", amountIn:null, minAmountOut:null}
        }
        console.log(`https://solscan.io/tx/${txid}`)

        return {txid,error:null, amountIn: tx.amountIn, minAmountOut:tx.minAmountOut}   
    }
}


export const swap_from_sol_to_token = async (pk:string, amount:number, tokenMint:string, maxRetries=10, delay=2000) => {
    //add pool to file if it doesn't exist
    const {error,saved,pool} = await fetch_pool_file_and_add_it_to_the_local_file_if_not_there_already(tokenMint);
    if(error){
        return {error:'pool not found, couldnt be fetched or added '+error, txid:null};
    }
    if(saved && pool){
        console.log("found pool, ",pool.id)
        const raydiumSwap = new RaydiumSwap(process.env.HELIUS_API_URL_MAINNET || "", pk);
        console.log("loaded raydium swap")

        await raydiumSwap.loadPoolKeys("/src/app/api/test/stack/pools.json");
        console.log("loaded pool cocks")

        const poolInfo = raydiumSwap.findPoolInfoForTokens("So11111111111111111111111111111111111111112",tokenMint)
        if(!poolInfo) {
            console.error('Pool info not found');
            return {error:'Pool info not found',txid:null};
        } else {
            console.log("found poolInfo with poolId: ",poolInfo.id.toBase58());
        }

        console.log("tokenMint: ",tokenMint, "amount: ",amount)
        let tx;
        for (let i=0;i<maxRetries;i++){
            try {
                tx = await raydiumSwap.getSwapTransaction(
                    tokenMint,
                    amount,
                    poolInfo,
                    15000000,
                    true,
                    "in" as "in" | "out"
                )
                if(tx){
                    return tx;
                }
            } catch (error) {
                console.log("error simulating transaction trying again in ", delay/1000, " seconds ..." )
                continue;
            }
        }
        if(!tx){
            console.error("tx not found");
            return {error:"tx not found",txid:null}
        }
        console.log("tx found, prepared swap tx: ",tx);
        return {txid:tx,error:null}
        // const {txid} = await raydiumSwap.sendVersionedTransaction(tx.versionedTransaction as VersionedTransaction, 20);
        // if(!txid){
        //     console.log("couldn't use sendVersionedTransaction");
        // }
        // console.log(`https://solscan.io/tx/${txid}`)
        // return {txid,error:null}
    }

}
// swap_from_sol_to_token(process.env.SWAPPER_PRIVATE_KEY,0.0025,"vE411CUkqxQnYdKVvduzn2Rre9n4euH4zEZDqpYuSd1");

export const fetch_token_balance = async (address:string,tokenMint:string) => {
    const url = `https://mainnet.helius-rpc.com/?api-key=e76fad87-52d5-4d8d-9662-9ee44bec9963`
    console.log("address from fetch_token_balance: ",address, " tokenMint: ",tokenMint)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-id',
            method: 'getAssetsByOwner',
            params: {
                ownerAddress: address,
                displayOptions: {
                    showFungible: true,
                    showNativeBalance: true,
                },
            },
        }),
    });

    const { result } = await response.json();

    if(result.items.length>0){
        const tokenItem = result.items.find((item:any)=>
            item.id===tokenMint
        )
        if(tokenItem){
            const tokenBalance=tokenItem.token_info.balance/10**tokenItem.token_info.decimals
            console.log("token balance: ",tokenBalance);
            return {tokenBalance,error:null};
        }else{
            return {tokenBalance:null,error:"token item not found"};
        }
    }else{
        return {tokenBalance:null,error:"result.items.length is not greater than 0, couldn't find any tokens"}
    }
}

export const swap_from_token_to_sol = async (pk:string, tokenMint:string, percentage=100) => {
    if(percentage>100 || percentage<0){
        return {error:'percentage must be between 0 and 100',txid:null};
    }
    //add pool to file if it doesn't exist
    const kp = Keypair.fromSecretKey(bs58.decode(pk));
    const {error,saved,pool} = await fetch_pool_file_and_add_it_to_the_local_file_if_not_there_already(tokenMint);
    if(error){
        return {error:'pool not found, couldnt be fetched or added '+error, txid:null};
    }
    if(saved && pool){
        const raydiumSwap = new RaydiumSwap(process.env.HELIUS_API_URL_MAINNET || "", pk);
        await raydiumSwap.loadPoolKeys("/pools.json");
        // await raydiumSwap.loadPoolKeys("https://www.jsonkeeper.com/b/R8LD");
        // console.log("all pool keys json from the swap.ts file: ", raydiumSwap.allPoolKeysJson[0][1]);

        const poolInfo = raydiumSwap.findPoolInfoForTokens("So11111111111111111111111111111111111111112",tokenMint)
        if(!poolInfo) {
            console.error('Pool info not found');
            return {error:'Pool info not found',txid:null};
        } else {
            console.log("found poolInfo with poolId: ",poolInfo.id.toBase58());
        }

        const {tokenBalance:amount,error} = await fetch_token_balance(kp.publicKey.toBase58(),tokenMint);
        if(error || !amount){
            console.log("error fetching the token balance: ",error, " or no amount: ",amount);
            return {error:error,txid:null};
        }

        // console.log("tokenMint: ",tokenMint, "amount: ",amount)
        const tx = await raydiumSwap.getSwapTransaction(
            "So11111111111111111111111111111111111111112",
            amount*percentage/100,
            poolInfo,
            15000000,
            true,
            "in" as "in" | "out"
        )

        if(!tx){
            console.error("tx not found");
            return {error:"tx not found",txid:null}
        }
        console.log("tx found, prepared swap tx: ",tx);

        const {txid} = await raydiumSwap.sendVersionedTransaction(tx.versionedTransaction as VersionedTransaction, 20);
        if(!txid){
            console.log("couldn't use sendVersionedTransaction");
        }
        console.log(`https://solscan.io/tx/${txid}`)
        return {txid,error:null}
    }
}
// swap_from_token_to_sol(process.env.SWAPPER_PRIVATE_KEY,"vE411CUkqxQnYdKVvduzn2Rre9n4euH4zEZDqpYuSd1",100);


export const getDexScreenerShit = async (poolAddress:string) => {

    const response = await fetch(`https://api.dexscreener.io/latest/dex/pairs/solana/${poolAddress}`);

    const  result = await response.json();

    return result
}