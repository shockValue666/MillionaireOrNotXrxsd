import { Connection, PublicKey, Keypair, Transaction, VersionedTransaction, TransactionMessage, TransactionExpiredBlockheightExceededError } from '@solana/web3.js'
import {
  Liquidity,
  LiquidityPoolKeys,
  jsonInfo2PoolKeys,
  LiquidityPoolJsonInfo,
  TokenAccount,
  Token,
  TokenAmount,
  TOKEN_PROGRAM_ID,
  Percent,
  SPL_ACCOUNT_LAYOUT,
} from '@raydium-io/raydium-sdk'
import { Wallet } from '@coral-xyz/anchor'
import bs58 from 'bs58'
import {promises} from 'fs'
import { BN } from 'bn.js';
import Decimal from 'decimal.js';



/**
 * Class representing a Raydium Swap operation.
 */
class RaydiumSwap {
  allPoolKeysJson: LiquidityPoolJsonInfo[] | undefined
  connection: Connection
  wallet: Wallet
  slpg: number;

    /**
   * Create a RaydiumSwap instance.
   * @param {string} RPC_URL - The RPC URL for connecting to the Solana blockchain.
   * @param {string} WALLET_PRIVATE_KEY - The private key of the wallet in base58 format.
   */
  constructor(RPC_URL: string, WALLET_PRIVATE_KEY: string, SLPG:number = 5) {
    this.connection = new Connection(RPC_URL
      , { commitment: 'finalized' })
      
    this.wallet = new Wallet(Keypair.fromSecretKey(Uint8Array.from(bs58.decode(WALLET_PRIVATE_KEY))))
    this.slpg = SLPG;
  }

   /**
   * Loads all the pool keys available from a JSON configuration file.
   * @async
   * @returns {Promise<void>}
   */
  async loadPoolKeys(liquidityFile: string) {
    // const liquidityJsonResp = await fetch(liquidityFile);
    // console.log("fetching pool keys from source: ",liquidityJsonResp)
    // // console.log("liquidityJsonResp: ",await liquidityJsonResp.json())
    // if (!liquidityJsonResp.ok) {
    //     console.log("couldn't fetch the liquidity file from raydium")
    //     return
    // }
    // // const liquidityJson = (await liquidityJsonResp.json()) as { official: any; unOfficial: any }
    // // const allPoolKeysJson = [...(liquidityJson?.official ?? []), ...(liquidityJson?.unOfficial ?? [])]
    // const allPoolKeysJson = await liquidityJsonResp.json()

    // this.allPoolKeysJson = [allPoolKeysJson] as LiquidityPoolJsonInfo[]

    // // this.allPoolKeysJson = allPoolKeysJson


    try {
      console.log("initiating try catch inside loadPoolKeys")
      let liquidityJsonResp;
      if(liquidityFile.startsWith("http")){
        console.log("liquidity file starts with http: ",liquidityFile)
          const response = await fetch(liquidityFile);
          if(!response.ok){
            console.log("couldn't fetch the liquidity file from raydium")
            return;
          }
          liquidityJsonResp = await response.json();
          // const liquidityJson = (await liquidityJsonResp.json()) as { official: any; unOfficial: any }
          // const allPoolKeysJson = [...(liquidityJson?.official ?? []), ...(liquidityJson?.unOfficial ?? [])]

          this.allPoolKeysJson = [liquidityJsonResp] as LiquidityPoolJsonInfo[]
          // console.log("this.allPoolKeysJson inside the raydiumSwap class: ",this.allPoolKeysJson)
      }else{
          console.log("liquidity file doesn't start with http: ",liquidityFile)
          const fileContent = await promises.readFile(process.cwd() + liquidityFile,"utf-8");
          liquidityJsonResp = JSON.parse(fileContent);
          // console.log("liquidityJsonResp inside the raydiumSwap class: ",liquidityJsonResp)
      }

      this.allPoolKeysJson = liquidityJsonResp as LiquidityPoolJsonInfo[];
    } catch (error) {
        console.log("error trying to fetch the response from loadPoolkeys.json: ",error)
    }
  }

    /**
   * Finds pool information for the given token pair.
   * @param {string} mintA - The mint address of the first token.
   * @param {string} mintB - The mint address of the second token.
   * @returns {LiquidityPoolKeys | null} The liquidity pool keys if found, otherwise null.
   */

