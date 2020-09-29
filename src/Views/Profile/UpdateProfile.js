import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import PhoneInput from "react-phone-input-2";
import { Formik } from "formik";
import countryList from "react-select-country-list";
import CircularProgress from "@material-ui/core/CircularProgress";
import ProfilePic from "../../profile-image.png";
import TypographyComponent from "../../Components/Typography/Typography";
import SelectComponent from "../../Components/Forms/Select";
import ButtonComponent from "../../Components/Forms/Button";
import InputComponent from "../../Components/Forms/Input";
import DialogComponent from "../../Components/Dialog/Dialog";
import MuiFormControl from "@material-ui/core/FormControl";
import { themes } from "../../themes";
import { SessionContext } from "../../Provider/Provider";
import { get } from "../../Services/Auth.service";
import Input from "@material-ui/core/Input";
import Hidden from "@material-ui/core/Hidden";
import "react-phone-input-2/lib/style.css";
import "./UpdateProfile.css";
import * as Yup from "yup";
const useSession = () => React.useContext(SessionContext);
const options = countryList().getData();
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(25),
    height: theme.spacing(25),
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
const FormControl = withStyles((theme) => ({
  root: {
    // maxWidth: 458,
    width: "100%",
  },
}))(MuiFormControl);
const FormControl2 = withStyles((theme) => {
  return {
    root: {
      maxWidth: 229,
      width: "100%",
    },
  };
})(MuiFormControl);

const Input2 = withStyles((theme) => ({
  root: {
    width: "100%",
  },
}))(Input);

