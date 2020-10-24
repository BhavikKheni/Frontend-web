import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import ChevronLeftOutlined from "@material-ui/icons/ChevronLeftOutlined";
import InputComponent from "../../Components/Forms/Input";
import ButtonComponent from "../../Components/Forms/Button";
import AddIcon from "@material-ui/icons/Add";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "./ProviderProfile.css";

const ProfileProviderSidebar = (props) => {
  const { history } = props;
  const { pathname } = props.location;
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const handleDateChange = (date) => {
    setSelectedDate(date);
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

      <div className="time-booking">
        <div className="title-booking">
          <span>Add Booking</span>
          <AddIcon />
        </div>
        <div className="select-form-date">
          <span className="from">From:</span>
          <InputComponent
            placeholder="00:00"
            value={fromTime}
            onChange={(e) => {
              setFromTime(e.target.value);
            }}
            className="fromTime"
          />
          <span className="to">To</span>
          <InputComponent
            placeholder="00:00"
            value={toTime}
            onChange={(e) => {
              setToTime(e.target.value);
            }}
            className="toTime"
          />
        </div>
        <div className="date">
          <span>Date</span>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              className="date-picker"
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className="total-cost">
          <span>Total cost</span>
          <span>20$</span>
        </div>
        <div className="confirm-button">
          <ButtonComponent title="confirm" />
        </div>
      </div>
    </div>
  );
};

export default withRouter(ProfileProviderSidebar);
