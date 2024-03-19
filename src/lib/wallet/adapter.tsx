import React from 'react'
import * as web3 from '@solana/web3.js';
import * as walletAdapterReact from '@solana/wallet-adapter-react'
// import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import {PhantomWalletAdapter} from '@solana/wallet-adapter-phantom'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');
import { useConnection, useWallet } from '@solana/wallet-adapter-react';



const Adapter = () => {
    // allows us to add the wallet account balance to our react function component
    const [balance, setBalance] = React.useState<number | null>(0);
    // we specify which network we want to connect to
    const endpoint = web3.clusterApiUrl('devnet');
    // we specify which wallets we want our wallet adapter to support
    const wallets = [
        new PhantomWalletAdapter()
    ];

    // connection context object that is injected into the browser by the wallet
    const { connection } = useConnection();
    // user's public key of the wallet they connected to our application
    const { publicKey } = useWallet();

    // when the status of `connection` or `publicKey` changes, we execute the code block below
    React.useEffect(() => {
        const getInfo = async () => {
            if (connection && publicKey) {
                // we get the account info for the user's wallet data store and set the balance in our application's state
                const info = await connection.getAccountInfo(publicKey);
                setBalance(info!.lamports / web3.LAMPORTS_PER_SOL);
            }
        }
        getInfo();
        // the code above will execute whenever these variables change in any way
    }, [connection, publicKey]);
  return (
    <>
        {/* provides a connection to the solana json rpc api */}
        <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
            {/* makes the wallet adapter available to the entirety of our application (wrapped in this component) */}
            <walletAdapterReact.WalletProvider wallets={wallets}>
                {/* provides components to the wrapped application */}
                <WalletModalProvider>
                    <div className='flex justify-between items-center'>
                        <WalletMultiButton
                            className='!bg-helius-orange !rounded-xl transition-all duration-200'
                        />
                    </div>
                    {/* <main className='min-h-screen text-white'>
                        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 p-4'>
                            <div className='col-span-1 lg:col-start-2 lg:col-end-4 rounded-lg bg-[#2a302f] h-60 p-4'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-3xl font-semibold'>
                                        account info ✨
                                    </h2>
                                    <WalletMultiButton
                                        className='!bg-helius-orange !rounded-xl hover:!bg-[#161b19] transition-all duration-200'
                                    />
                                </div>

                                <div className='mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2'>
                                    <ul className='p-2'>
                                        <li className='flex justify-between'>
                                            <p className='tracking-wider'>Wallet is connected...</p>
                                            <p className='text-helius-orange italic font-semibold'>
                                                {publicKey ? 'yes' : 'no'}
                                            </p>
                                        </li>
                                        
                                        <li className='text-sm mt-4 flex justify-between'>
                                            <p className='tracking-wider'>Balance...</p>
                                            <p className='text-helius-orange italic font-semibold'>
                                                {balance}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </main> */}
                </WalletModalProvider>
            </walletAdapterReact.WalletProvider>
        </walletAdapterReact.ConnectionProvider>
    </>
);
}

export default Adapter;