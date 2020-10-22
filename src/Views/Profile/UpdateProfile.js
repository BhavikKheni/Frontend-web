import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import PhoneInput from "react-phone-input-2";
import { Formik } from "formik";
import MuiFormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import TypographyComponent from "../../Components/Typography/Typography";
import SelectComponent from "../../Components/Forms/Select";
import ButtonComponent from "../../Components/Forms/Button";
import InputComponent from "../../Components/Forms/Input";
import DialogComponent from "../../Components/Dialog/Dialog";
import SnackbarComponent from "../../Components/SnackBar/SnackBar";
import { SessionContext } from "../../Provider/Provider";
import { useSidebar } from "../../Provider/SidebarProvider";
import { get } from "../../Services/Auth.service";
import Service from "../../Services/index";
import "react-phone-input-2/lib/style.css";
import "./UpdateProfile.css";
import * as Yup from "yup";
const service = new Service();
const useSession = () => React.useContext(SessionContext);

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
const FormControl = withStyles((theme) => ({
  root: {
    width: "100%",
  },
}))(MuiFormControl);

const Input2 = withStyles((theme) => ({
  root: {
    width: "100%",
  },
}))(Input);
const SERVIVCE_DATA = {
  set: (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
  },
  remove: () => {
    localStorage.remove();
  },
  get: (name) => ({
    data: JSON.parse(localStorage.getItem(name)),
  }),
};
const languages_level = [
  { label: "BASIC" },
  { label: "INTERMEDIATE" },
  { label: "ADVANCED" },
  { label: "EXPERT" },
];
const UpdateProfile = (props) => {
  let { user } = useSession();
  let [userData, setUserData] = useState({
    full_name: "",
    timezone: "",
    country: "",
    image: null,
    languages: [],
  });
  const [language, setLanguage] = React.useState("");
  let [copyRecord, setCopyRecord] = useState();
  const [level, setLevel] = React.useState("");
  const { setSidebarContent, setSidebar } = useSidebar();
  const [isLoading, setLoading] = useState(false);
  const [openEmail, setEmail] = React.useState(false);
  const [verify, setVerify] = React.useState(false);
  const [verifySucess, setVerifySuccess] = React.useState(false);
  const [openPhone, setPhone] = React.useState(false);
  const [verifyPhone, setVerifyPhone] = React.useState(false);
  const [verifySucessPhone, setVerifySuccessPhone] = React.useState(false);
  const [languages, setLanguages] = useState([]);
  const [isError, setError] = useState(false);
  const [openImage, setImageOpen] = useState(false);
  const [openErrorSnackBar, setOpenSnackBar] = useState(false);
  const [resError, setResError] = useState("");
  const [isImageSize, isSetImageSize] = useState(false);
  const [countries, setCountries] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [customLanguages, setCustomLanguages] = useState([]);

  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        <MenuItem>Messages</MenuItem>
        <MenuItem>My calendar</MenuItem>
        <MenuItem>Next bookingsa</MenuItem>
        <MenuItem>My service history</MenuItem>
        <MenuItem>My profile</MenuItem>
        <MenuItem>Payment methods</MenuItem>
        <MenuItem>Feedback</MenuItem>
        <MenuItem>FAQ</MenuItem>
        <MenuItem>Support</MenuItem>
      </div>
    );
  }, [setSidebarContent, setSidebar]);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await get(`/profile/${user && user.id_user}`);
      if (res) {
        setUserData({
          ...res.data,
        });
        setCopyRecord({
          ...res.data,
        });
        setLoading(false);
      } else {
        setResError(res);
        setOpenSnackBar(true);
        setLoading(false);
      }
    }
    async function countryList() {
      const cnt = SERVIVCE_DATA.get("countries");
      if (!cnt.data) {
        const res = await get("/countries/list").catch((error) => {
          console.log(error);
        });
        if (res) {
          SERVIVCE_DATA.set("countries", res);
          setCountries(res);
        }
      } else {
        setCountries(cnt.data);
      }
    }
    countryList();
    async function fetchTimeZones() {
      const tymzone = SERVIVCE_DATA.get("timezones");
      if (!tymzone.data) {
        const res = await get("/timezones/list");
        if (res) {
          SERVIVCE_DATA.set("timezones", res);
          setTimezones(res);
        }
      } else {
        setTimezones(tymzone.data);
      }
    }
    fetchTimeZones();
    async function fetchLanguages() {
      const res = await get("/languages/list");
      if (res) {
        setLanguages(res);
      }
    }
    fetchLanguages();
    getData();
  }, [user]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUploadClick = (event) => {
    if (event.target.files[0]) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 2) {
        isSetImageSize(true);
      } else {
        setUserData({
          ...userData,
          [event.target.name]: event.target.files[0],
        });
        isSetImageSize(false);
      }
    }
  };

  const closeEmail = () => {
    setEmail(false);
  };

  const closePhone = () => {
    setPhone(false);
  };

  function isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const isEdit = isEquivalent(copyRecord, userData);
    if (!isEdit) {
      let updateRecord = Object.keys(userData).reduce((diff, key) => {
        if (userData[key] === copyRecord[key]) return diff;
        return {
          ...diff,
          [key]: userData[key],
        };
      }, {});
      const formData = new FormData();
      userData.id_user = user.id_user;
      if (updateRecord.image instanceof File) {
        formData.append("image", updateRecord.image);
      }
      formData.append("id_user", user.id_user);
      formData.append("full_name", updateRecord.full_name);
      if(updateRecord.country){
        formData.append("country", updateRecord.country);
      }
      if(updateRecord.timezone){
        formData.append("timezone", updateRecord.timezone);
      }
      formData.append("languages", props.languages);

      const res = await service.upload("/profile/update", formData);
      if (res.status === 200) {
        console.log("success");
      } else {
        console.log("Error");
      }
    }
    setError(false);
  };

  return (
    <div style={{ width: "100%", margin: 20 }}>
      <div>
        <form
          onSubmit={onSubmit}
          noValidate
          autoComplete="off"
          style={{ marginTop: 20 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <FormControl>
                    <InputComponent
                      label="Full name"
                      type="text"
                      value={userData.full_name && userData.full_name}
                      placeholder="Full name"
                      name="full_name"
                      id="full_name"
                      onChange={handleChange}
                      error={isError}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={5}>
                  <FormControl variant="outlined">
                    <SelectComponent
                      name="language"
                      label="Select a language"
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                      }}
                      input={<Input2 />}
                    >
                      {languages &&
                        languages.map((l) => {
                          return (
                            <MenuItem
                              key={l.id_language}
                              value={l.language_name}
                            >
                              <ListItemText primary={l.language_name} />
                            </MenuItem>
                          );
                        })}
                    </SelectComponent>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <FormControl variant="outlined">
                    <SelectComponent
                      name="level"
                      label="Select a level"
                      value={level}
                      onChange={(e) => {
                        setLevel(e.target.value);
                      }}
                      input={<Input2 />}
                    >
                      {languages_level &&
                        languages_level.map((l, i) => {
                          return (
                            <MenuItem key={i} value={l.label}>
                              <ListItemText primary={l.label} />
                            </MenuItem>
                          );
                        })}
                    </SelectComponent>
                  </FormControl>
                </Grid>
                <Grid item xs={3} md={2}>
                  <ButtonComponent
                    title="Add"
                    style={{
                      color: "#fff",
                    }}
                    onClick={() => {
                      const arr = [];
                      arr.push({
                        language_name: language,
                        language_level: level,
                      });
                      setCustomLanguages([...customLanguages, ...arr]);
                      props.newLng([...customLanguages, ...arr]);
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <FormControl variant="outlined">
                    <SelectComponent
                      value={userData.country && userData.country}
                      onChange={handleChange}
                      name="country"
                      label="Select a country"
                    >
                      {countries &&
                        countries.map((m, i) => (
                          <MenuItem key={i} value={Number(m.country_id)}>
                            <ListItemText primary={m.country_name} />
                          </MenuItem>
                        ))}
                    </SelectComponent>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <FormControl variant="outlined">
                    <SelectComponent
                      value={userData.timezone && userData.timezone}
                      onChange={handleChange}
                      name="timezone"
                      label="Select your time zone"
                    >
                      {timezones &&
                        timezones.map((m, i) => (
                          <MenuItem key={i} value={Number(m.id_timezone)}>
                            <ListItemText primary={m.relativity} />
                          </MenuItem>
                        ))}
                    </SelectComponent>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl>
                    <ButtonComponent
                      title="Change password"
                      style={{
                        border: "1px solid rgba(25, 25, 25, 0.9)",
                        backgroundColor: "#fff",
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}></Grid>
                <Grid item xs={12} md={12}></Grid>
              </Grid>
            </Grid>
            <Hidden smDown>
              <Grid item md={1}></Grid>
            </Hidden>
            <Grid item xs={12} md={5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}></Grid>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={12}></Grid>
                <Grid item xs={12} md={12}></Grid>
                <Grid item xs={12} md={12}></Grid>
              </Grid>
            </Grid>
            <Hidden smDown>
              <Grid item md={1}></Grid>
            </Hidden>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ButtonComponent
                    title="Delete profile"
                    style={{
                      border: "1px solid rgba(25, 25, 25, 0.9)",
                      backgroundColor: "#fff",
                    }}
                  />
                  <ButtonComponent
                    title="Deactivate profile"
                    style={{
                      border: "1px solid rgba(25, 25, 25, 0.9)",
                      backgroundColor: "#fff",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}></Grid>
              </Grid>
            </Grid>
            <Hidden smDown>
              <Grid item md={1}></Grid>
            </Hidden>
            <Grid item xs={12} md={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="update-profile"
                    title="Update my profile"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Hidden smDown>
              <Grid item md={1}></Grid>
            </Hidden>
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
                  <TypographyComponent variant="h2" title="Didn’t get code?" />
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
                  <TypographyComponent variant="h2" title="Didn’t get code?" />
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
        <DialogComponent
          onClose={(e) => {
            e.stopPropagation();
            setImageOpen(false);
          }}
          open={openImage}
          title="Change picture"
          maxHeight={490}
        >
          <DialogContent style={{ textAlign: "center" }}>
            <FormControl className="image-upload">
              <div className="profile-image-tag">
                {/* <img
                    alt="Profile"
                    id="output"
                    src={userData.image && URL.createObjectURL(userData.image)}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "100%",
                    }}
                  /> */}
                <input
                  type="file"
                  id="upload-button"
                  style={{ display: "none" }}
                  name="image"
                  onChange={(event) => handleUploadClick(event)}
                />
              </div>
              <div className="profile-image-button">
                {userData.image && (
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="button"
                    style={{
                      backgroundColor: "#FF0000",
                      width: "100%",
                      maxWidth: "170px",
                    }}
                    title="Remove picture"
                    onClick={() => {
                      var output = document.getElementById("output");
                      output.src = null;
                      setUserData({
                        ...userData,
                        image: null,
                      });
                    }}
                  />
                )}
                <ButtonComponent
                  variant="contained"
                  color="primary"
                  type="button"
                  title={
                    userData.image !== null
                      ? "Upload picture"
                      : "Change picture"
                  }
                  style={{ width: "100%", maxWidth: "170px" }}
                  onClick={() => {
                    document.getElementById("upload-button").click();
                  }}
                />
              </div>
              {isImageSize && (
                <TypographyComponent
                  variant="h4"
                  title="Sorry! Image size is too big. It must be 2MB or smaller."
                  style={{
                    color: "#FF0000",
                    marginTop: 20,
                  }}
                />
              )}
            </FormControl>
          </DialogContent>
        </DialogComponent>
      </div>
      {/* )} */}
      <SnackbarComponent
        type="error"
        open={openErrorSnackBar}
        message={resError.message}
        handleClose={() => {
          setOpenSnackBar(false);
        }}
      />
    </div>
  );
};

export default withRouter(UpdateProfile);
