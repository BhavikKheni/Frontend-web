import React, { useState, useEffect } from "react";
import { withRouter, Link, Route } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { MenuItem } from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiFormControl from "@material-ui/core/FormControl";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../../../Provider/Provider";
import { get, add } from "../../../Services/Auth.service";
import ButtonComponent from "../../../Components/Forms/Button";
import TypographyComponent from "../../../Components/Typography/Typography";
import { themes } from "../../../themes";
import { useSidebar } from "../../../Provider/SidebarProvider";
import DialogComponent from "../../../Components/Dialog/Dialog";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import Spinner from "../../../Components/Spinner/Spinner";
import UpdateProfile from "./UserUpdateProfile";
import { LOCALSTORAGE_DATA, languages_level } from "../../../utils";
import ImageComponent from "../../../Components/Forms/Image";

import "./UserProfile.css";

const useSession = () => React.useContext(SessionContext);
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
  selected: {
    "&.MuiMenuItem-root.Mui-selected": {
      borderBottom: "none",
    },
  },
}));

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
const ProfileView = (props) => {
  const classes = useStyles();
  const { setSidebarContent, setSidebar } = useSidebar();
  const [isLoading, setLoading] = useState(false);
  const [allLanguages, setAllLanguges] = useState([]);
  const [verify, setVerify] = useState(false);
  const [verifySucess, setVerifySuccess] = useState(false);
  const [setRes, setTypeRes] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const [successSubTitle, setSuccessSubTitle] = useState("");
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const [isEmailVerifyLoader, setEmailVerifyLoader] = useState(false);
  const [isDisabledEmailVerify, setIsDisabledEmailVerify] = useState(false);
  const [profilVerifyLoader, setProfilVerifyLoader] = useState(false);
  const [isProfilVerifyDisable, setProfilVerifyDisable] = useState(false);
  const [isMobileVerifyLoader, setIsMobileVerifyLoader] = useState(false);
  const [isDisabledMobileVerify, setIsDisabledMobileVerify] = useState(false);
  const [otp, setOtp] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
  });
  let [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    phone_no: "",
    country: "",
    image: null,
    password: null,
    newPassword: null,
    languages: [],
  });

  useEffect(() => {
    async function fetchLanguages() {
      const storage_laguages = LOCALSTORAGE_DATA.get("languages");
      if (!storage_laguages.data) {
        const res = await get("/languages/list");
        if (res) {
          LOCALSTORAGE_DATA.set("languages", res);
          setAllLanguges(res);
        }
      } else {
        setAllLanguges(storage_laguages.data);
      }
    }
    fetchLanguages();
  }, []);

  const [openImage, setImageOpen] = useState(false);
  let { user, isLoggedIn } = useSession();
  const { pathname } = props.location;
  const { path } = props.match;
  const { t } = useTranslation();
  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        {isLoggedIn && (
          <React.Fragment>
            <MenuItem>{t("home.messages")}</MenuItem>
            <MenuItem>{t("home.myCalendar")}</MenuItem>
            <MenuItem>{t("home.nextBookings")}</MenuItem>
            <MenuItem>{t("home.myServiceHistory")}</MenuItem>
            <MenuItem
              component={Link}
              to="/profile"
              selected={pathname === "/profile"}
            >
              {t("home.myProfile")}
            </MenuItem>
            <MenuItem>{t("home.paymentMethods")}</MenuItem>
          </React.Fragment>
        )}
        <MenuItem>{t("home.feedback")}</MenuItem>
        <MenuItem>{t("home.faq")}</MenuItem>
        <MenuItem>{t("home.support")}</MenuItem>
      </div>
    );
  }, [
    setSidebarContent,
    setSidebar,
    t,
    pathname,
    classes.selected,
    isLoggedIn,
  ]);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await get(`/profile/${user && user.id_user}`);
      if (res) {
        setUserData({
          ...res.data,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    if (isLoggedIn) {
      getData();
    }
  }, [user, isLoggedIn]);

  const newLng = (data) => {
    setUserData({ ...userData, languages: [...userData.languages, ...data] });
  };

  const removeItem = (i) => {
    const temp = [...userData.languages];
    temp.splice(i, 1);
    setUserData({ ...userData, languages: [...temp] });
  };
  const closeImageDialog = () => {
    setImageOpen(false);
  };

  const newImagePath = (path) => {
    if (path) {
      setUserData({ ...userData, image: path });
    }
  };

  const handleChangeOtp = (name, event) => {
    const otpValue = event.target && event.target.value;
    if (otpValue) {
      setOtp((o) => ({ ...o, [name]: otpValue }));
    }
  };

  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 4) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onVerifyEmailDailog = async () => {
    if (type === "email") {
      const data = {
        email: userData.email,
        id_user: userData.id_user,
      };
      setEmailVerifyLoader(true);
      setIsDisabledEmailVerify(true);
      const res = await add("/profile/verifyemail", data).catch((err) => {
        setTypeRes(err);
        setIsDisabledEmailVerify(false);
        setEmailVerifyLoader(false);
      });
      if (res && res.type === "SUCCESS") {
        setIsDisabledEmailVerify(false);
        setEmailVerifyLoader(false);
        setVerify(true);
        setTypeRes(res);
        setOpen(true);
      } else {
        setOpen(true);
      }
    } else if (type === "mobile") {
      const data = {
        phone: userData.phone_no,
        id_user: userData.id_user,
      };
      setIsMobileVerifyLoader(true);
      setIsDisabledMobileVerify(true);
      const res = await add("/profile/verifyphone", data).catch((err) => {
        setTypeRes(err);
        setIsDisabledMobileVerify(false);
        setIsMobileVerifyLoader(false);
      });
      if (res && res.type === "SUCCESS") {
        setVerify(true);
        setTypeRes(res);
        setIsDisabledMobileVerify(false);
        setIsMobileVerifyLoader(false);
        setOpen(true);
      } else {
        setOpen(true);
      }
    }
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    onVerifyEmail();
  };

  const onVerifyEmail = async () => {
    if (type === "email") {
      const data = {
        id_user: userData.id_user,
        code: Number(`${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}`),
        type: "email",
      };
      setProfilVerifyLoader(true);
      setProfilVerifyDisable(true);
      const res = await add("/profile/verify", data).catch((err) => {
        setTypeRes(err);
        setProfilVerifyLoader(false);
        setProfilVerifyDisable(false);
      });
      if (res && res.type === "SUCCESS") {
        setProfilVerifyLoader(false);
        setVerify(false);
        setTypeRes(res);
        setOpen(true);
        setVerifySuccess(true);
        setSuccessTitle("E-mail verification");
        setSuccessSubTitle(
          "Congratulations! Your e-mail id has been verified."
        );
      } else {
        setOpen(true);
      }
    }
    if (type === "mobile") {
      const data = {
        id_user: userData.id_user,
        code: Number(`${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}`),
        type: "phone",
      };
      const res = await add("/profile/verify", data).catch((err) => {
        setTypeRes(err);
      });
      if (res && res.type === "SUCCESS") {
        setVerify(true);
        setTypeRes(res);
        setOpen(true);
        setVerifySuccess(true);
        setSuccessTitle("Phone verification");
        setSuccessSubTitle("Congratulations! Your phone id has been verified.");
      } else {
        setOpen(true);
      }
    }
  };
  return (
    <div className="profile_page_wrapper">
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={path}> My profile </Link>
        {pathname === "/profile/edit" && <Link to={`/profile/edit`}>edit</Link>}
      </Breadcrumbs>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="user_profile_updated_value">
          <div className="user_profile_img">
            <div className="user_profile_img_block">
              {userData.image && userData.image ? (
                <img alt="profile" src={userData.image} />
              ) : (
                <ImageComponent />
              )}
            </div>
            {pathname === "/profile/edit" && (
              <TypographyComponent
                className="user_profile_change_cta"
                title="Change picture"
                onClick={() => {
                  setImageOpen(true);
                }}
              />
            )}
          </div>
          <div className="user_language_timezone">
            <TypographyComponent
              variant="h3"
              title={`${userData.first_name} ${userData.last_name}`}
              style={{
                color: themes.default.colors.darkGray,
              }}
            />
            <div className="user_country_timezone_title">
              <TypographyComponent
                variant="h6"
                title={userData.country_name || ""}
              />
              <TypographyComponent
                variant="h6"
                title={userData.timezone_name || ""}
              />
            </div>
            <div className="user_country_timezone_data">
              {userData.languages &&
                userData.languages.map((language, i) => {
                  let language_name =
                    allLanguages &&
                    allLanguages.find(
                      (x) =>
                        Number(x.id_language) === Number(language.language_id)
                    );
                  const label =
                    languages_level &&
                    languages_level.find(
                      (x) =>
                        Number(x.language_level_id) ===
                        Number(language.language_level_id)
                    );
                  return (
                    <div className="user_language_item" key={i}>
                      <ClearIcon onClick={() => removeItem(i)} />
                      <span className="user_language">
                        {language_name ? language_name.language_name : ""}
                      </span>
                      <span>{label ? label.label : ""}</span>
                    </div>
                  );
                })}
            </div>
            {pathname !== "/profile/edit" && (
              <div className="profile_edit_cta">
                <Link to={`/profile/edit`}>Edit</Link>
              </div>
            )}
          </div>
          <div className="user_verification">
            <TypographyComponent variant="h4" title="Employer Verfication" />
            <div className="user_verification_item">
              <CheckIcon />
              <TypographyComponent variant="h5" title={userData.member_since} />
            </div>
            <div className="user_verification_item">
              {!userData.email_verified && <CheckIcon />}
              <TypographyComponent variant="h5" title="E-Mail verified" />
              {!userData.email_verified && (
                <ButtonComponent
                  title="Verify"
                  onClick={() => {
                    onVerifyEmailDailog();
                    setType("email");
                    setTitle("E-mail verification");
                    setSubTitle(
                      "We’ve send a 4 digit code to your email. Please enter the code to verify your email-id."
                    );
                  }}
                  startIcon={isEmailVerifyLoader && <Spinner />}
                  disabled={isDisabledEmailVerify}
                />
              )}
            </div>

            {/* <div className="user_verification_item">
              {!userData.phone_verified && <CheckIcon />}
              <TypographyComponent variant="h5" title="Mobile verified" />
              {!userData.phone_verified && (
                <ButtonComponent
                  title="Verify"
                  onClick={() => {
                    onVerifyEmailDailog();
                    setType("mobile");
                    setTitle("Mobile verification");
                    setSubTitle(
                      "We’ve send a 4 digit code to your mobile. Please enter the code to verify your mobile."
                    );
                  }}
                  startIcon={isMobileVerifyLoader && <Spinner />}
                  disabled={isDisabledMobileVerify}
                />
              )}
            </div> */}
          </div>
        </div>
      )}
      <Route
        path={`/profile/:edit`}
        render={() => (
          <UpdateProfile
            newLng={(data) => newLng(data)}
            languages={userData.languages}
            openImage={openImage}
            closeImageDialog={closeImageDialog}
            newImagePath={(path) => newImagePath(path)}
          />
        )}
      />
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          setVerify(false);
        }}
        open={verify}
        title={title}
        subTitle1={subTitle}
        maxHeight={312}
      >
        <DialogContent style={{ textAlign: "center" }}>
          <form onSubmit={handleSubmitOtp}>
            <div className="otpContainer">
              <div className="otpContainer">
                <input
                  name="otp1"
                  type="text"
                  autoComplete="off"
                  className="otpInput"
                  value={otp.otp1}
                  onChange={(e) => handleChangeOtp("otp1", e)}
                  tabIndex="1"
                  maxLength="1"
                  onKeyUp={(e) => inputfocus(e)}
                />
                <input
                  name="otp2"
                  type="text"
                  autoComplete="off"
                  className="otpInput"
                  value={otp.otp2}
                  onChange={(e) => handleChangeOtp("otp2", e)}
                  tabIndex="2"
                  maxLength="1"
                  onKeyUp={(e) => inputfocus(e)}
                />
                <input
                  name="otp3"
                  type="text"
                  autoComplete="off"
                  className="otpInput"
                  value={otp.otp3}
                  onChange={(e) => handleChangeOtp("otp3", e)}
                  tabIndex="3"
                  maxLength="1"
                  onKeyUp={(e) => inputfocus(e)}
                />
                <input
                  name="otp4"
                  type="text"
                  autoComplete="off"
                  className="otpInput"
                  value={otp.otp4}
                  onChange={(e) => handleChangeOtp("otp4", e)}
                  tabIndex="4"
                  maxLength="1"
                  onKeyUp={(e) => inputfocus(e)}
                />

                <div className="resend-button">
                  <div
                    className="get-code"
                    onClick={() => onVerifyEmailDailog()}
                  >
                    <TypographyComponent
                      variant="h2"
                      title="Didn’t get code?"
                    />
                    <TypographyComponent
                      variant="h2"
                      title="Resend"
                      style={{ color: "#F5F5F5", marginLeft: 5 }}
                    />
                  </div>
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="send-code"
                    title="verify"
                    startIcon={profilVerifyLoader && <Spinner />}
                    endIcon={<ArrowForwardIosIcon />}
                    disabled={isProfilVerifyDisable}
                  />
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </DialogComponent>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          setVerifySuccess(false);
        }}
        open={verifySucess}
        title={successTitle}
        subTitle1={successSubTitle}
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
                onClick={() => {
                  setVerifySuccess(false);
                }}
              />
            </div>
          </FormControl>
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
    </div>
  );
};

export default withRouter(ProfileView);
