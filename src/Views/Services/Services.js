import React, { useState, useEffect } from "react";
import {
  ArrowForward,
  ExpandMore,
  KeyboardArrowDown,
} from "@material-ui/icons";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import JobCardComponent from "../../Components/Jobs/JobCard/JobCard";
import Spinner from "../../Components/Spinner/Spinner";
import { search } from "../../Services/Auth.service";
import RatingComponent from "../../Components/Rating/Rating";

const limit = 10;
const Services = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [jobs, setJobs] = useState([]);
  const [isUpcomingMoreData, setUpcomingMoreData] = useState(true);
  const [upcomingoffset, setUpcomingOffset] = useState(0);
  const [isUpcomingLoading, setUpcomingLoading] = useState(false);
  const [deActivateDialog, setDeActivateDialog] = useState(false);

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

  return (
    <React.Fragment>
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
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      ) : (
        <div style={{ display:'flex',flexDirection:'row',flexFlow:'row wrap' }}>
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
    </React.Fragment>
  );
};

export default Services;
