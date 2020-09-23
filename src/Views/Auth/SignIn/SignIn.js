import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { FormControl } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { login, setLocalStorage } from "../../../Services/Auth.service";
import InputTextComponent from "../../../Components/Forms/Input";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import "./signin.css";
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    display: "flex",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#FF7A00",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const {
    children,
    classes,
    onClose,
    openSignUpDialog,
    ...other
  } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div
        style={{ maxWidth: 140, width: "100%", display: "flex", flex: 1 }}
      ></div>
      <div className="signin-header">
        <div>
          <span className="signin-title">{children}</span>
        </div>
        <div>
          <span className="signin-anAccount">Don't have account?</span>{" "}
          <span
            className="signin-anAccount"
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              onClose();
              openSignUpDialog();
            }}
          >
            Sign up
          </span>
        </div>
      </div>
      <div style={{ maxWidth: 140, width: "100%", display: "flex", flex: 1 }}>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </div>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
const TextInputField = withStyles((theme) => ({
  root: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
}))(TextField);
const SignIn = (props) => {
  const {
    openSignIn,
    handleCloseSignIn,
    openForgotPasswordDialog,
    openSignUpDialog,
    setLogin,
  } = props;

  const [isValid, setValid] = useState(false);
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
  const onSubmit = () => {
    if (state.email && state.password) {
      setValid(false);
      setDisabled(true);
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
    }
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={handleCloseSignIn}
        aria-labelledby="customized-dialog-title"
        open={openSignIn}
        disableBackdropClick
        className="login-dialog"
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleCloseSignIn}
          openSignUpDialog={openSignUpDialog}
        >
          LOGIN
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <FormControl className="login-form-control">
            <TextInputField
              id="outlined-email"
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              variant="filled"
            />
            <TextInputField
              id="outlined-password"
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              variant="filled"
              className="password"
            />
            <div
              style={{
                marginTop: 29,
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  onSubmit();
                }}
                disabled={isDisabled}
                className="login"
              >
                Log in <ArrowForwardIosIcon />
              </Button>
            </div>
            {/* <InputTextComponent
              label="Email Address"
              type="email"
              placeholder="Email Address"
              name="email"
              id="outlined-email"
              autoFocus
              required={isValid}
              onChange={handleChange}
            /> */}
            {/* <InputTextComponent
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              id="outlined-password"
              required={isValid}
              onChange={handleChange}
            />
            <Link
              href="#"
              className={"forgot-password"}
              onClick={() => {
                handleCloseSignIn();
                openForgotPasswordDialog();
              }}
            >
              Forgot Password?
            </Link> */}
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onSubmit();
              }}
              disabled={isDisabled}
            >
              Log in
            </Button> */}
          </FormControl>
        </DialogContent>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        message="Login Successfully"
        autoHideDuration={3000}
      />
    </React.Fragment>
  );
};
export default SignIn;
