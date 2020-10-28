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
  const { handleCloseSignUp, openSignUp, openSignInDialog } = props;
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
      password: Yup.string().required(t('validation.password')),
      first_name: Yup.string().required(t('validation.firstName')),
      last_name: Yup.string().required(t('validation.lastName')),
      phone_number: Yup.string().required(t('validation.phoneNumber')),
      checkedC: Yup.boolean().required("Required").oneOf([true], "Error"),
      checked: Yup.boolean().required("Required").oneOf([true], "Error"),
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
    formik.resetForm();
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
        <DialogContent style={{ textAlign: "center" }}>
          <form onSubmit={formik.handleSubmit} className="signup-form">
            <FormControl className="signup-form-control">
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
                styles={{ maxHeight: 80, height: "100%"}}
              />
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
                styles={{ maxHeight: 80, height: "100%", marginTop: 10 }}
              />
              <InputComponent
                type="email"
                placeholder="Email"
                name="email"
                id="outlined-email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.errors.email ? true : false}
                helperText={formik.errors.email && `${formik.errors.email}`}
                styles={{ maxHeight: 80, height: "100%", marginTop: 10 }}
              />
              <InputComponent
                type="tel"
                placeholder="Phone Number"
                name="phone_number"
                id="outlined-name"
                onChange={formik.handleChange}
                value={formik.values.phone_number}
                error={formik.errors.phone_number ? true : false}
                helperText={
                  formik.errors.phone_number && `${formik.errors.phone_number}`
                }
                styles={{ maxHeight: 80, height: "100%", marginTop: 10 }}
              />
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
                styles={{ maxHeight: 80, height: "100%", marginTop: 10 }}
              />

              {/* Agreement Checkboxes */}
              <div className="terms-condition-control" style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  {/* Citizenship Agreement */}
                  <div className="item">
                    <div>
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
                              size="medium"
                            />
                          }
                        />
                    </div>
                    <div className="item item-1">
                      <TypographyComponent
                        title={t('signup.citizenshipAgree')}
                        variant="h1"
                        style={{
                          lineHeight: 4,
                        }}
                      />
                    </div>
                  </div>

                  {/* Terms & Condition Agreement */}
                  <div className="item-2">
                    <div>
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
                    <div>
                      <TypographyComponent
                        title={t('signup.registrationAgree')}
                        variant="h1"
                        style={{
                          lineHeight: 4,
                        }}
                      />
                      <TypographyComponent
                        title={t('signup.termsConditions')}
                        variant="h1"
                        onClick={() => {
                          setTermsCondition(true);
                          handleCloseSignUp();
                        }}
                        style={{
                          lineHeight: 0,
                          textAlign: "left",
                          color: themes.default.colors.green,
                        }}
                        className="terms-condition-item"
                      />
                    </div>
                  </div>
                </div>

                <div className="item" style={{ height: 48 }}>
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isDisabled}
                    className="go"
                    startIcon={isLoading && <CircularProgress />}
                    endIcon={!isLoading && <ArrowForwardIosIcon />}
                    title={t("signup.go")}
                    style={{
                      backgroundColor: formik.values.checkedC && formik.values.checked
                        ? "#2FB41A"
                        : "#949494",
                      height: 48,
                    }}
                  />
                </div>
              </div>
              <FormHelperText style={{ color: "red" }}>
                {formik.errors.checked && `${formik.errors.checked}`}
              </FormHelperText>
            </FormControl>
          </form>
        </DialogContent>
      </DialogComponent>

      {/* Terms & Conditions Popup */}
      <DialogComponent
        onClose={handleCloseTermsCondition}
        open={openTermsCondition}
        maxHeight={892}
        maxWidth={1269}
      >
        <DialogContent style={{ textAlign: "center" }}>
          <form
            onSubmit={formik.handleSubmit}
            noValidate
            autoComplete="off"
            className="terms-condition-form"
          >
            <FormControl className="terms-condition-control">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <TypographyComponent
                    variant="h3"
                    title={t("signup.termsConditions")}
                    style={{
                      marginTop: 20,
                      marginBottom: 20,
                      textAlign: "left",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className="terms-condition-item">
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <InputComponent
                    label="First name"
                    type="text"
                    placeholder="First name"
                    name="first_name"
                    id="outlined-name"
                    autoFocus
                    onChange={formik.handleChange}
                    value={formik.values.first_name}
                    error={formik.errors.first_name ? true : false}
                    helperText={
                      formik.errors.first_name && `${formik.errors.first_name}`
                    }
                    className="terms-condition-input-component"
                    styles={{ maxHeight: 80, height: "100%" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <InputComponent
                    label="Last name"
                    type="text"
                    placeholder="Last name"
                    name="last_name"
                    id="outlined-name"
                    onChange={formik.handleChange}
                    value={formik.values.last_name}
                    error={formik.errors.last_name ? true : false}
                    helperText={
                      formik.errors.last_name && `${formik.errors.last_name}`
                    }
                    className="terms-condition-input-component"
                    styles={{ maxHeight: 80, height: "100%" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <InputComponent
                    label="Email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    id="outlined-email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    error={formik.errors.email ? true : false}
                    helperText={formik.errors.email && `${formik.errors.email}`}
                    styles={{ maxHeight: 80, height: "100%", marginTop: 10 }}
                    className="terms-condition-input-component"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <InputComponent
                    label="Phone Number"
                    type="tel"
                    placeholder="Phone Number"
                    name="phone_number"
                    id="outlined-name"
                    onChange={formik.handleChange}
                    value={formik.values.phone_number}
                    error={formik.errors.phone_number ? true : false}
                    helperText={
                      formik.errors.phone_number && `${formik.errors.phone_number}`
                    }
                    styles={{ maxHeight: 80, height: "100%" }}
                    className="terms-condition-input-component"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <InputComponent
                    label="Create password"
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
                    styles={{ maxHeight: 80, height: "100%" }}
                    className="password terms-condition-input-component"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <div className="item">
                    {/* Terms & Condition Agreement */}
                    <div style={{ display: "flex" }}>
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
                      <div className="item-1">
                        <TypographyComponent
                          title={t("signup.registrationAgree")}
                          variant="h1"
                          style={{
                            lineHeight: 4,
                          }}
                        />

                        <TypographyComponent
                          title={t("signup.termsConditions")}
                          variant="h1"
                          style={{
                            lineHeight: 0,
                            textAlign: "left",
                            color: themes.default.colors.green,
                            cursor: "initial",
                          }}
                          className="terms-condition-item"
                        />
                      </div>
                    </div>
                    <div style={{ height: 48 }}>
                      <ButtonComponent
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isDisabled}
                        className="go"
                        endIcon={<ArrowForwardIosIcon />}
                        title={t("signup.go")}
                        style={{
                          backgroundColor: formik.values.checked
                            ? "#2FB41A"
                            : "#949494",
                          height: 48,
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="Container Flipped">
                    <div className="Content">
                      GeeksforGeeks is a Computer Science portal for geeks. 
                      It contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                      GeeksforGeeks is a Computer Science portal for geeks. 
                      It contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                      GeeksforGeeks is a Computer Science portal for geeks. It
                      contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                      GeeksforGeeks is a Computer Science portal for geeks. It
                      contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                      GeeksforGeeks is a Computer Science portal for geeks. It
                      contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                      GeeksforGeeks is a Computer Science portal for geeks. It
                      contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                      GeeksforGeeks is a Computer Science portal for geeks. It
                      contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                      GeeksforGeeks is a Computer Science portal for geeks. It
                      contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                      GeeksforGeeks is a Computer Science portal for geeks. It
                      contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                      GeeksforGeeks is a Computer Science portal for geeks. It
                      contains well written, well thought and well explained
                      computer science and programming articles, quizzes etc.
                    </div>
                  </div>
                </Grid>
              </Grid>
            </FormControl>
          </form>
        </DialogContent>
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
