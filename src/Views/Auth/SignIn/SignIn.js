import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { FormControl, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { login, setLocalStorage } from '../../../Services/Auth.service';
import InputTextComponent from '../../../Components/Forms/Input';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const SignIn = (props) => {
  const {
    openSignIn,
    handleCloseSignIn,
    openForgotPasswordDialog,
    openSignUpDialog,
    setLogin,
    toggle
  } = props;

  const [isValid, setValid] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [isEmailValid, setEmailValid] = useState(true);

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
    // if (!isValid) return;
    setLoading(true);
    setDisabled(true);
    login(state.email, state.password).then((res) => {

      // setLoading(false);
      setDisabled(false);

      if (res && res.type === 'SUCCESS') {
        setLocalStorage({
          ...((res && res.user) || {}),
          token: res.auth_token
        });
        setLogin(res && res.user);
        // Message('success', res.status);
        handleCloseSignIn();
      } else {
        // Message('error', res.message);
      }
    }).catch((error) => {
      // Message('error', "Error");
      setLoading(false);
      setDisabled(false);
    });
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={handleCloseSignIn}
        aria-labelledby="customized-dialog-title"
        open={openSignIn}
        className={"modal-dialog form-modal"}
        disableBackdropClick
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseSignIn}>
          LOGIN
        </DialogTitle>
        <DialogContent className={"form-wrapper"} dividers>
          <FormControl>
            <InputTextComponent
              label="Email Address"
              type="email"
              placeholder="Email Address"
              name="Email"
              id="outlined-email"
              required
              autoFocus
            />
            <InputTextComponent
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              id="outlined-password"
              required
            />
            <Button
              color="primary"
              onClick={() => {
                handleCloseSignIn();
                openForgotPasswordDialog();
              }}
            >
              Forgot Password?
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onSubmit();
              }}
              disabled={isDisabled}
            >
              Log in
            </Button>
          </FormControl>
        </DialogContent>
        <DialogContent dividers className={"text-center"}>
          <span>
            Not a member already? <br />
            <Button
              color="primary"
              onClick={() => {
                handleCloseSignIn();
                openSignUpDialog();
              }}
            >
              Sign Up
            </Button>
          </span>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
export default SignIn;
