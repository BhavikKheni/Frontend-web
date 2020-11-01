import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import ChevronLeftOutlined from "@material-ui/icons/ChevronLeftOutlined";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import "./ProviderProfile.css";

const ProfileProviderSidebar = (props) => {
  const { history } = props;
  const { pathname } = props.location;
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <div style={{ margin: 20 }}>
      <MenuItem
        onClick={() => {
          history.goBack();
        }}
      >
        <ChevronLeftOutlined />
        Go back
      </MenuItem>
      <MenuItem
        component={Link}
        to="/profile-provider"
        selected={pathname === "/profile-provider"}
      >
        Provider Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("offered-services");
          elmnt[0].scrollIntoView();
        }}
      >
        Offered services
      </MenuItem>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("service-details");
          elmnt[0].scrollIntoView();
        }}
      >
        Service details
      </MenuItem>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("latest-reviews");
          elmnt[0].scrollIntoView();
        }}
      >
        Latest reviews
      </MenuItem>
      <SnackBarComponent
        open={openSnackBar}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={response.message}
        type={response.type && response.type.toLowerCase()}
      />
    </div>
  );
};

export default withRouter(ProfileProviderSidebar);
