import React, { useState, useEffect, useRef } from "react";
import { withRouter, Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Grid from "@material-ui/core/Grid";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from "@material-ui/core/InputBase";
import ReactFlagsSelect from "react-flags-select";
import { FormControl } from "@material-ui/core";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SearchIcon from "@material-ui/icons/Search";
import { useTranslation } from "react-i18next";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { SessionContext } from "../../Provider/Provider";
import TypographyComponent from "../../Components/Typography/Typography";
import ButtonComponent from "../../Components/Forms/Button";
import { onIsLoggedIn, onLogout } from "../../Services/Auth.service";
import { themes } from "../../themes.js";
import SignIn from "../Auth/SignIn/SignIn";
import SignUp from "../Auth/SignUp/SignUp";
import ForgotPassword from "../Auth/ForgotPassword/ForgotPassword";
import "react-flags-select/css/react-flags-select.css";
import OweraHeaderPic from "../../images/Owera-logo.png";
import DialogComponent from "../../Components/Dialog/Dialog";
import "./Header.css";
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
    width: "100%",
  },
  searchIconItem: {
    width: "100%",
    maxWidth: 60,
    backgroundColor: themes.default.colors.darkGray,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  searchIcon: {
    marginLeft: 15,
    marginTop: 5,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
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
  },
  menuName: {
    display: "flex",
  },
  logoutDialog: {
    textAlign: "center",
    height: "100%",
    width: "100%",
    maxWidth: 458,
    maxHeight: 240,
  },
  logoutDescription: {
    fontSize: 36,
    fontWeight: 500,
    color: themes.default.colors.white,
    textAlign: "left",
  },
}));
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const OweraHeader = (props) => {
  const classes = useStyles();
  const { handleDrawerToggle } = props;
  const { t, i18n } = useTranslation();
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openForgotPassword, setForgotPasswordDialog] = useState(false);
  let { isLoggedIn, doLogin, logout } = useSession();
  const [search, setSearch] = useState(false);
  const [openLogout, setLogout] = useState(false);
  let { pathname } = props.location;
  const { history } = props;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (search.length > 3) {
      intervalRef.current = setTimeout(() => {}, 1000);
    } else {
      clearTimeout(intervalRef.current);
    }
    return () => clearTimeout(intervalRef.current);
  }, [search]);

  const openSignInDialog = () => {
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
        history.push('/');
      }
    });
  };

  const onSelectFlag = (countryCode) => {
    i18n.changeLanguage(countryCode.toLowerCase());
  };

  const handleLogout = () => {
    onLogout(props).then((result) => {
      logout();
      setLogout(false);
    });
  };

  const changeSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  };

  const onSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, classes.colorDefault)}
      >
        <div className='container'>
          <div className='header_inner'>
            <div className="header_brand_wrapper">
              <a href="/" className='header_brand'>
                <img src={OweraHeaderPic} alt="Owera"></img>
              </a>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
            </div>
            <div className="header_navbar_wrapper">
              <div className="searchbar_wrapper">
                <InputBase
                  placeholder="Search"
                  inputProps={{ "aria-label": "search" }}
                  onChange={changeSearch}
                />
                <span className={classes.searchIconItem} onClick={onSearch}>
                  <SearchIcon className={classes.searchIcon} />
                </span>
              </div>
              <div className={clsx(classes.menuName, 'header_navbar')}>
                <MenuItem
                component={RouterLink}
                to="javascript:void(0);"
                selected={pathname === "javascript:void(0);"}
                >
                  <NotificationsNoneIcon className={classes.colorPrimary} />
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
                  to="/home"
                  selected={pathname === "/home"}
                >
                  Home
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/work"
                  selected={pathname === "/work"}
                >
                  Work
                </MenuItem>
              </div>
            </div>
            <div className="header_button_wrapper">
              {!isLoggedIn ? (
                <div className="login_button">
                  <ButtonComponent
                    onClick={openSignInDialog}
                    title={t("loginButton")}
                  />
                  <ButtonComponent
                    style={{
                      backgroundColor: themes.default.colors.orange,
                    }}
                    onClick={openSignUpDialog}
                    title={t("signUpButton")}
                  />
                </div>
              ) : (
                <div className="login_button">
                  <ButtonComponent
                    style={{
                      backgroundColor: themes.default.colors.purple,
                      color: themes.default.colors.white,
                    }}
                    title={t("logout")}
                    onClick={() => {
                      setLogout(true);
                    }}
                  />
                </div>
              )}
              <ReactFlagsSelect
                className='country_flag'
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
            </div>
        </div>
        </div>
        
      </AppBar>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          setLogout(false);
        }}
        open={openLogout}
        title={t("logout")}
        onSubTitle2={(e) => {
          e.stopPropagation();
        }}
        maxHeight={241}
        titleColor={themes.default.colors.green}
        iconColor={themes.default.colors.green}
      >
        <DialogContent style={{ textAlign: "center" }}>
          <FormControl className={classes.logoutDialog}>
            <TypographyComponent
              title="a warmly good bye..."
              className={classes.logoutDescription}
            />
            <div style={{ textAlign: "right" }}>
              <ButtonComponent
                variant="contained"
                color="primary"
                type="button"
                endIcon={<ArrowForwardIosIcon />}
                title={t("Logout")}
                style={{
                  backgroundColor: themes.default.colors.orange,
                }}
                onClick={handleLogout}
              />
            </div>
          </FormControl>
        </DialogContent>
      </DialogComponent>
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
