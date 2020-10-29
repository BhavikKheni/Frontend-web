import React, { useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import MuiFormControl from "@material-ui/core/FormControl";
import Rating from "@material-ui/lab/Rating";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ServiceCardComponent from "../../Components/ServiceCard/ServiceCard";
import Spinner from "../../Components/Spinner/Spinner";
import { search, add, get } from "../../Services/Auth.service";
import DialogComponent from "../../Components/Dialog/Dialog";
import InputComponent from "../../Components/Forms/Input";
import ButtonComponent from "../../Components/Forms/Button";
import SnackBarComponent from "../../Components/SnackBar/SnackBar";
import { SessionContext } from "../../Provider/Provider";
import { useSidebar } from "../../Provider/SidebarProvider";
import SelectComponent from "../../Components/Forms/Select";
import TypographyComponent from "../../Components/Typography/Typography";
import { onLogout } from "../../Services/Auth.service";
import { LOCALSTORAGE_DATA } from "../../utils";

import "./service.css";

import { useDebouncedCallback } from "use-debounce";
const useSession = () => React.useContext(SessionContext);
const limit = 10;

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    width: "100%",
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const FormControl = withStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-root": {},
  },
}))(MuiFormControl);

const Services = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  let { logout, user } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarLoader, setSidebarLoader] = useState(false);
  const [services, setServices] = useState([]);
  const [isUpcomingMoreData, setUpcomingMoreData] = useState(true);
  const [upcomingoffset, setUpcomingOffset] = useState(0);
  const [isUpcomingLoading, setUpcomingLoading] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [country, setCountry] = useState(214);
  const { setSidebarContent, setSidebar } = useSidebar();
  const [languages, setLanguages] = useState([]);
  const [provider_language, setProviderLanguage] = useState(3);
  const [per_hour_rate_min, setperHourRateMin] = useState(10);
  const [per_hour_rate_max, setperHourRateMax] = useState(99);
  const { history } = props;
  const [value, setValue] = useState(true);
  const [simpathy, setSimpathy] = useState();
  const [service_quality, setServiceQuality] = useState();
  const [countries, setCountries] = useState([]);
  const [verify, setVerify] = useState(false);
  const [setRes, setTypeRes] = useState("");
  const [open, setOpen] = React.useState(false);
  const [otp, setOtp] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
  });

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

  const handleChangeRadio = (event) => {
    const value1 = event.target.value === "true" ? "true" : "false";
    setValue(value1);
    debounced.callback();
  };

  const getParams = useCallback(() => {
    return {
      limit: limit,
      offset: 0,
      per_hour_rate_min: Number(per_hour_rate_min),
      per_hour_rate_max: Number(per_hour_rate_max),
      simpathy,
      service_quality,
      live_now: value,
      country: country,
      provider_language,
    };
  }, [
    per_hour_rate_min,
    per_hour_rate_max,
    simpathy,
    service_quality,
    provider_language,
    country,
    value,
  ]);
  const debounced = useDebouncedCallback(
    () => {
      asyncFetchData();
    },
    1500,
    { maxWait: 2000 }
  );

  useEffect(
    () => () => {
      debounced.flush();
    },
    [debounced]
  );

  async function asyncFetchData() {
    setIsLoading(true);
    const res = await search("/service/list/filter", getParams()).catch(
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );
    if (res) {
      const { data, stopped_at, type } = res || {};
      if (type === "ERROR" || (data && data.length === 0)) {
        setUpcomingMoreData(false);
        setIsLoading(false);
        setServices([]);
        return;
      }
      setUpcomingOffset(stopped_at);
      setServices(data || []);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const res = await search("/service/list/filter", getParams()).catch(
        (error) => {
          setIsLoading(false);
          console.log(error);
        }
      );
      if (res) {
        const { data, stopped_at, type } = res || {};
        if (type === "ERROR" || (data && data.length === 0)) {
          setUpcomingMoreData(false);
          setIsLoading(false);
          setServices([]);
          return;
        }
        setUpcomingOffset(stopped_at);
        setServices(data || []);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div className="sidebar_inner">
        {sidebarLoader ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <div className="sidebar_row">
              <FormControl variant="outlined" disabled>
                <SelectComponent
                  name="country"
                  label="Select a country"
                  value={(country && country) || ""}
                  onChange={(e) => {
                    setCountry(e.target.value);
                  }}
                  native
                >
                  {countries &&
                    countries.map((m, i) => (
                      <option key={i} value={m.country_id}>
                        {m.country_name}
                      </option>
                    ))}
                </SelectComponent>
              </FormControl>
            </div>
            <div className="sidebar_row">
              <FormControl variant="outlined" disabled>
                <SelectComponent
                  name="provider_language"
                  label="Provider language"
                  value={provider_language}
                  onChange={(e) => {
                    setProviderLanguage(e.target.value);
                  }}
                  native
                >
                  {languages &&
                    languages.map((l) => {
                      return (
                        <option key={l.id_language} value={l.id_language}>
                          {l.language_name}
                        </option>
                      );
                    })}
                </SelectComponent>
              </FormControl>
            </div>
            <div className="sidebar_row select_price_range">
              <TypographyComponent title="Price per hour"></TypographyComponent>
              <div className="select_price_range_inner">
                <TextField
                  type="number"
                  value={per_hour_rate_min}
                  placeholder="CHF"
                  name="per_hour_rate_min"
                  id="per_hour_rate_min"
                  InputProps={{ inputProps: { min: 0, max: 200 } }}
                  onChange={(e) => {
                    setperHourRateMin(e.target.value);
                    debounced.callback();
                  }}
                  variant="outlined"
                />

                <span>To</span>

                <TextField
                  type="number"
                  value={per_hour_rate_max}
                  placeholder="CHF"
                  name="per_hour_rate_max"
                  id="per_hour_rate_max"
                  InputProps={{ inputProps: { min: 0, max: 200 } }}
                  onChange={(e) => {
                    setperHourRateMax(e.target.value);
                    debounced.callback();
                  }}
                  variant="outlined"
                />
              </div>
            </div>
            <div className="sidebar_row">
              <div className="sidebar_review">
                <TypographyComponent title="Service quality"></TypographyComponent>
                <Rating
                  name="quality"
                  value={service_quality}
                  onChange={(event, newValue) => {
                    setServiceQuality(newValue);
                    debounced.callback();
                  }}
                  size="small"
                />
              </div>
              <div className="sidebar_review">
                <TypographyComponent title="Simpathy"></TypographyComponent>
                <Rating
                  name="simpathy"
                  value={simpathy}
                  onChange={(event, newValue) => {
                    setSimpathy(newValue);
                    debounced.callback();
                  }}
                  size="small"
                />
              </div>
            </div>
            <div className="sidebar_row sidebar_input_radio">
              <RadioGroup
                aria-label="live_now"
                name="live_now"
                value={String(value)}
                onChange={handleChangeRadio}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Live service"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Book service"
                />
              </RadioGroup>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }, [
    per_hour_rate_min,
    per_hour_rate_max,
    provider_language,
    classes.formControl,
    countries,
    country,
    service_quality,
    simpathy,
    languages,
    setSidebarContent,
    setSidebar,
    value,
    sidebarLoader,
    debounced,
  ]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const forgotPassword = urlParams.get("forgotPassword");

    if (Boolean(forgotPassword) === true) {
      setOpenResetPassword(true);
      // onLogout(props).then((result) => {
      //   logout();
      // });
    }

    const fetchLanguage = new Promise((resolve, reject) => {
      const cnt = LOCALSTORAGE_DATA.get("languages") || [];
      if (!cnt.data) {
        const res = get("/languages/list").catch((error) => {
          reject(error);
        });
        if (res) {
          resolve(res);
        }
      } else {
        resolve(cnt.data);
      }
    });

    const fetchCountry = new Promise((resolve, reject) => {
      const cnt = LOCALSTORAGE_DATA.get("countries") || [];
      if (!cnt.data) {
        const res = get("/countries/list").catch((error) => {
          reject(error);
        });
        if (res) {
          resolve(res);
        }
      } else {
        resolve(cnt.data);
      }
    });
    setSidebarLoader(true);
    Promise.all([fetchLanguage, fetchCountry])
      .then(([languages, countries]) => {
        setSidebarLoader(false);
        LOCALSTORAGE_DATA.set("languages", languages);
        LOCALSTORAGE_DATA.set("countries", countries);
        setCountries(countries);
        setLanguages(languages);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, [logout]);

  const onMore = async (path, offset, criteria = {}) => {
    setUpcomingLoading(true);
    let res = await search(path, {
      limit: limit,
      offset: offset,
      ...criteria,
    });
    if (res) {
      const { data, stopped_at, type } = res || {};
      if (type === "ERROR" || (data && data.length === 0)) {
        setUpcomingMoreData(false);
        return;
      }
      setUpcomingOffset(stopped_at);
      setServices((services) => [...(services || []), ...(data || [])]);
      setUpcomingLoading(false);
    }
  };
  const onResetPassword = () => {
    //update auth api call karva ni
  };

  const onPhone = (element) => {
    history.push("/call-page", {
      service: element,
      userId: element.assigned_to,
    });
  };

  const onCalendar = (element) => {
    history.push("/profile-provider", {
      type: "calendar-view",
      service: element,
      userId: element.assigned_to,
    });
  };

  const onServiceTitle = (element) => {
    history.push("/profile-provider", {
      service: element,
      type: "job-details",
      userId: element.assigned_to,
    });
  };

  const onProviderName = (element) => {
    history.push("/profile-provider", {
      userId: element.assigned_to,
    });
  };

  const onVerifyEmail = async () => {
    const data = {
      email: user.email,
      id_user: user.id_user,
    };
    const res = await add("/profile/verifyemail", data).catch((err) => {
      setTypeRes(err);
    });
    if (res && res.type === "SUCCESS") {
      setVerify(true);
      setTypeRes(res);
      setOpen(true);
    } else {
      setOpen(true);
    }
  };

  const onSubmitEmailCode = async () => {
    const data = {
      id_user: user.id_user,
      code: Number(`${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}`),
      type: "email",
    };
    const res = await add("/profile/verify", data).catch((err) => {
      setTypeRes(err);
    });
    if (res && res.type === "SUCCESS") {
      setVerify(false);
      setTypeRes(res);
      setOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    setVerify(false);
    onSubmitEmailCode();
  };

  return (
    <div className="service_card_content">
      {user && !user.email_verified && (
        <div className="promotion_text">
          <p>
            Hi, Your email isn’t verified yet. Please verify to use all the
            services.
          </p>
          <div className="promotion_links">
            <a
              href="javascript:void(0)"
              onClick={() => {
                onVerifyEmail();
              }}
            >
              Resend email confirmation link
            </a>
            <a href="javascript:void(0)" className="close_icon">
              <span className="material-icons">close</span>
            </a>
          </div>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="service_card_wrapper">
          {services && services.length ? (
            <span>{t("service.notFoundService")}</span>
          ) : (
            services.map((element, index) => (
              <ServiceCardComponent
                key={index}
                images={element.images}
                title={element.title}
                providerName={element.provider_name}
                price={element.price}
                service_quality_rating={element.service_quality_rating}
                sympathy_rating={element.sympathy_rating}
                service_provider_live_now={element.service_provider_live_now}
                onPhone={() => onPhone(element)}
                onCalendar={() => onCalendar(element)}
                onServiceTitle={() => onServiceTitle(element)}
                onProviderName={() => onProviderName(element)}
              />
            ))
          )}
        </div>
      )}
      {isUpcomingMoreData && services && services.length > 0 && (
        <div>
          {isUpcomingLoading ? (
            <Spinner />
          ) : (
            <div
              className="load-more"
              onClick={() =>
                onMore("/service/list/filter", upcomingoffset, {
                  per_hour_rate_min: Number(per_hour_rate_min),
                  per_hour_rate_max: Number(per_hour_rate_max),
                  simpathy,
                  service_quality,
                  live_now: value,
                  country: country,
                  provider_language,
                })
              }
            ></div>
          )}
        </div>
      )}
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          setOpenResetPassword(false);
        }}
        open={openResetPassword}
        title="Change password"
        maxHeight={340}
      >
        <div className="dialog_container">
          <DialogContent style={{ textAlign: "center" }}>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={(values, { setSubmitting }) => {
                onResetPassword(values);
              }}
              validationSchema={Yup.object().shape({
                password: Yup.string().required("Password is required"),
                confirmPassword: Yup.string()
                  .required("Password is required")
                  .test(
                    "passwords-match",
                    "Confirm Passwords must match with Password",
                    function (value) {
                      return this.parent.password === value;
                    }
                  ),
              })}
            >
              {({
                values,
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className="reset-password-form">
                  <FormControl className="dialog_form_control_inner">
                    <div className="dialog_form_row">
                      <InputComponent
                        type="password"
                        placeholder="New password"
                        name="password"
                        value={values.password}
                        id="outlined-password"
                        autoFocus
                        onChange={handleChange}
                        error={errors.password ? true : false}
                        helperText={errors.password && `${errors.password}`}
                      />
                    </div>
                    <div className="dialog_form_row">
                      <InputComponent
                        type="password"
                        placeholder="Confirm new password"
                        name="confirmPassword"
                        id="Confirm new password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword ? true : false}
                        helperText={
                          errors.confirmPassword && `${errors.confirmPassword}`
                        }
                      />
                    </div>
                    <div className="modal_bottom_cta">
                      <ButtonComponent
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="reset-password-button"
                        title="Reset"
                      />
                    </div>
                  </FormControl>
                </form>
              )}
            </Formik>
          </DialogContent>
        </div>
      </DialogComponent>
      {/* email verification dialog */}
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          setVerify(false);
        }}
        open={verify}
        title="E-mail verification"
        subTitle1="We’ve send a 4 digit code to your email. Please enter the code to verify your email-id."
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
              </div>
              <div className="resend-button">
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => onVerifyEmail()}
                >
                  <TypographyComponent variant="h2" title="Didn’t get code?" />
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
                  endIcon={<ArrowForwardIosIcon />}
                  title="verify"
                />
              </div>
            </div>
          </form>
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

export default Services;
