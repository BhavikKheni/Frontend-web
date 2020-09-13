import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { FormControl } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { add } from "../../../Services/Auth.service";
import InputTextComponent from "../../../Components/Forms/Input";

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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

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

const SignUp = (props) => {
  const { handleCloseSignUp, openSignUp, openSignInDialog } = props;
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [isValid, setValid] = useState(false);
  const [state, setState] = useState({
    email: null,
    first_name: null,
    last_name: null,
    password: null,
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onFinish = () => {
    if (state.email && state.first_name && state.last_name && state.password) {
      setValid(false);
      setDisabled(true);
      add("/signup", state)
        .then((res) => {
          if (res && res.type === "SUCCESS") {
            setDisabled(false)
            handleCloseSignUp()
          } else {
            setDisabled(false);
          }
        })
        .catch((error) => {});
    } else {
      setValid(true);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={handleCloseSignUp}
        aria-labelledby="customized-dialog-title"
        open={openSignUp}
        className={"modal-dialog form-modal"}
        disableBackdropClick
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseSignUp}>
          SIGN UP
        </DialogTitle>
        <DialogContent className={"form-wrapper"} dividers>
          <FormControl>
            <InputTextComponent
              label="Email Address"
              type="email"
              placeholder="Email Address"
              name="Email"
              id="outlined-email"
              autoFocus
              required={isValid}
              onChange={handleChange}
            />
            <InputTextComponent
              label="First Name"
              type="text"
              placeholder="First Name"
              name="first_name"
              id="outlined-first-name"
              required={isValid}
              onChange={handleChange}
            />
            <InputTextComponent
              label="Last Name"
              type="text"
              placeholder="Last Name"
              name="last_name"
              id="outlined-last-name"
              required={isValid}
              onChange={handleChange}
            />
            <InputTextComponent
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              id="outlined-password"
              required={isValid}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isDisabled}
              onClick={() => {
                onFinish();
              }}
            >
              Continue
            </Button>
          </FormControl>
        </DialogContent>
        <DialogContent dividers className={"text-center"}>
          <span>
            Already have an account? <br />
            <Button
              color="primary"
              onClick={() => {
                handleCloseSignUp();
                openSignInDialog();
              }}
            >
              Sign In
            </Button>
          </span>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SignUp;
