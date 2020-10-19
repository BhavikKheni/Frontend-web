import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, MenuItem } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../../Provider/Provider";
import { get } from "../../Services/Auth.service";
import ButtonComponent from "../../Components/Forms/Button";
import TypographyComponent from "../../Components/Typography/Typography";
import ProfilePic from "../../profile-image.png";
import { themes } from "../../themes";
import { useSidebar } from "../../Provider/SidebarProvider";
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
          component={Link}
          to="/profile"
          selected={pathname === "/profile"}
          className={classes.selected}
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
  return (
    <div style={{ margin: 20 }}>
      <TypographyComponent variant="h4" title="My profile" />
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
              <div>
                <TypographyComponent
                  variant="h6"
                  title={userData.country}
                  style={{ marginLeft: 5 }}
                />
                <TypographyComponent
                  variant="h6"
                  title={userData.timezone}
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
                  <span key={i}>{language}</span>
                ))}
            </Grid>
            <Grid>
              <ButtonComponent
                title="Edit"
                onClick={() => {
                  const { history } = props;
                  history.push("/profile/edit");
                }}
                style={{
                  backgroundColor: themes.default.colors.orange,
                  color: themes.default.colors.white,
                  borderRadius: 10,
                  height: 35,
                  width: 80,
                  marginTop: 10,
                }}
              />
            </Grid>
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
    </div>
  );
};

export default withRouter(ProfileView);
