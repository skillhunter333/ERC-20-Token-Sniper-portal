import { useState, useEffect, useMemo, useCallback } from "react";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";
import axios from "axios";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const useWallets = (userId) => {
  const [wallets, setWallets] = useState([]);
  const [walletsIncludingBalances, setWalletsIncludingBalances] = useState([]);
  const WETHaddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

  const provider = useMemo(
    () =>
      new ethers.providers.JsonRpcProvider(
        `${import.meta.env.VITE_ALCHEMY_API_URL}`
      ),
    []
  );

  const WETH = useMemo(
    () => new ethers.Contract(WETHaddress, ERC20.abi, provider),
    [provider]
  );

  const fetchWallets = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getUserWallets`,
        { params: { userId } }
      );
      setWallets(response.data);
    } catch (error) {
      toast.error(
        `Error fetching wallets: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [userId]);

  useEffect(() => {
    const getBalances = async (address) => {
      try {
        const wethBalance = await WETH.balanceOf(address);
        const ethBalance = await provider.getBalance(address);
        return {
          wethBalance: ethers.utils.formatEther(wethBalance),
          ethBalance: ethers.utils.formatEther(ethBalance),
        };
      } catch (error) {
        toast.error(`Error fetching balances: ${error.message}`);
        return {
          wethBalance: "Error",
          ethBalance: "Error",
        };
      }
    };

    const fetchAndSetBalances = async (wallets) => {
      const walletsUpdatedWithBalances = await Promise.all(
        wallets.map(async (wallet) => {
          const balances = await getBalances(wallet.publicKey);
          return { ...wallet, ...balances };
        })
      );

      setWalletsIncludingBalances(walletsUpdatedWithBalances);
    };

    if (wallets.length > 0) {
      fetchAndSetBalances(wallets);
    }
  }, [wallets, WETH, provider]);

  const handleCreateWallet = useCallback(async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/createWallet`,
        { userId }
      );
      setWallets((prevWallets) => [...prevWallets, response.data]);
      fetchWallets();
      toast.success("Wallet created successfully!");
    } catch (error) {
      toast.error(
        `Error creating wallet: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }, [userId]);

  const handleSetActiveWallet = useCallback(
    async (key) => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/set-active-wallet`,
          {
            userId,
            key,
          }
        );

        toast.success("Selected wallet set as active wallet successfully!");
      } catch (error) {
        toast.error(
          `Error setting active wallet: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    },
    [userId]
  );

  const handleDeleteWallet = useCallback(
    async (walletId) => {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/wallets/${walletId}`
        );
        setWallets((prevWallets) =>
          prevWallets.filter((wallet) => wallet.id !== walletId)
        );
        toast.success("Wallet deleted successfully!");
        fetchWallets();
      } catch (error) {
        toast.error(
          `Error deleting wallet: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    },
    [fetchWallets]
  );

  const copyToClipboard = useCallback((publicKey) => {
    navigator.clipboard.writeText(publicKey).then(
      () => {
        toast("Copied wallet address to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy wallet address: " + err);
      }
    );
  }, []);

  const refreshBalances = async () => {
    if (wallets.length > 0) {
      await fetchAndSetBalances(wallets);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/deleteWallet/${userId}`
      );

      toast.success("Wallet deleted successfully!");
    } catch (error) {
      toast.error(
        `Error deleting wallet: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return [
    wallets,
    walletsIncludingBalances,
    fetchWallets,
    handleCreateWallet,
    handleSetActiveWallet,
    handleDeleteWallet,
    copyToClipboard,
    refreshBalances,
    handleDelete,
  ];
};

export default useWallets;
