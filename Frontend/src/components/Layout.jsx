import { ToastContainer } from "react-toastify";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Background from "./Background";

const Layout = () => {
  return (
    <>
      <ToastContainer />

      <NavBar className="h-12" />

      <Background />
      <div className="h-full">
        <Outlet />
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default Layout;
