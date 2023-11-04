import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import contractInterface from "../assets/contract-abi";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEthereum } from "react-icons/fa";

const NFT = () => {
  const { isConnected } = useAccount();
  const [isFlipped, setIsFlipped] = useState(false);

  const contractAddress = "0x64344bb5fb4b4a3d48804dfb9dcdeda47a21a2ca";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractInterface,
    functionName: "mint",
  });

  const {
    data,
    isSuccess: isMintStarted,
    isLoading,
    write,
  } = useContractWrite(config);

  const { isSuccess: txSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const isMinted = txSuccess;

  useEffect(() => {
    if (txSuccess) {
      setIsFlipped(true);
    }
  }, [txSuccess]);

  return (
    <div className="mx-72 mt-20 flex  h-7/8 w-96 max-w-fit rounded-l-lg  bg-slate-900">
      {/*Minting Card /////////////// */}
      <div className="border-slate-300 rounded-l-lg border-2 border-r-0 border-rounded-l h-7/8 min-h-full min-w-96  shadow-2xl">
        <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-slate-600 w-full h-full min-h-full min-w-max p-6 rounded-l-lg shadow-md dark:bg-gray-900  dark:text-gray-50">
          <img
            src="https://res.cloudinary.com/dz6opiy3z/image/upload/v1695987850/coin_q6igyu.jpg"
            alt=""
            className="object-cover object-center w-full rounded-md h-72 dark:bg-gray-500"
          />
          <div className="mt-6 mb-2">
            <span className="block text-xs font-medium tracki uppercase">
              NFT PASS
            </span>
            <h2 className="text-xl font-semibold tracki">
              Unlimited Bot Access
            </h2>
          </div>

          <div className="grid grid-cols-2">
            <div className="w-full flex px-8 py-3 justify-between font-semibold border rounded-l-lg bg-green-200 dark:border-gray-100 dark:text-gray-100 hover:bg-green-200">
              <p className="font-medium">FREE {""}</p>

              <FaEthereum />
            </div>
            {isConnected ? (
              <button
                onClick={write}
                type="button"
                disabled={isLoading || isMintStarted}
                data-mint-loading={isLoading}
                data-mint-started={isMintStarted}
                className="px-8 w-full py-3 font-semibold border rounded-r-lg bg-emerald-500 dark:border-gray-100 dark:text-gray-100 hover:bg-emerald-600"
              >
                {isMintStarted && !isMinted && "Minting..."}
                {isLoading && "Approve..."}
                {!isMintStarted && !isLoading && "Mint"}
                {isMinted && "Success!"}
              </button>
            ) : (
              <button
                type="button"
                className="px-8 w-full py-3 font-semibold border rounded-r-lg bg-emerald-500 dark:border-gray-100 dark:text-gray-100 hover:bg-emerald-600"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/*Flipcard*/}
      <div>
        <div className="rounded-lg  h-full  w-96 ">
          <AnimatePresence>
            {isFlipped ? (
              <motion.div
                key="back"
                className=" border-2 border-l-0 border-slate-300 flex-col w-48 h-7/8 min-h-full bg-gradient-to-r from-slate-600 via-slate-500 to-emerald-500 rounded-r-lg shadow-lg flex items-center justify-center"
                initial={{ opacity: 0, rotateY: 180 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 180 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-white text-center mb-10 text-2xl backdrop-blur-2xl rounded-lg">
                  NFT successfully minted!
                </p>
                <p className="p-4 mb-10 font-bold backdrop-blur-2xl rounded-lg">
                  Your NFT should be available in your wallet. Transaction
                  successful
                </p>
                <p>
                  <a
                    className="border-b border-blue-900 font-semibold"
                    href={`https://sepolia.etherscan.io/tx/${data?.hash}`}
                  >
                    View on Etherscan
                  </a>
                </p>
                <br></br>
                <p>
                  <a
                    className="border-b border-blue-900 font-semibold"
                    href={`https://testnets.opensea.io/assets/sepolia/${contractAddress}/1`}
                  >
                    View on Opensea
                  </a>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="front"
                className=" border-2 border-l-0 border-slate-300  flex-col w-48 h-7/8 min-h-full bg-gradient-to-r from-slate-600 via-slate-500 to-slate-400 rounded-r-lg flex items-center justify-center"
                initial={{ opacity: 0, rotateY: 0 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="border-b border-slate-300 font-bold w-full shadow-sm shadow-white tracki p-4 backdrop-blur-2xl rounded-lg m-2">
                  Whitelist only
                </p>
                <p className="border-b text-center text-slate-900  border-slate-300 shadow-sm shadow-white font-medium w-full tracki p-4 backdrop-blur-2xl rounded-lg m-2">
                  Bots and trading tools.Use this NFT pass to gain access to the
                  restricted areas
                </p>
                <p className="border-b font-semibold border-slate-300 shadow-sm shadow-white backdrop-blur-2xl w-full rounded-lg  tracki uppercase m-2 p-4">
                  No gas money needed. Simply connect on the{" "}
                  <strong>Sepolia testnet</strong> to mint.
                </p>
                {isMintStarted && !isMinted && (
                  <div className="p-4 mt-2">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin "></div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NFT;
