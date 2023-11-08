import React from "react";

const Infobox = () => {
  return (
    <div className="dropdown dropdown-end">
      Use method to snipe
      <label tabIndex={0} className="btn btn-circle btn-ghost btn-xs text-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-4 h-4 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </label>
      <div
        tabIndex={0}
        className="card compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-64"
      >
        <div className="card-body">
          <h2 className="card-title">You needed more info?</h2>
          <p>Here is a description!</p>
        </div>
      </div>
    </div>
  );
};
export default Infobox;
