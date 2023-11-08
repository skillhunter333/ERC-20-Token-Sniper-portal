import React from "react";
import { BiCopyAlt } from "react-icons/bi";
import { BsFillTrash3Fill } from "react-icons/bs";
import etherscan from "../assets/etherscan.svg";

const Wallet = ({ wallet, onDelete, onSetActive, onCopy, isSelected }) => {
  return (
    <li
      className={`flex justify-items-start border-b-2 text-white text-bold border-white p-2 
                  ${isSelected ? "bg-sky-700" : ""}`}
      onClick={() => {
        onSetActive(wallet.publicKey);
        isSelected = true;
      }}
    >
      <span>
        Address:{" "}
        {wallet.publicKey.slice(0, 4) + "..." + wallet.publicKey.slice(-6)}
      </span>

      <button onClick={() => onCopy(wallet.publicKey)} className="mx-4 mb-4">
        <BiCopyAlt />
      </button>
      <a href={`https://etherscan.io/address/${wallet.publicKey}`}>
        <img src={etherscan} alt="etherscan" className="h-4 mt-2" />
      </a>
      <span className="p-2 bg-slate-800 ml-4 mb-4 rounded-l-lg text-xs text-white">
        {wallet.wethBalance ? wallet.wethBalance : "0.000"} WETH |
      </span>
      <span className="p-2 bg-slate-800 mb-4 rounded-r-lg text-xs text-white">
        {wallet.ethBalance ? wallet.ethBalance : "nA"} ETH
      </span>
      <button className="ml-8 mt-2" onClick={() => onDelete(wallet.publicKey)}>
        <BsFillTrash3Fill />
      </button>
    </li>
  );
};

export default Wallet;
