import React, { useState } from "react";
import Infobox from "../utils/Infobox";

const SelectFlashbot = ({ setBribeValue, isEnabled, setIsEnabled }) => {
  const handleToggle = (e) => {
    setIsEnabled(e.target.checked);
    if (!e.target.checked) {
      setBribeValue(null);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex  items-center font-semibold text-center text-slate-950 text-lg">
        <label className=" inline-flex bg-slate-900 h-6 rounded-l-3xl items-center">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggle}
            className="toggle accent-black  fill-slate-500"
          />

          <span
            className={`${
              !isEnabled ? "text-purple-700" : "text-pink-700"
            } font-bold bg-slate-900 h-6 mx-4 w-48 rounded-xl hover:underline`}
          >
            Flashbot tx
          </span>
        </label>
        <div className="">
          <Infobox title="Flashbot tx">
            Using a flashbot transaction can lead to faster inclusion in a block
            if the validator accepts the bid. However, it also may incur higher
            fees due to competitive bidding{" "}
          </Infobox>
        </div>
      </div>
      <div className="flex justify-end items-center mt-2">
        <span
          className={`${
            !isEnabled ? "opacity-50 cursor-not-allowed" : ""
          }text-slate-400 text-md mr-2 pl-2 `}
        >
          bribe
        </span>
        <input
          type="number"
          className={`input w-32 h-8 text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-xl ${
            !isEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default SelectFlashbot;
