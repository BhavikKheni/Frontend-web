import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CreateRoutes from "../../Routers/Routers";
const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    // padding: theme.spacing(4),
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerHeader: {
    padding: theme.spacing(6, 2),
    ...theme.mixins.toolbar,
  },
}));

function DefaultLayout(props) {
  const { sidebarOpen } = props;
  const classes = useStyles();
  return (
    <main
      className={clsx(classes.content, {
        [classes.contentShift]: sidebarOpen,
      })}
    >
      {/* <div className={classes.drawerHeader} /> */}
      <CreateRoutes />
    </main>
  );
}
export default DefaultLayout;
