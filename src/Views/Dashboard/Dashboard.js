import React from 'react';
import JobCardComponent from '../../Components/Jobs/JobCard/JobCard';
import Spinner from '../../Components/Spinner/Spinner';

const Dashboard = (props) => {
  return (
    <React.Fragment>
      <Spinner />
      <JobCardComponent />
    </React.Fragment>
  );
};

export default Dashboard;