import { Routes, Route } from "react-router-dom";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, sepolia } from "wagmi/chains";

import Layout from "./components/Layout";
import HomePage from "./pages/Homepage";
import NFT from "./pages/NFT";
import Sniper from "./pages/Sniper";

const chains = [arbitrum, mainnet, polygon, sepolia];
const projectId = `${import.meta.env.VITE_PROJECT_ID}`;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="snipe" element={<Sniper />} />
            <Route path="mint" element={<NFT />} />
          </Route>
        </Routes>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default App;
