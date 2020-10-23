import React from "react";
import StartWork from './StartWork';
import MyServiceLibrary from './MyServiceLibrary';
import AddBookinSpace from './AddBookingSpace';
import ManageService from './ManageService';

const Work = () => {
  return (
    <React.Fragment>
      <StartWork />
      <MyServiceLibrary />
      <AddBookinSpace />
      <ManageService />
    </React.Fragment>
  );
};

export default Work;
