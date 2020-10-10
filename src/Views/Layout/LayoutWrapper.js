import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import OweraHeader from "../Header/Header";
import Sidebar from "../SideBar/Sidebar";
import Layout from "./Layout";
import { useSidebar } from "../../Provider/SidebarProvider";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

const LayoutWrapper = () => {
  const classes = useStyles();
  const { isSideBar } = useSidebar();
  const [mobileOpen, setMobileOpen] = React.useState(true);
  

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div>
      <div className={classes.root}>
        <CssBaseline />
        <OweraHeader
          open={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Hidden xsDown={isSideBar} smUp={!isSideBar} implementation="css">
          <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
        </Hidden>

        <Layout sidebarOpen={mobileOpen} />
      </div>
      <footer className="main_footer">hello</footer>
    </div>
  );
};

export default LayoutWrapper;
