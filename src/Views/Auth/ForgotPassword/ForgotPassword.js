import React, { useState } from "react";
import MuiFormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Formik } from "formik";
import InputComponent from "../../../Components/Forms/Input";
import TypographyComponent from "../../../Components/Typography/Typography";
import { add } from "../../../Services/Auth.service";
import ButtonComponent from "../../../Components/Forms/Button";
import DialogComponent from "../../../Components/Dialog/Dialog";
import * as Yup from "yup";

import "./ForgotPassword.css";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const FormControl = withStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 458,
  },
}))(MuiFormControl);

const ForgotPassword = (props) => {
  const {
    closeForgotPasswordDialog,
    openForgotPassword,
    openSignInDialog,
  } = props;
  const [isDisabled, setDisabled] = useState(false);
  const onFinish = (email) => {
    add("/forgot", { email: email })
      .then((res) => {
        if (res && res.type === "SUCCESS") {
          setDisabled(false);
          closeForgotPasswordDialog();
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
  };

  return (
    <React.Fragment>
      <DialogComponent
        onClose={closeForgotPasswordDialog}
        disableBackdropClick
        aria-labelledby="customized-dialog-title"
        open={openForgotPassword}
        title="Reset password"
        maxHeight={267}
      >
        <DialogContent>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={async (values) => {
              onFinish(values.email);
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email().required("Use your sign up E-Mail"),
            })}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                handleChange,
                handleSubmit,
              } = props;
              return (
                <form onSubmit={handleSubmit} className="forgot-password-form">
                  <FormControl className="forgot-password-form-control">
                    <InputComponent
                      label="E-Mail"
                      type="email"
                      value={values.email}
                      placeholder=" E-Mail"
                      name="email"
                      id="outlined-name"
                      onChange={handleChange}
                      error={errors.email ? true : false}
                      helperText={
                        errors.email && touched.email && `${errors.email}`
                      }
                      styles={{ maxHeight: 80, height: "100%" }}
                    />

                    <div className="forrgot-form-button">
                      <TypographyComponent
                        variant="h2"
                        title="Back to sign in."
                        onClick={() => {
                          openSignInDialog();
                          closeForgotPasswordDialog();
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ButtonComponent
                        variant="contained"
                        color="primary"
                        disabled={isDisabled}
                        type="submit"
                        endIcon={<ArrowForwardIosIcon />}
                        title="Send new password"
                        style={{
                          maxWidth: 213,
                          height: 48,
                          borderRadius: 10,
                        }}
                      />
                    </div>
                  </FormControl>
                </form>
              );
            }}
          </Formik>
        </DialogContent>
      </DialogComponent>
    </React.Fragment>
  );
};
export default ForgotPassword;
