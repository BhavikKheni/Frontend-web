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
  let { user } = useSession();
  const { pathname } = props.location;
  const { path } = props.match;
  const { t } = useTranslation();
  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        <MenuItem>{t("home.messages")}</MenuItem>
        <MenuItem>{t("home.myCalendar")}</MenuItem>
        <MenuItem>{t("home.nextBookings")}</MenuItem>
        <MenuItem>{t("home.myServiceHistory")}</MenuItem>
        <MenuItem
        // component={Link}
        // to="/profile"
        // selected={pathname === "/profile"}
        // className={classes.selected}
        >
          {t("home.myProfile")}
        </MenuItem>
        <MenuItem>{t("home.paymentMethods")}</MenuItem>
      </div>
    );
  }, [setSidebarContent, setSidebar, t, pathname, classes.selected]);

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
    getData();
  }, [user]);

  const newLng = (data) => {
    setUserData({ ...userData, languages: [...userData.languages, ...data] });
  };

  const removeItem = (i) => {
    const temp = [...userData.languages];
    temp.splice(i, 1);
    setUserData({ ...userData, languages: [...temp] });
  };

  return (
    <div style={{ margin: 20 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={path}>
          <TypographyComponent variant="h4" title="My profile" />
        </Link>
        <Link to={`/profile/edit`}>
          <TypographyComponent variant="h4" title="edit" />
        </Link>
      </Breadcrumbs>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3} style={{ marginTop: 20 }}>
          <Grid item xs={12} md={2}>
            <img
              alt="profile"
              src={userData.image ? userData.image : ProfilePic}
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "100%",
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TypographyComponent
              variant="h3"
              title={userData.full_name}
              style={{
                fontWeight: "bold",
                color: themes.default.colors.darkGray,
              }}
            />
            <Grid style={{ display: "flex", marginTop: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TypographyComponent
                  variant="h6"
                  title={userData.country_name}
                  style={{ marginLeft: 5 }}
                />
                <TypographyComponent
                  variant="h6"
                  title={userData.timezone_name}
                  style={{ marginLeft: 5 }}
                />
              </div>
            </Grid>
            <Grid
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {userData.languages &&
                userData.languages.map((language, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <ClearIcon onClick={() => removeItem(i)} />
                    <span>{language.language_name}</span>
                    <span>{language.language_level}</span>
                  </div>
                ))}
            </Grid>
            {pathname !== "/profile/edit" && (
              <Grid>
                <div style={{ marginTop: 20 }}>
                  <Link
                    to={`/profile/edit`}
                    style={{
                      border: `1px solid ${themes.default.colors.orange}`,
                      color: themes.default.colors.orange,
                      textDecoration: "none",
                      padding: "10px 20px 10px 20px",
                      borderRadius: 10,
                    }}
                  >
                    Edit
                  </Link>
                </div>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <TypographyComponent variant="h4" title="Employer Verfication" />
            <Grid style={{ display: "flex", marginTop: 10 }}>
              <CheckIcon />
              <TypographyComponent
                variant="h4"
                title={userData.member_since}
                style={{ marginLeft: 5 }}
              />
            </Grid>

            <Grid
              style={{ display: "flex", alignItems: "center", marginTop: 10 }}
            >
              <CheckIcon />
              <TypographyComponent
                variant="h4"
                title="E-Mail verified"
                style={{ marginLeft: 5 }}
              />
              <ButtonComponent
                title="Verify"
                style={{
                  backgroundColor: themes.default.colors.white,
                  color: themes.default.colors.orange,
                  border: `1px solid ${themes.default.colors.orange}`,
                  width: 100,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
      <Route
        path={`/profile/:edit`}
        render={() => <UpdateProfile newLng={(data) => newLng(data)} languages={userData.languages}/>}
      />
    </div>
  );
};

export default withRouter(ProfileView);
