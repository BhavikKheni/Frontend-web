import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MuiDialogContent from "@material-ui/core/DialogContent";
import InputBase from "@material-ui/core/InputBase";
import ReactFlagsSelect from "react-flags-select";
import { FormControl } from "@material-ui/core";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SearchIcon from "@material-ui/icons/Search";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../../Provider/Provider";
import TypographyComponent from "../../Components/Typography/Typography";
import ButtonComponent from "../../Components/Forms/Button";
import { onIsLoggedIn, onLogout, search } from "../../Services/Auth.service";
import { themes } from "../../themes.js";
import SignIn from "../Auth/SignIn/SignIn";
import SignUp from "../Auth/SignUp/SignUp";
import ForgotPassword from "../Auth/ForgotPassword/ForgotPassword";
import "react-flags-select/css/react-flags-select.css";
import OweraHeaderPic from "../../images/Owera-logo.png";
import DialogComponent from "../../Components/Dialog/Dialog";
import Sppiner from "../../Components/Spinner/Spinner";
import { serverLogout } from "../../Services/Auth.service";
import "./Header.css";
import { LOCALSTORAGE_DATA } from "../../utils";
const useSession = () => React.useContext(SessionContext);
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    color: "#000",
    backgroundColor: theme.palette.background.paper,
  },
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
    fontFamily: "Rubik",
    fontSize: 36,
    fontWeight: 500,
    letterSpacing: "0.05em",
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
  const [textSearch, setSearch] = useState(false);
  const [openLogout, setLogout] = useState(false);
  const [logoutLoader, setLogoutLoader] = useState(false);
  const [logoutDisabled,setLogoutDisabled]=useState(false);
  let { pathname } = props.location;
  const { history } = props;
  const intervalRef = useRef(null);
  const [toPath, setPath] = useState("");

  useEffect(() => {
    if (textSearch.length > 3) {
      intervalRef.current = setTimeout(() => {
        fetchSearch();
      }, 1000);
    } else {
      clearTimeout(intervalRef.current);
    }
    return () => clearTimeout(intervalRef.current);
  }, [textSearch, fetchSearch]);

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
      }
    });
  };

  const onSelectFlag = (countryCode) => {
    i18n.changeLanguage(countryCode.toLowerCase());
  };

  const handleLogout = () => {
    setLogoutLoader(true);
    setLogoutDisabled(true)
    serverLogout()
      .then((result) => {
        if (result.type === "SUCCESS") {
          onLogout(props).then((result) => {
            logout();
            LOCALSTORAGE_DATA.remove("countries");
            LOCALSTORAGE_DATA.remove("languages");
            LOCALSTORAGE_DATA.remove("timezones");
            LOCALSTORAGE_DATA.remove("token");
            setLogoutLoader(false);
            setLogout(false);
            setLogoutDisabled(false)
            history.push('/')
          });
        }
      })
      .catch((err) => console.log(err));
  };

  async function fetchSearch() {
    const res = await search("/search", {
      searchValue: textSearch,
    }).catch((err) => console.log(err));
    if (res && res) {
      console.log("res", res);
    }
  }

  const changeSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  };

  const onSearch = (e) => {
    e.preventDefault();
  };

  const onServiceHeader = () => {
    history.push("/");
  };

  const onHomeHeader = (index) => {
    if (!isLoggedIn) {
      openSignInDialog();
      setPath("/home");
    } else {
      history.push("/home");
    }
  };

  const onWorkHeader = (index) => {
    if (!isLoggedIn) {
      openSignInDialog();
      setPath("/work");
    } else {
      console.log("work call");
      history.push("/work");
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, classes.colorDefault)}
      >
        <div className="container">
          <div className="header_inner">
            <div className="header_brand_wrapper">
              <a href="/" className="header_brand">
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
              <List className={(classes.root, "header_navbar")}>
                <ListItem>
                  <NotificationsNoneIcon className={classes.colorPrimary} />
                </ListItem>
                <ListItem
                  selected={pathname === "/"}
                  onClick={(event, index) => {
                    onServiceHeader();
                  }}
                >
                  Services
                </ListItem>
                <ListItem
                  selected={pathname === "/home"}
                  onClick={(event, index) => {
                    onHomeHeader(1);
                  }}
                >
                  Home
                </ListItem>
                <ListItem
                  selected={pathname === "/work"}
                  onClick={(event, index) => {
                    onWorkHeader(2);
                  }}
                >
                  Work
                </ListItem>
              </List>
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
                className="country_flag"
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
        <div className="dialog_container">
          <DialogContent>
            <FormControl className={classes.logoutDialog}>
              <TypographyComponent
                title="a warmly good bye..."
                className={classes.logoutDescription}
              />
              <div className="modal_bottom_cta">
                <ButtonComponent
                  variant="contained"
                  color="primary"
                  type="button"
                  title={t("Log out")}
                  style={{
                    backgroundColor: themes.default.colors.orange,
                  }}
                  disabled={logoutDisabled}
                  onClick={handleLogout}
                  startIcon={logoutLoader && <Sppiner />}
                />
              </div>
            </FormControl>
          </DialogContent>
        </div>
      </DialogComponent>
      <SignIn
        onClose={handleCloseSignIn}
        openSignIn={openSignIn}
        openSignUpDialog={openSignUpDialog}
        openForgotPasswordDialog={openForgotPasswordDialog}
        handleCloseSignIn={handleCloseSignIn}
        setLogin={LoggedIn}
        toPath={toPath}
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
