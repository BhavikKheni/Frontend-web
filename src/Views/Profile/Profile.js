import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import ButtonComponent from "../../Components/Forms/Button";
import TypographyComponent from "../../Components/Typography/Typography";
import ProfilePic from "../../profile-image.png";
import { themes } from "../../themes";

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
  return (
    <div>
      <TypographyComponent variant="h4" title="My profile" />
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Avatar alt="profile" src={ProfilePic} className={classes.large} />
          {/* <TypographyComponent variant="h5" title="Change picture" /> */}
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
            <TypographyComponent variant="h6" title="India" />
          </Grid>
          <Grid style={{ marginTop: 10 }}>Language1 Language2</Grid>
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
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <TypographyComponent variant="h4" title="Employer Verfication" />
          <Grid style={{ display: "flex", marginTop: 10 }}>
            <CheckIcon />
            <TypographyComponent
              variant="h4"
              title="Member since September 2009"
            />
          </Grid>
          <Grid style={{ display: "flex" }}>
            <CheckIcon />
            <TypographyComponent variant="h4" title="Mobile verified" />
          </Grid>
          <Grid style={{ display: "flex" }}>
            <CheckIcon />
            <TypographyComponent variant="h4" title="E-Mail verified" />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(ProfileView);
