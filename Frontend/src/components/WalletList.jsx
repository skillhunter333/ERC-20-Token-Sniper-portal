import React from "react";
import Wallet from "./Wallet";

const WalletList = ({
  walletsIncludingBalances,
  deleteWallet,
  setActiveWallet,
  copyWalletAddress,
  selectedWalletPublicKey,
}) => {
  return (
    <ul>
      {walletsIncludingBalances.map((wallet) => (
        <Wallet
          key={wallet.publicKey}
          wallet={wallet}
          onDelete={() => deleteWallet(wallet.publicKey)}
          onSetActive={() => setActiveWallet(wallet.publicKey)}
          isSelected={wallet.publicKey === selectedWalletPublicKey}
          onCopy={() => copyWalletAddress(wallet.publicKey)}
        />
      ))}
    </ul>
  );
};

export default WalletList;
