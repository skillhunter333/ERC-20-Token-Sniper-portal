// Sniper.js

import { useState, useEffect } from "react";

const Sniper = () => {
  const [amount, setAmount] = useState("0.25");
  const [gas, setGas] = useState("21000"); // Default gas value
  const [slippage, setSlippage] = useState("0.05");
  const [targetTokenAddress, setTargetTokenAddress] = useState("");

  const [consoleLogs, setConsoleLogs] = useState([]);
  const [sniping, setSniping] = useState(false);

  const handleStartSnipe = async () => {
    setSniping(true);
    setConsoleLogs([]);
    const response = await fetch("/api/startSnipe", {
      method: "POST",
      body: JSON.stringify({ amount, gas, slippage }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setConsoleLogs(data.logs);
    }

    setSniping(false);
  };

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:7545"); // Replace with your backend WebSocket URL

    socket.onmessage = (event) => {
      const newLog = JSON.parse(event.data);
      setConsoleLogs((prevLogs) => [...prevLogs, newLog]);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="bg-black p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Sniper</h1>

      <div>
        <label className="block mb-2">
          Contract to snipe:
          <input
            type="text"
            value={targetTokenAddress}
            onChange={(e) => setTargetTokenAddress(e.target.value)}
            className="rounded-md p-1 bg-gray-800 text-white"
          />
        </label>
        <label className="block mb-2">
          Amount (WETH):
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-md p-1 bg-gray-800 text-white"
          />
        </label>
        <label className="block mb-2">
          Gas:
          <input
            type="text"
            value={gas}
            onChange={(e) => setGas(e.target.value)}
            className="rounded-md p-1 bg-gray-800 text-white"
          />
        </label>
        <label className="block mb-2">
          Slippage:
          <input
            type="text"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="rounded-md p-1 bg-gray-800 text-white"
          />
        </label>
        <button
          onClick={handleStartSnipe}
          disabled={sniping}
          className="bg-green-500 text-white rounded-md p-2 cursor-pointer"
        >
          {sniping ? "Sniping..." : "Start Snipe"}
        </button>
      </div>

      <div className="mt-8 border border-white border-opacity-20 p-4">
        <div className="console">
          {consoleLogs.map((log, index) => (
            <div key={index} className="log">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sniper;
