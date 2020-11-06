import React, { useState } from "react";
import { onIsLoggedIn } from "../Services/Auth.service";
import { SessionContext } from "../Provider/Provider";

export const AuthenticationContext = React.createContext();
const useSession = () => React.useContext(SessionContext);

function SessionProvider(props) {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openForgotPassword, setForgotPasswordDialog] = useState(false);
  let { doLogin, isLoggedIn } = useSession();

  const LoggedIn = (user) => {
    onIsLoggedIn(true).then((res) => {
      if (res) {
        doLogin(res);
      }
    });
  };
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
  const session = {
    openSignIn: openSignIn,
    openSignUp: openSignUp,
    openForgotPassword: openForgotPassword,
    openSignInDialog,
    handleCloseSignIn,
    openSignUpDialog,
    handleCloseSignUp,
    openForgotPasswordDialog,
    closeForgotPasswordDialog,
    LoggedIn,
    isLoggedIn
  };

  return (
    <AuthenticationContext.Provider value={session}>
      {props.children}
    </AuthenticationContext.Provider>
  );
}

export default SessionProvider;
