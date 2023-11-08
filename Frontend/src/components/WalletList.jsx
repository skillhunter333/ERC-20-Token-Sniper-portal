import React, { useState } from "react";
import Wallet from "../components/Wallet";
import useWallets from "../hooks/useWallets";

const WalletList = ({ userId, onDelete, onSetActive, onCopy, isSelected }) => {
  const [wallets, walletsIncludingBalances, fetchWallets, setActiveWallet] =
    useWallets(userId);
  const [selectedWalletPublicKey, setSelectedWalletPublicKey] = useState("");

  return (
    <ul>
      {wallets.map((wallet) => (
        <Wallet
          key={wallet.publicKey}
          wallet={wallet}
          onDelete={onDelete}
          onSetActive={setActiveWallet}
          isSelected={wallet.publicKey === selectedWalletPublicKey}
          onCopy={onCopy}
        />
      ))}
    </ul>
  );
};

export default WalletList;
