import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { FormControl } from "@material-ui/core";
import InputTextComponent from "../../../Components/Forms/Input";
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
  const [isValid, setValid] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const onFinish = () => {
    console.log(email)
    if (email) {
      setValid(false);
      setDisabled(true);
      add("/forgot", { email: email })
        .then((res) => {
          if (res && res.type === "SUCCESS") {
            setDisabled(false);
            closeForgotPasswordDialog()
          } else {
            setTimeout(() => {
              setDisabled(false);
            }, 2000);
          }
        })
        .catch((error) => {
          setTimeout(() => {
            setDisabled(false);
          }, 2000);
        });
    }else{
      setValid(true);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={closeForgotPasswordDialog}
        disableBackdropClick
        aria-labelledby="customized-dialog-title"
        open={openForgotPassword}
        className={"modal-dialog form_modal"}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={closeForgotPasswordDialog}
        >
          FORGOT PASSWORD
        </DialogTitle>
        <DialogContent className={"form_wrapper"} dividers>
          <FormControl>
          <InputTextComponent
              label="Email Address"
              type="email"
              placeholder="Email Address"
              name="email"
              id="outlined-email"
              autoFocus
              required={isValid}
              onChange={handleChange}
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
            Already have an account? <br />
            <Button
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
