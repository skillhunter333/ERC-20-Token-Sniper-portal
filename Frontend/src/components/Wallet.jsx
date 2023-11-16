import React from "react";
import { BiCopyAlt } from "react-icons/bi";
import { BsFillTrash3Fill } from "react-icons/bs";
import etherscan from "../assets/etherscan.svg";

const Wallet = ({ wallet, onDelete, onSetActive, onCopy, isSelected }) => {
  return (
    <li
      className={`flex px-4 justify-between  border-b-2 text-slate-300 text-bold border-slate-300 h-20 p-2 
                  ${
                    isSelected ? "text-pink-700 bg-pink-700 " : "text-slate-300"
                  }`}
      onClick={() => onSetActive()}
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
      <span className="p-2 bg-slate-800 ml-4 mb-4 rounded-l-lg text-xs ">
        {wallet.wethBalance ? wallet.wethBalance : "nA"} WETH |
      </span>
      <span className="p-2 bg-slate-800 mb-4 rounded-r-lg text-xs ">
        {wallet.ethBalance ? wallet.ethBalance : "nA"} ETH
      </span>
      <button className="ml-8 mt-2" onClick={() => onDelete(wallet.publicKey)}>
        <BsFillTrash3Fill />
      </button>
    </li>
  );
};

export default Wallet;
