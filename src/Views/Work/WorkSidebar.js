import React, { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
// import { add } from "../../Services/Auth.service";
import InputComponent from "../../Components/Forms/Input";
import ButtonComponent from "../../Components/Forms/Button";

const WorkSidebar = (props) => {
  const { t } = useTranslation();
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onConfirm = () => {
    const { editRecord, user } = props;
    const data = {
      from_time: fromTime,
      to_time: toTime,
      id_service: editRecord.id_service,
      booking_date: moment(selectedDate).format("YYYY-MM-DD"),
      id_user: user.id_user,
    };
    
    // add("/service/book", data)
    //   .then((result) => {})
    //   .catch((error) => {
    //     console.log("Error", error);
    //   });
  };

  return (
    <div style={{ margin: 20 }}>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("start_work");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }}
      >
        {t("service.create-service.startWork")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("my-service-lib");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }}
      >
        {t("service.create-service.myServiceLibrary")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("add-booking-space");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }}
      >
        {t("service.create-service.addBookingSpace")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("create-service");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }}
      >
        {t("service.create-service.createSpace")}
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
            onClick={() => {
              onConfirm();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkSidebar;
