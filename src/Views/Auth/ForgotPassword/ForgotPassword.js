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
import Spinner from "../../../Components/Spinner/Spinner";
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
  const [isLoading, setLoading] = useState(false);
  const onFinish = (email) => {
    add("/forgot", { email: email })
      .then((res) => {
        setLoading(true);
        if (res && res.type === "SUCCESS") {
          setDisabled(false);
          closeForgotPasswordDialog();
        }
      })
      .catch((error) => {
        setLoading(false);
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
        <div className="dialog_container">
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
                  <form
                    onSubmit={handleSubmit}
                    className="forgot-password-form"
                  >
                    <FormControl className="dialog_form_control_inner">
                      <div className="dialog_form_row">
                        <InputComponent
                          type="email"
                          value={values.email}
                          placeholder="E-Mail"
                          name="email"
                          id="outlined-E-mail-name"
                          onChange={handleChange}
                          error={errors.email ? true : false}
                          helperText={
                            errors.email && touched.email && `${errors.email}`
                          }
                        />
                      </div>
                      <div className="modal_bottom_cta">
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
                          startIcon={isLoading && <Spinner />}
                          type="submit"
                          title="Send new password"
                          loader={isLoading}
                        />
                      </div>
                    </FormControl>
                  </form>
                );
              }}
            </Formik>
          </DialogContent>
        </div>
      </DialogComponent>
    </React.Fragment>
  );
};
export default ForgotPassword;
