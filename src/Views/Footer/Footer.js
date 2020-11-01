import React from "react";
import { Formik } from "formik";
import clsx from "clsx";
import { withStyles, makeStyles } from "@material-ui/core/styles";
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
import { useTranslation } from "react-i18next";
import "./Footer.css";
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
  footer: {
    backgroundColor: themes.default.colors.gray20,
    padding: 30,
  },
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
    textAlign: "right",
    paddingRight: 20,
    borderRight: `1px solid ${themes.default.colors.gray}`,
    [theme.breakpoints.down("sm")]: {
      margin: 20,
      textAlign: "left",
    },
  },
  grid4: {
    paddingLeft: 20,
    [theme.breakpoints.down("sm")]: {
      margin: 20,
    },
  },
}));

const Footer = (props) => {
  const { t } = useTranslation();
  const classes = useStyles(props);
  return (
    <div className={clsx(classes.footer, 'footer')}>
        <div className="footer_content">
            <div className="footer_brand_wrapper">
              <a href="/" className='footer_brand'>
                <img alt="Owera" src={FooterIcon}/>
              </a>
            </div>
            <div className="footer_page_links">
              <div className="footer_page_link">
                <MenuItem className={classes.fontColor}>
                  {t("footer.navigationLink.aboutUs")}
                </MenuItem>
                <MenuItem className={classes.fontColor}>
                  {t("footer.navigationLink.history")}
                </MenuItem>
                <MenuItem className={classes.fontColor}>
                  {t("footer.navigationLink.support")}
                </MenuItem>
              </div>
              <div className="footer_page_link">
                <MenuItem className={classes.fontColor}>
                  {t("footer.navigationLink.faq")}
                </MenuItem>
                <MenuItem className={classes.fontColor}>
                  {t("footer.navigationLink.feedback")}
                </MenuItem>
              </div>
            </div>
            <div className="get_touch_links">
              <div className="apps_link">
                <TypographyComponent
                  title={t("footer.navigationLink.theForGo")}
                  className={classes.appForGo}
                />
                <button className="button_link">
                  <img alt="app store" src={AppStore} className={classes.appIcon} />
                </button>
                <button className="button_link">
                  <img alt="android" src={Android} className={classes.appIcon} />
                </button>
              </div>
              <div className="follow_subscribe_link">
                <div className="social_links">
                  <TypographyComponent
                    title={t("footer.navigationLink.followUs")}
                    className={classes.iconColor}
                  />
                  <div className={classes.icons}>
                    <button className="button_link">
                      <InstagramIcon className={classes.iconColor} />
                    </button>
                    <button className="button_link">
                      <FacebookIcon className={classes.iconColor} />
                    </button>
                    <button className="button_link">
                      <TwitterIcon className={classes.iconColor} />
                    </button>
                  </div>
                </div>
                <div className="subscribe_form">
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
                        />
                        <ButtonComponent
                          title={t("footer.navigationLink.subscribe")}
                          disabled={isSubmitting}
                          className={classes.subscribe}
                        />
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
          <TypographyComponent
            title="© OWERA, Inc. 2020. We love our users."
            style={{ color: "#BDBDBD", textAlign: "center" }}
            className={'copyright_text'}
          />
        </div>
  );
};

export default Footer;
