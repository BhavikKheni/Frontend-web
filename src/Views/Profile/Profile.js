import React, { useState, useEffect } from "react";
import { withRouter, Link, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, MenuItem } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { useTranslation } from "react-i18next";
import { SessionContext } from "../../Provider/Provider";
import { get } from "../../Services/Auth.service";
import ButtonComponent from "../../Components/Forms/Button";
import TypographyComponent from "../../Components/Typography/Typography";
import ProfilePic from "../../images/profile-image.png";
import { themes } from "../../themes";
import { useSidebar } from "../../Provider/SidebarProvider";
import UpdateProfile from "./UpdateProfile";
import "./Profile.css";
const languages_level = [
  { language_level_id: 1, label: "BASIC" },
  { language_level_id: 2, label: "INTERMEDIATE" },
  { language_level_id: 3, label: "ADVANCED" },
];
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

  let [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    country: "",
    image: null,
    password: null,
    newPassword: null,
    languages: [],
  });
  useEffect(() => {
    async function fetchLanguages() {
      const res = await get("/languages/list");
      if (res) {
        setAllLanguges(res);
      }
    }
    fetchLanguages();
  },[]);
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
            <MenuItem>{t("home.myProfile")}</MenuItem>
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
  return (
    <div className="profile_page_wrapper">
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={path}> My profile </Link>
        {pathname === "/profile/edit" && <Link to={`/profile/edit`}>edit</Link>}
      </Breadcrumbs>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <div className="user_profile_updated_value">
          <div className="user_profile_img">
            <div className="user_profile_img_block">
              <img
                alt="profile"
                src={userData.image ? userData.image : ProfilePic}
              />
            </div>
            <TypographyComponent
              className="user_profile_change_cta"
              title="Change picture"
              onClick={() => {
                setImageOpen(true);
              }}
            />
          </div>
          <div className="user_language_timezone">
            <TypographyComponent
              variant="h3"
              title={userData.full_name}
              style={{
                color: themes.default.colors.darkGray,
              }}
            />
            <div className="user_country_timezone_title">
              <TypographyComponent variant="h6" title={userData.country_name} />
              <TypographyComponent
                variant="h6"
                title={userData.timezone_name}
              />
            </div>
            <div className="user_country_timezone_data">
              {userData.languages &&
                userData.languages.map((language, i) => {
                  return (
                    <div className="user_language_item" key={i}>
                      <ClearIcon onClick={() => removeItem(i)} />
                      <span className="user_language">
                        {
                          allLanguages.find(
                            (x) =>
                              Number(x.id_language) ===
                              Number(language.language_id)
                          ).language_name
                        }
                      </span>
                      <span>
                        {
                          languages_level.find(
                            (x) =>
                              Number(x.language_level_id) ===
                              Number(language.language_level_id)
                          ).label
                        }
                      </span>
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
              <CheckIcon />
              <TypographyComponent variant="h5" title="E-Mail verified" />
              <ButtonComponent title="Verify" />
            </div>
            <div className="user_verification_item">
              <CheckIcon />
              <TypographyComponent variant="h5" title="Mobile verified" />
              <ButtonComponent title="Verify" />
            </div>
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
    </div>
  );
};

export default withRouter(ProfileView);