const UpdateProfile = (props) => {
  const classes = useStyles();
  let { user } = useSession();
  let [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    country: "",
    image: null,
    cover_image: null,
    password: null,
    newPassword: null,
    languages: [],
  });
  const [isLoading, setLoading] = useState(false);
  const [openEmail, setEmail] = React.useState(false);
  const [verify, setVerify] = React.useState(false);
  const [verifySucess, setVerifySuccess] = React.useState(false);
  const [openPhone, setPhone] = React.useState(false);
  const [verifyPhone, setVerifyPhone] = React.useState(false);
  const [verifySucessPhone, setVerifySuccessPhone] = React.useState(false);
  const [languages, setLanguages] = useState([]);
  const [isPassword, setPassword] = useState(false);
  const [isError, setError] = useState(false);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await get(`/profile/${user && user.id_user}`);

      if (res) {
        setUserData({
          ...(res || {}),
        });
      }
      setLoading(false);
    }

    async function fetchLanguages() {
      const res = await get("/languages/list");
      if (res) {
        setLanguages(res);
      }
    }
    fetchLanguages();
    getData();
  }, [user]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUploadClick = (e) => {
    var file = e.target.files[0];
  };

  const onEmail = () => {
    setEmail(true);
  };

  const closeEmail = () => {
    setEmail(false);
  };
  const closePhone = () => {
    setPhone(false);
  };
  function countdown() {
    var seconds = 60;
    function tick() {
      var counter = document.getElementById("counter");
      seconds--;
      counter.innerHTML = "0:" + (seconds < 10 ? "0" : "") + String(seconds);
      if (seconds > 0) {
        setTimeout(tick, 1000);
      } else {
      }
    }
    tick();
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (userData.password !== userData.newPassword) {
      setPassword(true);
    } else {
      setPassword(false);
    }
    if (!userData.first_name || !userData.last_name) {
      setError(true);
    } else {
      setError(false);
    }
    console.log(userData);
  };

  return (
    <div style={{ width: "100%" }}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <React.Fragment>
          <TypographyComponent
            variant="h4"
            title="My profile"
            style={{ fontWeight: 500 }}
          />
          <Grid
            container
            spacing={3}
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Avatar
                alt="profile"
                src={ProfilePic}
                className={classes.large}
              />
              <label className="change-picture">
                <div>
                  <TypographyComponent
                    variant="h5"
                    title="Change picture"
                    style={{ fontWeight: 500 }}
                  />
                </div>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  name="image"
                  onChange={(event) => handleUploadClick(event)}
                />
              </label>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TypographyComponent
                variant="h3"
                title="Juile Ann"
                style={{
                  fontWeight: "bold",
                  color: themes.default.colors.darkGray,
                }}
              />
              <Grid style={{ display: "flex", marginTop: 10 }}>
                <TypographyComponent variant="h6" title="Country " />
                <TypographyComponent
                  variant="h6"
                  title={userData.country}
                  style={{ marginLeft: 5 }}
                />
              </Grid>
              <Grid style={{ marginTop: 10 }}>
                {userData.languages.map((language, i) => (
                  <span key={i}>{language}</span>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <TypographyComponent variant="h4" title="Employer Verfication" />
              <Grid style={{ display: "flex", marginTop: 10 }}>
                <CheckIcon />
                <TypographyComponent
                  variant="h4"
                  title="Member since September 2009"
                  style={{ marginLeft: 5 }}
                />
              </Grid>
              <Grid style={{ display: "flex" }}>
                <CheckIcon />
                <TypographyComponent
                  variant="h4"
                  title="Mobile verified"
                  style={{ marginLeft: 5 }}
                />
              </Grid>
              <Grid style={{ display: "flex" }}>
                <CheckIcon />
                <TypographyComponent
                  variant="h4"
                  title="E-Mail verified"
                  style={{ marginLeft: 5 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <form
            onSubmit={onSubmit}
            noValidate
            autoComplete="off"
            style={{ marginTop: 20 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <InputComponent
                        label="First name"
                        type="text"
                        value={userData.first_name && userData.first_name}
                        placeholder="First name"
                        name="first_name"
                        id="outlined-name"
                        onChange={handleChange}
                        error={isError}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <InputComponent
                        label="Last name"
                        type="text"
                        value={userData.last_name && userData.last_name}
                        placeholder="Last name"
                        name="last_name"
                        id="outlined-email"
                        onChange={handleChange}
                        error={isError}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <TypographyComponent
                        title="Change password"
                        variant="h4"
                        style={{
                          fontWeight: 500,
                          marginBottom: 10,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <InputComponent
                        label="Actual password"
                        type="password"
                        placeholder="Actual password"
                        name="full_name"
                        id="outlined-name"
                        onChange={handleChange}
                        error={isError}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <InputComponent
                        label="New password"
                        type="password"
                        placeholder="New password"
                        name="password"
                        id="outlined-name"
                        onChange={handleChange}
                        error={isPassword}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <InputComponent
                        label="Create new password"
                        type="password"
                        placeholder="Create new password"
                        name="newPassword"
                        id="outlined-name"
                        onChange={handleChange}
                        error={isPassword}
                        helperText={isPassword && "Password is not match"}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Hidden smDown>
                <Grid item md={1}></Grid>
              </Hidden>
              <Grid item xs={12} md={5}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <SelectComponent
                        value={userData.country && userData.country}
                        onChange={handleChange}
                        name="country"
                      >
                        {options.map((m, i) => (
                          <MenuItem key={i} value={m.label}>
                            <ListItemText primary={m.label} />
                          </MenuItem>
                        ))}
                      </SelectComponent>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <InputLabel id="demo-customized-select-label">
                        Select new language
                      </InputLabel>
                      <SelectComponent
                        name="languages"
                        multiple
                        value={userData.languages && userData.languages}
                        onChange={handleChange}
                        input={<Input2 />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                        options={languages}
                      >
                        {options.map((l) => {
                          return (
                            <MenuItem key={l.value} value={l.label}>
                              <Checkbox
                                checked={
                                  userData.languages.indexOf(l.label) > -1
                                }
                              />
                              <ListItemText primary={l.label} />
                            </MenuItem>
                          );
                        })}
                      </SelectComponent>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <InputLabel id="demo-customized-select-label">
                        Select new language
                      </InputLabel>
                      <SelectComponent
                        name="languages"
                        multiple
                        value={userData.languages && userData.languages}
                        onChange={handleChange}
                        input={<Input2 />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                        options={languages}
                      >
                        {options.map((l) => {
                          return (
                            <MenuItem key={l.value} value={l.label}>
                              <Checkbox
                                checked={
                                  userData.languages.indexOf(l.label) > -1
                                }
                              />
                              <ListItemText primary={l.label} />
                            </MenuItem>
                          );
                        })}
                      </SelectComponent>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <TypographyComponent
                        title="Change E-Mail"
                        variant="h4"
                        style={{
                          fontWeight: 500,
                          marginBottom: 10,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <InputComponent
                        label="Actual Email"
                        type="email"
                        placeholder="Actual Email"
                        name="full_name"
                        id="outlined-name"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <InputComponent
                        label="Enter new E-mail"
                        type="email"
                        placeholder="Enter new E-mail"
                        name="full_name"
                        id="outlined-name"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Hidden smDown>
                <Grid item md={1}></Grid>
              </Hidden>
            </Grid>
            <Grid
              container
              spacing={3}
              direction="column"
              style={{ margin: 2, marginTop: 20 }}
            >
              <TypographyComponent
                title="Stripe verification"
                variant="h4"
                style={{
                  fontWeight: 500,
                  marginBottom: 10,
                }}
              />
              <Grid className="stripe-verification-item">
                <Grid className="stripe-item">
                  <CheckIcon />
                  <TypographyComponent
                    variant="h4"
                    title="Stripe verification"
                    style={{ marginLeft: 5 }}
                  />
                </Grid>
                <Grid className="stripe-item">
                  <CheckIcon />
                  <TypographyComponent
                    variant="h4"
                    title="ID verified"
                    style={{ marginLeft: 5 }}
                  />
                </Grid>
                <Grid className="stripe-item">
                  <TypographyComponent
                    variant="h4"
                    title="E-Mail verified"
                    style={{ marginLeft: 25 }}
                  />
                  <ButtonComponent
                    title="Verify"
                    onClick={() => {
                      onEmail();
                    }}
                    style={{
                      backgroundColor: themes.default.colors.white,
                      color: themes.default.colors.orange,
                      borderRadius: 10,
                      border: `1px solid ${themes.default.colors.orange}`,
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid className="stripe-item">
                  <TypographyComponent
                    variant="h4"
                    title="Phone number"
                    style={{ marginLeft: 25 }}
                  />
                  <ButtonComponent
                    title="Verify"
                    variant="outlined"
                    onClick={() => {
                      setPhone(true);
                    }}
                    style={{
                      backgroundColor: themes.default.colors.white,
                      color: themes.default.colors.orange,
                      borderRadius: 10,
                      border: `1px solid ${themes.default.colors.orange}`,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
          <DialogComponent
            onClose={(e) => {
              e.stopPropagation();
              closeEmail();
            }}
            open={openEmail}
            title="Email verification"
            subTitle1="Write your email"
            maxHeight={291}
            flexDirection="column"
            alignItems="start"
          >
            <DialogContent style={{ textAlign: "center" }}>
              <FormControl className="email-verify">
                <Formik
                  initialValues={{ email: "" }}
                  onSubmit={async (values) => {
                    setEmail(false);
                    setVerify(true);
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string().email().required("Required"),
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
                      <form onSubmit={handleSubmit}>
                        <FormControl>
                          <InputComponent
                            label="Enter E-Mail"
                            type="email"
                            value={values.email}
                            placeholder="Enter E-Mail"
                            name="email"
                            id="outlined-name"
                            onChange={handleChange}
                            helperText={
                              errors.email && touched.email && `${errors.email}`
                            }
                            className="profile-form-control"
                          />
                        </FormControl>
                        <div style={{ textAlign: "right" }}>
                          <ButtonComponent
                            variant="contained"
                            color="primary"
                            type="submit"
                            className="send-code"
                            endIcon={<ArrowForwardIosIcon />}
                            title="Send code"
                          />
                        </div>
                      </form>
                    );
                  }}
                </Formik>
              </FormControl>
            </DialogContent>
          </DialogComponent>

          <DialogComponent
            onClose={(e) => {
              e.stopPropagation();
              setVerify(false);
            }}
            open={verify}
            title="E-mail verification"
            subTitle1="We’ve send a 4 digit code to your email. Please enter the 
        code to verify your email-id."
            maxHeight={312}
          >
            <DialogContent style={{ textAlign: "center" }}>
              <FormControl className="email-verify">
                <FormControl className="phone-number-otp">
                  <TextField id="number1" type="number" style={{ width: 62 }} />
                  <TextField id="number2" type="number" style={{ width: 62 }} />
                  <TextField id="number3" type="number" style={{ width: 62 }} />
                  <TextField id="number4" type="number" style={{ width: 62 }} />
                  <div className="timer">
                    <div id="counter" style={{ marginLeft: 5 }}>
                      1:00
                    </div>
                  </div>
                </FormControl>
                <div className="resend-button">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TypographyComponent
                      variant="h2"
                      title="Didn’t get code?"
                    />
                    <Link href="#" style={{ color: "#F5F5F5", marginLeft: 5 }}>
                      Resend
                    </Link>
                  </div>
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="button"
                    className="send-code"
                    endIcon={<ArrowForwardIosIcon />}
                    title="verify"
                    onClick={() => {
                      setVerify(false);
                      setVerifySuccess(true);
                    }}
                  />
                </div>
              </FormControl>
            </DialogContent>
          </DialogComponent>
          <DialogComponent
            onClose={(e) => {
              e.stopPropagation();
              setVerifySuccess(false);
            }}
            open={verifySucess}
            title="E-mail verification"
            subTitle1="Congratulations! Your e-mail id has been verified."
            maxHeight={234}
          >
            <DialogContent style={{ textAlign: "center" }}>
              <FormControl className="email-verify">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="button"
                    className="send-code"
                    endIcon={<ArrowForwardIosIcon />}
                    title="Finish"
                    onClick={() => {}}
                  />
                </div>
              </FormControl>
            </DialogContent>
          </DialogComponent>
          <DialogComponent
            onClose={(e) => {
              e.stopPropagation();
              closePhone();
            }}
            open={openPhone}
            title="Phone verification"
            subTitle1="Write your phone number"
            maxHeight={271}
            flexDirection="column"
            alignItems="start"
          >
            <DialogContent style={{ textAlign: "center" }}>
              <Formik
                initialValues={{ phone: "" }}
                onSubmit={async (values) => {
                  setPhone(false);
                  setVerifyPhone(true);
                }}
              >
                {(props) => {
                  const { values, handleSubmit } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                      <FormControl style={{ maxWidth: 458 }}>
                        <PhoneInput
                          value={values.phone}
                          onChange={(phone) => {}}
                          inputProps={{
                            name: "phone",
                            required: true,
                            autoFocus: true,
                          }}
                          inputStyle={{
                            width: "100%",
                            background: "#F5F5F5",
                            border: "1px solid #191919",
                            borderRadius: 10,
                            height: 55,
                          }}
                        />
                        <div style={{ textAlign: "right" }}>
                          <ButtonComponent
                            variant="contained"
                            color="primary"
                            type="submit"
                            className="send-code"
                            endIcon={<ArrowForwardIosIcon />}
                            title="Send code"
                          />
                        </div>
                      </FormControl>
                    </form>
                  );
                }}
              </Formik>
            </DialogContent>
          </DialogComponent>

          <DialogComponent
            onClose={(e) => {
              e.stopPropagation();
              setVerifyPhone(false);
            }}
            open={verifyPhone}
            title="Phone verification"
            subTitle1="We’ve send a 4 digit code to your phone number. Please enter the 
        code to verify your number."
            maxHeight={312}
          >
            <DialogContent style={{ textAlign: "center" }}>
              <FormControl className="email-verify">
                <FormControl className="phone-number-otp">
                  <TextField id="number1" type="number" style={{ width: 62 }} />
                  <TextField id="number2" type="number" style={{ width: 62 }} />
                  <TextField id="number3" type="number" style={{ width: 62 }} />
                  <TextField id="number4" type="number" style={{ width: 62 }} />
                  <div className="timer">
                    <div id="counter" style={{ marginLeft: 5 }}>
                      1:00
                    </div>
                  </div>
                </FormControl>
                <div className="resend-button">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TypographyComponent
                      variant="h2"
                      title="Didn’t get code?"
                    />
                    <Link href="#" style={{ color: "#F5F5F5", marginLeft: 5 }}>
                      Resend
                    </Link>
                  </div>
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="button"
                    className="send-code"
                    endIcon={<ArrowForwardIosIcon />}
                    title="verify"
                    onClick={() => {
                      setVerifyPhone(false);
                      setVerifySuccessPhone(true);
                    }}
                  />
                </div>
              </FormControl>
            </DialogContent>
          </DialogComponent>
          <DialogComponent
            onClose={(e) => {
              e.stopPropagation();
              setVerifySuccessPhone(false);
            }}
            open={verifySucessPhone}
            title="Phone verification"
            subTitle1="Congratulations! Your phone number has been verified."
            maxHeight={234}
          >
            <DialogContent style={{ textAlign: "center" }}>
              <FormControl className="email-verify">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="button"
                    className="send-code"
                    endIcon={<ArrowForwardIosIcon />}
                    title="Finish"
                    onClick={() => {}}
                  />
                </div>
              </FormControl>
            </DialogContent>
          </DialogComponent>
        </React.Fragment>
      )}
    </div>
  );
};

export default withRouter(UpdateProfile);
