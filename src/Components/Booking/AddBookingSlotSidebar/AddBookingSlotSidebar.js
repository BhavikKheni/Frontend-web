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
  const [isDisabled, setDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { selectedService, getSelectedDateTime } = props;

  useEffect(() => {
    if (getSelectedDateTime && getSelectedDateTime.startStr) {
      setFromTime(moment(getSelectedDateTime.startStr).format("HH:mm"));
      setToTime(moment(getSelectedDateTime.endStr).format("HH:mm"));
      console.log(
        "start time:",
        moment(getSelectedDateTime.startStr).format("HH:mm")
      );
    }
  });

  const onSaveSlot = () => {
    const startDate = moment(getSelectedDateTime.startStr).format("YYYY-MM-DD");
    const endDate = moment(getSelectedDateTime.endStr).format("YYYY-MM-DD");
    const bookingData = {
      id_service: selectedService.id_service,
      from_datetime: moment(`${startDate} ${getFromTime}`).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      to_datetime: moment(`${endDate} ${getToTime}`).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    };
    onSave(bookingData);
  };

  const onSave = (record) => {
    setLoading(true);
    setDisabled(true);
    add("/slot/add", record)
      .then((result) => {
        if (result.type === "SUCCESS") {
          setLoading(false);
          setResponse(result);
          setOpenSnackBar(true);
          setDisabled(false);
        }
        props.onAddBookingCalendar();
      })
      .catch((error) => {
        setDisabled(false);
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
      {getSelectedDateTime && getSelectedDateTime.startStr ? (
        <React.Fragment>
          <div className="booking_row booking_date">
            <span className="booking_time_label">From Date:</span>
            <span>
              {moment(getSelectedDateTime.startStr).format("MM-DD-YYYY")}
            </span>
          </div>
          <div className="booking_row booking_date">
            <span className="booking_time_label">To Date:</span>
            <span>
              {moment(getSelectedDateTime.endStr).format("MM-DD-YYYY")}
            </span>
          </div>
        </React.Fragment>
      ) : null}
      <div className="confirm_booking_row">
        <ButtonComponent
          title="Add"
          type="button"
          endIcon={!isLoading && <AddIcon />}
          startIcon={isLoading && <Sppiner />}
          loader={isLoading}
          onClick={() => {
            onSaveSlot();
          }}
          disabled={isDisabled}
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

export default AddBookingSlotSideBar;
