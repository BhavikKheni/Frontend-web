import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import MuiFormControl from "@material-ui/core/FormControl";
import Rating from "@material-ui/lab/Rating";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { get } from "../../Services/Auth.service";
import ServiceCardComponent from "../../Components/ServiceCard/ServiceCard";
import Spinner from "../../Components/Spinner/Spinner";
import { search } from "../../Services/Auth.service";
import DialogComponent from "../../Components/Dialog/Dialog";
import InputComponent from "../../Components/Forms/Input";
import ButtonComponent from "../../Components/Forms/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import { SessionContext } from "../../Provider/Provider";
import { useSidebar } from "../../Provider/SidebarProvider";
import SelectComponent from "../../Components/Forms/Select";
import TypographyComponent from "../../Components/Typography/Typography";
import { onLogout } from "../../Services/Auth.service";
import { LOCALSTORAGE_DATA } from "../../utils";

import "./service.css";

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
  let { logout } = useSession();
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
  const [provider_language, setProviderLanguage] = useState(50);
  const [per_hour_rate_min, setperHourRateMin] = useState(10);
  const [per_hour_rate_max, setperHourRateMax] = useState(99);
  const { history } = props;
  const [value, setValue] = useState(true);
  const [simpathy, setSimpathy] = useState();
  const [service_quality, setServiceQuality] = useState();
  const [countries, setCountries] = useState([]);

  const handleChangeRadio = (event) => {
    const value1 = event.target.value === "true" ? "true" : "false";
    setValue(value1);
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
    value,
    country,
    provider_language,
  ]);

  useEffect(() => {
    async function searchService() {
      const res = await search("/service/list/filter", getParams());
      if (res) {
        const { data, stopped_at, type } = res || {};
        if (type === "ERROR" || data.length === 0) {
          setUpcomingMoreData(false);
          setIsLoading(false);
          return;
        }
        setUpcomingOffset(stopped_at);
        setServices(data || []);
        setIsLoading(false);
      }
    }
    searchService();
  }, [getParams]);

  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div className="sidebar_inner">
        {sidebarLoader ? <Spinner /> :
          (<React.Fragment>
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
                  placeholder="0.00$"
                  name="per_hour_rate_min"
                  id="per_hour_rate_min"
                  InputProps={{ inputProps: { min: 0, max: 200 } }}
                  onChange={(e) => {
                    setperHourRateMin(e.target.value);
                  }}
                  variant="outlined"
                />

                <span>To</span>

                <TextField
                  type="number"
                  value={per_hour_rate_max}
                  placeholder="0.00$"
                  name="per_hour_rate_max"
                  id="per_hour_rate_max"
                  InputProps={{ inputProps: { min: 0, max: 200 } }}
                  onChange={(e) => {
                    setperHourRateMax(e.target.value);
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
          </React.Fragment>)
        }
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
  ]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const forgotPassword = urlParams.get("forgotPassword");

    if (Boolean(forgotPassword) === true) {
      setOpenResetPassword(true);
      onLogout(props).then((result) => {
        logout();
      });
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
      if (type === "ERROR" || data.length === 0) {
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

  const onPhone = (element) => {};

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

  return (
    <div>
      <div className="promotion_text">
        <p>Hi, Your email isn’t verified yet. Please verify to use all the services.</p>
        <div className="promotion_links">
          <a href="javscript:void(0)">Resend email confirmation link</a>
          <a href="javscript:void(0)" className="close_icon"><span class="material-icons">close</span></a>
        </div>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "space-between",
          }}
        >
          {services &&
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
            ))}
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
            >
              <ExpandMore />
            </div>
          )}
        </div>
      )}
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          setOpenResetPassword(false);
        }}
        open={openResetPassword}
        title="Reset Password"
        maxHeight={340}
      >
        <DialogContent style={{ textAlign: "center" }}>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              onResetPassword(values);
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string().required("Password is required"),
            })}
          >
            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="reset-password-form">
                <FormControl className="reset-password-form-control">
                  <InputComponent
                    label="New password"
                    type="password"
                    placeholder="New password"
                    name="password"
                    value={values.password}
                    id="outlined-password"
                    autoFocus
                    onChange={handleChange}
                    error={errors.password ? true : false}
                    helperText={errors.password && `${errors.password}`}
                    styles={{ maxHeight: 80, height: "100%" }}
                  />
                  <InputComponent
                    label="Confirm new password"
                    type="password"
                    placeholder="Confirm new password"
                    name="password"
                    id="Confirm new password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password ? true : false}
                    helperText={errors.password && `${errors.password}`}
                    styles={{ marginTop: 10, maxHeight: 80, height: "100%" }}
                  />
                  <div className="reset-password-bottom">
                    <ButtonComponent
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="reset-password-button"
                      endIcon={<ArrowForwardIosIcon />}
                      title="Reset"
                    />
                  </div>
                </FormControl>
              </form>
            )}
          </Formik>
        </DialogContent>
      </DialogComponent>
    </div>
  );
};

export default Services;
