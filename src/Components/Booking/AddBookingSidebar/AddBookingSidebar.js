import React, { forwardRef, useState, useImperativeHandle } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import AddIcon from "@material-ui/icons/Add";
import InputComponent from "../../Forms/Input";
import ButtonComponent from "../../Forms/Button";
import Spinner from "../../Spinner/Spinner";
import { add } from "../../../Services/Auth.service";
import SnackBarComponent from "../../SnackBar/SnackBar";

const AddBookingSidebar = forwardRef ((props, ref) => {

  const [getFromTime, setFromTime] = useState("");
  const [getToTime, setToTime] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});
  const [selectedDate, setSelectedDate] = React.useState();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { user, selectedService } = props;
  const [getSlotDetails, setSlotDetails] = useState({});
  
  useImperativeHandle(ref, () => ({
    getSeletedSlotDetails(selectedSlotDetails) {
      console.log("AAAA", selectedSlotDetails.start);
      console.log("in log", selectedSlotDetails.extendedProps.slot_id);
      setSlotDetails(selectedSlotDetails);
      setDateTimeFieldValue(selectedSlotDetails);
      calculatePrice();
    }
  }));

  const setDateTimeFieldValue = (dateTime) => {
    setSelectedDate(dateTime.start);
    setFromTime(moment(dateTime.start).format("HH:mm"));
    setToTime(moment(dateTime.end).format("HH:mm"));
  }

  const calculatePrice = () => {
    console.log("selectedService: ", selectedService);
    console.log("Price: ", selectedService.price);
    const pricePerHour = selectedService.price;
    const pricePerMinute = pricePerHour/60;
    
    const startTime = moment(getFromTime, "HH:mm");
    const endTime = moment(getToTime, "HH:mm");
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onAddBooking = () => {
    const date = moment(selectedDate).format("YYYY-MM-DD");
    const bookingData = {
      id_service: selectedService.id_service,
      start: moment(`${date} ${getFromTime}`).format(),
      end: moment(`${date} ${getToTime}`).format(),
      id_user: user.id_user,
      color: "red",
    };
    console.log(bookingData);
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

  const onChangeFromTime = (e) => {
    setFromTime(e.target.value)
    calculatePrice();
  }

  const onChangeToTime = (e) => {
    setToTime(e.target.value)
    calculatePrice();
  }

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
});

export default AddBookingSidebar;
