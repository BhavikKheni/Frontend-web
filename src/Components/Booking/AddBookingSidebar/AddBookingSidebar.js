import React, { forwardRef, useState, useImperativeHandle } from "react";
import moment from "moment";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import InputComponent from "../../Forms/Input";
import ButtonComponent from "../../Forms/Button";
import { add } from "../../../Services/Auth.service";
import SnackBarComponent from "../../SnackBar/SnackBar";
import TypographyComponent from "../../Typography/Typography";
import DialogComponent from "../../Dialog/Dialog";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DialogContent from "@material-ui/core/DialogContent";
import { CardCvcElement } from "@stripe/react-stripe-js";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Select from "@material-ui/core/Select";
import Radio from "@material-ui/core/Radio";

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "18px",
      color: "#000",
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "#000",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};
const useStyles = makeStyles((theme) => ({
  timeFields: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textColor: {
    color: "#fff",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectCards: {
    textAlign: "end",
    padding: "10px 0px 10px 0px",
    cursor: "pointer",
  },
  card_wrapper: {
    backgroundColor: "#fff",
  },
  card_list_item: {
    backgroundColor: "#000",
    width: "100%",
    maxWidth: "273px",
    padding: 10,
  },
}));

const AddBookingSidebar = forwardRef((props, ref) => {
  const classes = useStyles();
  const [getFromTime, setFromTime] = useState("");
  const [getToTime, setToTime] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});
  const [selectedDate, setSelectedDate] = React.useState();
  const { user, selectedService } = props;
  const [getSlotDetails, setSlotDetails] = useState({});
  const [getTotalCost, setTotalCost] = useState(null);
  const [getFinalTime, setFinalTime] = useState(null);
  const [open, setOpen] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("a");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

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
    calculatePrice(
      moment(dateTime.start).format("HH:mm"),
      moment(dateTime.end).format("HH:mm")
    );
  };

  // Calculate the final price for booking
  const calculatePrice = (get_from_time, get_to_time) => {
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
    calculatePrice(e.target.value, getToTime);
  };

  const onChangeToTime = (e) => {
    setToTime(e.target.value);
    calculatePrice(getFromTime, e.target.value);
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
        <span>{moment(selectedDate).format("MM-DD-YYYY")}</span>
      </div>
      {getTotalCost && getFinalTime && (
        <>
          <div className="booking_row booking_cost">
            <span className="booking_time_label">Total Cost:</span>
            <p className="booking_cost_price">{getTotalCost} CHF</p>
          </div>
          <div className="booking_row booking_cost">
            <span className="booking_time_label">Duration:</span>
            <p className="booking_cost_price">{getFinalTime} Minutes</p>
          </div>
        </>
      )}
      <div className="confirm_booking_row">
        <ButtonComponent
          title="Confirm"
          type="button"
          onClick={() => {
            onAddBooking();
            setOpen(true);
          }}
          className={"confirm_cta"}
        />
      </div>
      <DialogComponent
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        title="Confirm booking"
      >
        <DialogContent>
          <TypographyComponent
            title={selectedService && selectedService.title}
            className={classes.textColor}
          />
          <TypographyComponent
            className={classes.textColor}
            title={
              selectedService &&
              selectedService.provider_details &&
              `${selectedService.provider_details.first_name} ${selectedService.provider_details.last_name}`
            }
          />
          <div className={classes.timeFields}>
            <div className={classes.textColor}>
              <div className={classes.item}>
                <TypographyComponent title="Start time:" />
                <TypographyComponent title={getFromTime} />
              </div>
              <div className={classes.item}>
                <TypographyComponent title="End time:" />
                <TypographyComponent title={getToTime} />
              </div>
            </div>
            <div className={classes.textColor}>
              <div className={classes.item}>
                <TypographyComponent title="Start date:" />
                <TypographyComponent
                  title={moment(selectedDate).format("DD-MM-YYYY")}
                />
              </div>
              <div className={classes.item}>
                <TypographyComponent title="total:" />
                <TypographyComponent title={getTotalCost} />
              </div>
            </div>
          </div>
          <div className={classes.selectCards}>
            <span
              onClick={() => setCardVisible(true)}
              className={classes.textColor}
            >
              select cards
            </span>
          </div>
          {cardVisible ? (
            <Select
              native
              value={1}
              onChange={() => {}}
              label="cards"
              inputProps={{
                name: "card",
                id: "outlined-card",
              }}
            >
              <option value={30}>
                <Radio
                  checked={selectedValue === "a"}
                  // onChange={handleChange}
                  value="a"
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
                Thirty
              </option>
            </Select>
          ) : (
            <div className={classes.card_wrapper}>
              <div className={classes.item}>
                <TypographyComponent title="Select card" />
                <ExpandMoreIcon />
              </div>
              <div className={clsx(classes.textColor, classes.card_list_item)}>
                <span>VISA</span>
                <div className={classes.item}>
                  <span>Name on card</span>
                  <span>expired on</span>
                </div>
                <div className={classes.item}>
                  <span>xxxx xxxx xxxx xxx36</span>
                  <span>00/00</span>
                </div>
              </div>
              <div>
                <CardCvcElement options={CARD_OPTIONS} />
              </div>
            </div>
          )}

          <ButtonComponent
            title="Buy to set booking"
            endIcon={<ChevronRightIcon />}
            style={{ color: classes.textColor }}
          />
        </DialogContent>
      </DialogComponent>
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
