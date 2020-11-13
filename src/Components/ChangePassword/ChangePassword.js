import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiFormControl from "@material-ui/core/FormControl";
import DialogComponent from "../Dialog/Dialog";
import InputComponent from "../Forms/Input";
import ButtonComponent from "../Forms/Button";
import Sppiner from "../Spinner/Spinner";
import { add } from "../../Services/Auth.service";
import SnackBarComponent from "../SnackBar/SnackBar";

const FormControl = withStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-root": {},
  },
}))(MuiFormControl);

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const ChangePassword = (props) => {
  const { onOpenChangePassword, openResetPassword } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const onSubmit = async (values) => {
    if (props.type === "change-password") {
      const data = {
        email: props.user.email,
        old_password: values.current_password,
        new_password: values.confirm_password,
      };
      setIsLoading(true);
      const res = await add("/updateAuth", data).catch((error) => {
        console.log("Error", error);
        setIsLoading(false);
        setResponse(error);
        setOpen(true);
      });
      if (res) {
        setOpen(true);
        setResponse(res);
        setIsLoading(false);
        onOpenChangePassword();
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <DialogComponent
      onClose={(e) => {
        e.stopPropagation();
        onOpenChangePassword();
      }}
      open={openResetPassword}
      title="Change password"
    >
      <div className="dialog_container">
        <DialogContent style={{ textAlign: "center" }}>
          <Formik
            initialValues={{
              password: "",
              current_password: "",
              confirm_password: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              onSubmit(values);
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string().required("Password is required"),
              current_password: Yup.string().required("Current Password is required"),
              confirm_password: Yup.string()
                .required("Confirm Password is required")
                .test(
                  "passwords-match",
                  "Confirm Passwords must match with Password",
                  function (value) {
                    return this.parent.password === value;
                  }
                ),
            })}
          >
            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="reset-password-form">
                <FormControl className="dialog_form_control_inner">
                  <div className="dialog_form_row">
                    <InputComponent
                      type="password"
                      placeholder="Current password"
                      name="current_password"
                      value={values.current_password}
                      id="outlined-current_password"
                      autoFocus
                      onChange={handleChange}
                      error={errors.current_password ? true : false}
                      helperText={
                        errors.current_password && `${errors.current_password}`
                      }
                    />
                  </div>
                  <div className="dialog_form_row">
                    <InputComponent
                      type="password"
                      placeholder="New password"
                      name="password"
                      value={values.password}
                      id="change-password"
                      onChange={handleChange}
                      error={errors.password ? true : false}
                      helperText={errors.password && `${errors.password}`}
                    />
                  </div>
                  <div className="dialog_form_row">
                    <InputComponent
                      type="password"
                      placeholder="Confirm new password"
                      name="confirm_password"
                      id="Confirm-new-password"
                      value={values.confirm_password}
                      onChange={handleChange}
                      error={errors.confirm_password ? true : false}
                      helperText={
                        errors.confirm_password && `${errors.confirm_password}`
                      }
                    />
                  </div>
                  <div className="modal_bottom_cta">
                    <ButtonComponent
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="reset-password-button"
                      title="Reset"
                      startIcon={isLoading && <Sppiner />}
                      loader={isLoading}
                    />
                  </div>
                </FormControl>
              </form>
            )}
          </Formik>
        </DialogContent>
      </div>
      <SnackBarComponent
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={response.message}
        type={response.type && response.type.toLowerCase()}
      />
    </DialogComponent>
  );
};
export default ChangePassword;
