import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import DateFnsUtils from "@date-io/date-fns";
import ChevronLeftOutlined from "@material-ui/icons/ChevronLeftOutlined";
import InputComponent from "../../../Components/Forms/Input";
import ButtonComponent from "../../../Components/Forms/Button";
import { add } from "../../../Services/Auth.service";
import Sppiner from "../../../Components/Spinner/Spinner";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import "./ProviderProfile.css";
const ProfileProviderSidebar = (props) => {
  const { history } = props;
  const { pathname } = props.location;
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const onAddBooking = () => {
    const { user, selectedService } = props;
    const data = {
      from_time: fromTime,
      to_time: toTime,
      id_service: selectedService.id_service,
      booking_date: moment(selectedDate).format("YYYY-MM-DD"),
      id_user: user.id_user,
    };
    setLoading(true);
    add("/service/book", data)
      .then((result) => {
        setLoading(false);
        setResponse(result);
        setOpenSnackBar(true);
      })
      .catch((error) => {
        setLoading(false);
        setResponse(error);
        console.log("Error", error);
      });
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
          <ButtonComponent
            title="confirm"
            type="button"
            startIcon={loading && <Sppiner />}
            onClick={() => {
              onAddBooking();
            }}
          />
        </div>
      </div>
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