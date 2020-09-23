import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { FormControl } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { add } from "../../../Services/Auth.service";
import InputTextComponent from "../../../Components/Forms/Input";
import TextField from "@material-ui/core/TextField";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Grid from "@material-ui/core/Grid";
import "./Signup.css";
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogTitle = withStyles(styles)((props) => {
  const {
    children,
    classes,
    onClose,
     openSignInDialog,
    isAccount = true,
    ...other
  } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div
        style={{ maxWidth: 140, width: "100%", display: "flex", flex: 1 }}
      ></div>
      <div className="signup-header">
        <div>
          <span className="signup-title">{children}</span>
        </div>
        {isAccount && (
          <div style={{ marginTop: 10 }}>
            <span className="signup-anAccount">Already have an account?</span>{" "}
            <span
              className="signup-anAccount"
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => {
                onClose();
                openSignInDialog();
              }}
            >
              Login
            </span>
          </div>
        )}
      </div>
      <div
        style={{
          maxWidth: 140,
          width: "100%",
          display: "flex",
          flex: 1,
          marginTop: 10,
        }}
      >
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
const TextInputField = withStyles((theme) => ({
  root: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
}))(TextField);
const CustomCheckbox = withStyles({
  root: {
    color: "#949494",
    "&$checked": {
      color: "#fff",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);
const SignUp = (props) => {
  const { handleCloseSignUp, openSignUp, openSignInDialog } = props;
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [isValid, setValid] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [openTermsCondition, setTermsCondition] = useState(false);

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
            setDisabled(false);
            handleCloseSignUp();
          } else {
            setDisabled(false);
          }
        })
        .catch((error) => {});
    } else {
      setValid(true);
    }
  };
  const handleCloseTermsCondition = () => {
    setTermsCondition(false);
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={handleCloseSignUp}
        aria-labelledby="customized-dialog-title"
        open={openSignUp}
        className={"signup-dialog"}
        disableBackdropClick
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleCloseSignUp}
          openSignInDialog={openSignInDialog}
        >
          Sign up
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <FormControl className="signup-form-control">
            <TextInputField
              id="fullName"
              label="Full name"
              type="text"
              name="fullName"
              variant="filled"
            />
            <TextInputField
              id="outlined-email"
              label="Email"
              type="email"
              name="email"
              className="email"
              variant="filled"
            />
            <TextInputField
              id="outlined-password"
              label="Password"
              type="password"
              placeholder="Create password"
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
              <div>
                <FormControlLabel
                  control={
                    <CustomCheckbox
                      checked={isChecked}
                      name="checked"
                      onChange={() => {
                        setChecked(!isChecked);
                      }}
                      size="medium"
                    />
                  }
                />

                <span className="terms-condition">
                  With your registration you agree to our{" "}
                </span>
                <span
                  className="terms-condition"
                  style={{ color: "#65B61B", cursor: "pointer" }}
                  onClick={() => {
                    setTermsCondition(true);
                    handleCloseSignUp();
                  }}
                >
                  terms & conditions
                </span>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {}}
                disabled={isDisabled}
                className="go"
                style={{ backgroundColor: isChecked ? "#2FB41A" : "#949494" }}
              >
                go <ArrowForwardIosIcon />
              </Button>
            </div>
            {/* <InputTextComponent
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
            </Button> */}
          </FormControl>
        </DialogContent>
      </Dialog>
      <Dialog
        onClose={handleCloseTermsCondition}
        aria-labelledby="term-condition-dialog"
        open={openTermsCondition}
        className={"terms-condition-dialog"}
        disableBackdropClick
      >
        <DialogTitle
          id="terms-dialog-title"
          onClose={handleCloseTermsCondition}
          isAccount={false}
        >
          Terms & condtitions
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <FormControl className="terms-condition-control">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TextInputField
                  id="fullName"
                  label="Full name"
                  type="text"
                  name="fullName"
                  variant="filled"
                  className="terms-condition-fullName"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TextInputField
                  id="outlined-password"
                  label="Password"
                  type="password"
                  placeholder="Create password"
                  name="password"
                  variant="filled"
                  className="password terms-condition-password"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TextInputField
                  id="outlined-email"
                  label="Email"
                  type="email"
                  name="email"
                  className="email terms-condition-email"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <FormControlLabel
                      control={
                        <CustomCheckbox
                          checked={isChecked}
                          name="checked"
                          onChange={() => {
                            setChecked(!isChecked);
                          }}
                          size="medium"
                        />
                      }
                    />
                    <span className="terms-condition">
                      With your registration you agree to our{" "}
                    </span>
                    <span
                      className="terms-condition"
                      style={{ color: "#65B61B" }}
                    >
                      terms & conditions
                    </span>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {}}
                    disabled={isDisabled}
                    className="go"
                    style={{
                      backgroundColor: isChecked ? "#2FB41A" : "#949494",
                    }}
                  >
                    go <ArrowForwardIosIcon />
                  </Button>
                </div>
              </Grid>
            </Grid>
            <div className="Container Flipped">
              <div className="Content">
                GeeksforGeeks is a Computer Science portal for geeks. It
                contains well written, well thought and well explained computer
                science and programming articles, quizzes etc. GeeksforGeeks is
                a Computer Science portal for geeks. It contains well written,
                well thought and well explained computer science and programming
                articles, quizzes etc. GeeksforGeeks is a Computer Science
                portal for geeks. It contains well written, well thought and
                well explained computer science and programming articles,
                quizzes etc. GeeksforGeeks is a Computer Science portal for
                geeks. It contains well written, well thought and well explained
                computer science and programming articles, quizzes etc.
                GeeksforGeeks is a Computer Science portal for geeks. It
                contains well written, well thought and well explained computer
                science and programming articles, quizzes etc. GeeksforGeeks is
                a Computer Science portal for geeks. It contains well written,
                well thought and well explained computer science and programming
                articles, quizzes etc. GeeksforGeeks is a Computer Science
                portal for geeks. It contains well written, well thought and
                well explained computer science and programming articles,
                quizzes etc. GeeksforGeeks is a Computer Science portal for
                geeks. It contains well written, well thought and well explained
                computer science and programming articles, quizzes etc.
                GeeksforGeeks is a Computer Science portal for geeks. It
                contains well written, well thought and well explained computer
                science and programming articles, quizzes etc. GeeksforGeeks is
                a Computer Science portal for geeks. It contains well written,
                well thought and well explained computer science and programming
                articles, quizzes etc.
              </div>
            </div>
          </FormControl>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SignUp;
