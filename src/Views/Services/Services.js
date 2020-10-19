import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import MuiFormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
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
import { useSidebar } from "../../Provider/SidebarProvider";
import SelectComponent from "../../Components/Forms/Select";
import TypographyComponent from "../../Components/Typography/Typography";
import { themes } from "../../themes";
import "./service.css";
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
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
    },
  },
}))(MuiFormControl);
const MuiTextField = withStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-input": {
      padding: "10px 14px",
      border: `1px solid ${themes.default.colors.darkGray}`,
      borderRadius: 10,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 10,
      fontFamily: themes.default.fontFamily,
      fontWeight: 500,
      maxWidth: 100,
    },
  },
}))(TextField);

const Services = (props) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isUpcomingMoreData, setUpcomingMoreData] = useState(true);
  const [upcomingoffset, setUpcomingOffset] = useState(0);
  const [isUpcomingLoading, setUpcomingLoading] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [country, setCountry] = useState();
  const { setSidebarContent, setSidebar } = useSidebar();
  const [languages, setLanguages] = useState([]);
  const [provider_language, setProviderLanguage] = useState();
  const [per_hour_rate_min, setperHourRateMin] = useState();
  const [per_hour_rate_max, setperHourRateMax] = useState();
  const { history } = props;
  const [value, setValue] = useState(true);
  const [simpathy, setSimpathy] = useState();
  const [serviceQuality, setServiceQuality] = useState();
  const [countries, setCountries] = useState([]);
  const handleChangeRadio = (event) => {
    const value1 = event.target.value === "true" ? "true" : "false";
    setValue(value1);
  };

  const searchJobs = useCallback(async () => {
    setIsLoading(true);
    const res = await search("/job/list", {
      limit: limit,
      offset: 0,
      per_hour_rate_min: per_hour_rate_min,
      per_hour_rate_max: per_hour_rate_max,
      simpathy: simpathy,
      service_quality: serviceQuality,
      live_now: value,
      country: country,
      provider_language: provider_language,
    }).catch((err) => {
      console.log("Error", err);
      setIsLoading(false);
    });
    const { data, stopped_at, type } = res || {};
    if (data.offset === "0" && data.limit === "10") {
      setJobs([]);
    }
    if (type === "ERROR") {
      setUpcomingMoreData(false);
      setIsLoading(false);
      return;
    }
    setUpcomingOffset(stopped_at);
    setJobs(data || []);
    setIsLoading(false);
  }, [
    per_hour_rate_min,
    per_hour_rate_max,
    provider_language,
    country,
    serviceQuality,
    simpathy,
    value,
  ]);

  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ marginLeft: 25, marginRight: 25 }}>
        <FormControl variant="outlined" className={classes.formControl}>
          <SelectComponent
            name="country"
            label="Select a country"
            value={(country && country) || ""}
            onChange={(e) => setCountry(e.target.value)}
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
        <FormControl
          variant="outlined"
          className={classes.formControl}
          style={{ marginTop: 10 }}
        >
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
        <TypographyComponent
          title="Price per hour"
          style={{ marginTop: 20 }}
        ></TypographyComponent>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <MuiTextField
            type="text"
            value={per_hour_rate_min}
            placeholder="0.00$"
            name="per_hour_rate_min"
            id="per_hour_rate_min"
            onChange={(e) => {
              setperHourRateMin(e.target.value);
            }}
            variant="outlined"
          />

          <div>
            <span>To</span>
          </div>
          <MuiTextField
            type="text"
            value={per_hour_rate_max}
            placeholder="0.00$"
            name="per_hour_rate_max"
            id="per_hour_rate_max"
            onChange={(e) => {
              setperHourRateMax(e.target.value);
            }}
            variant="outlined"
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <TypographyComponent title="Service quality"></TypographyComponent>
          <Rating
            name="quality"
            value={serviceQuality}
            onChange={(event, newValue) => {
              setServiceQuality(newValue);
            }}
            size="small"
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
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
        <ButtonComponent
          title="Search"
          className={classes.margin}
          style={{
            backgroundColor: themes.default.colors.white,
            border: "1px solid rgba(25, 25, 25, 0.9)",
            marginTop: 20,
          }}
          type="button"
          size="large"
          onClick={() => {
            searchJobs();
          }}
        />
      </div>
    );
  }, [
    setSidebarContent,
    setSidebar,
    country,
    provider_language,
    setperHourRateMax,
    setperHourRateMin,
    languages,
    per_hour_rate_min,
    per_hour_rate_max,
    value,
    serviceQuality,
    simpathy,
    countries,
    classes.formControl,
    searchJobs,
  ]);
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const forgotPassword = urlParams.get("forgotPassword");

    if (Boolean(forgotPassword) === true) {
      setOpenResetPassword(true);
    }
    async function fetchLanguages() {
      const res = await get("/languages/list");
      if (res) {
        setLanguages(res);
      }
    }
    fetchLanguages();

    async function countryList() {
      const res = await get("/countries/list").catch((error) => {
        console.log(error);
      });
      if (res) {
        setCountries(res);
      }
    }
    countryList();
    searchJobs();
  }, []);
  const onMore = async (path, offset, criteria = {}) => {
    setUpcomingLoading(true);
    let res = await search(path, {
      limit: limit,
      offset: offset,
      ...criteria,
    });
    if (res) {
      const { data, stopped_at, type } = res || {};
      if (type === "ERROR") {
        setUpcomingMoreData(false);
        return;
      }
      setUpcomingOffset(stopped_at);
      setJobs((jobs) => [...(jobs || []), ...(data || [])]);
      setUpcomingLoading(false);
    }
  };
  const onResetPassword = () => {};
  const onPhone = () => {};
  const onCalendar = () => {};
  const onJobTitle = (element) => {
    history.push("/create-services", { job: element });
  };
  const onProviderName = (element) => {
    history.push("/profile-provider", {
      userId: element.assigned_to,
    });
  };

  return (
    <div>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "space-between",
          }}
        >
          {jobs &&
            jobs.map((element, index) => (
              <ServiceCardComponent
                key={index}
                images={element.images}
                title={element.title}
                providerName={element.provider_name}
                price={element.price}
                service_quality_rating={element.service_quality_rating}
                sympathy_rating={element.sympathy_rating}
                onPhone={onPhone}
                onCalendar={onCalendar}
                onJobTitle={() => onJobTitle(element)}
                onProviderName={() => onProviderName(element)}
              />
            ))}
        </div>
      )}
      {isUpcomingMoreData && jobs && jobs.length > 0 && (
        <div>
          {isUpcomingLoading ? (
            <Spinner />
          ) : (
            <div
              className="load-more"
              onClick={() => onMore("/job/list", upcomingoffset, {})}
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
