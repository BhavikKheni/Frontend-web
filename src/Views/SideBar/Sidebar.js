import React from "react";
import { useMediaQuery } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { useSidebar } from "../../Provider/SidebarProvider";
const drawerWidth = 270;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    // [theme.breakpoints.up("sm")]: {
    //   width: drawerWidth,
    //   flexShrink: 0,
    // },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
    height:'100%'
  },
}));

function Sidebar(props) {
  const { open, onClose } = props;
  const theme = useTheme();
  const isBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const { sidebarContent } = useSidebar();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={isBreakpoint ? !open : open}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <div className={classes.drawerContainer}>{sidebarContent}</div>
    </Drawer>
  );
}

export default Sidebar;
