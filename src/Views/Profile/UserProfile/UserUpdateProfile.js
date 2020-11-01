import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { Formik } from "formik";
import * as Yup from "yup";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import MuiFormControl from "@material-ui/core/FormControl";
import TypographyComponent from "../../../Components/Typography/Typography";
import SelectComponent from "../../../Components/Forms/Select";
import ButtonComponent from "../../../Components/Forms/Button";
import InputComponent from "../../../Components/Forms/Input";
import DialogComponent from "../../../Components/Dialog/Dialog";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import { SessionContext } from "../../../Provider/Provider";
import { useSidebar } from "../../../Provider/SidebarProvider";
import { get, add } from "../../../Services/Auth.service";
import Service from "../../../Services/index";
import ImageComponent from "../../../Components/Forms/Image";
import Spinner from "../../../Components/Spinner/Spinner";
import { LOCALSTORAGE_DATA } from "../../../utils";
import ChangePassword from "../../../Components/ChangePassword/ChangePassword";
import "react-phone-input-2/lib/style.css";
import "./UserUpdateProfile.css";
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

const languages_level = [
  { language_level_id: 1, label: "BASIC" },
  { language_level_id: 2, label: "INTERMEDIATE" },
  { language_level_id: 3, label: "ADVANCED" },
];
const UpdateProfile = (props) => {
  let { user } = useSession();
  let [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    phone_no: "",
    timezone: "GMT+2:00 Eastern European Time",
    country: 214,
    image: null,
    languages: [],
  });
  const [language, setLanguage] = useState(3);
  let [copyRecord, setCopyRecord] = useState();
  const [level, setLevel] = useState(1);
  const { setSidebarContent, setSidebar } = useSidebar();
  const [isLoading, setLoading] = useState(false);
  const [isImageUploadLoader, setImageUploadLoader] = useState(false);
  const [isImageRemoveLoader, setImageRemoveLoader] = useState(false);
  const [openEmail, setEmail] = useState(false);
  const [openPhone, setPhone] = useState(false);
  const [verifyPhone, setVerifyPhone] = useState(false);
  const [verifySucessPhone, setVerifySuccessPhone] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isError, setError] = useState(false);
  const [openErrorSnackBar, setOpenSnackBar] = useState(false);
  const [resError, setResError] = useState("");
  const [isImageSize, isSetImageSize] = useState(false);
  const [countries, setCountries] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [customLanguages, setCustomLanguages] = useState([]);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deActivateLoader, setDeactivateLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);

  const [updateDisabled, setUpdateDisabled] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const [deActivateDisabled, setDeactivateDisabled] = useState(false);

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
    const { userData } = props;
    setUserData({
      ...userData,
    });
    setCopyRecord({
      ...userData,
    });
    async function countryList() {
      const cnt = LOCALSTORAGE_DATA.get("countries");
      if (!cnt.data) {
        const res = await get("/countries/list").catch((error) => {
          console.log(error);
        });
        if (res) {
          LOCALSTORAGE_DATA.set("countries", res);
          setCountries(res);
        }
      } else {
        setCountries(cnt.data);
      }
    }
    countryList();
    async function fetchTimeZones() {
      const tymzone = LOCALSTORAGE_DATA.get("timezones");
      if (!tymzone.data) {
        const res = await get("/timezones/list");
        if (res) {
          LOCALSTORAGE_DATA.set("timezones", res);
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
        saveImage(event.target.files[0]);
        props.newImagePath(URL.createObjectURL(event.target.files[0]));
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

  const makeImage = () => {
    if (userData.image instanceof File) {
      return URL.createObjectURL(userData.image);
    } else {
      return userData.image;
    }
  };

  const removeImage = async () => {
    const formData = new FormData();
    formData.append("id_user", user.id_user);
    setImageRemoveLoader(true);
    const res = await service
      .upload("/profile/removeimage", formData)
      .catch((err) => {
        setImageRemoveLoader(false);
      });
    if (res.status === "SUCCESS") {
    } else {
      setImageRemoveLoader(false);
    }
  };
  const saveImage = async (img) => {
    const formData = new FormData();
    if (img instanceof File) {
      formData.append("image", img);
    }
    formData.append("id_user", user.id_user);
    setImageUploadLoader(true);
    const res = await service.upload("/profile/update", formData);
    if (res.status === "SUCCESS") {
      setImageUploadLoader(false);
      setImageUploadSuccess(true);
    } else {
      setImageUploadLoader(false);
      setImageUploadSuccess(false);

      console.log("Error");
    }
  };

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
      if (updateRecord.first_name) {
        formData.append("first_name", updateRecord.first_name);
      }
      if (updateRecord.phone_no) {
        formData.append("phone_no", updateRecord.phone_no);
      }
      if (updateRecord.last_name) {
        formData.append("last_name", updateRecord.last_name);
      }
      if (updateRecord.country) {
        formData.append("country", updateRecord.country);
      }
      if (updateRecord.timezone) {
        formData.append("timezone", updateRecord.timezone);
      }

      props.languages.forEach((ele, index) => {
        formData.append(`languages[${[index]}][0]`, ele.language_id);
        formData.append(`languages[${[index]}][1]`, ele.language_level_id);
      });
      setUpdateLoader(true);
      setUpdateDisabled(true);
      const res = await service.upload("/profile/update", formData);
      res.json().then((response) => {
        if (response && response) {
          setUpdateLoader(false);
          setUpdateDisabled(false);
          setOpenSnackBar(true);
          setResError(response);
          props.setUpdate(userData);
        }
      });
    }
    setError(false);
  };

  const onOpenChangePassword = () => {
    setOpenChangePassword(false);
  };

  const onDelete = async () => {
    setDeleteLoader(true);
    setDeleteDisabled(true);
    const res = await add("/profile/delete", {
      id_user: user.id_user,
    }).catch((error) => {
      setDeleteLoader(false);
      setOpenSnackBar(true);
      setResError(res);
      console.log("Profile Deactive Error", error);
    });
    if (res && res.type === "SUCCESS") {
      setDeleteLoader(false);
      setDeleteDisabled(false);
      setOpenSnackBar(true);
      setResError(res);
    } else if (res && res.type === "ERROR") {
      setDeleteLoader(false);
      setOpenSnackBar(true);
      setDeleteDisabled(false);
      setResError(res);
    }
  };

  const onDeactivate = async () => {
    setDeactivateLoader(true);
    setDeactivateDisabled(true);
    const res = await add("/profile/deactivate", {
      id_user: user.id_user,
    }).catch((error) => {
      setDeactivateLoader(false);
      setOpenSnackBar(true);
      console.log("Profile Deactive Error", error);
    });
    if (res && res.type === "SUCCESS") {
      setDeactivateLoader(false);
      setDeactivateDisabled(false);
      setOpenSnackBar(true);
    } else if (res && res.type === "ERROR") {
      setDeactivateLoader(false);
      setOpenSnackBar(true);
      setDeactivateDisabled(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <div className="update_profile_form_wrapper">
      <div>
        <form onSubmit={onSubmit} noValidate autoComplete="off">
          <div className="update_profile_inner">
            <div className="form_row">
              <FormControl variant="outlined">
                <InputComponent
                  label="First name"
                  type="text"
                  value={userData.first_name && userData.first_name}
                  name="first_name"
                  id="first_name"
                  onChange={handleChange}
                  error={isError}
                />
              </FormControl>
            </div>

            <div className="form_row">
              <FormControl variant="outlined">
                <InputComponent
                  label="Last name"
                  type="text"
                  value={userData.last_name && userData.last_name}
                  name="last_name"
                  id="last_name"
                  onChange={handleChange}
                  error={isError}
                />
              </FormControl>
            </div>

            <div className="form_row">
              <FormControl variant="outlined">
                <InputComponent
                  label="Mobile No"
                  type="text"
                  value={userData.phone_no && userData.phone_no}
                  name="phone_no"
                  id="phone_no"
                  onChange={handleChange}
                  error={isError}
                />
              </FormControl>
            </div>

            <div className="form_row form_multi_field">
              <FormControl variant="outlined">
                <SelectComponent
                  name="language"
                  label="Select a language"
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                  }}
                  native
                >
                  {languages &&
                    languages.map((l, i) => (
                      <option key={l.id_language} value={l.id_language}>
                        {l.language_name}
                      </option>
                    ))}
                </SelectComponent>
              </FormControl>

              <FormControl variant="outlined">
                <SelectComponent
                  name="level"
                  label="Select a level"
                  value={level}
                  onChange={(e) => {
                    setLevel(e.target.value);
                  }}
                  native
                >
                  {languages_level &&
                    languages_level.map((l, i) => (
                      <option key={i} value={l.language_level_id}>
                        {l.label}
                      </option>
                    ))}
                </SelectComponent>
              </FormControl>

              <div>
                <ButtonComponent
                  title="Add"
                  onClick={() => {
                    const arr = [];
                    arr.push({
                      language_id: language,
                      language_level_id: level,
                    });
                    setCustomLanguages([...customLanguages, ...arr]);
                    props.newLng([...arr]);
                  }}
                />
              </div>
            </div>

            <div className="form_row">
              <FormControl variant="outlined">
                <SelectComponent
                  name="country"
                  label="Select a country"
                  value={userData.country && userData.country}
                  onChange={handleChange}
                  native
                >
                  {countries &&
                    countries.map((m, i) => (
                      <option key={i} value={Number(m.country_id)}>
                        {m.country_name}
                      </option>
                    ))}
                </SelectComponent>
              </FormControl>
            </div>

            <div className="form_row">
              <FormControl variant="outlined">
                <SelectComponent
                  name="timezone"
                  label="Select your time zone"
                  value={userData.timezone && userData.timezone}
                  onChange={handleChange}
                  native
                >
                  {timezones &&
                    timezones.map((m, i) => (
                      <option key={i} value={Number(m.id_timezone)}>
                        {m.relativity}
                      </option>
                    ))}
                </SelectComponent>
              </FormControl>
            </div>
            <div className="form_row change_password_field">
              <FormControl>
                <ButtonComponent
                  title="Change password"
                  type="button"
                  onClick={() => {
                    setOpenChangePassword(true);
                  }}
                />
              </FormControl>
            </div>
          </div>
          <div className="update_profile_form_cta_row">
            <ButtonComponent
              title="Delete profile"
              type="button"
              disabled={deleteDisabled}
              startIcon={deleteLoader && <Spinner />}
              onClick={() => onDelete()}
              loader={deleteLoader}
            />
            <ButtonComponent
              title="Deactivate profile"
              type="button"
              disabled={deActivateDisabled}
              startIcon={deActivateLoader && <Spinner />}
              onClick={() => onDeactivate()}
              loader={deActivateLoader}
            />
            <ButtonComponent
              className="update_profile_cta"
              variant="contained"
              color="primary"
              type="submit"
              title="Update my profile"
              disabled={updateDisabled}
              startIcon={updateLoader && <Spinner />}
              endIcon={!updateLoader && ""}
              loader={updateLoader}
            />
          </div>
        </form>
        <ChangePassword
          openResetPassword={openChangePassword}
          onOpenChangePassword={() => onOpenChangePassword()}
          type="change-password"
          user={user}
        />
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
            props.closeImageDialog();
          }}
          open={props.openImage}
          title="Change picture"
          maxHeight={490}
        >
          <DialogContent style={{ textAlign: "center" }}>
            <FormControl className="image-upload">
              <div className="profile-image-tag">
                {userData.image === null ||
                userData.image === undefined ||
                typeof userData.image === "string" ? (
                  <ImageComponent />
                ) : (
                  <img
                    alt="Profile"
                    id="output"
                    src={makeImage()}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "100%",
                    }}
                  />
                )}
                <input
                  type="file"
                  id="upload-button"
                  style={{ display: "none" }}
                  name="image"
                  onChange={(event) => handleUploadClick(event)}
                  accept="image/*"
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
                      setUserData((d) => ({ ...d, image: null }));
                      removeImage();
                    }}
                    startIcon={isImageRemoveLoader && <Spinner />}
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
                  startIcon={isImageUploadLoader && <Spinner />}
                />
              </div>
              {imageUploadSuccess && (
                <TypographyComponent
                  variant="h4"
                  title="Congrats! You’ve successfully changed your picture."
                  style={{
                    color: "#2FB41A",
                    marginTop: 20,
                  }}
                />
              )}
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

      <SnackBarComponent
        open={openErrorSnackBar}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={resError.message}
        type={resError.type && resError.type.toLowerCase()}
      />
    </div>
  );
};

export default withRouter(UpdateProfile);
