import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { FormControl } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { login, setLocalStorage } from "../../../Services/Auth.service";
import InputComponent from "../../../Components/Forms/Input";
import ButtonComponent from "../../../Components/Forms/Button";
import DialogComponent from "../../../Components/Dialog/Dialog";
import SnackBraComponent from "../../../Components/SnackBar/SnackBar";
import { Formik } from "formik";
import * as Yup from "yup";
import "./signin.css";

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
  } = props;

  const [open, setOpen] = React.useState(false);
  const [setRes, setTypeRes] = React.useState("");
  const onSubmit = (values) => {
    login(values.email, values.password)
      .then((res) => {
        if (res && res.type === "SUCCESS") {
          setLocalStorage({
            ...((res && res.user) || {}),
            token: res.auth_token,
          });
          setOpen(true);
          setLogin(res && res.user);
          handleCloseSignIn();
          setTypeRes(res);
        } else {
          setOpen(true)
          setTypeRes(res);
        }
      })
      .catch((error) => {});
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <React.Fragment>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          handleCloseSignIn();
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
        maxHeight={340}
      >
        <DialogContent style={{ textAlign: "center" }}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              onSubmit(values);
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string()
                .required("Password is required")
            })}
          >
            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="login-form">
                <FormControl className="login-form-control">
                  <InputComponent
                    label="Email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    id="outlined-email"
                    autoFocus
                    onChange={handleChange}
                    error={errors.email ? true : false}
                    helperText={errors.email && `${errors.email}`}
                    styles={{ maxHeight: 80, height: "100%" }}
                  />
                  <InputComponent
                    label="Password"
                    type="password"
                    placeholder="Password"
                    name="password"
                    id="outlined-password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password ? true : false}
                    helperText={errors.password && `${errors.password}`}
                    styles={{ marginTop: 10, maxHeight: 80, height: "100%" }}
                  />
                  <div className="signin-button-bottom">
                    <Link
                      href="#"
                      className={"forgot-password"}
                      onClick={() => {
                        handleCloseSignIn();
                        openForgotPasswordDialog();
                      }}
                    >
                      Send new password?
                    </Link>
                    <ButtonComponent
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="signin-button"
                      endIcon={<ArrowForwardIosIcon />}
                      title="Login"
                    />
                  </div>
                </FormControl>
              </form>
            )}
          </Formik>
        </DialogContent>
      </DialogComponent>
      <SnackBraComponent
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={setRes.message}
        type={setRes.type && setRes.type.toLowerCase()}
      ></SnackBraComponent>
    </React.Fragment>
  );
};
export default SignIn;
