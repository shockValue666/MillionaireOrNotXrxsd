import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import * as walletAdapterWallets from '@solana/wallet-adapter-phantom'
import * as web3 from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');

interface WalletContextProviderProps {
    children:React.ReactNode;
}

const WalletContextProvider:React.FC<WalletContextProviderProps> = ({ children }) => {

    const endpoint = web3.clusterApiUrl('devnet');
    const wallets = [
        new walletAdapterWallets.PhantomWalletAdapter()
    ];
    // console.log("wallets: ",wallets)

    return (
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect={true}>
                    <WalletModalProvider>
                        {children}
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
    );
};

export default WalletContextProvider;