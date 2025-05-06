import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import DashboardSidebar from "../../components/DashboardSidebar";

const Layout = () => {
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1">
        <Navbar/>
          <Outlet />
      </div>
    </div>
  );
};

export default Layout;
