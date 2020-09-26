import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FormControl } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Snackbar from "@material-ui/core/Snackbar";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import MuiAlert from "@material-ui/lab/Alert";
import { login, setLocalStorage } from "../../../Services/Auth.service";
import InputComponent from "../../../Components/Forms/Input";
import ButtonComponent from "../../../Components/Forms/Button";
import FormDialog from "../../../Components/Dialog/Dialog";
import "./signin.css";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const SignIn = (props) => {
  const {
    openSignIn,
    handleCloseSignIn,
    openForgotPasswordDialog,
    openSignUpDialog,
    setLogin,
  } = props;

  const [isValid, setValid] = useState(false);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [open, setOpen] = React.useState(false);

  const [state, setState] = useState({
    email: null,
    password: null,
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (state.email && state.password) {
      setValid(false);
      setDisabled(true);
      setError(false);
      login(state.email, state.password)
        .then((res) => {
          setDisabled(false);
          if (res && res.type === "SUCCESS") {
            setLocalStorage({
              ...((res && res.user) || {}),
              token: res.auth_token,
            });
            setOpen(true);
            setLogin(res && res.user);
            handleCloseSignIn();
          } else {
            console.log(res.message);
          }
        })
        .catch((error) => {
          setDisabled(false);
        });
    } else {
      setValid(true);
      setError(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <React.Fragment>
      <FormDialog
        onClose={(e) => {
          e.stopPropagation();
          handleCloseSignIn();
          setState(null)
        }}
        open={openSignIn}
        title="Sign in"
        subTitle1="Don't have account?"
        subTitle2="Sign up"
        onSubTitle2={(e) => {
          e.stopPropagation();
          handleCloseSignIn();
          openSignUpDialog();
        }}
        maxHeight={328}
      >
        <DialogContent style={{ textAlign: "center" }}>
          <form onSubmit={onSubmit} noValidate autoComplete="off">
            <FormControl className="login-form-control">
              <InputComponent
                label="Email"
                type="email"
                placeholder="Email"
                name="email"
                id="outlined-email"
                autoFocus
                required={isValid}
                onChange={handleChange}
                error={isError}
                styles={{
                  border: isError && isValid ? "1px solid red" : "initial",
                }}
              />
              <InputComponent
                label="Password"
                type="password"
                placeholder="Password"
                name="password"
                id="outlined-password"
                required={isValid}
                onChange={handleChange}
                error={isError}
                styles={{
                  border: isError && isValid ? "1px solid red" : "initial",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link
                  href="#"
                  className={"forgot-password"}
                  onClick={() => {
                    handleCloseSignIn();
                    openForgotPasswordDialog();
                  }}
                >
                  Forgot Password?
                </Link>
                <ButtonComponent
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isDisabled}
                  className="login"
                  endIcon={<ArrowForwardIosIcon />}
                  title="Log in"
                />
              </div>
            </FormControl>
          </form>
        </DialogContent>
      </FormDialog>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleClose} severity="success">
          Login Successfully
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
export default SignIn;
