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
import { add } from '../../../Services/Auth.service';

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
  const [isEmailValid, setEmailValid] = useState(true);
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
    // if (!isValid) return;
    setLoading(true);
    setDisabled(true);
    add("/signup", state)
      .then((res) => {
        if (res && res.type === "SUCCESS") {
          // Message('success', 'Signed up successfully');
          // toggle();
        } else {
          // Message('error', res.message);
          // setLoading(false);
          setDisabled(false);
        }
      })
      .catch((error) => {
        // Message('error', 'Request failed');
        // setLoading(false);
      });
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
            <TextField
              label="Email Address"
              type="email"
              id="outlined-email"
              variant="outlined"
              size="small"
              margin="normal"
              autoFocus
              name="email"
              onChange={handleChange}
            />
            <TextField
              label="First Name"
              id="outlined-email"
              variant="outlined"
              size="small"
              margin="normal"
              name="firstName"
              onChange={handleChange}
            />
            <TextField
              label="Last Name"
              id="outlined-email"
              variant="outlined"
              size="small"
              margin="normal"
            />
            <TextField
              label="Password"
              id="outlined-password"
              variant="outlined"
              size="small"
              margin="normal"
              name="password"
              onChange={handleChange}
            />
            <Button variant="contained" color="primary"  disabled={isDisabled}>
              Continue
            </Button>
          </FormControl>
        </DialogContent>
        <DialogContent dividers className={"text-center"}>
          <span>
            Already member? <br />
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
