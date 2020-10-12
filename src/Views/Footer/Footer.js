import React from "react";
import { Formik } from "formik";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MuiTextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import TypographyComponent from "../../Components/Typography/Typography";
import ButtonComponent from "../../Components/Forms/Button";
import FooterIcon from "./FooterIcon.png";
import AppStore from "./AppStore.png";
import Android from "./Android.png";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import { themes } from "../../themes";
import * as Yup from "yup";
const TextField = withStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-input": {
      padding: "14px 14px",
      backgroundColor: "#BDBDBD",
      borderRadius: 5,
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(25, 25, 25, 0.9)",
    },
  },
}))(MuiTextField);
const useStyles = makeStyles((theme) => ({
  logo: {
    width: "100%",
    maxWidth: 315,
    height: "auto",
    maxHeight: 200,
  },
  fontColor: {
    color: themes.default.colors.gray,
  },
  appForGo: {
    color: themes.default.colors.gray,
    fontWeight: "normal",
    fontStyle: "normal",
  },
  appIcon: {
    width: 172,
    height: 42,
  },
  icons: {
    display: "flex",
    justifyContent: "space-between",
  },
  iconColor: {
    color: themes.default.colors.silver,
  },
  footerForm: {
    display: "flex",
    alignItems: "center",
  },
  subscribe: {
    background: themes.default.colors.darkGray,
    border: `2px solid ${themes.default.colors.silver}`,
    borderRadius: 5,
    color: themes.default.colors.silver,
  },
  grid3: {
    borderRight: `1px solid ${themes.default.colors.gray}`,
    [theme.breakpoints.down("sm")]: {
      margin: 20,
    },
  },
  grid4: {
    [theme.breakpoints.down("sm")]: {
      margin: 20,
    },
  },
}));

const Footer = (props) => {
  const classes = useStyles(props);
  return (
    <div
      style={{
        backgroundColor: themes.default.colors.gray20,
        height: "100%",
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <img alt="footer" src={FooterIcon} className={classes.logo} />
        </Grid>
        <Grid item xs={12} md={2} style={{ display: "flex" }}>
          <div>
            <MenuItem className={classes.fontColor}>About us</MenuItem>
            <MenuItem className={classes.fontColor}>History</MenuItem>
            <MenuItem className={classes.fontColor}>Support</MenuItem>
          </div>
          <div>
            <MenuItem className={classes.fontColor}>FAQ</MenuItem>
            <MenuItem className={classes.fontColor}>Feedback</MenuItem>
          </div>
        </Grid>
        <Grid item xs={12} md={3} className={classes.grid3}>
          <TypographyComponent
            title="The app for on the go"
            className={classes.appForGo}
          />
          <img alt="app store" src={AppStore} className={classes.appIcon} />
          <img alt="android" src={Android} className={classes.appIcon} />
        </Grid>
        <Grid item xs={12} md={3} className={classes.grid4}>
          <div style={{ display: "flex" }}>
            <TypographyComponent
              title="Follow us:"
              className={classes.iconColor}
            />
            <div className={classes.icons}>
              <InstagramIcon className={classes.iconColor} />
              <FacebookIcon className={classes.iconColor} />
              <TwitterIcon className={classes.iconColor} />
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Formik
              initialValues={{
                email: "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }
                return errors;
              }}
              onSubmit={async (values) => {}}
              validationSchema={Yup.object().shape({
                password: Yup.string().required("Password is required"),
              })}
            >
              {({
                values,
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className={classes.footerForm}>
                  <TextField
                    id="type-email"
                    placeholder="Type your email"
                    variant="outlined"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email ? true : false}
                    helperText={errors.email && `${errors.email}`}
                    style={{
                      borderRadius: 5,
                    }}
                  />
                  <ButtonComponent
                    title="Subscribe"
                    disabled={isSubmitting}
                    className={classes.subscribe}
                  />
                </form>
              )}
            </Formik>
          </div>
        </Grid>
      </Grid>
      <TypographyComponent
        title="OWERA, Inc. 2020. We love our users."
        style={{ color: "#BDBDBD", textAlign: "center" }}
      />
    </div>
  );
};

export default Footer;
