import React, { forwardRef, useState, useImperativeHandle } from "react";
import moment from "moment";
import AddIcon from "@material-ui/icons/Add";
import InputComponent from "../../Forms/Input";
import ButtonComponent from "../../Forms/Button";
import { add } from "../../../Services/Auth.service";
import SnackBarComponent from "../../SnackBar/SnackBar";

const AddBookingSidebar = forwardRef((props, ref) => {
  const [getFromTime, setFromTime] = useState("");
  const [getToTime, setToTime] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});
  const [selectedDate, setSelectedDate] = React.useState();
  const { user, selectedService } = props;
  const [getSlotDetails, setSlotDetails] = useState({});
  const [getTotalCost, setTotalCost] = useState(null);
  const [getFinalTime, setFinalTime] = useState(null);

  useImperativeHandle(ref, () => ({
    getSeletedSlotDetails(selectedSlotDetails) {
      setSlotDetails(selectedSlotDetails);
      setDateTimeFieldValue(selectedSlotDetails);
      
    },
  }));

  const setDateTimeFieldValue = (dateTime) => {
    setSelectedDate(dateTime.start);
    setFromTime(moment(dateTime.start).format("HH:mm"));
    setToTime(moment(dateTime.end).format("HH:mm"));
    calculatePrice(moment(dateTime.start).format("HH:mm"),moment(dateTime.end).format("HH:mm"));
  };

  // Calculate the final price for booking
  const calculatePrice = (get_from_time,get_to_time) => {
    const pricePerHour = selectedService.price;
    const pricePerMinute = pricePerHour / 60;
    const startTimeInMinutes = getTimeInMinutes(get_from_time);
    const endTimeInMinutes = getTimeInMinutes(get_to_time);

    const finalTime = endTimeInMinutes - startTimeInMinutes;
    setFinalTime(finalTime);

    const totalCost = finalTime * pricePerMinute;
    setTotalCost(totalCost.toFixed(2));
  };

  // Function will convert 13:45 time to minutes
  const getTimeInMinutes = (time) => {
    const hourTime = parseInt(time.toString().split(":")[0]);
    const minuteTime = parseInt(time.toString().split(":")[1]);
    const timeInMinutes = hourTime * 60 + minuteTime;
    return timeInMinutes;
  };

  const checkIfValidSlotSelectedOrNot = () => {
    const actualSlotFromTime = getTimeInMinutes(
      moment(getSlotDetails.start).format("HH:mm")
    );
    const actualSlotToTime = getTimeInMinutes(
      moment(getSlotDetails.end).format("HH:mm")
    );

    const slotBookingFromTime = getTimeInMinutes(getFromTime);
    const slotBookingToTime = getTimeInMinutes(getToTime);

    if (
      actualSlotFromTime > slotBookingFromTime ||
      actualSlotToTime < slotBookingToTime
    ) {
      return false;
    } else {
      return true;
    }
  };

  const onAddBooking = () => {
    if (checkIfValidSlotSelectedOrNot()) {
      // const bookingData = {
      //   id_service: selectedService.id_service,
      //   start: moment(`${date} ${getFromTime}`).format(),
      //   end: moment(`${date} ${getToTime}`).format(),
      //   id_user: user.id_user,
      //   color: "red",
      // };
      // setData(bookingData);
      // props.onAddBooking(bookingData);
    } else {
      alert("Slot is not available for your selected date and time");
    }
  };

  // Need to remove this function
  // const onSaveAddBooking = () => {
  //   props.onAddBooking(data);
  //   setLoading(true);
  //   add("/service/book", data)
  //     .then((result) => {
  //       setLoading(false);
  //       setResponse(result);
  //       setOpenSnackBar(true);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       setResponse(error);
  //     });
  // };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const onChangeFromTime = (e) => {
    setFromTime(e.target.value);
    calculatePrice(e.target.value,getToTime);
  };

  const onChangeToTime = (e) => {
    setToTime(e.target.value);
    calculatePrice(getFromTime,e.target.value);
  };

  return (
    <React.Fragment>
      <div className="booking_title">
        <h4>Add Booking</h4>
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
        <span>{moment(selectedDate).format('YYYY-MM-DD')}</span>
      </div>
      {getTotalCost && getFinalTime && (
        <>
          <div className="booking_row booking_cost">
            <span className="booking_time_label">Total Cost:</span>
            <p className="booking_cost_price">{getTotalCost}$</p>
          </div>
          <div className="booking_row booking_cost">
            <span className="booking_time_label">Duration:</span>
            <p className="booking_cost_price">{getFinalTime}</p>
          </div>
        </>
      )}
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
