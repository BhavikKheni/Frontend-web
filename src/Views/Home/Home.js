import React, { useState, useEffect, useCallback } from "react";
import { withRouter, Link } from "react-router-dom";
import { MenuItem, Divider } from "@material-ui/core";
import { useSidebar } from "../../Provider/SidebarProvider";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../../Provider/Provider";
import SignIn from "../Auth/SignIn/SignIn";
import SignUp from "../Auth/SignUp/SignUp";
import ForgotPassword from "../Auth/ForgotPassword/ForgotPassword";
import { onIsLoggedIn } from "../../Services/Auth.service";
const useSession = () => React.useContext(SessionContext);

const Home = (props) => {
  const { t } = useTranslation();
  const { pathname } = props.location;
  let { isLoggedIn, doLogin } = useSession();
  const [openSignIn, setOpenSignIn] = useState(false);
  const { setSidebarContent, setSidebar } = useSidebar();
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openForgotPassword, setForgotPasswordDialog] = useState(false);

  const LoggedIn = useCallback(
    (user) => {
      onIsLoggedIn(true).then((res) => {
        if (res) {
          doLogin(res);
        }
      });
    },
    [doLogin]
  );
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

  useEffect(() => {
    if (!isLoggedIn) {
      setOpenSignIn(true);
    } else {
      setSidebar(true);
      setSidebarContent(
        <div style={{ margin: 20 }}>
          {isLoggedIn && (
            <React.Fragment>
              <MenuItem
                component={Link}
                to="/messages"
                selected={pathname === "/messages"}
              >
                {t("home.messages")}
              </MenuItem>
              <MenuItem>{t("home.myCalendar")}</MenuItem>
              <MenuItem>{t("home.nextBookings")}</MenuItem>
              <MenuItem>{t("home.myServiceHistory")}</MenuItem>
              <MenuItem
                component={Link}
                to="/profile"
                selected={pathname === "/profile"}
              >
                {t("home.myProfile")}
              </MenuItem>
              <MenuItem>{t("home.paymentMethods")}</MenuItem>
              <MenuItem>
                <Divider
                  style={{
                    border: "0.5px solid #949494",
                    width: "84%",
                  }}
                />
              </MenuItem>
            </React.Fragment>
          )}
          <MenuItem>{t("home.feedback")}</MenuItem>
          <MenuItem>{t("home.faq")}</MenuItem>
          <MenuItem>{t("home.support")}</MenuItem>
        </div>
      );
    }
  }, [setSidebarContent, setSidebar, t, pathname, isLoggedIn]);
  return (
    <div>
      HOME
      
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

export default withRouter(Home);
