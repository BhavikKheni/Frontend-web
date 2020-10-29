import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { FormControl, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Grid from "@material-ui/core/Grid";
import InputComponent from "../../../Components/Forms/Input";
import ButtonComponent from "../../../Components/Forms/Button";
import TypographyComponent from "../../../Components/Typography/Typography";
import { add } from "../../../Services/Auth.service";
import DialogComponent from "../../../Components/Dialog/Dialog";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import { themes } from "../../../themes";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import "./Signup.css";
import FormHelperText from "@material-ui/core/FormHelperText";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

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
  const { t } = useTranslation();
  const {
    handleCloseSignUp,
    openSignUp,
    openSignInDialog,
    openSignUpDialog,
  } = props;
  const [isDisabled, setDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [setRes, setTypeRes] = React.useState("");
  const [openTermsCondition, setTermsCondition] = useState(false);
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      checkedC: false,
      checked: false,
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = t("validation.email");
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = t("validation.inValidateEmail");
      }
      return errors;
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required(t("validation.password")),
      first_name: Yup.string().required(t("validation.firstName")),
      last_name: Yup.string().required(t("validation.lastName")),
      phone_number: Yup.string().required(t("validation.phoneNumber")),
      checkedC: Yup.boolean()
        .required("Required")
        .oneOf([true], t("validation.thisFieldIsRequired")),
      checked: Yup.boolean()
        .required("Required")
        .oneOf([true], t("validation.thisFieldIsRequired")),
    }),
  });

  const onSubmit = (values) => {
    setLoading(true);
    add("/signup", values)
      .then((res) => {
        if (res && res.type === "SUCCESS") {
          handleCloseSignUp();
          setLoading(false);

          console.log(values);
        } else {
          setTypeRes(res);
          setDisabled(false);
          setLoading(false);
          setOpen(true);
        }
      })
      .catch((error) => {});
  };

  const handleCloseTermsCondition = () => {
    setTermsCondition(false);
    openSignUpDialog();
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
        onClose={() => {
          handleCloseSignUp();
          formik.resetForm();
        }}
        open={openSignUp}
        title={t("signup.title")}
        subTitle1={t("signup.alreadyHaveAccount")}
        subTitle2={t("login.title")}
        onSubTitle2={(e) => {
          e.stopPropagation();
          handleCloseSignUp();
          openSignInDialog();
        }}
        maxHeight={500}
      >
        {/* Signup Popup */}
        <div className="dialog_container">
          <DialogContent style={{ overflow: "inherit" }}>
            <form onSubmit={formik.handleSubmit} className="signup-form">
              <FormControl className="dialog_form_control_inner">
                <div className="dialog_form_row">
                  <InputComponent
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    id="outlined-name"
                    autoFocus
                    onChange={formik.handleChange}
                    value={formik.values.first_name}
                    error={formik.errors.first_name ? true : false}
                    helperText={
                      formik.errors.first_name && `${formik.errors.first_name}`
                    }
                  />
                </div>
                <div className="dialog_form_row">
                  <InputComponent
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    id="outlined-name"
                    onChange={formik.handleChange}
                    value={formik.values.last_name}
                    error={formik.errors.last_name ? true : false}
                    helperText={
                      formik.errors.last_name && `${formik.errors.last_name}`
                    }
                  />
                </div>
                <div className="dialog_form_row">
                  <InputComponent
                    type="email"
                    placeholder="Email"
                    name="email"
                    id="outlined-email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    error={formik.errors.email ? true : false}
                    helperText={formik.errors.email && `${formik.errors.email}`}
                  />
                </div>
                <div className="dialog_form_row">
                  <InputComponent
                    type="tel"
                    placeholder="Phone Number"
                    name="phone_number"
                    id="outlined-name"
                    onChange={formik.handleChange}
                    value={formik.values.phone_number}
                    error={formik.errors.phone_number ? true : false}
                    helperText={
                      formik.errors.phone_number &&
                      `${formik.errors.phone_number}`
                    }
                  />
                </div>
                <div className="dialog_form_row">
                  <InputComponent
                    type="password"
                    placeholder="Create password"
                    name="password"
                    id="outlined-password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    error={formik.errors.password ? true : false}
                    helperText={
                      formik.errors.password && `${formik.errors.password}`
                    }
                  />
                </div>
                {/* Agreement Checkboxes */}
                <div className="dialog_form_row dialog_form_checkbox_row">
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={formik.values.checkedC}
                        name="checkedC"
                        onChange={() => {
                          formik.setFieldValue(
                            "checkedC",
                            !formik.values.checkedC
                          );
                        }}
                      />
                    }
                  />
                  <p>{t("signup.citizenshipAgree")}</p>
                </div>

                <div className="modal_bottom_cta sign_up_first_step_cta">
                  {/* Terms & Condition Agreement */}
                  <div className="dialog_form_checkbox_row">
                    <div className="dialog_form_checkbox_input_wrapper">
                      <FormControlLabel
                        control={
                          <CustomCheckbox
                            checked={formik.values.checked}
                            name="checked"
                            onChange={() => {
                              formik.setFieldValue(
                                "checked",
                                !formik.values.checked
                              );
                            }}
                            size="medium"
                          />
                        }
                      />
                      <FormHelperText className="checkbox_error">
                        {formik.errors.checked && `${formik.errors.checked}`}
                      </FormHelperText>
                    </div>
                    <p>
                      {t("signup.registrationAgree")}
                      <a
                        href="javascript:;"
                        onClick={() => {
                          setTermsCondition(true);
                          handleCloseSignUp();
                        }}
                      >
                        {t("signup.termsConditions")}
                      </a>
                    </p>
                  </div>
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isDisabled}
                    className="go"
                    startIcon={isLoading && <CircularProgress />}
                    title={t("signup.go")}
                    style={{
                      backgroundColor:
                        formik.values.checkedC && formik.values.checked
                          ? "#2FB41A"
                          : "#949494",
                    }}
                  />
                </div>
              </FormControl>
            </form>
          </DialogContent>
        </div>
      </DialogComponent>

      {/* Terms & Conditions Popup */}
      <DialogComponent
        onClose={handleCloseTermsCondition}
        open={openTermsCondition}
        className="terms-condition-form-wrapper"
      >
        <div className="dialog_container">
          <DialogContent style={{ overflow: "inherit" }}>
            <form
              onSubmit={formik.handleSubmit}
              noValidate
              autoComplete="off"
              className="terms-condition-form"
            >
              <FormControl className="dialog_form_control_inner">
                <TypographyComponent
                  variant="h3"
                  title={t("signup.termsConditions")}
                />
                <Grid container spacing={3} className="terms-condition-item">
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <div className="dialog_form_row">
                      <InputComponent
                        type="text"
                        placeholder="First name"
                        name="first_name"
                        id="outlined-name"
                        autoFocus
                        onChange={formik.handleChange}
                        value={formik.values.first_name}
                        error={formik.errors.first_name ? true : false}
                        helperText={
                          formik.errors.first_name &&
                          `${formik.errors.first_name}`
                        }
                        className="terms-condition-input-component"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <div className="dialog_form_row">
                      <InputComponent
                        type="text"
                        placeholder="Last name"
                        name="last_name"
                        id="outlined-name"
                        onChange={formik.handleChange}
                        value={formik.values.last_name}
                        error={formik.errors.last_name ? true : false}
                        helperText={
                          formik.errors.last_name &&
                          `${formik.errors.last_name}`
                        }
                        className="terms-condition-input-component"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <div className="dialog_form_row">
                      <InputComponent
                        type="email"
                        placeholder="Email"
                        name="email"
                        id="outlined-email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        error={formik.errors.email ? true : false}
                        helperText={
                          formik.errors.email && `${formik.errors.email}`
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <div className="dialog_form_row">
                      <InputComponent
                        type="tel"
                        placeholder="Phone Number"
                        name="phone_number"
                        id="outlined-name"
                        onChange={formik.handleChange}
                        value={formik.values.phone_number}
                        error={formik.errors.phone_number ? true : false}
                        helperText={
                          formik.errors.phone_number &&
                          `${formik.errors.phone_number}`
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <div className="dialog_form_row">
                      <InputComponent
                        type="password"
                        placeholder="Create password"
                        name="password"
                        id="outlined-password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        error={formik.errors.password ? true : false}
                        helperText={
                          formik.errors.password && `${formik.errors.password}`
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <div className="dialog_form_row dialog_form_checkbox_row">
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={formik.values.checkedC}
                        name="checkedC"
                        onChange={() => {
                          formik.setFieldValue(
                            "checkedC",
                            !formik.values.checkedC
                          );
                        }}
                      />
                    }
                  />
                  <p>{t("signup.citizenshipAgree")}</p>
                </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <div className="modal_bottom_cta sign_up_first_step_cta">
                      {/* Terms & Condition Agreement */}
                      <div className="dialog_form_checkbox_row">
                        <div className="dialog_form_checkbox_input_wrapper">
                          <FormControlLabel
                            control={
                              <CustomCheckbox
                                checked={formik.values.checked}
                                name="checked"
                                onChange={() => {
                                  formik.setFieldValue(
                                    "checked",
                                    !formik.values.checked
                                  );
                                }}
                                size="medium"
                              />
                            }
                          />
                        </div>
                        <p>
                          {t("signup.registrationAgree")}
                          <a href="javascript:;">
                            {t("signup.termsConditions")}
                          </a>
                        </p>
                      </div>
                      <div style={{ height: 48 }}>
                        <ButtonComponent
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={isDisabled}
                          className="go"
                          title={t("signup.go")}
                          style={{
                            backgroundColor: formik.values.checked
                              ? "#2FB41A"
                              : "#949494",
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>

                <div className="signup_form_tandc_text">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Urna, arcu risus mus in risus eget arcu. Tortor nibh nunc
                    nunc at. Duis scelerisque arcu volutpat gravida volutpat
                    quisque sit. Sed ipsum vitae cum turpis. Molestie cursus
                    etiam nullam nisl erat volutpat elit ut. Ullamcorper mattis
                    vestibulum enim leo ultrices a. Felis egestas posuere
                    vestibulum, pharetra sem curs
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Urna, arcu risus mus in risus eget arcu. Tortor nibh nunc
                    nunc at. Duis scelerisque arcu volutpat gravida volutpat
                    quisque sit. Sed ipsum vitae cum turpis. Molestie cursus
                    etiam nullam nisl erat volutpat elit ut. Ullamcorper mattis
                    vestibulum enim leo ultrices a. Felis egestas posuere
                    vestibulum, pharetra sem curs
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Urna, arcu risus mus in risus eget arcu. Tortor nibh nunc
                    nunc at. Duis scelerisque arcu volutpat gravida volutpat
                    quisque sit. Sed ipsum vitae cum turpis. Molestie cursus
                    etiam nullam nisl erat volutpat elit ut. Ullamcorper mattis
                    vestibulum enim leo ultrices a. Felis egestas posuere
                    vestibulum, pharetra sem curs
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Urna, arcu risus mus in risus eget arcu. Tortor nibh nunc
                    nunc at. Duis scelerisque arcu volutpat gravida volutpat
                    quisque sit. Sed ipsum vitae cum turpis. Molestie cursus
                    etiam nullam nisl erat volutpat elit ut. Ullamcorper mattis
                    vestibulum enim leo ultrices a. Felis egestas posuere
                    vestibulum, pharetra sem curs
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Urna, arcu risus mus in risus eget arcu. Tortor nibh nunc
                    nunc at. Duis scelerisque arcu volutpat gravida volutpat
                    quisque sit. Sed ipsum vitae cum turpis. Molestie cursus
                    etiam nullam nisl erat volutpat elit ut. Ullamcorper mattis
                    vestibulum enim leo ultrices a. Felis egestas posuere
                    vestibulum, pharetra sem curs
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Urna, arcu risus mus in risus eget arcu. Tortor nibh nunc
                    nunc at. Duis scelerisque arcu volutpat gravida volutpat
                    quisque sit. Sed ipsum vitae cum turpis. Molestie cursus
                    etiam nullam nisl erat volutpat elit ut. Ullamcorper mattis
                    vestibulum enim leo ultrices a. Felis egestas posuere
                    vestibulum, pharetra sem curs
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Urna, arcu risus mus in risus eget arcu. Tortor nibh nunc
                    nunc at. Duis scelerisque arcu volutpat gravida volutpat
                    quisque sit. Sed ipsum vitae cum turpis. Molestie cursus
                    etiam nullam nisl erat volutpat elit ut. Ullamcorper mattis
                    vestibulum enim leo ultrices a. Felis egestas posuere
                    vestibulum, pharetra sem curs
                  </p>
                </div>
              </FormControl>
            </form>
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
      />
    </React.Fragment>
  );
};

export default SignUp;
