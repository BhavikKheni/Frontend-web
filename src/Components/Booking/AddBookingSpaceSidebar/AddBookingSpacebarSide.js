import React, { useState } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import AddIcon from "@material-ui/icons/Add";
import InputComponent from "../../Forms/Input";
import ButtonComponent from "../../Forms/Button";
import Sppiner from "../../Spinner/Spinner";
import { add } from "../../../Services/Auth.service";
import SnackBarComponent from "../../SnackBar/SnackBar";

const AddBookingSpaceSidebar = (props) => {
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const { user, selectedService } = props;
  const [data, setData] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onAddBooking = () => {
    const date = moment(selectedDate).format("YYYY-MM-DD");
    const bookingData = {
      id_service: selectedService.id_service,
      start: `${date}T${fromTime}:00`,
      end: `${date}T${toTime}:00`,
      id_user: user.id_user,
      color: "red",
    };
    setData(bookingData);
    props.onAddBookingCalendar(bookingData);
  };

  const onSaveAddBooking = () => {
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <React.Fragment>
      <div className="booking_title">
        <h4>Add Booking space</h4>
      </div>
      <div className="booking_row booking_time_interval">
        <span className="booking_time_label">From:</span>
        <InputComponent
          placeholder="00:00"
          type="time"
          value={fromTime}
          onChange={(e) => {
            setFromTime(e.target.value);
          }}
          className="booking_time_interval_input"
        />
        <span>To</span>
        <InputComponent
          placeholder="00:00"
          type="time"
          value={toTime}
          onChange={(e) => {
            setToTime(e.target.value);
          }}
          className="booking_time_interval_input"
        />
      </div>
      <div className="booking_row booking_date">
        <span className="booking_time_label">Date:</span>
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
            disablePast
          />
        </MuiPickersUtilsProvider>
      </div>
      <div className="confirm_booking_row">
        <ButtonComponent
          title="Add"
          type="button"
          endIcon={<AddIcon />}
          onClick={() => {
            onAddBooking();
          }}
          className={"confirm_cta"}
        />
        <ButtonComponent
          title="save"
          type="button"
          startIcon={isLoading && <Sppiner />}
          onClick={() => {
            onSaveAddBooking();
          }}
          className={"confirm_cta"}
        />
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
    </React.Fragment>
  );
};

export default AddBookingSpaceSidebar;
