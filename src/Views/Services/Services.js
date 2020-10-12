import React, { useState, useEffect } from "react";
import {
  ExpandMore,
} from "@material-ui/icons";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import MuiFormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import Rating from "@material-ui/lab/Rating";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import countryList from "react-select-country-list";
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
const FormControl1 = withStyles((theme) => ({
  root: {
    width: "100%",
  },
}))(MuiFormControl);
const Input2 = withStyles((theme) => ({
  root: {
    width: "100%",
  },
}))(Input);
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
const options = countryList().getData();
const Services = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [jobs, setJobs] = useState([]);
  const [isUpcomingMoreData, setUpcomingMoreData] = useState(true);
  const [upcomingoffset, setUpcomingOffset] = useState(0);
  const [isUpcomingLoading, setUpcomingLoading] = useState(false);
  const [deActivateDialog, setDeActivateDialog] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [country, setCountry] = useState("");
  const { setSidebarContent, setSidebar } = useSidebar();
  const [languages, setLanguages] = useState([]);
  const [lng, setLng] = useState([]);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        <FormControl1 variant="outlined">
          <SelectComponent
            value={(country && country) || ""}
            onChange={(e) => setCountry({ [e.target.name]: e.target.value })}
            name="country"
            label="Select a country"
          >
            {options.map((m, i) => (
              <MenuItem key={i} value={m.label}>
                <ListItemText primary={m.label} />
              </MenuItem>
            ))}
          </SelectComponent>
        </FormControl1>
        <FormControl1 variant="outlined" style={{ marginTop: 20 }}>
          <SelectComponent
            name="languages"
            label="Select a language"
            multiple
            value={Array.isArray(lng.languages) ? lng.languages : []}
            onChange={(e) => {
              setLng(e.target.value);
            }}
            input={<Input2 />}
            renderValue={(selected) => selected.join(", ")}
          >
            {languages &&
              languages.map((l) => {
                return (
                  <MenuItem key={l.id_language} value={l.language_name}>
                    <Checkbox
                      checked={
                        languages && languages.indexOf(l.language_name) > -1
                      }
                    />
                    <ListItemText primary={l.language_name} />
                  </MenuItem>
                );
              })}
          </SelectComponent>
        </FormControl1>
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
            value={value1 && value1}
            placeholder="0.00$"
            name="value1"
            id="value1"
            onChange={(e) => {
              setValue1(e.target.value);
            }}
            variant="outlined"
          />

          <div>
            <span>To</span>
          </div>
          <MuiTextField
            type="text"
            value={value2 && value2}
            placeholder="0.00$"
            name="value2"
            id="value2"
            onChange={(e) => {
              setValue2(e.target.value);
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
          <Rating name="quality" disabled />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <TypographyComponent title="Service quality"></TypographyComponent>
          <Rating name="Simpathy" disabled />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          <Radio value="a" name="live" inputProps={{ "aria-label": "A" }} />
          <TypographyComponent title="Live service"></TypographyComponent>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          <Radio value="a" name="book" inputProps={{ "aria-label": "A" }} />
          <TypographyComponent title="Book service"></TypographyComponent>
        </div>
      </div>
    );
  }, [
    setSidebarContent,
    setSidebar,
    country,
    lng.languages,
    setValue2,
    setValue1,
    languages,
    value1,
    value2,
  ]);
  useEffect(() => {
    async function fetchLanguages() {
      const res = await get("/languages/list");
      if (res) {
        setLanguages(res);
      }
    }
    fetchLanguages();
    async function searchJobs() {
      setIsLoading(true);
      const res = await search("/job/list", {
        limit: limit,
        offset: 0,
      });
      const { data, stopped_at, type } = res || {};
      if (type === "ERROR") {
        setUpcomingMoreData(false);
        setIsLoading(false);
        return;
      }
      setUpcomingOffset(stopped_at);
      setJobs(data || []);
      setIsLoading(false);
    }
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
                images={element.image}
                title={element.title}
                providerName={element.PorviderName}
                description={element.description}
                price={element.price}
                onPhone={onPhone}
                onCalendar={onCalendar}
              />
            ))}
        </div>
      )}
      {isUpcomingMoreData && jobs && jobs.length > 0 && (
        <div>
          {isUpcomingLoading ? (
            <Spinner />
          ) : (
            <React.Fragment>
              <span onClick={() => onMore("/job/list", upcomingoffset, {})}>
                Load more jobs
              </span>
              <ExpandMore />
            </React.Fragment>
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
