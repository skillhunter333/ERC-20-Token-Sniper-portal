import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { Web3Button } from "@web3modal/react";

const ulStyles = {
  dropdown:
    "fixed top-16 right-5 text-black dark:text-white bg-slate-200 dark:bg-slate-800 rounded text-base",
  expanded: "sm:flex mt-4 justify-end items-center sm:block mr-4",
};

// eslint-disable-next-line react/prop-types
const MenuList = ({ dropdown = false }) => {
  //const navigate = useNavigate();

  return (
    <ul className={dropdown ? ulStyles.dropdown : ulStyles.expanded}>
      <>
        <li className="text-slate-600 dark:text-slate-200 font-bold mx-20 my-2">
          <Link to="/">Home</Link>
        </li>
        <li className="text-slate-600 dark:text-slate-200 font-bold mx-4 my-2">
          <Link to="/snipe">Sniper</Link>
        </li>

        <li className="text-slate-600 dark:text-slate-200 font-bold mr-12 my-2">
          <Link to="/mint">NFT</Link>
        </li>
        <li className="mr-12">
          <Web3Button />
        </li>
      </>
    </ul>
  );
};

const NavBar = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const showDropdown = (e) => {
    e.stopPropagation();
    setToggleDropdown((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener("click", () => {
      setToggleDropdown(false);
    });
  }, []);

  return (
    <div className="sticky w-screen  h-12 bg-transparent backdrop-blur-xs dark:bg-zinc-600 flex justify-end">
      <div
        className="sm:hidden text-3xl flex items-center p-4"
        onClick={showDropdown}
      >
        <RxHamburgerMenu />
        {toggleDropdown && <MenuList dropdown />}
      </div>
      <MenuList />
    </div>
  );
};

export default NavBar;
