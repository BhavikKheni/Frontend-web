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
import OweraHeaderPic from "../../Group 135.png";
import DialogComponent from "../../Components/Dialog/Dialog";
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
        <Toolbar>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2}>
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
            </Grid>
            <Grid item xs={12} md={7}>
              <div className={classes.search}>
                <InputBase
                  placeholder="Search"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onChange={changeSearch}
                />
                <span className={classes.searchIconItem} onClick={onSearch}>
                  <SearchIcon className={classes.searchIcon} />
                </span>
              </div>
              <div className={classes.menuName}>
                <MenuItem>
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
                  to="/create-services"
                  selected={pathname === "/create-services"}
                >
                  Work
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
            <Grid item xs={12} md={3}>
              {!isLoggedIn ? (
                <div style={{ display: "flex" }}>
                  <ButtonComponent
                    size="small"
                    color="inherit"
                    onClick={openSignInDialog}
                    style={{
                      maxWidth: "116px",
                      width: "100%",
                    }}
                    title={t("loginButton")}
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
                    title={t("signUpButton")}
                  />
                </div>
              ) : (
                <div>
                  <ButtonComponent
                    style={{
                      fontSize: 16,
                      width: 100,
                      height: 40,
                      cursor: "pointer",
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
