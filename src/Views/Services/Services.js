import React, { useState, useEffect } from "react";
import {
  ArrowForward,
  ExpandMore,
  KeyboardArrowDown,
} from "@material-ui/icons";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import JobCardComponent from "../../Components/Jobs/JobCard/JobCard";
import Spinner from "../../Components/Spinner/Spinner";
import { search } from "../../Services/Auth.service";
import RatingComponent from "../../Components/Rating/Rating";
import DialogComponent from "../../Components/Dialog/Dialog";
import InputComponent from "../../Components/Forms/Input";
import ButtonComponent from "../../Components/Forms/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSidebar } from "../../Provider/SidebarProvider";
import "./service.css";

const limit = 10;
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
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
  const { setSidebarContent,setSidebar } = useSidebar();
  React.useEffect(() => {
    setSidebar(false)
    setSidebarContent(
      <div>
        <Typography variant="caption" color="textSecondary" component="p">
          <span>Simpathy</span>
          <span>
            <RatingComponent
              name="Simpathy"
              precision={0.5}
              defaultValue={3.5}
              readOnly
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </span>
        </Typography>
        <Typography variant="caption" color="textSecondary" component="p">
          <span>Service Quality</span>
          <span>
            <RatingComponent
              name="Quality"
              defaultValue={2.5}
              precision={0.5}
              readOnly
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </span>
        </Typography>
        <span>Price</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            value="0.5$"
            size="small"
            style={{ width: 120 }}
          />
          <span style={{ margin: 5 }}>to</span>
          <TextField
            id="outlined-basic"
            variant="outlined"
            value="100$"
            size="small"
            style={{ width: 120 }}
          />
        </div>
        <FormControl component="fieldset">
          <RadioGroup aria-label="gender" name="gender1">
            <FormControlLabel
              value="Live service"
              control={<Radio />}
              label="Live service"
            />
            <FormControlLabel
              value="book"
              control={<Radio />}
              label="Book service"
            />
          </RadioGroup>
        </FormControl>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography> Provider language</Typography>
          <KeyboardArrowDown />
        </div>
      </div>
    );
  }, [setSidebarContent]);
  useEffect(() => {
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

  return (
    <React.Fragment>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexFlow: "row wrap",
          }}
        >
          {jobs &&
            jobs.map((element, index) => (
              <JobCardComponent
                key={index}
                image={element.image}
                title={element.title}
                header={element.PorviderName}
                description={element.description}
                price={element.price}
                footerTitle={element.active ? "Deactivate job" : "Activate job"}
                footerLeftIcon={<ArrowForward />}
                footerRightTitle="Edit job"
                footerRightIcon={<ArrowForward />}
                // onRightIconClick={() => editJob(element)}
                // onLeftIconClick={() => onDeActivate(element)}
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
    </React.Fragment>
  );
};

export default Services;
