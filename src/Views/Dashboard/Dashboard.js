import React, { useState, useEffect } from "react";
import { ArrowForward, ExpandMore } from "@material-ui/icons";
import JobCardComponent from "../../Components/Jobs/JobCard/JobCard";
import Spinner from "../../Components/Spinner/Spinner";
import { search } from "../../Services/Auth.service";
const limit = 10;
const Dashboard = (props) => {
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
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
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
        </React.Fragment>
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

export default Dashboard;
