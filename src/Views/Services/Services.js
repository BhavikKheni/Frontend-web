import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import MuiFormControl from "@material-ui/core/FormControl";
import Rating from "@material-ui/lab/Rating";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ServiceCardComponent from "../../Components/ServiceCard/ServiceCard";
import Spinner from "../../Components/Spinner/Spinner";
import { search, add, get } from "../../Services/Auth.service";
import SnackBarComponent from "../../Components/SnackBar/SnackBar";
import { SessionContext } from "../../Provider/Provider";
import { AuthenticationContext } from "../../Provider/AuthProvider";
import { useSidebar } from "../../Provider/SidebarProvider";
import SelectComponent from "../../Components/Forms/Select";
import TypographyComponent from "../../Components/Typography/Typography";
import ChangePassword from "../../Components/ChangePassword/ChangePassword";
// import { onLogout } from "../../Services/Auth.service";
import { LOCALSTORAGE_DATA } from "../../utils";
import Verification from "../../Components/Verification/VerificationDialog";
import "./service.css";
import SignIn from "../Auth/SignIn/SignIn";
import { useDebouncedCallback } from "use-debounce";
const useSession = () => React.useContext(SessionContext);
const useSession1 = () => React.useContext(AuthenticationContext);

const limit = 10;

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
  let { logout, user, isLoggedIn } = useSession();
  const {
    openSignIn,
    handleCloseSignIn,
    openSignUpDialog,
    openForgotPasswordDialog,
    openSignInDialog,
    LoggedIn,
  } = useSession1();
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
  const [value, setValue] = useState("LIVE");
  const [simpathy, setSimpathy] = useState();
  const [service_quality, setServiceQuality] = useState();
  const [countries, setCountries] = useState([]);
  const [setRes, setTypeRes] = useState("");
  const [open, setOpen] = React.useState(false);
  const [verify, setVerify] = useState(false);
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [disabledPromotionLink, setDisabledPromotionLink] = useState(false);
  const [promotion_text_hide, setPromotion_text_hide] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChangeRadio = (event) => {
    setValue(event.target.value);
    debounced.callback();
  };

  const onOpenChangePassword = () => {
    setOpenResetPassword(false);
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
  
  useEffect(() => {
    window.scrollTo(0, 0);
  });

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
              <TypographyComponent title="Price per hour (CHF)"></TypographyComponent>
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
                aria-label="service"
                name="live_now"
                value={value}
                onChange={handleChangeRadio}
              >
                <FormControlLabel
                  value="LIVE"
                  control={<Radio />}
                  label="Live service"
                />
                <FormControlLabel
                  value="BOOK"
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

  const goToPhone = (element) => {
    if (user && user.id_user === element.provider_id_user) {
      setOpen(true);
      setTypeRes({
        message: "You can't this service because it is belongs to you",
        type: "error",
      });
    } else {
      if (isLoggedIn) {
        history.push("/call-page", {
          service: element,
          userId: element.provider_id_user,
        });
      } else {
        openSignInDialog();
      }
    }
  };

  const goToCalendar = (element) => {
    if (user && user.id_user === element.provider_id_user) {
      setOpen(true);
      setTypeRes({
        message: "You can't this service because it is belongs to you",
        type: "error",
      });
    } else {
      history.push("/profile-provider", {
        type: "calendar-view",
        service: element,
        userId: element.provider_id_user,
      });
    }
  };

  const goToServiceTitle = (element) => {
    history.push("/profile-provider", {
      service: element,
      type: "job-details",
      userId: element.provider_id_user,
    });
  };

  const goToProviderName = (element) => {
    history.push("/profile-provider", {
      userId: element.provider_id_user,
      service: element,
    });
  };

  const onSetVerify = () => {
    setVerify(true);
  };

  const onVerifyEmail = async () => {
    const data = {
      email: user.email,
      id_user: user.id_user,
    };
    setVerifyLoader(true);
    setDisabledPromotionLink(true);
    const res = await add("/profile/verifyemail", data).catch((err) => {
      setTypeRes(err);
      setVerifyLoader(false);
      setDisabledPromotionLink(false);
    });
    if (res && res.type === "SUCCESS") {
      setVerifyLoader(false);
      onSetVerify();
      setTypeRes(res);
      setDisabledPromotionLink(false);
      setOpen(true);
    } else if (res && res.type === "ERROR") {
      setVerify(false);
      setVerifyLoader(false);
      setOpen(true);
      setDisabledPromotionLink(false);
    }
  };

  const onCloseVerifyDialog = () => {
    setVerify(false);
  };

  const onPromotionLinkHide = () => {
    setPromotion_text_hide(true);
  };

  const onPromotionClick = () => {
    setPromotion_text_hide(true);
  };

  return (
    <div className="service_card_content">
      {user && !user.email_verified && isLoggedIn && !promotion_text_hide && (
        <div className="promotion_text">
          <p>
            Hi, Your email isn’t verified yet. Please verify to use all the
            services.
          </p>
          <div className="promotion_links">
            {verifyLoader && <Spinner size={20} />}
            <span
              disabled={disabledPromotionLink}
              onClick={() => {
                onVerifyEmail();
              }}
            >
              Resend email confirmation link
            </span>
            <p className="close_icon" onClick={() => onPromotionClick()}>
              <span className="material-icons">close</span>
            </p>
          </div>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="service_card_wrapper">
          {services && !services.length ? (
            <span className="no_records_found">
              {t("service.notFoundService")}
            </span>
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
                onPhone={() => goToPhone(element)}
                onCalendar={() => goToCalendar(element)}
                onServiceTitle={() => goToServiceTitle(element)}
                onProviderName={() => goToProviderName(element)}
              />
            ))
          )}
        </div>
      )}
      {isUpcomingMoreData && services && services.length > 0 && !isLoading && (
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
      <ChangePassword
        openResetPassword={openResetPassword}
        onOpenChangePassword={() => onOpenChangePassword()}
        type="forgot-password"
      />

      {/* email verification dialog */}
      <Verification
        user={user}
        verify={verify}
        closeVerifyDialog={onCloseVerifyDialog}
        onPromotionLinkHide={onPromotionLinkHide}
        title="E-mail verification"
        subTitle1="We’ve send a 4 digit code to your email. Please enter the code to verify your email-id."
        type="email"
      />
      <SignIn
        onClose={handleCloseSignIn}
        openSignIn={openSignIn}
        openSignUpDialog={openSignUpDialog}
        openForgotPasswordDialog={openForgotPasswordDialog}
        handleCloseSignIn={handleCloseSignIn}
        setLogin={LoggedIn}
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

export default Services;
