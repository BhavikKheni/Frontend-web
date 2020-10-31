import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { FormControl, CircularProgress } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { login, setLocalStorage } from "../../../Services/Auth.service";
import InputComponent from "../../../Components/Forms/Input";
import ButtonComponent from "../../../Components/Forms/Button";
import DialogComponent from "../../../Components/Dialog/Dialog";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [setRes, setTypeRes] = React.useState("");

  const onSubmit = (values, setSubmitting) => {
    setLoading(true);
    login(values.email, values.password)
      .then((res) => {
        if (res && res.type === "SUCCESS") {
          setLocalStorage({
            ...((res && res.user) || {}),
            token: res.auth_token,
          });
          setLoading(false);
          setOpen(true);
          setLogin(res && res.user);
          handleCloseSignIn();
          setTypeRes(res);
        } else {
          setSubmitting(false);
          setLoading(false);
          setOpen(true);
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
    <div>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          handleCloseSignIn();
        }}
        open={openSignIn}
        title={t("login.signin")}
        subTitle1={t("login.donHaveAccount")}
        subTitle2={t("login.signup")}
        onSubTitle2={(e) => {
          e.stopPropagation();
          handleCloseSignIn();
          openSignUpDialog();
        }}
        maxHeight={340}
      >
        <div className="dialog_container">
          <DialogContent>
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = errors.email = t("validation.email");
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = t("validation.inValidateEmail");
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                onSubmit(values, setSubmitting);
              }}
              validationSchema={Yup.object().shape({
                password: Yup.string().required(t("validation.password")),
              })}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                handleBlur,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className="login-form">
                  <FormControl className="dialog_form_control_inner">
                    <div className="dialog_form_row">
                      <InputComponent
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={values.email}
                        id="email-id"
                        autoFocus
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email && touched.email ? true : false}
                        helperText={
                          errors.email && touched.email && `${errors.email}`
                        }
                      />
                    </div>
                    <div className="dialog_form_row">
                      <InputComponent
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="signin-password-1"
                        value={values.password}
                        onChange={handleChange}
                        handleBlur={handleBlur}
                        error={
                          errors.password && touched.password ? true : false
                        }
                        helperText={
                          errors.password &&
                          touched.password &&
                          `${errors.password}`
                        }
                      />
                    </div>
                    <div className="modal_bottom_cta">
                      <Link
                        href="#"
                        className={"forgot-password"}
                        onClick={() => {
                          handleCloseSignIn();
                          openForgotPasswordDialog();
                        }}
                      >
                        {t("login.sendNewPassword")}
                      </Link>
                      <ButtonComponent
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="signin-button"
                        startIcon={isLoading && <CircularProgress />}
                        endIcon={!isLoading && ""}
                        title={t("login.button")}
                      />
                    </div>
                  </FormControl>
                </form>
              )}
            </Formik>
          </DialogContent>
        </div>
      </DialogComponent>
      <SnackBarComponent
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={setRes.message}
        type={setRes.type && setRes.type.toLowerCase()}
      ></SnackBarComponent>
    </div>
  );
};
export default withRouter(SignIn);
