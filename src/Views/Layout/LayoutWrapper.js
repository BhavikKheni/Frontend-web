import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import OweraHeader from "../Header/Header";
import Sidebar from "../SideBar/Sidebar";
import Layout from "./Layout";
import { useSidebar } from "../../Provider/SidebarProvider";
import Footer from "../Footer/Footer";
import "./LayoutWrapper.css";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

const LayoutWrapper = () => {
  const classes = useStyles();
  const { isSideBar, setSidebar } = useSidebar();
  const [mobileOpen, setMobileOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setSidebar(!isSideBar);
  };

  return (
    <div>
      <CssBaseline />
      <OweraHeader open={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <div className="content-wrapper">
        <div className="main-content">
          <Hidden
            xsDown={isSideBar}
            smUp={!isSideBar}
            implementation="css"
            className="sidebar-wrapper"
          >
            <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
          </Hidden>
          <Layout sidebarOpen={mobileOpen} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LayoutWrapper;
