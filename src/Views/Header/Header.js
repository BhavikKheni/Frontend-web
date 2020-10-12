import React, { useState } from "react";
import { withRouter, Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from "@material-ui/core/InputBase";
import ReactFlagsSelect from "react-flags-select";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SearchIcon from "@material-ui/icons/Search";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../../Provider/Provider";
import ButtonComponent from "../../Components/Forms/Button";
import TypographyComponent from "../../Components/Typography/Typography";
import { onIsLoggedIn, onLogout } from "../../Services/Auth.service";
import { themes } from "../../themes.js";
import SignIn from "../Auth/SignIn/SignIn";
import SignUp from "../Auth/SignUp/SignUp";
import ForgotPassword from "../Auth/ForgotPassword/ForgotPassword";
import "react-flags-select/css/react-flags-select.css";
import OweraHeaderPic from "../../Group 135.png";
const useSession = () => React.useContext(SessionContext);
const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  colorPrimary: {
    color: themes.default.colors.darkGray,
  },
  colorDefault: {
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 6px 8px rgba(48, 48, 48, 0.25)",
  },
  menuButton: {
    color: "#000",
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  search: {
    display: "flex",
    background: "#FFFFFF",
    border: "2px solid #303030",
    borderRadius: 25,
    maxWidth: 458,
    width: "100%",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: themes.default.colors.darkGray,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  menuName: {
    display: "flex",
  },
}));

const OweraHeader = (props) => {
  const classes = useStyles();
  const { handleDrawerToggle } = props;
  const { t, i18n } = useTranslation();
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openForgotPassword, setForgotPasswordDialog] = useState(false);
  let { isLoggedIn, doLogin, logout } = useSession();
  let { pathname } = props.location;
  const { history } = props;

  const openSignInDialog = (e) => {
    e.stopPropagation();
    setOpenSignIn(true);
  };

  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  const openSignUpDialog = () => {
    setOpenSignUp(true);
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  const openForgotPasswordDialog = () => {
    setForgotPasswordDialog(true);
  };

  const closeForgotPasswordDialog = () => {
    setForgotPasswordDialog(false);
  };

  const LoggedIn = (user) => {
    onIsLoggedIn(true).then((res) => {
      if (res) {
        doLogin(res);
        history.push(`/profile/${res.user.id_user}`);
      }
    });
  };

  const onSelectFlag = (countryCode) => {
    i18n.changeLanguage(countryCode.toLowerCase());
  };

  const handleLogout = () => {
    onLogout(props).then((result) => {
      logout();
    });
  };
  return (
    <div>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, classes.colorDefault)}
      >
        <Toolbar>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <img src={OweraHeaderPic} alt="header"></img>
              {/* <TypographyComponent title={t("title")} style={{color:'black'}}/> */}
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={classes.search}>
                <InputBase
                  placeholder="Search"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
                <SearchIcon />
              </div>
              <div className={classes.menuName}>
                <MenuItem>
                  <NotificationsNoneIcon className={classes.colorPrimary} />
                </MenuItem>

                <MenuItem
                  component={RouterLink}
                  to="/dashboard"
                  selected={pathname === "/dashboard"}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/"
                  selected={pathname === "/"}
                >
                  Services
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/create-services"
                  selected={pathname === "/create-service"}
                >
                  Create service
                </MenuItem>
                {isLoggedIn && (
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    selected={pathname === "/profile"}
                    className={clsx(classes.selected)}
                  >
                    Profile
                  </MenuItem>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={3} >
              {!isLoggedIn ? (
                <div style={{ display: "flex"}}>
                  <ButtonComponent
                    size="small"
                    color="inherit"
                    onClick={openSignInDialog}
                    style={{
                      maxWidth: "116px",
                      width: "100%",
                    }}
                    title={t("signin")}
                  />
                  <ButtonComponent
                    size="small"
                    style={{
                      backgroundColor: themes.default.colors.orange,
                      color: "#fff",
                      maxWidth: "116px",
                      width: "100%",
                    }}
                    onClick={openSignUpDialog}
                    title={t("signup")}
                  />
                </div>
              ) : (
                <div>
                  <TypographyComponent
                    variant="h4"
                    style={{
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                    title="Logout"
                    onClick={() => {
                      handleLogout();
                    }}
                  />
                </div>
              )}
              <ReactFlagsSelect
                countries={["US", "GB", "FR", "DE", "IT", "GU"]}
                placeholder="Language"
                customLabels={{
                  US: "EN-US",
                  GB: "EN-GB",
                  FR: "FR",
                  DE: "DE",
                  IT: "IT",
                  GUJ: "GU",
                }}
                onSelect={onSelectFlag}
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <SignIn
        onClose={handleCloseSignIn}
        openSignIn={openSignIn}
        openSignUpDialog={openSignUpDialog}
        openForgotPasswordDialog={openForgotPasswordDialog}
        handleCloseSignIn={handleCloseSignIn}
        setLogin={LoggedIn}
      />
      <SignUp
        handleCloseSignUp={handleCloseSignUp}
        openSignUp={openSignUp}
        openSignInDialog={openSignInDialog}
      />
      <ForgotPassword
        closeForgotPasswordDialog={closeForgotPasswordDialog}
        openForgotPassword={openForgotPassword}
        openSignInDialog={openSignInDialog}
      />
    </div>
  );
};

export default withRouter(OweraHeader);
