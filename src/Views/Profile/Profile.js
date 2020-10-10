import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MailIcon from "@material-ui/icons/Mail";
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
  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <List>
        {[
          "Messages",
          "My calendar",
          "Next bookings",
          "My service history",
          "My profile",
          "Payment methods",
        ].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{<MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    );
  }, [setSidebarContent, setSidebar]);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await get(`/profile/${user && user.id_user}`);
      if (res) {
        setUserData({
          ...res,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    getData();
  }, [user]);
  return (
    <div>
      <TypographyComponent variant="h4" title="My profile" />
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid
          container
          spacing={3}
          alignItems="center"
          style={{ marginTop: 20 }}
        >
          <Grid item xs={12} md={2}>
            <img
              alt="profile"
              src={ProfilePic}
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
          <Grid item xs={12} md={4}>
            <TypographyComponent variant="h4" title="Employer Verfication" />
            <Grid style={{ display: "flex", marginTop: 10 }}>
              <CheckIcon />
              <TypographyComponent
                variant="h4"
                title="Member since September 2009"
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
