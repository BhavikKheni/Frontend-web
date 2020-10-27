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
      full_name: "",
      email: "",
      password: "",
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
      full_name: Yup.string().required(t("validation.fullName")),
      checked: Yup.boolean()
        .required("Required")
        .oneOf([true], "Terms & condition Required"),
    }),
  });

  const onSubmit = (values) => {
    setLoading(true);
    add("/signup", values)
      .then((res) => {
        if (res && res.type === "SUCCESS") {
          handleCloseSignUp();
          setLoading(false);
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
        subTitle1={t("alreadyHaveAccount")}
        subTitle2={t("login.title")}
        onSubTitle2={(e) => {
          e.stopPropagation();
          handleCloseSignUp();
          openSignInDialog();
        }}
        maxHeight={427}
      >
        <div className="dialog_container">
        <DialogContent style={{ textAlign: "center" }}>
          <form onSubmit={formik.handleSubmit} className="signup-form">
            <FormControl className="dialog_form_control_inner">
            <div className="dialog_form_row">
              <InputComponent
                type="text"
                placeholder="Full name"
                name="full_name"
                id="outlined-name"
                autoFocus
                onChange={formik.handleChange}
                value={formik.values.full_name}
                error={formik.errors.full_name ? true : false}
                helperText={
                  formik.errors.full_name && `${formik.errors.full_name}`
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
              <div className="dialog_form_row dialog_form_checkbox_row">
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
                <div>
                  <TypographyComponent
                    title={t("signup.registrationAgree")}
                  />
                  <TypographyComponent
                    title={t("signup.termsConditions")}
                    onClick={() => {
                      setTermsCondition(true);
                      handleCloseSignUp();
                    }}
                    style={{
                      color: themes.default.colors.green,
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
                  startIcon={isLoading && <CircularProgress />}
                  endIcon={!isLoading && <ArrowForwardIosIcon />}
                  title={t("signup.go")}
                  style={{
                    backgroundColor: formik.values.checked
                      ? "#2FB41A"
                      : "#949494",
                    height: 48,
                  }}
                />
              </div>
              <FormHelperText style={{ color: "red" }}>
                {formik.errors.checked && `${formik.errors.checked}`}
              </FormHelperText>
            </FormControl>
          </form>
        </DialogContent>
        </div>
      </DialogComponent>
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
                    label="Full name"
                    type="text"
                    placeholder="Full name"
                    name="full_name"
                    id="outlined-name"
                    autoFocus
                    onChange={formik.handleChange}
                    value={formik.values.full_name}
                    error={formik.errors.full_name ? true : false}
                    helperText={
                      formik.errors.full_name && `${formik.errors.full_name}`
                    }
                    className="terms-condition-fullName"
                    styles={{ maxHeight: 80, height: "100%" }}
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
                    className="password terms-condition-password"
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
                    className="email terms-condition-email"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <div className="item">
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
