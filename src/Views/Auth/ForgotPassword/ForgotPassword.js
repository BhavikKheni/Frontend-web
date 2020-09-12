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
import { add } from "../../../Services/Auth.service";
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

const ForgotPassword = (props) => {
  const {
    closeForgotPasswordDialog,
    openForgotPassword,
    openSignInDialog,
  } = props;
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [email, setEmail] = useState(null);
  const [isEmailValid, setEmailValid] = useState(true);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const onFinish = () => {
    // if (!isEmailValid || !email) return;
    // setLoading(true);
    setDisabled(true);
    add("/forgot", { email: email })
      .then((res) => {
        if (res && res.type === "SUCCESS") {
          // Message('Success', 'Forgot password request is completed. Kindly check your mail');
          setLoading(false);
          setDisabled(false);
          // toggle();
        } else {
          // Message('Error', res && res.message);
          setTimeout(() => {
            setLoading(false);
            setDisabled(false);
          }, 2000);
        }
      })
      .catch((error) => {
        setTimeout(() => {
          // Message('error', 'Request Failed');
          setLoading(false);
          setDisabled(false);
        }, 2000);
      });
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={closeForgotPasswordDialog}
        disableBackdropClick
        aria-labelledby="customized-dialog-title"
        open={openForgotPassword}
        className={"modal-dialog form-modal"}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={closeForgotPasswordDialog}
        >
          FORGOT PASSWORD
        </DialogTitle>
        <DialogContent className={"form-wrapper"} dividers>
          <FormControl>
            <TextField
              label="Email Address"
              id="outlined-email"
              variant="outlined"
              size="small"
              margin="normal"
              autoFocus
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isDisabled}
              onClick={onFinish}
            >
              RESET PASSWORD
            </Button>
          </FormControl>
        </DialogContent>
        <DialogContent dividers className={"text-center"}>
          <span>
            Already member? <br />
            <Button
              href="#text-buttons"
              color="primary"
              onClick={() => {
                closeForgotPasswordDialog();
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

export default ForgotPassword;
