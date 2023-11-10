import React, { useState } from "react";

function MyComponent() {
  const [autoSellEnabled, setAutoSellEnabled] = useState(false);
  const [targetProfitEnabled, setTargetProfitEnabled] = useState(false);

  const handleAutoSellToggle = () => {
    setAutoSellEnabled(!autoSellEnabled);
    if (!autoSellEnabled) setTargetProfitEnabled(false);
  };

  const handleTargetProfitToggle = () => {
    setTargetProfitEnabled(!targetProfitEnabled);
    if (!targetProfitEnabled) setAutoSellEnabled(false);
  };

  // handleSetAutoSell und handleSetAutoSellProfit ////

  return (
    <div>
      <ul className="flex flex-col text-xl justify-items-start border-b-2 text-purple-700 font-bold border-white p-2">
        <li className="flex h-6 items-center bg-slate-900 text-slate-200 p-2 rounded-md mb-2">
          <input
            type="checkbox"
            checked={autoSellEnabled}
            onChange={handleAutoSellToggle}
            className="toggle mr-4 h-6"
          />
          Sell after
          <input
            type="number"
            className="input h-6 input-bordered w-20 ml-2 text-center bg-slate-950 border border-purple-950 text-slate-300"
            disabled={!autoSellEnabled}
          />
          Blocks
        </li>
        <li className="flex items-center bg-slate-900 text-slate-200 p-2 rounded-md">
          <input
            type="checkbox"
            checked={targetProfitEnabled}
            onChange={handleTargetProfitToggle}
            className="toggle mr-4"
          />
          Sell on target profit
          <input
            type="number"
            className="input input-bordered w-20 ml-2 text-center bg-slate-950 border border-purple-950 text-slate-300"
            disabled={!targetProfitEnabled}
          />
          %
        </li>
      </ul>
    </div>
  );
}

export default MyComponent;
