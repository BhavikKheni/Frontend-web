import React, { useState } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import AddIcon from "@material-ui/icons/Add";
import InputComponent from "../../../Components/Forms/Input";
import ButtonComponent from "../../../Components/Forms/Button";
import Sppiner from "../../../Components/Spinner/Spinner";
import { add } from "../../../Services/Auth.service";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";

const AddBookingSidebar = (props) => {
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { user, selectedService } = props;
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onAddBooking = () => {
    const bookingData = {
      from_time: fromTime,
      to_time: toTime,
      id_service: selectedService.id_service,
      booking_date: moment(selectedDate).format("YYYY-MM-DD"),
      id_user: user.id_user,
    };
    setData(bookingData);
    props.onAddBooking(bookingData);
  };

  const onSaveAddBooking = () => {
    props.onAddBooking(data);
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
        <h4>Add Booking</h4>
        <AddIcon />
      </div>
      <div className="booking_row booking_time_interval">
        <span className="booking_time_label">From:</span>
        <InputComponent
          placeholder="00:00"
          value={fromTime}
          onChange={(e) => {
            setFromTime(e.target.value);
          }}
          className="booking_time_interval_input"
        />
        <span>To</span>
        <InputComponent
          placeholder="00:00"
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
      <div className="booking_row booking_cost">
        <span className="booking_time_label">Total Cost:</span>
        <p className="booking_cost_price">20$</p>
      </div>
      <div className="confirm_booking_row">
        <ButtonComponent
          title="Confirm"
          type="button"
          onClick={() => {
            onAddBooking();
          }}
          className={"confirm_cta"}
        />
        <ButtonComponent
          title="Save"
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

export default AddBookingSidebar;
