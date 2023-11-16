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

  return (
    <div className="flex flex-col  bg-slate-900 rounded-t-lg  pt-16 py-4 ">
      <ul className="flex flex-col text-xl justify-items-start border-b-2 text-purple-700 font-bold border-white p-2">
        <li className="flex justify-between items-center bg-slate-900 text-slate-200 p-2 rounded-md mb-2">
          <div className="flex items-center text-purple-700">
            <input
              type="checkbox"
              checked={autoSellEnabled}
              onChange={handleAutoSellToggle}
              className="toggle mr-4 h-6 "
            />
            Sell
            <input
              type="number"
              className={`input h-6 input-bordered w-16 ml-2 mr-2 border-2 text-center bg-slate-950  border-purple-950 text-slate-300 ${
                !autoSellEnabled ? "opacity-25" : ""
              }`}
              disabled={!autoSellEnabled}
            />
            % after
            <input
              type="number"
              className={`input  h-6 input-bordered w-16 ml-4 border-2 text-center bg-slate-950  border-purple-950 text-slate-300 ${
                !autoSellEnabled ? "opacity-25" : ""
              }`}
              disabled={!autoSellEnabled}
            />
          </div>
          <span className="text-purple-700">Block(s)</span>
        </li>
        <li className="flex justify-between items-center bg-slate-900 text-purple-700 p-2 rounded-md">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={targetProfitEnabled}
              onChange={handleTargetProfitToggle}
              className="toggle mr-4"
            />
            Sell on target profit
            <input
              type="number"
              className={`input input-bordered h-6 w-16 ml-4 text-center bg-slate-950 border-2 border-purple-950 text-slate-300 disabled:opacity-25 ${
                !targetProfitEnabled ? "border-red-700" : ""
              }`}
              disabled={!targetProfitEnabled}
            />
          </div>
          <span>%</span>
        </li>
      </ul>
    </div>
  );
}

export default MyComponent;
