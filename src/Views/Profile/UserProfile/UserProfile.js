import React, { useState, useEffect } from "react";
import { withRouter, Link, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { MenuItem, Divider } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../../../Provider/Provider";
import { get, add, setLocalStorage } from "../../../Services/Auth.service";
import ButtonComponent from "../../../Components/Forms/Button";
import TypographyComponent from "../../../Components/Typography/Typography";
import { themes } from "../../../themes";
import { useSidebar } from "../../../Provider/SidebarProvider";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import Spinner from "../../../Components/Spinner/Spinner";
import UpdateProfile from "./UserUpdateProfile";
import { LOCALSTORAGE_DATA, languages_level } from "../../../utils";
import ImageComponent from "../../../Components/Forms/Image";
import TooltipComponent from "../../../Components/Tooltip/Tooltip";
import Verification from "../../../Components/Verification/VerificationDialog";
import "./UserProfile.css";
import { scrollToSection } from "../../../utils";
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

const ProfileView = (props) => {
  const classes = useStyles();
  const { setSidebarContent, setSidebar } = useSidebar();
  const [isLoading, setLoading] = useState(false);
  const [allLanguages, setAllLanguges] = useState([]);
  const [verify, setVerify] = useState(false);
  const [setRes, setTypeRes] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const [isEmailVerifyLoader, setEmailVerifyLoader] = useState(false);
  const [isDisabledEmailVerify, setIsDisabledEmailVerify] = useState(false);
  const [isMobileVerifyLoader, setIsMobileVerifyLoader] = useState(false);
  const [isDisabledMobileVerify, setIsDisabledMobileVerify] = useState(false);

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
            <MenuItem
              component={Link}
              to="/home/messages"
              selected={pathname === "/home/messages"}
            >
              {t("home.messages")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/calendar"
              selected={pathname === "/home/calendar"}
              onClick={() => {
                scrollToSection("calendar");
              }}
            >
              {t("home.myCalendar.title")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/next-booking"
              selected={pathname === "/home/next-booking"}
              onClick={() => {
                scrollToSection("next_booking");
              }}
            >
              {t("home.nextBookings")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/service-history"
              selected={pathname === "/home/service-history"}
              onClick={() => {
                scrollToSection("service_history");
              }}
            >
              {t("home.myServiceHistory")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/profile"
              selected={pathname === "/home/profile"}
            >
              {t("home.myProfile")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/payment-methods"
              selected={pathname === "/home/payment-methods"}
              onClick={() => {
                scrollToSection("payment_methods");
              }}
            >
              {t("home.paymentMethods")}
            </MenuItem>
            <MenuItem>
              <Divider
                style={{
                  border: "0.5px solid #949494",
                  width: "84%",
                }}
              />
            </MenuItem>
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
        setLocalStorage({
          ...((res && res.data) || {}),
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

  const setUpdate = (d) => {
    setUserData((a) => ({ ...a, ...d }));
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
    setUserData({ ...userData, image: path });
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
    } else if (type === "phone") {
      const data = {
        phone: userData.phone_no,
        id_user: userData.id_user,
      };
      setIsMobileVerifyLoader(true);
      setIsDisabledMobileVerify(true);
      const res = await add("/profile/verifymobile", data).catch((err) => {
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

  const onCloseVerifyDialog = () => {
    setVerify(false);
  };

  return (
    <div className="profile_page_wrapper">
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={path}> My profile </Link>
        {pathname === "/home/profile/edit" && <Link to={`/home/profile/edit`}>edit</Link>}
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
            {pathname === "/home/profile/edit" && (
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
                      <TooltipComponent title="Remove Language">
                        <ClearIcon onClick={() => removeItem(i)} />
                      </TooltipComponent>
                      <span className="user_language">
                        {language_name ? language_name.language_name : ""}
                      </span>
                      <span>{label ? label.label : ""}</span>
                    </div>
                  );
                })}
            </div>
            {pathname !== "/home/profile/edit" && (
              <div className="/home/profile_edit_cta">
                <Link to={`/home/profile/edit`}>Edit</Link>
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
              {userData.email_verified ? (
                <TooltipComponent placement="bottom" title="Email verified">
                  <CheckIcon />
                </TooltipComponent>
              ) : (
                <TooltipComponent placement="bottom" title="Email unverified">
                  <ClearIcon />
                </TooltipComponent>
              )}
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
                  loader={isEmailVerifyLoader}
                />
              )}
            </div>

            <div className="user_verification_item">
              {userData.phone_verified ? (
                <TooltipComponent placement="bottom" title="Mobile verified">
                  <CheckIcon />
                </TooltipComponent>
              ) : (
                <TooltipComponent placement="bottom" title="Mobile unverified">
                  <ClearIcon />
                </TooltipComponent>
              )}
              <TypographyComponent variant="h5" title="Mobile verified" />
              {!userData.phone_verified && (
                <ButtonComponent
                  title="Verify"
                  type="button"
                  onClick={() => {
                    onVerifyEmailDailog();
                    setType("phone");
                    setTitle("Mobile verification");
                    setSubTitle(
                      "We’ve send a 4 digit code to your mobile. Please enter the code to verify your mobile."
                    );
                  }}
                  startIcon={isMobileVerifyLoader && <Spinner />}
                  disabled={isDisabledMobileVerify}
                  loader={isMobileVerifyLoader}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {!isLoading && (
        <Route
          path={`/home/profile/:edit`}
          render={() => (
            <UpdateProfile
              newLng={(data) => newLng(data)}
              languages={userData.languages}
              openImage={openImage}
              closeImageDialog={closeImageDialog}
              newImagePath={(path) => newImagePath(path)}
              userData={userData}
              setUpdate={(data) => setUpdate(data)}
            />
          )}
        />
      )}
      <Verification
        user={user}
        verify={verify}
        closeVerifyDialog={onCloseVerifyDialog}
        title={title}
        subTitle1={subTitle}
        type={type}
      />

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