  findPoolInfoForTokens(mintA: string, mintB: string) {

    if(this.allPoolKeysJson === undefined){
      return null;
    }
    // console.log("here", this.allPoolKeysJson)
    const poolData = this.allPoolKeysJson.find(
      (i) => {
        // console.log("i: ",i);
        return (i.baseMint === mintA && i.quoteMint === mintB) || (i.baseMint === mintB && i.quoteMint === mintA)
      }
    )

    if (!poolData) return null

    return jsonInfo2PoolKeys(poolData) as LiquidityPoolKeys
  }
  findPoolInfoForTokensCustom(poolData:LiquidityPoolJsonInfo){
    
    return jsonInfo2PoolKeys(poolData) as LiquidityPoolKeys
  }

    /**
   * Retrieves token accounts owned by the wallet.
   * @async
   * @returns {Promise<TokenAccount[]>} An array of token accounts.
   */
  async getOwnerTokenAccounts() {
    const walletTokenAccount = await this.connection.getTokenAccountsByOwner(this.wallet.publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    return walletTokenAccount.value.map((i) => ({
      pubkey: i.pubkey,
      programId: i.account.owner,
      accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
    }))
  }

    /**
   * Builds a swap transaction.
   * @async
   * @param {string} toToken - The mint address of the token to receive.
   * @param {number} amount - The amount of the token to swap.
   * @param {LiquidityPoolKeys} poolKeys - The liquidity pool keys.
   * @param {number} [maxLamports=100000] - The maximum lamports to use for transaction fees.
   * @param {boolean} [useVersionedTransaction=true] - Whether to use a versioned transaction.
   * @param {'in' | 'out'} [fixedSide='in'] - The fixed side of the swap ('in' or 'out').
   * @returns {Promise<Transaction | VersionedTransaction>} The constructed swap transaction.
   */
  async getSwapTransaction(
    toToken: string,
    // fromToken: string,
    amount: number,
    poolKeys: LiquidityPoolKeys,
    maxLamports: number = 100000,
    useVersionedTransaction = true,
    fixedSide: 'in' | 'out' = 'in'
  ): Promise<{transaction?:Transaction, versionedTransaction?: VersionedTransaction, 
    minAmountOut: string, amountIn: string
  }> {
    //usually quoteMint is the token we want to swap to and baseMint is SOL
    const directionIn = poolKeys.quoteMint.toString() == toToken
    //directionIn is a boolean. it's true if the token we want to swap to is the quote token
    //which usually is, and false if the token we want to swap to is solana
    //so if we want to swap usdc to solana it's true, if we want to swap solana to usdc it's false
    const { minAmountOut, amountIn } = await this.calcAmountOut(poolKeys, amount, directionIn)
    //calculates the amount of token we will receive, for exapmle if we swap sol->usdc, it's gonna 
    //return the amount of usdc we are gonna get i think.
    // console.log("minAmountOut: ",minAmountOut, "amountIn: ",amountIn)
    const {numerator:minAmountOutNumerator,denominator:minAmountOutDenominator} = minAmountOut
    // const newVarForTheMinAmountOut = (new BN(minAmountOutNumerator)).div(new BN(minAmountOutDenominator));
    const newVarForTheMinAmountOut = new Decimal(minAmountOutNumerator.toString()).div(new Decimal(minAmountOutDenominator.toString()));
    const {numerator:amountInNumerator,denominator:amountInDenominator} = amountIn;
    // const newVarForTheAmountIn = (new BN(amountInNumerator.toString())).div(new BN(amountInDenominator.toString()));
    const newVarForTheAmountIn = new Decimal(amountInNumerator.toString()).div(new Decimal(amountInDenominator.toString()));
    console.log("newVarForAmountIn: ",newVarForTheAmountIn.toString())
    console.log("newVarForAmountOut: ",newVarForTheMinAmountOut.toString())
    

    const userTokenAccounts = await this.getOwnerTokenAccounts()
    const swapTransaction = await Liquidity.makeSwapInstructionSimple({
      connection: this.connection,
      makeTxVersion: useVersionedTransaction ? 0 : 1,
      poolKeys: {
        ...poolKeys,
      },
      userKeys: {
        tokenAccounts: userTokenAccounts,
        owner: this.wallet.publicKey,
      },
      amountIn: amountIn,
      amountOut: minAmountOut,
      fixedSide: fixedSide,
      config: {
        bypassAssociatedCheck: false,
      },
      computeBudgetConfig: {
        microLamports: maxLamports,
      },
    })
    //i think swapTransaction contains the instructions we need to make the transaction

    const recentBlockhashForSwap = await this.connection.getLatestBlockhash()
    const instructions = swapTransaction.innerTransactions[0].instructions.filter(Boolean)

    if (useVersionedTransaction) {
      const versionedTransaction = new VersionedTransaction(
        new TransactionMessage({
          payerKey: this.wallet.publicKey,
          recentBlockhash: recentBlockhashForSwap.blockhash,
          instructions: instructions,
        }).compileToV0Message()
      )

      versionedTransaction.sign([this.wallet.payer])

      return {versionedTransaction, amountIn: newVarForTheAmountIn.toString(), minAmountOut: newVarForTheMinAmountOut.toString()}
    }

    const legacyTransaction = new Transaction({
      blockhash: recentBlockhashForSwap.blockhash,
      lastValidBlockHeight: recentBlockhashForSwap.lastValidBlockHeight,
      feePayer: this.wallet.publicKey,
    })

    legacyTransaction.add(...instructions)

    return {transaction:legacyTransaction, amountIn: newVarForTheAmountIn.toString(), minAmountOut: newVarForTheMinAmountOut.toString()}
  }

    /**
   * Sends a legacy transaction.
   * @async
   * @param {Transaction} tx - The transaction to send.
   * @returns {Promise<string>} The transaction ID.
   */
  async sendLegacyTransaction(tx: Transaction, maxRetries?: number) {
    const txid = await this.connection.sendTransaction(tx, [this.wallet.payer], {
      skipPreflight: false,
      maxRetries: maxRetries,
      preflightCommitment:"finalized"
    })

    return txid
  }

    /**
   * Sends a versioned transaction.
   * @async
   * @param {VersionedTransaction} tx - The versioned transaction to send.
   * @returns {Promise<string>} The transaction ID.
   */
  async sendVersionedTransaction(tx: VersionedTransaction, maxRetries?: number,) {

    try {
      console.log("reached here: ",tx)
      const txid = await this.connection.sendTransaction(tx, {
        skipPreflight: false,
        maxRetries: maxRetries,
        preflightCommitment:"finalized"
      })

      const {lastValidBlockHeight,blockhash} = await this.connection.getLatestBlockhash()

      const confirmation = await this.connection.confirmTransaction({blockhash,lastValidBlockHeight,signature:txid},"confirmed")
      console.log("confirmation: ",confirmation)

      return {txid,confirmation,error:null}
    }catch(err){
       if (err instanceof TransactionExpiredBlockheightExceededError
       ) {
            console.error("Transaction expired due to block height exceeded:", err);
            return { txid: null, confirmation: null, error: "Transaction expired" };
        } else {
            console.error("Error in sendVersionedTransaction:", err);
            return { txid: null, confirmation: null, err };
        }
    }
  }

  async sendVersionedTransactionNew(tx: VersionedTransaction, maxRetries:number) {
      let txid;
      for(let attempt=0;attempt<=maxRetries;attempt++){
        try {
          console.log("trying attempt: ",attempt)
          txid = await this.connection.sendTransaction(tx, {
            skipPreflight: false,
            maxRetries: maxRetries,
            preflightCommitment:"finalized"
          })
          let lastValidBlockHeight,blockhash
          if(attempt===0){
            const latest = await this.connection.getLatestBlockhash()
            lastValidBlockHeight = "1234";
            blockhash=latest.blockhash
          }else{
            const latest = await this.connection.getLatestBlockhash()
            lastValidBlockHeight = latest.lastValidBlockHeight;
            blockhash = latest.blockhash
          }
          const confirmation = await this.connection.confirmTransaction({blockhash,lastValidBlockHeight: Number(lastValidBlockHeight),signature:txid},"confirmed")
          console.log("confirmation: ",confirmation)
          return {txid,confirmation,error:null}
        } catch (error) {
          // if(error instanceof TransactionExpiredBlockheightExceededError || error.message.includes("Blockhash not found")){
          console.error("blockhash error: ",error)
          if(attempt<maxRetries){
            const waitTime = Math.pow(2,attempt)*1000;
            console.log("retrying in:  ",waitTime/1000, " seconds")
            await new Promise((resolve) => setTimeout(resolve, waitTime));  
            continue; 
          }else{
            return { txid: null, confirmation: null, error: "Transaction expired" };
          }
        }
        // }
      }
  }

 /**
   * Simulates a versioned transaction.
   * @async
   * @param {VersionedTransaction} tx - The versioned transaction to simulate.
   * @returns {Promise<any>} The simulation result.
   */
  async simulateLegacyTransaction(tx: Transaction) {
    const txid = await this.connection.simulateTransaction(tx, [this.wallet.payer])

    return txid
  }

    /**
   * Simulates a versioned transaction.
   * @async
   * @param {VersionedTransaction} tx - The versioned transaction to simulate.
   * @returns {Promise<any>} The simulation result.
   */
  async simulateVersionedTransaction(tx: VersionedTransaction) {
    const txid = await this.connection.simulateTransaction(tx)

    return txid
  }

    /**
   * Gets a token account by owner and mint address.
   * @param {PublicKey} mint - The mint address of the token.
   * @returns {TokenAccount} The token account.
   */
  getTokenAccountByOwnerAndMint(mint: PublicKey) {
    return {
      programId: TOKEN_PROGRAM_ID,
      pubkey: PublicKey.default,
      accountInfo: {
        mint: mint,
        amount: 0,
      },
    } as unknown as TokenAccount
  }

    /**
   * Calculates the amount out for a swap.
   * @async
   * @param {LiquidityPoolKeys} poolKeys - The liquidity pool keys.
   * @param {number} rawAmountIn - The raw amount of the input token.
   * @param {boolean} swapInDirection - The direction of the swap (true for in, false for out).
   * @returns {Promise<Object>} The swap calculation result.
   */
  async calcAmountOut(poolKeys: LiquidityPoolKeys, rawAmountIn: number, swapInDirection: boolean) {
    const poolInfo = await Liquidity.fetchInfo({ connection: this.connection, poolKeys })

    // console.log("rawAmountIn: ", rawAmountIn)
    let currencyInMint = poolKeys.baseMint
    // console.log("currencInMKint: ", currencyInMint.toBase58())
    let currencyInDecimals = poolInfo.baseDecimals
    let currencyOutMint = poolKeys.quoteMint
    // console.log("currencyOutMint: ", currencyOutMint.toBase58())
    let currencyOutDecimals = poolInfo.quoteDecimals

    //this is triggered if we want to swap sol to usdc
    //i actually don't think so. the swapInDirection is true if 
    //the quoteMint is equal to the toToken arguement of the getSwapTransaction function
    //usually the baseMint  is solana, so the quoteMint is the other token. so if
    //we want to swap to the other token it's true so if we want to swap sol to usdc it's true
    //i tested it and it's true
    //swapDirection is false when we swap to solana
    //swapDirection is true when we swap from solana
    if (!swapInDirection) {
      console.log("swapInDirection is false : ", swapInDirection)
      currencyInMint = poolKeys.quoteMint
      currencyInDecimals = poolInfo.quoteDecimals
      currencyOutMint = poolKeys.baseMint
      currencyOutDecimals = poolInfo.baseDecimals
    }

    const currencyIn = new Token(TOKEN_PROGRAM_ID, currencyInMint, currencyInDecimals)
    // console.log("currencyIn inside calcAmountOut: ",currencyIn)
    const amountIn = new TokenAmount(currencyIn, rawAmountIn, false)
    // console.log("amountIn inside calcAmountOut: ",amountIn)
    const currencyOut = new Token(TOKEN_PROGRAM_ID, currencyOutMint, currencyOutDecimals)
    const slippage = new Percent(this.slpg, 100) // 5% slippage

    const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee } = Liquidity.computeAmountOut({
      poolKeys,
      poolInfo,
      amountIn,
      currencyOut,
      slippage,
    })

    return {
      amountIn,
      amountOut,
      minAmountOut,
      currentPrice,
      executionPrice,
      priceImpact,
      fee,
    }
  }
}

export default RaydiumSwap