import React, { useState, useEffect } from "react";
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

const AddBookingSlotSideBar = (props) => {

  const [getFromTime, setFromTime] = useState("");
  const [getToTime, setToTime] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const { user, selectedService, getSelectedDateTime } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (getSelectedDateTime && getSelectedDateTime.startStr) {
      setFromTime(moment(getSelectedDateTime.startStr).format("HH:mm"));
      setToTime(moment(getSelectedDateTime.endStr).format("HH:mm"));
      console.log("start time:", moment(getSelectedDateTime.startStr).format("HH:mm"));
    }
  })

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onSaveSlot = () => {
    const date = moment(selectedDate).format("YYYY-MM-DD");
    const bookingData = {
      id_service: selectedService.id_service,
      start: moment(`${date} ${getFromTime}`).format(),
      end: moment(`${date} ${getToTime}`).format(),
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

  const onChangeFromTime = (e) => {
    setFromTime(e.target.value);
  };

  const onChangeToTime = (e) => {
    setToTime(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="booking_title">
        <h4>Add Booking Space</h4>
      </div>
      <div className="booking_row booking_time_interval">
        <span className="booking_time_label">From:</span>
        <InputComponent
          placeholder="00:00"
          type="time"
          value={getFromTime}
          onChange={(e) => {
            onChangeFromTime(e);
          }}
          className="booking_time_interval_input"
        />
        <span>To</span>
        <InputComponent
          placeholder="00:00"
          type="time"
          value={getToTime}
          onChange={(e) => {
            onChangeToTime(e);
          }}
          className="booking_time_interval_input"
        />
      </div>
      { getSelectedDateTime && getSelectedDateTime.startStr ?
        <React.Fragment>
          <div className="booking_row booking_date">
            <span className="booking_time_label">From Date:</span>
            <span>{moment(getSelectedDateTime.startStr).format('YYYY-MM-DD')}</span>
          </div>
          <div className="booking_row booking_date">
            <span className="booking_time_label">To Date:</span>
            <span>{moment(getSelectedDateTime.endStr).format('YYYY-MM-DD')}</span>
          </div>
         </React.Fragment>: null
      }
      <div className="confirm_booking_row">
        <ButtonComponent
          title="Add"
          type="button"
          endIcon={<AddIcon />}
          onClick={() => {
            onSaveSlot();
          }}
          className={"confirm_cta"}
        />
        {/* <ButtonComponent
          title="save"
          type="button"
          startIcon={isLoading && <Sppiner />}
          onClick={() => {
            onSaveAddBooking();
          }}
          className={"confirm_cta"}
        /> */}
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

export default AddBookingSlotSideBar;
