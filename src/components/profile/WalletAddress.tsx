import { useState } from 'react';

interface WalletAddressProps {
    address: string;
}

const WalletAddress:React.FC<WalletAddressProps> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  // Function to copy the address to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
  };
  const truncateAddress = () => {
    const prefix = address.substring(0, 3);
    const suffix = address.substring(address.length - 3);
    return `${prefix}...${suffix}`;
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md p-2">
      <span className="mr-2">{window.innerWidth > 768 ? address : truncateAddress()}</span>
      <button onClick={copyToClipboard} className="bg-black text-hotPink hover:bg-accent hover:text-accent-foreground py-2 px-4 rounded-md">
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default WalletAddress;
